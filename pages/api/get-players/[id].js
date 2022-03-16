import { getUsersByRoomId } from "../../../db";

export default async function handler(req, res) {
  const users = await getUsersByRoomId(req.query.id);
  return res.status(200).json({ users });
}
