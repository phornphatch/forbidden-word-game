import admin from "../firebase/nodeApp";

const db = admin.database();

const words = {
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

export async function joinRoom(roomId, username) {
  const room = await db.ref(`/${roomId}`).get();
  if (!room.val()) return null;
  return db.ref(`${roomId}/users`).push({
    name: username,
    point: 0,
    word: "",
  });
}

export async function setRoom(roomId, username) {
  try {
    await db.ref(`/${roomId}`).set({
      id: roomId,
      creator: username,
      users: [
        {
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

export async function getUsersByRoomId(roomId) {
  const snapshot = await db.ref(`/${roomId}/users`).get();
  if (snapshot.exists()) {
    return Object.values(snapshot.val());
  }

  return [];
}
