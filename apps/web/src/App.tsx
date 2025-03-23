import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Docs from "./pages/Docs";
import Library from "./pages/Library";
import Tasks from "./pages/Tasks";
import Board from "./pages/Board";
import Image from "./pages/Image";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/library" element={<Library />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/board" element={<Board />} />
              <Route path="/image" element={<Image/>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;