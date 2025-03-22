
import React from 'react';
import Navbar from '@/components/NavigationBar';
import ImageUploader from '../components/ImageUploader';
import NavigationBar from '@/components/NavigationBar';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavigationBar />
      
      <main className="flex-1 pt-10 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">

            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-gray-900 mb-3">
              Effortless Image Sharing
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Upload and share your images with a minimalist, intuitive interface. 
              No clutter, just pure functionality.
            </p>
          </div>
          
          <ImageUploader />
          
          <div className="mt-16 flex flex-col md:flex-row justify-between gap-8 animate-fade-up">
            <div className="glass-dark p-6 rounded-xl flex-1">
              <h3 className="text-base font-medium mb-2">Drag & Drop</h3>
              <p className="text-sm text-gray-600">
                Simply drag your image into the upload area or select from your device.
              </p>
            </div>
            
            <div className="glass-dark p-6 rounded-xl flex-1">
              <h3 className="text-base font-medium mb-2">Instantly Share</h3>
              <p className="text-sm text-gray-600">
                Click the send button in the corner to share your image immediately.
              </p>
            </div>
            
            <div className="glass-dark p-6 rounded-xl flex-1">
              <h3 className="text-base font-medium mb-2">Securely Stored</h3>
              <p className="text-sm text-gray-600">
                Your images are securely stored and only accessible to those you share with.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2023 MinimalUpload. Designed with precision.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
