import React from 'react';
import { Bell } from 'lucide-react';

const NotificationsPage = () => {
  return (
    
      <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 to-brand-secondary-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-brand-neutral-900 flex items-center gap-3 mb-4">
            <Bell className="h-8 w-8 text-brand-primary-500" />
            Notifications
          </h1>
          <p className="text-brand-neutral-600">
            Your notifications will appear here.
          </p>
        </div>
      </div>
    
  );
};

export default NotificationsPage;
