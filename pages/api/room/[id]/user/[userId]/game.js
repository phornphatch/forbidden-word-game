import { getOtherUsers } from "../../../../../../db";

export default async function handler(req, res) {
  const users = await getOtherUsers(req.query.id, req.query.userId);
  if (!users) return res.status(404).send();
  return res.status(200).json({ users });
}
