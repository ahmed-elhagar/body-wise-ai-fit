
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { ProfilePage } from "@/features/profile";

const Profile = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <ProfilePage />
      </Layout>
    </ProtectedRoute>
  );
};

export default Profile;
