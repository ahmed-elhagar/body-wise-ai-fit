
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Coach = () => {
  return (
    <ProtectedRoute requireRole="coach">
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
          <PageHeader
            title="Coach Dashboard"
            description="Manage your trainees and coaching programs"
            icon={<Users className="h-6 w-6 text-purple-600" />}
          />
          
          <div className="px-6 pb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Coach Panel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Coach dashboard coming soon!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Coach;
