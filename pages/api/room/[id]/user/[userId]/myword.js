import { getRoom } from "../../../../../../db";

export default async function handler(req, res) {
  const room = await getRoom(req.query.id)
  if (!room) return res.status(404).send();
  const [currentUser] = room.users.filter(({ id }) => id === req.query.userId)
  return res.status(200).json({ word: currentUser.word });
}
