import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const GlobalLoader = () => {
  const { loading: authLoading } = useAuth();

  if (!authLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center">
        <Loader size="lg" />
        <p className="text-gray-400 mt-4 text-lg tracking-widest font-primary">AUTHENTICATING REBELLION...</p>
    </div>
  );
};

export default GlobalLoader;