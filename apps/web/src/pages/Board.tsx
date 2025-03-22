import React from "react";
import { Tldraw } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import NavigationBar from "@/components/NavigationBar";

const Board: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Navigation Bar */}
      <NavigationBar />

      {/* Centered Board */}
      <div className="flex-grow flex justify-center items-center">
        <div className="w-[95vw] h-[85vh]">
          <Tldraw persistenceKey="my-drawing-board" />
        </div>
      </div>
    </div>
  );
};

export default Board;
