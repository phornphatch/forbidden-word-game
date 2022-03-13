import { VStack, Box, Heading, Button } from "@chakra-ui/react";
import Link from "next/link";

export default function Waiting() {
  const players = [
    {
      username: "test",
    },
    {
      username: "test2",
    },
    {
      username: "test3",
    },
    {
      username: "test4",
    },
  ];
  return (
    <main>
      <VStack>
        <Heading>Waiting for players...</Heading>
        {players.map((p) => (
          <Box key={p.username}>{p.username}</Box>
        ))}
        <Link href="/game">
          <Button>Start</Button>
        </Link>
      </VStack>
    </main>
  );
}
