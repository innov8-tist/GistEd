
import React, { useState } from "react";
import { PlusCircle, Calendar, Clock, Tag, MoreVertical } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "review" | "done";
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  labels: string[];
}

interface Column {
  id: string;
  title: string;
  status: Task["status"];
  tasks: Task[];
}

interface TaskBoardProps {
  columns: Column[];
  onAddTask: (status: Task["status"]) => void;
  onDragStart: (e: React.DragEvent, taskId: string, sourceStatus: Task["status"]) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetStatus: Task["status"]) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  columns,
  onAddTask,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  return (
    <div className="h-[calc(100vh-12rem)] overflow-x-auto">
      <div className="flex space-x-4 min-w-[800px] pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="task-column flex-1"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, column.status)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-700">
                {column.title} <span className="text-gray-400 text-sm ml-1">({column.tasks.length})</span>
              </h3>
              <button
                onClick={() => onAddTask(column.status)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <PlusCircle size={16} />
              </button>
            </div>

            <div className="space-y-2">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, task.id, task.status)}
                  className="task-card animate-fade-in"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-gray-800">{task.title}</h4>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex space-x-1">
                      {task.labels.map((label, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                    
                    {task.dueDate && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar size={12} className="mr-1" />
                        <span>
                          {task.dueDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AddTaskButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-6 right-6 p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors"
    >
      <PlusCircle size={24} />
    </button>
  );
};
