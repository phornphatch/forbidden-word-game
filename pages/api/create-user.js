import { addUserToRoom } from "../../db";


export default async function handler(req, res) {
  const { body } = req;
  addUserToRoom(body.username, body.roomId);
  return res.status(200).send();
}