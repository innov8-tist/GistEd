
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageSquare, FileText, Library, CheckSquare, Layout } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      title: "AI-Powered Chat",
      description: "Get instant answers with our intelligent chat assistant",
      icon: <MessageSquare className="h-10 w-10 text-blue-500" />
    },
    {
      id: 2,
      title: "Smart Documents",
      description: "Organize and access your documents with ease",
      icon: <FileText className="h-10 w-10 text-blue-500" />
    },
    {
      id: 3,
      title: "Digital Library",
      description: "All your resources in one searchable place",
      icon: <Library className="h-10 w-10 text-blue-500" />
    },
    {
      id: 4,
      title: "Task Management",
      description: "Keep track of your assignments and deadlines",
      icon: <CheckSquare className="h-10 w-10 text-blue-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-auto">
      {/* Navigation */}
      <nav className="glass w-full py-4 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-blue-600">GistEd</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
          <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          onClick={() => navigate("/login")}
        >
          Get Started
        </Button>
      </nav>

      {/* About Section */}
      <section id="about" className="min-h-[70vh] w-full flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="relative">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 via-purple-400 to-blue-600 opacity-75 blur-3xl"></div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 relative">
            GistEd
          </h1>
        </div>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
          Transforming education through AI-powered learning solutions
        </p>
        <div className="mt-10">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            onClick={() => navigate("/login")}
          >
            Start Learning Now
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Our Features</h2>
          
          <div className="relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-0 w-24 z-10 bg-gradient-to-r from-gray-50 to-transparent"></div>
            <div className="absolute top-0 bottom-0 right-0 w-24 z-10 bg-gradient-to-l from-gray-50 to-transparent"></div>
            
            <div className="flex animate-carousel">
              {/* First set of features */}
              {features.map(feature => (
                <div key={feature.id} className="w-[300px] flex-shrink-0 mx-4">
                  <div className="glass-card h-full p-6 flex flex-col items-center text-center">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
              
              {/* Duplicated for infinite loop */}
              {features.map(feature => (
                <div key={`dup-${feature.id}`} className="w-[300px] flex-shrink-0 mx-4">
                  <div className="glass-card h-full p-6 flex flex-col items-center text-center">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Contact Us</h2>
          
          <div className="max-w-3xl mx-auto glass rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                <p className="text-gray-600 mb-4">
                  Have questions about GistEd? Our team is here to help you.
                </p>
                <div className="space-y-2">
                  <p className="flex items-center text-gray-700">
                    <span className="font-medium mr-2">Email:</span> 
                    <a href="mailto:info@gisted.com" className="text-blue-600 hover:underline">
                      info@gisted.com
                    </a>
                  </p>
                  <p className="flex items-center text-gray-700">
                    <span className="font-medium mr-2">Phone:</span> +1 (555) 123-4567
                  </p>
                  <p className="flex items-center text-gray-700">
                    <span className="font-medium mr-2">Address:</span> 123 Education St, Learning City
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full mb-4">
                  Schedule a Demo
                </Button>
                <Button variant="outline" className="w-full">
                  Download Brochure
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">© 2023 GistEd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
