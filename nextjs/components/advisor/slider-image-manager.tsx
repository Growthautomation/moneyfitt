'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Upload, X, Check } from "lucide-react"
import { uploadAdvisorImage, getAdvisorImages, deleteAdvisorImage, updateAdvisorProfile } from "@/lib/actions/agent"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface SliderImageManagerProps {
  advisorId: string
  selectedImages: string[]
  onUpdate: (paths: string[]) => void
  maxImages?: number
}

interface ImageFile {
  name: string
  path: string
  url: string
  created: string
}

// Add the same helper functions at the top of the file
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

export function SliderImageManager({ 
  advisorId, 
  selectedImages: initialSelectedImages,
  onUpdate,
  maxImages = 6 
}: SliderImageManagerProps) {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Convert full URLs to paths
  const extractPathFromUrl = (url: string) => {
    const match = url.match(/Advisors\/(.*)/);
    return match ? match[1] : '';
  }

  // Initialize selected images from URLs
  const [selectedImages, setSelectedImages] = useState<string[]>(
    (initialSelectedImages || []).map(extractPathFromUrl).filter(Boolean)
  );

  // Update parent with full URLs when selection changes
  const updateParent = (paths: string[]) => {
    const fullUrls = paths.map(path => 
      `https://xpjrqmknieuxbnpilskz.supabase.co/storage/v1/object/public/Advisors/${path}`
    );
    onUpdate(fullUrls);
  }

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

    if (selectedImages.length >= maxImages) {
      toast({
        title: "Maximum images reached",
        description: `You can only select up to ${maxImages} images`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('advisorId', advisorId)

      const result = await uploadAdvisorImage(formData)
      await loadImages()
      handleToggleImage(result.path)
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

  const handleToggleImage = (imagePath: string) => {
    const isSelected = selectedImages.includes(imagePath)
    if (isSelected) {
      const newSelection = selectedImages.filter(path => path !== imagePath);
      setSelectedImages(newSelection);
      updateParent(newSelection);
    } else {
      if (selectedImages.length < maxImages) {
        const newSelection = [...selectedImages, imagePath];
        setSelectedImages(newSelection);
        updateParent(newSelection);
      } else {
        toast({
          title: "Maximum images reached",
          description: `You can only select up to ${maxImages} images`,
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteImage = async (imagePath: string) => {
    try {
      await deleteAdvisorImage(imagePath)
      // Remove from selection if selected
      if (selectedImages.includes(imagePath)) {
        onUpdate(selectedImages.filter(path => path !== imagePath))
      }
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

  // Modify handleSaveAndClose to save full URLs
  const handleSaveAndClose = async () => {
    try {
      // Convert paths to full URLs
      const fullUrls = selectedImages.map(path => 
        `https://xpjrqmknieuxbnpilskz.supabase.co/storage/v1/object/public/Advisors/${path}`
      )

      // Update the advisor record with the full URLs
      await updateAdvisorProfile({
        id: advisorId,
        secondary_images: fullUrls
      })

      setIsOpen(false)
      toast({
        title: "Success",
        description: `${selectedImages.length} images saved to slider`,
      })

      // Pass the full URLs back to parent
      onUpdate(fullUrls)
    } catch (error) {
      console.error('Failed to save slider images:', error)
      toast({
        title: "Error",
        description: "Failed to save slider images",
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
          <Upload className="mr-2 h-4 w-4" /> Manage Slider Images
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Manage Slider Images 
            <span className="text-sm font-normal text-[#4543AB] ml-2">
              ({selectedImages.length}/{maxImages} selected)
            </span>
          </DialogTitle>
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
                      {/* Single button that toggles selection */}
                      <Button
                        size="sm"
                        variant={selectedImages.includes(image.path) ? "destructive" : "secondary"}
                        onClick={() => handleToggleImage(image.path)}
                        className={selectedImages.includes(image.path) 
                          ? "bg-red-500 hover:bg-red-600 text-white" 
                          : "bg-[#5C59E4] hover:bg-[#4543AB] text-white"}
                      >
                        {selectedImages.includes(image.path) ? (
                          "Remove from Slider"
                        ) : (
                          "Add to Slider"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                {selectedImages.includes(image.path) && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add save and close button */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#5C59E4] hover:bg-[#4543AB] text-white"
              onClick={handleSaveAndClose}
            >
              Save Selection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 