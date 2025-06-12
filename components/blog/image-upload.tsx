"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, X, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload.",
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      toast({
        title: "File size too large",
        description: "Image must be less than 5MB.",
      });
      return;
    }

    setIsUploading(true);

    // Simulate upload
    setTimeout(() => {
      // Use a random image from Pexels
      const images = [
        "https://images.pexels.com/photos/5483071/pexels-photo-5483071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/5926393/pexels-photo-5926393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      ];
      const randomImage = images[Math.floor(Math.random() * images.length)];
      onChange(randomImage);
      setIsUploading(false);
    }, 1500);
  };

  const handleRemove = () => {
    onChange("");
    setSelectedFile(null);
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <div className="absolute right-2 top-2 z-10">
            <Button type="button" variant="destructive" onClick={handleRemove}>
              <X className="h-4 w-4" />
            </Button>{" "}
            as any
          </div>
          <Image src={value} alt="Cover image" fill className="object-cover" />
        </div>
      ) : (
        <div className="flex aspect-video w-full flex-col items-center justify-center rounded-lg border border-dashed">
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 p-6 text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-sm text-muted-foreground">
                Uploading image...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 p-6 text-center">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium">No image selected</p>
              <p className="text-xs text-muted-foreground">
                Upload a cover image for your blog
              </p>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <label htmlFor="image-upload">
                <Button type="button" variant="secondary" className="mt-2">
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>{" "}
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
