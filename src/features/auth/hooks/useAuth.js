import { useSelector } from "react-redux";

const normalizeRole = (role) => {
  if (!role) return null;

  return String(role)
    .trim()
    .replace(/\s+/g, " ");
};

const readStoredAuth = () => {
  try {
    const localAuth = localStorage.getItem("auth");

    if (localAuth) {
      const parsed = JSON.parse(localAuth);

      if (parsed?.token && parsed?.user) {
        return parsed;
      }
    }

    const sessionAuth = sessionStorage.getItem("auth");

    if (sessionAuth) {
      const parsed = JSON.parse(sessionAuth);

      if (parsed?.token && parsed?.user) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Unable to read stored authentication:", error);
  }

  return null;
};

const useAuth = () => {
  const auth = useSelector((state) => state.auth);

  const storedAuth = readStoredAuth();

  /*
   * Redux is the primary source.
   * Storage is only used after a page refresh.
   */
  const user = auth.user || storedAuth?.user || null;

  const token = auth.token || storedAuth?.token || null;

  const role = normalizeRole(user?.role);

  const isAuthenticated = Boolean(user && token);

  return {
    user,
    token,
    role,
    isAuthenticated,
  };
};

export default useAuth;
