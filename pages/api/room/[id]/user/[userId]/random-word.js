import { sample, map } from "lodash";
import { getRoom, setUsers, words } from "../../../../../../db";

export default async function handler(req, res) {
  const room = await getRoom(req.query.id);

  if (!room) return res.status(404).send();

  const newUsers = map(room.users, (user) => {
    const randomWord = sample([...words.other, ...words.mecode]);
    user.word = randomWord;
    return user;
  });

  await setUsers(req.query.id, newUsers);

  return res.status(200).send();
}
