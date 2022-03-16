import { getRoom } from "../../../db";

export default async function handler(req, res) {
  const room = await getRoom(req.query.id);
  if (room) {
    return res.status(200).send();
  }

  return res.status(404).send();
}
