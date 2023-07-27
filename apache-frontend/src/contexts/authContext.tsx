import React, { useState, createContext, useContext, useEffect } from "react";
import store from "store";

const useValue = () => {
  const [currentUser, setCurrentUser] = React.useState(null);

  return {
    currentUser,
    setCurrentUser,
  };
};

export const AuthContext = createContext({} as ReturnType<typeof useValue>);

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      const user = store.get("my_app_user");
      setCurrentUser(user);
      setLoading(false);
    }
  }, [currentUser]);

  const value = {
    currentUser,
    setCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
