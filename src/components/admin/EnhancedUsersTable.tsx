
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Search, 
  Star,
  Crown,
  Calendar,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
  ai_generations_remaining: number;
  created_at: string;
  is_online?: boolean;
  last_seen?: string;
  subscription?: {
    id: string;
    status: string;
    plan_type: string;
    current_period_end: string;
  };
}

const EnhancedUsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false);
  const queryClient = useQueryClient();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log('Fetching users...');
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          role,
          ai_generations_remaining,
          created_at,
          is_online,
          last_seen
        `)
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Fetch subscriptions for all users
      const { data: subscriptions, error: subsError } = await supabase
        .from('subscriptions')
        .select('user_id, id, status, plan_type, current_period_end')
        .eq('status', 'active');

      if (subsError) {
        console.error('Error fetching subscriptions:', subsError);
      }

      // Merge subscription data with user data
      const usersWithSubscriptions = profiles.map(user => ({
        ...user,
        subscription: subscriptions?.find(sub => sub.user_id === user.id) || null
      }));

      console.log('Fetched users with subscriptions:', usersWithSubscriptions);
      setUsers(usersWithSubscriptions);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast.success('User role updated successfully');
      await fetchUsers();
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const createSubscription = async (userId: string) => {
    setIsCreatingSubscription(true);
    try {
      // Create a 1-month subscription
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          stripe_customer_id: `admin_created_${userId}`,
          stripe_subscription_id: `admin_sub_${userId}_${Date.now()}`,
          status: 'active',
          plan_type: 'monthly',
          current_period_start: startDate.toISOString(),
          current_period_end: endDate.toISOString(),
          cancel_at_period_end: false,
          stripe_price_id: 'admin_created',
          interval: 'month'
        });

      if (error) throw error;

      toast.success('1-month subscription created successfully');
      await fetchUsers();
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('Failed to create subscription');
    } finally {
      setIsCreatingSubscription(false);
    }
  };

  const cancelSubscription = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'cancelled',
          cancel_at_period_end: true 
        })
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) throw error;

      toast.success('Subscription cancelled successfully');
      await fetchUsers();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    }
  };

  const resetAIGenerations = async (userId: string, newCount: number = 5) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ai_generations_remaining: newCount })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`AI generations reset to ${newCount}`);
      await fetchUsers();
    } catch (error) {
      console.error('Error resetting AI generations:', error);
      toast.error('Failed to reset AI generations');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubscriptionBadge = (user: User) => {
    if (user.subscription && user.subscription.status === 'active') {
      const endDate = new Date(user.subscription.current_period_end);
      const isActive = endDate > new Date();
      
      if (isActive) {
        return (
          <Badge className="bg-green-100 text-green-800">
            <Crown className="h-3 w-3 mr-1" />
            Pro
          </Badge>
        );
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Users className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Enhanced User Management</h2>
            <p className="text-gray-600">Manage user roles, subscriptions, and AI generations</p>
          </div>
        </div>
        
        <Button onClick={fetchUsers} variant="outline">
          <UserPlus className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Role System:</strong> Only 'normal' and 'admin' roles available. Pro status comes from active subscriptions.
          <br />
          <strong>Subscription Management:</strong> Create 1-month subscriptions or cancel existing ones.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users ({filteredUsers.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>AI Credits</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {user.first_name && user.last_name 
                          ? `${user.first_name} ${user.last_name}` 
                          : user.email}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {getSubscriptionBadge(user)}
                      {user.subscription && (
                        <div className="text-xs text-gray-500">
                          Expires: {new Date(user.subscription.current_period_end).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{user.ai_generations_remaining}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => resetAIGenerations(user.id)}
                      >
                        <Star className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.is_online ? 'bg-green-500' : 'bg-gray-300'}`} />
                      {user.is_online ? 'Online' : 'Offline'}
                    </div>
                    {user.last_seen && !user.is_online && (
                      <div className="text-xs text-gray-500">
                        Last seen: {new Date(user.last_seen).toLocaleDateString()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog open={isEditDialogOpen && selectedUser?.id === user.id} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            Edit Role
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit User Role</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Email</Label>
                              <Input value={selectedUser?.email || ''} disabled />
                            </div>
                            <div>
                              <Label>Role</Label>
                              <Select
                                value={selectedUser?.role || 'normal'}
                                onValueChange={(value) => {
                                  if (selectedUser) {
                                    updateUserRole(selectedUser.id, value);
                                  }
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="normal">Normal</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {user.subscription && user.subscription.status === 'active' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelSubscription(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel Sub
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => createSubscription(user.id)}
                          disabled={isCreatingSubscription}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Add 1M Sub
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedUsersTable;
