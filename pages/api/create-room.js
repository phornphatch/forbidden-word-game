import { setRoom } from "../../db";

function generateRoomId() {
  return Math.random().toString(36).substring(2, 7);
}

export default async function handler(req, res) {
  try {
    const { username } = req.body;
    const roomId = generateRoomId();
    await setRoom(roomId, username);
    return res.status(200).json({ roomId });
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
}
