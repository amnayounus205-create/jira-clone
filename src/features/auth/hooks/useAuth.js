const useAuth = () => {
  return {
    isAuthenticated: true,
    user: {
      id: 1,
      name: "Admin",
      role: "Super Admin",
    },
  };
};

export default useAuth;