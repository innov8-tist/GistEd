
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
          </div>
      </main>
    </div>
  );
};

export default Index;
