import { filter } from "lodash";
import admin from "../firebase/nodeApp";

const db = admin.database();

export const words = {
  verb: [
    "กิน",
    "นอน",
    "นั่ง",
    "ยืน",
    "เขียน",
    "พิมพ์",
    "ออกกำลังกาย",
    "เที่ยว",
    "เดิน",
    "ทำอาหาร",
    "คิด",
    "เรียน",
    "หลับ",
    "ขับรถ",
    "อาบน้ำ",
  ],
  fruit: [
    "แอปเปิ้ล",
    "มะละกอ",
    "กล้วย",
    "ส้ม",
    "กีวี่",
    "องุ่่น",
    "ทุเรียน",
    "เงาะ",
    "ลำไย",
    "สตอเบอร์รี่",
  ],
  animal: [
    "หมา",
    "แมว",
    "หมู",
    "หมี",
    "ควาย",
    "วัว",
    "ปลา",
    "หนู",
    "แพนด้า",
    "เพนกวิน",
    "ช้าง",
  ],
  occupation: [
    "ครู",
    "นักเรียน",
    "หมอ",
    "นายก",
    "ตำรวจ",
    "ทหาร",
    "ดารา",
    "พ่อค้า",
    "แม่ค้า",
  ],
  other: [
    "ใช่",
    "ไม่ใช่",
    "อะไร",
    "ที่ไหน",
    "เมื่อไร",
    "ใคร",
    "ทำไม",
    "หรอ",
    "จริง",
    "เธอ",
    "เรา",
    "นั่น",
    "ใกล้",
    "ไกล",
    "ได้",
    "ตก",
    "เบิ่อ",
    "ง่วง",
    "หิว",
  ],
};

export async function joinRoom(roomId, username, userId) {
  const room = await db.ref(`/${roomId}`).get();
  if (!room.val()) return null;
  return db.ref(`${roomId}/users`).push({
    id: userId,
    name: username,
    point: 0,
    word: "",
  });
}

export async function setRoom(roomId, username, userId) {
  try {
    await db.ref(`/${roomId}`).set({
      id: roomId,
      creator: username,
      users: [
        {
          id: userId,
          name: username,
          point: 0,
          word: "",
        },
      ],
    });
  } catch (e) {
    console.error(e);
  }
}

export async function setUsers(roomId, users) {
  await db.ref(`/${roomId}/users`).set(users);
}

export async function getRoom(roomId) {
  const snapshot = await db.ref(`/${roomId}`).get();
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
}

export async function getOtherUsers(roomId, userId) {
  const snapshot = await db.ref(`/${roomId}/users`).get();
  if (snapshot.exists()) {
    const users = filter(snapshot.val(), (user) => (user.id !== userId))
    return users;
  }

  return null;
}

export async function getUsersByRoomId(roomId) {
  const snapshot = await db.ref(`/${roomId}/users`).get();
  if (snapshot.exists()) {
    return Object.values(snapshot.val());
  }

  return [];
}
