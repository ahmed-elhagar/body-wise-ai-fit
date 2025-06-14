
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const UsersTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Users Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">User management features coming soon!</p>
      </CardContent>
    </Card>
  );
};

export default UsersTable;
