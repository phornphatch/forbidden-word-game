import { getAuth, signInAnonymously } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { useEffect, useState } from "react";
import { createFirebaseApp } from "./clientApp";

export function useFirebase() {
  const [db, setDB] = useState(null);
  const [anonUser, setAnonUser] = useState(null);

  useEffect(() => {
    const signIn = async () => {
      const app = createFirebaseApp();
      const auth = getAuth(app);
      const { user } = await signInAnonymously(auth);
      setDB(getDatabase(app));
      setAnonUser(user);
    };

    signIn();
  }, []);

  return { db, anonUser };
}
