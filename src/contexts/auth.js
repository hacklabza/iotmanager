import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { signIn as sendSignInRequest } from '../api/auth';
import { useLocalStorage } from '../utils/state';


function AuthProvider(props) {
  const [user, setUser] = useLocalStorage('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function () {
      if (user) {
        setUser(user);
      }
      setLoading(false);
    })();
  }, []);

  const signIn = useCallback(async (email, password) => {
    const result = await sendSignInRequest(email, password);
    if (result.isOk) {
      setUser(result.data);
    }
    return result;
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);


  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }} {...props} />
  );
}

const AuthContext = createContext({ loading: false });
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth }
