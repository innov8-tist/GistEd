
import React from "react";
import NavigationBar from "@/components/NavigationBar";

const Board = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      
      <div className="w-full px-4">
        <div className="glass rounded-lg p-6 flex items-center justify-center" style={{ height: "calc(100vh - 8rem)" }}>
          <div className="text-center">
            <h2 className="text-2xl font-medium text-gray-800 mb-2">Board Section</h2>
            <p className="text-gray-500">This section is under development.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
