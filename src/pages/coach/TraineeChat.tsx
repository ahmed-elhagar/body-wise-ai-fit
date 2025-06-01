
import { Navigate } from "react-router-dom";

const TraineeChat = () => {
  // Redirect to the Chat page
  return <Navigate to="/chat" replace />;
};

export default TraineeChat;
