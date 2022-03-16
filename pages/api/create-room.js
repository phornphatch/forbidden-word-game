import { setRoom } from "../../db";

function generateRoomId() {
  return Math.random().toString(36).substring(2, 7);
}

export default async function handler(req, res) {
  const roomId = generateRoomId();
  await setRoom(roomId);
  return res.status(200).json({ roomId });
}
