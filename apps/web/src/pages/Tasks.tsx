
import React, { useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import { TaskBoard, AddTaskButton } from "@/components/TaskBoard";
import AddTaskDialog from "@/components/AddTaskDialog";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "review" | "done";
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  labels: string[];
}

const initialTasks: Task[] = [
  {
    id: "task1",
    title: "Complete Literature Review",
    description: "Finish researching for the thesis introduction",
    status: "todo",
    dueDate: new Date(2023, 5, 15),
    priority: "high",
    labels: ["Research", "Thesis"],
  },
  {
    id: "task2",
    title: "Prepare Presentation Slides",
    status: "todo",
    dueDate: new Date(2023, 5, 20),
    priority: "medium",
    labels: ["Presentation"],
  },
  {
    id: "task3",
    title: "Review Calculus Problem Set",
    description: "Check solutions for homework assignment",
    status: "in-progress",
    priority: "medium",
    labels: ["Homework", "Math"],
  },
  {
    id: "task4",
    title: "Update Research Notes",
    status: "in-progress",
    priority: "low",
    labels: ["Research"],
  },
  {
    id: "task5",
    title: "Submit Physics Lab Report",
    status: "review",
    dueDate: new Date(2023, 5, 10),
    priority: "high",
    labels: ["Lab", "Physics"],
  },
  {
    id: "task6",
    title: "Compile Data Analysis Results",
    status: "done",
    priority: "medium",
    labels: ["Data", "Analysis"],
  },
  {
    id: "task7",
    title: "Complete Programming Exercise",
    status: "done",
    priority: "medium",
    labels: ["Coding", "Assignment"],
  },
];

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [sourceStatus, setSourceStatus] = useState<Task["status"] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<Task["status"]>("todo");

  const columns = [
    {
      id: "col1",
      title: "To Do",
      status: "todo" as const,
      tasks: tasks.filter(task => task.status === "todo"),
    },
    {
      id: "col2",
      title: "In Progress",
      status: "in-progress" as const,
      tasks: tasks.filter(task => task.status === "in-progress"),
    },
    {
      id: "col3",
      title: "Review",
      status: "review" as const,
      tasks: tasks.filter(task => task.status === "review"),
    },
    {
      id: "col4",
      title: "Done",
      status: "done" as const,
      tasks: tasks.filter(task => task.status === "done"),
    },
  ];

  const handleDragStart = (e: React.DragEvent, taskId: string, status: Task["status"]) => {
    setDraggedTaskId(taskId);
    setSourceStatus(status);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Task["status"]) => {
    e.preventDefault();
    
    if (draggedTaskId && sourceStatus && sourceStatus !== targetStatus) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === draggedTaskId ? { ...task, status: targetStatus } : task
        )
      );
    }
    
    setDraggedTaskId(null);
    setSourceStatus(null);
  };

  const handleOpenAddTaskDialog = (status: Task["status"]) => {
    setNewTaskStatus(status);
    setDialogOpen(true);
  };

  const handleAddTask = (taskData: {
    title: string;
    description?: string;
    dueDate?: Date;
    status: Task["status"];
  }) => {
    const newTask: Task = {
      id: `task${tasks.length + 1}`,
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      dueDate: taskData.dueDate,
      priority: "medium",
      labels: ["New"],
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      
      <div className="w-full px-4">
        <div className="glass rounded-lg p-6 relative">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Task Board</h2>
          
          <TaskBoard
            columns={columns}
            onAddTask={handleOpenAddTaskDialog}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
          
          <AddTaskButton onClick={() => handleOpenAddTaskDialog("todo")} />
          
          <AddTaskDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onAddTask={handleAddTask}
            status={newTaskStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
