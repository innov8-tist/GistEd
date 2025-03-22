
import React from "react";
import { FileText, Send, Search, ExternalLink, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface LibraryFile {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "doc" | "video" | "audio";
  dateAdded: Date;
  thumbnailUrl?: string;
}

interface LibrarySectionProps {
  files: LibraryFile[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const LibrarySearchResults: React.FC<LibrarySectionProps> = ({
  files,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-800 mb-1">Research Results</h2>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search library resources..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {files.map((file) => (
          <div key={file.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all border border-gray-100">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-md mr-3">
                    <FileText size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{file.title}</h3>
                    <p className="text-xs text-gray-500">
                      Added {formatDistanceToNow(file.dateAdded, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button className="p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-500">
                    <ExternalLink size={16} />
                  </button>
                  <button className="p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-500">
                    <Download size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{file.description}</p>
            </div>
          </div>
        ))}
      </div>

      {files.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No resources found. Try a different search term.</p>
        </div>
      )}
    </div>
  );
};

export const LibraryChatInput = () => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg mt-4">
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Ask about library resources..."
          className="chat-input"
        />
        
        <button className="absolute right-3 p-1.5 rounded-full bg-blue-500 text-white">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
