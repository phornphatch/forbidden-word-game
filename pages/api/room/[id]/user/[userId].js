import { joinRoom } from "../../../../../db";
import { cors } from "../../../../../lib/middleware";

export default async function handler(req, res) {
  await cors(req, res);

  const room = await joinRoom(req.query.id, req.body.username, req.query.userId);

  if (room) {
    return res.status(200).send();
  }

  return res.status(404).send();
}
