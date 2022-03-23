import { getRoom, joinRoom } from "../../../db";
import { cors } from "../../../lib/middleware";

export default async function handler(req, res) {
  await cors(req, res);

  // handle get method
  const room = await getRoom(req.query.id);
  if (!room) return res.status(404).send();
  return res.status(200).json({ message: "ok" });
}
