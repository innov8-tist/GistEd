
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="text-center glass p-12 rounded-xl animate-fade-in">
        <h1 className="text-6xl font-bold mb-4 text-blue-500">404</h1>
        <p className="text-xl text-gray-600 mb-8">The page you're looking for doesn't exist</p>
        <Link to="/chat" className="btn-primary inline-flex items-center">
          <Home size={18} className="mr-2" />
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
