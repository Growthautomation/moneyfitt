'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Upload, X, Check } from "lucide-react"
import { uploadAdvisorImage, getAdvisorImages, updateProfileImage, deleteAdvisorImage } from "@/lib/actions/agent"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface ImageManagerProps {
  advisorId: string
  currentProfileImage: string | null
  onUpdate: () => void
}

interface ImageFile {
  name: string
  path: string
  url: string
  created: string
}

const validateImage = async (file: File): Promise<{ valid: boolean; message?: string }> => {
  // Check file size - 4.5MB in bytes
  const maxSize = 4.5 * 1024 * 1024
  if (file.size > maxSize) {
    return { valid: false, message: "Image must be less than 4.5MB" }
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, message: "File must be an image" }
  }

  // Check image dimensions
  try {
    const dimensions = await getImageDimensions(file)
    if (dimensions.width > 4000 || dimensions.height > 4000) {
      return { valid: false, message: "Image dimensions must be less than 4000x4000" }
    }
  } catch (error) {
    return { valid: false, message: "Invalid image file" }
  }

  return { valid: true }
}

const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(img.src)
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      reject(new Error('Failed to load image'))
    }
  })
}

export function ImageManager({ advisorId, currentProfileImage, onUpdate }: ImageManagerProps) {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const loadImages = async () => {
    try {
      const { images } = await getAdvisorImages(advisorId)
      setImages(images)
    } catch (error) {
      console.error('Failed to load images:', error)
      toast({
        title: "Error",
        description: "Failed to load images",
        variant: "destructive",
      })
    }
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size FIRST - 4.5MB in bytes
    const maxSize = 4.5 * 1024 * 1024
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Image must be less than 4.5MB",
        variant: "destructive",
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('advisorId', advisorId)

      await uploadAdvisorImage(formData)
      await loadImages()
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
    } catch (error) {
      console.error('Failed to upload:', error)
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSetProfileImage = async (imagePath: string) => {
    try {
      await updateProfileImage(advisorId, imagePath)
      onUpdate()
      setIsOpen(false)
      toast({
        title: "Success",
        description: "Profile image updated",
      })
    } catch (error) {
      console.error('Failed to set profile image:', error)
      toast({
        title: "Error",
        description: "Failed to update profile image",
        variant: "destructive",
      })
    }
  }

  const handleDeleteImage = async (imagePath: string) => {
    try {
      await deleteAdvisorImage(imagePath)
      await loadImages()
      toast({
        title: "Success",
        description: "Image deleted",
      })
    } catch (error) {
      console.error('Failed to delete image:', error)
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (open) loadImages()
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Upload className="mr-2 h-4 w-4" /> Change Profile Image
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Profile Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>Loading...</>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Image
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.path} className="relative group">
                <div className="aspect-square relative overflow-hidden rounded-lg border">
                  <Image
                    src={image.url}
                    alt={image.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSetProfileImage(image.path)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteImage(image.path)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                {currentProfileImage === image.path && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 