
import React, { useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import { DocumentSections, DocumentChatInput } from "@/components/DocumentSection";
import { useIsMobile } from "@/hooks/use-mobile";

interface File {
  id: string;
  title: string;
  type: "pdf" | "doc" | "txt";
  dateModified: Date;
}

interface Section {
  id: string;
  title: string;
  files: File[];
  isExpanded: boolean;
}

const initialSections: Section[] = [
  {
    id: "1",
    title: "Research Papers",
    files: [
      {
        id: "file1",
        title: "Machine Learning Fundamentals.pdf",
        type: "pdf",
        dateModified: new Date(2023, 2, 15),
      },
      {
        id: "file2",
        title: "Neural Networks Overview.pdf",
        type: "pdf",
        dateModified: new Date(2023, 3, 20),
      },
    ],
    isExpanded: true,
  },
  {
    id: "2",
    title: "Course Notes",
    files: [
      {
        id: "file3",
        title: "Advanced Mathematics.doc",
        type: "doc",
        dateModified: new Date(2023, 1, 10),
      },
      {
        id: "file4",
        title: "Data Structures.txt",
        type: "txt",
        dateModified: new Date(2023, 0, 5),
      },
    ],
    isExpanded: false,
  },
  {
    id: "3",
    title: "Project Documentation",
    files: [
      {
        id: "file5",
        title: "Project Plan.pdf",
        type: "pdf",
        dateModified: new Date(2023, 4, 8),
      },
    ],
    isExpanded: false,
  },
  {
    id: "4",
    title: "Study Guides",
    files: [
      {
        id: "file6",
        title: "Exam Preparation.pdf",
        type: "pdf",
        dateModified: new Date(2023, 5, 1),
      },
      {
        id: "file7",
        title: "Quick References.doc",
        type: "doc",
        dateModified: new Date(2023, 5, 12),
      },
    ],
    isExpanded: false,
  },
];

const Docs = () => {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const isMobile = useIsMobile();

  const handleToggleSection = (id: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === id
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  };

  const handleAddFile = () => {
    // This would typically open a file upload dialog
    console.log("Add file button clicked");
  };

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      
      <div className="w-full px-0 md:px-4 max-w-[100vw] overflow-x-hidden">
        <div className="glass rounded-lg p-4 md:p-6 mb-4 mx-auto">
          <DocumentSections
            sections={sections}
            onToggleSection={handleToggleSection}
            onAddFile={handleAddFile}
          />
          
          <DocumentChatInput />
        </div>
      </div>
    </div>
  );
};

export default Docs;
