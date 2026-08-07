import { useSelector } from "react-redux";

const useAuth = () => {
  const auth = useSelector((state) => state.auth);

  let storageAuth = null;

  if (!auth.isAuthenticated) {
    storageAuth =
      JSON.parse(localStorage.getItem("auth")) ||
      JSON.parse(sessionStorage.getItem("auth"));
  }

  return {
    user: auth.user || storageAuth?.user,
    token: auth.token || storageAuth?.token,
    role: auth.user?.role || storageAuth?.user?.role,
    isAuthenticated:
      auth.isAuthenticated || !!storageAuth,
  };
};

export default useAuth;