
// Admin feature utilities exports
export const formatUserRole = (role: string) => {
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export const formatTaskPriority = (priority: string) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

export const getTaskStatusColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-red-600';
    case 'medium':
      return 'text-yellow-600';
    case 'low':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
};
