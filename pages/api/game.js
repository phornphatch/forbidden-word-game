
export default function handler(req, res) {
  const user = req.headers['authorization'];
  // const userWithoutSelf = getdb().ab123.users.filter(u => u.name !== user);
  // return res.status(200).json({ users: userWithoutSelf });
}
