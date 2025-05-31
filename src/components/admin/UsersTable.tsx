
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  ai_generations_remaining: number;
  created_at: string;
}

const UsersTable = () => {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, ai_generations_remaining, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as User[];
    }
  });

  if (isLoading) {
    return (
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
      <h2 className="text-xl font-semibold mb-4">Users Overview</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Email</th>
              <th className="text-left py-2">AI Generations Left</th>
              <th className="text-left py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="py-2">{user.first_name} {user.last_name}</td>
                <td className="py-2">{user.email}</td>
                <td className="py-2">
                  <Badge variant={user.ai_generations_remaining > 0 ? "default" : "destructive"}>
                    {user.ai_generations_remaining}
                  </Badge>
                </td>
                <td className="py-2">{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default UsersTable;
