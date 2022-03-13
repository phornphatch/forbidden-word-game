import { VStack, Box, Heading } from "@chakra-ui/react";

export default function Game() {
  const players = [
    {
      username: "test2",
      word: "กล้วย",
    },
    {
      username: "test3",
      word: "ช้าง",
    },
    {
      username: "test4",
      word: "ลิง",
    },
  ];

  return (
    <main>
      <VStack>
        <Heading>Timer: 01:00</Heading>
        {players.map((p) => (
          <Box key={p.username}>
            user: {p.username} word: {p.word}
          </Box>
        ))}
      </VStack>
    </main>
  );
}
