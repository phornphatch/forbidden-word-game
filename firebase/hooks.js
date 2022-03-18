import { getAuth, signInAnonymously } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { useEffect, useState } from "react";
import { createFirebaseApp } from "./clientApp";

export function useFirebaseDB() {
  const [db, setDB] = useState(null);

  useEffect(() => {
    const signIn = async () => {
      const app = createFirebaseApp();
      const auth = getAuth(app);
      await signInAnonymously(auth);
      setDB(getDatabase(app));
    };

    signIn();
  }, []);

  return { db };
}
