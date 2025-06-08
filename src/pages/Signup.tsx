
import NewSignupForm from "@/components/signup/NewSignupForm";
import ProtectedRoute from "@/components/ProtectedRoute";

const Signup = () => {
  return (
    <ProtectedRoute requireAuth={false} preventAuthenticatedAccess={true}>
      <NewSignupForm />
    </ProtectedRoute>
  );
};

export default Signup;
