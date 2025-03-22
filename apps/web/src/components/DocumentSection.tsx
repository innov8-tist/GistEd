
import React from "react";
import { Plus, FileText, Folder, ChevronRight, Search, Send } from "lucide-react";

interface Section {
  id: string;
  title: string;
  files: File[];
  isExpanded: boolean;
}

interface File {
  id: string;
  title: string;
  type: "pdf" | "doc" | "txt";
  dateModified: Date;
}

interface DocumentSectionProps {
  sections: Section[];
  onToggleSection: (id: string) => void;
  onAddFile: () => void;
}

export const DocumentSections: React.FC<DocumentSectionProps> = ({
  sections,
  onToggleSection,
  onAddFile,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 h-[calc(100vh-12rem)] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search documents..."
            className="pl-9 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
        </div>
        <button
          onClick={onAddFile}
          className="flex items-center space-x-1 text-sm px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} />
          <span>Add File</span>
        </button>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="border-b border-gray-200 pb-3">
            <button
              onClick={() => onToggleSection(section.id)}
              className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-700 hover:text-gray-900"
            >
              <div className="flex items-center">
                <Folder size={18} className="text-blue-500 mr-2" />
                <span>{section.title}</span>
              </div>
              <ChevronRight
                size={18}
                className={`text-gray-400 transition-transform ${
                  section.isExpanded ? "transform rotate-90" : ""
                }`}
              />
            </button>
            
            {section.isExpanded && (
              <div className="mt-2 pl-6 space-y-1 animate-fade-in">
                {section.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <FileText size={16} className="text-gray-500 mr-2" />
                    <span className="text-gray-700 text-sm">{file.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const DocumentChatInput = () => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg mt-4">
      <div className="relative flex items-center">
        <button className="absolute left-3 p-1.5 rounded-full bg-gray-200 text-gray-600">
          <FileText size={16} />
        </button>
        
        <input
          type="text"
          placeholder="Ask about this document..."
          className="chat-input pl-12"
        />
        
        <button
          className="absolute right-3 p-1.5 rounded-full bg-blue-500 text-white"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
