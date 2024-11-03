"use server";

import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";

export const createAgent = async (form: FormData) => {
  const supabase = createClient();
  const email = form.get("email") as string;
  const password = form.get("password") as string;
  const attributes = JSON.parse((form.get("attributes") as string) || "{}");
  const profile = form.get("profile_img") as File;

  // TODO: single transaction for both user and advisor creation
  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { userType: "advisor" } },
  });
  if (error) {
    console.error("user creation", error);
    return {
      success: false,
      error: error.message,
    };
  }

  const { data: profileUploaded } = await supabase.storage
    .from("public-files")
    .upload(`${user?.id}/${profile.name}`, profile, {
      cacheControl: "3600",
      upsert: true,
    });

  const { data, error: insertError } = await supabase
    .from("advisor")
    .insert({ id: user?.id, ...attributes, profile_img: profileUploaded?.path })
    .single();
  
  if (insertError) {
    console.error("agent creation", insertError);
    return {
      success: false,
      error: insertError.message,
    };
  }

  return redirect("/agent/chat");
};

export const agentSignIn = async (form: FormData) => {
  const supabase = createClient();
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return redirect("/agent/home");
};

export const updateAdvisorProfile = async (advisorData: any) => {
  const supabase = createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Remove fields that shouldn't be updated
  const { id, created_at, updated_at, profile_img, ...updateData } = advisorData

  try {
    // First, get the current advisor data
    const { data: currentAdvisor, error: fetchError } = await supabase
      .from('advisor')
      .select('*')
      .eq('id', user.id)
      .single()

    if (fetchError) throw fetchError

    // Compare and only update changed fields
    const changedFields = Object.entries(updateData).reduce((acc, [key, value]) => {
      if (JSON.stringify(currentAdvisor[key]) !== JSON.stringify(value)) {
        acc[key] = value
      }
      return acc
    }, {} as Record<string, any>)

    if (Object.keys(changedFields).length === 0) {
      return { success: true, message: 'No changes detected' }
    }

    // Update only the changed fields
    const { error: updateError } = await supabase
      .from('advisor')
      .update(changedFields)
      .eq('id', user.id)

    if (updateError) throw updateError

    return { success: true }
  } catch (error) {
    console.error('Failed to update profile:', error)
    throw error
  }
}

export const uploadAdvisorImage = async (formData: FormData) => {
  const supabase = createClient()
  const file = formData.get('file') as File
  const advisorId = formData.get('advisorId') as string
  
  if (!file || !advisorId) {
    throw new Error('Missing file or advisorId')
  }

  try {
    // First check if advisor folder exists
    const { data: folders, error: listError } = await supabase.storage
      .from("Advisors")
      .list()

    if (listError) {
      console.error('List error:', listError)
      throw listError
    }

    console.log('Available folders:', folders)

    // Try to create advisor folder regardless
    try {
      const { data: keepFile, error: keepError } = await supabase.storage
        .from("Advisors")
        .upload(`${advisorId}/.keep`, new Blob(['']))

      console.log('Keep file creation:', keepFile, keepError)
    } catch (keepError) {
      // Ignore error if file already exists
      console.log('Keep file error (might be normal if folder exists):', keepError)
    }

    // Create a unique filename with timestamp
    const timestamp = new Date().getTime()
    const fileExt = file.name.split('.').pop()
    const fileName = `${timestamp}.${fileExt}`
    const filePath = `${advisorId}/${fileName}`

    console.log('Attempting to upload to path:', filePath)

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()

    // Upload the file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("Advisors")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    console.log('Upload successful:', uploadData)

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from("Advisors")
      .getPublicUrl(filePath)

    return {
      success: true,
      path: filePath,
      url: publicUrl
    }
  } catch (error) {
    console.error('Failed to upload image:', error)
    throw error
  }
}

export const getAdvisorImages = async (advisorId: string) => {
  const supabase = createClient()
  
  try {
    // List all files in advisor's folder
    const { data: files, error: listError } = await supabase.storage
      .from("Advisors")
      .list(advisorId)

    if (listError) throw listError

    // If no files or only .keep file, return empty array
    if (!files || (files.length === 1 && files[0].name === '.keep')) {
      return {
        success: true,
        images: []
      }
    }

    // Filter out the .keep file and get public URLs for all images
    const images = await Promise.all(
      files
        .filter(file => file.name !== '.keep')
        .map(async (file) => {
          const { data: { publicUrl } } = supabase.storage
            .from("Advisors")
            .getPublicUrl(`${advisorId}/${file.name}`)

          return {
            name: file.name,
            path: `${advisorId}/${file.name}`,
            url: publicUrl,
            created: file.created_at || new Date().toISOString()
          }
        })
    )

    return {
      success: true,
      images: images.sort((a, b) => b.created.localeCompare(a.created))
    }
  } catch (error) {
    console.error('Failed to get advisor images:', error)
    throw error
  }
}

export const updateProfileImage = async (advisorId: string, imagePath: string) => {
  const supabase = createClient()
  
  try {
    // Get the full URL for the image
    const { data: { publicUrl } } = supabase.storage
      .from("Advisors")
      .getPublicUrl(imagePath)

    // Save the full URL to the profile
    const { error } = await supabase
      .from('advisor')
      .update({ profile_img: publicUrl })
      .eq('id', advisorId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Failed to update profile image:', error)
    throw error
  }
}

export const deleteAdvisorImage = async (imagePath: string) => {
  const supabase = createClient()
  
  try {
    const { error } = await supabase.storage
      .from("Advisors")
      .remove([imagePath])

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Failed to delete image:', error)
    throw error
  }
}
