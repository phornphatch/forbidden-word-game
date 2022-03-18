import { getUsersByRoomId } from "../../../db";
import { cors } from "../../../lib/middleware";

export default async function handler(req, res) {
  await cors(req, res)
  const users = await getUsersByRoomId(req.query.id);
  return res.status(200).json({ users });
}
