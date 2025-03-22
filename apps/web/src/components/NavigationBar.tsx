
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageSquare, FileText, Library, CheckSquare, Layout, User } from "lucide-react";

const NavigationBar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="glass w-full max-w-5xl mx-auto rounded-full mb-6 animate-fade-in">
      <nav className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-1">
          <Link 
            to="/chat" 
            className={`nav-link flex items-center space-x-2 ${isActive('/chat') ? 'nav-link-active' : ''}`}
          >
            <MessageSquare size={18} className={isActive('/chat') ? 'text-blue-600' : 'text-gray-600'} />
            <span>Chat</span>
          </Link>
          
          <Link 
            to="/docs" 
            className={`nav-link flex items-center space-x-2 ${isActive('/docs') ? 'nav-link-active' : ''}`}
          >
            <FileText size={18} className={isActive('/docs') ? 'text-blue-600' : 'text-gray-600'} />
            <span>Docs</span>
          </Link>
          
          <Link 
            to="/library" 
            className={`nav-link flex items-center space-x-2 ${isActive('/library') ? 'nav-link-active' : ''}`}
          >
            <Library size={18} className={isActive('/library') ? 'text-blue-600' : 'text-gray-600'} />
            <span>Library</span>
          </Link>
          
          <Link 
            to="/tasks" 
            className={`nav-link flex items-center space-x-2 ${isActive('/tasks') ? 'nav-link-active' : ''}`}
          >
            <CheckSquare size={18} className={isActive('/tasks') ? 'text-blue-600' : 'text-gray-600'} />
            <span>Tasks</span>
          </Link>
          
          <Link 
            to="/board" 
            className={`nav-link flex items-center space-x-2 ${isActive('/board') ? 'nav-link-active' : ''}`}
          >
            <Layout size={18} className={isActive('/board') ? 'text-blue-600' : 'text-gray-600'} />
            <span>Board</span>
          </Link>
        </div>
        
        <div className="flex items-center">
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <User size={20} className="text-gray-700" />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default NavigationBar;
