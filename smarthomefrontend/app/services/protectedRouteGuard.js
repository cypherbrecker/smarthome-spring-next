import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ApiService from "./ApiService";

const ProtectedRouteGuard = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = ApiService.isAuthenticated();
    // console.log("token:", token);
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true); //if he has token then the authentication is okey
    }
  }, [router]);

  //if isAuthenticated then render the children
  return isAuthenticated ? children : null;
};

export default ProtectedRouteGuard;
