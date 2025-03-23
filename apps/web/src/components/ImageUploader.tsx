
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from '@/components/ui/use-toast';
import { Upload, Image as ImageIcon, Send } from 'lucide-react';

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (file: File) => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!validImageTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, GIF, WEBP)",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      toast({
        title: "File too large",
        description: "Image must be less than 10MB",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onloadstart = () => {
      setIsUploading(true);
    };
    
    reader.onload = (e) => {
      setTimeout(() => {
        setSelectedImage(e.target?.result as string);
        setIsUploading(false);
      }, 500); // Add slight delay for animation
    };
    
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSend = () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please select an image first",
        variant: "destructive",
      });
      return;
    }

    // Show loading state
    setIsUploading(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsUploading(false);
      setSelectedImage(null);
      toast({
        title: "Success!",
        description: "Your image has been sent successfully",
      });
    }, 1500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative animate-fade-up">
      <div 
        className={`
          min-h-[400px] w-full rounded-xl border-2 border-dashed 
          transition-all duration-200 flex flex-col items-center justify-center
          relative overflow-hidden
          ${isDragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-gray-50/50'}
          ${selectedImage ? 'p-0' : 'p-8'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!selectedImage && (
          <div className="text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">Upload an image</h3>
            <p className="text-sm text-gray-500">
              Drag and drop an image here, or click to select one from your device
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <Button 
                onClick={triggerFileInput}
                variant="outline" 
                className="relative overflow-hidden group hover:bg-gray-100"
              >
                <Upload className="w-4 h-4 mr-2" />
                Select Image
              </Button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleInputChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        )}

        {selectedImage && (
          <div className="w-full h-full relative group">
            <img 
              src={selectedImage} 
              alt="Selected"
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {selectedImage && (
        <Button
          onClick={handleSend}
          disabled={isUploading}
          variant="default"
          size="icon"
          className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-all duration-300 ease-out animate-slide-in-right"
        >
          <Send className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default ImageUploader;
