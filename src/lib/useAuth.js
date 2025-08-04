// lib/useAuth.js
import { useEffect, useState } from "react";
import { auth } from "./firebaseConfig";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ⏳ estado de carregamento

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false); // ✅ carregamento concluído
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};

export default useAuth;