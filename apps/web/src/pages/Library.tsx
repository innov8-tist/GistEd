import React from "react";
import NavigationBar from "@/components/NavigationBar";
import { LibrarySearchResults } from "@/components/LibrarySection";

interface LibraryFile {
  id: string;
  title: string;
  description: string;
  type: "audio" | "video" | "pdf" | "doc";
  dateAdded: Date;
}

const sampleFiles: LibraryFile[] = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    description: "Learn the basics of ML algorithms",
    type: "pdf",
    dateAdded: new Date(2023, 4, 15)
  },
  {
    id: "2",
    title: "Data Structures and Algorithms",
    description: "Comprehensive guide to DSA",
    type: "pdf",
    dateAdded: new Date(2023, 3, 22)
  },
  {
    id: "3",
    title: "Web Development Fundamentals",
    description: "HTML, CSS and JavaScript basics",
    type: "doc",
    dateAdded: new Date(2023, 5, 10)
  },
  {
    id: "4",
    title: "Artificial Intelligence Overview",
    description: "Introduction to AI concepts",
    type: "video",
    dateAdded: new Date(2023, 2, 5)
  },
  {
    id: "5",
    title: "Database Systems",
    description: "SQL and NoSQL database concepts",
    type: "pdf",
    dateAdded: new Date(2023, 1, 18)
  },
  {
    id: "6",
    title: "Cloud Computing Essentials",
    description: "Learn about cloud service models",
    type: "doc",
    dateAdded: new Date(2023, 0, 30)
  }
];

const Library = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      
      <div className="w-full px-4">
        <div className="glass rounded-lg p-6" style={{ height: "calc(100vh - 8rem)" }}>
          <h2 className="text-2xl font-medium text-gray-800 mb-4">Your Library</h2>
          {/* Replace LibrarySection with LibrarySearchResults */}
          <LibrarySearchResults files={sampleFiles} searchQuery="" onSearchChange={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default Library;
