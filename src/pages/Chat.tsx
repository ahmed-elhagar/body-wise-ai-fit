
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

const Chat = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">AI Chat</h1>
            <p className="text-gray-600">AI chat features coming soon...</p>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Chat;
