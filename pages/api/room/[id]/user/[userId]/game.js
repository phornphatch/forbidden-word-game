import { omit } from "lodash";
import { getOtherUsers, getRoom } from "../../../../../../db";

export default async function handler(req, res) {
  const [{users, self}, room] = await Promise.all([
    getOtherUsers(req.query.id, req.query.userId),
    getRoom(req.query.id),
  ]);
  if (!users || !room) return res.status(404).send();
  return res.status(200).json({ users, endTime: room.endTime, self: omit(self, 'word') });
}
