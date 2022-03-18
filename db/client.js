import { getDatabase, ref } from "firebase/database";
import { createFirebaseApp } from "../firebase/clientApp";

export function getRoomRef(roomId) {
  const app = createFirebaseApp();
  const db = getDatabase(app);
  return ref(db, `/${roomId}`);
}
