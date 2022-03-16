import { VStack, Box, Heading } from "@chakra-ui/react";
import useSWR from "swr";
import { authFetcher } from "../lib/fetcher";

export default function Game() {
  const { data, error } = useSWR(['/api/game', 'tino'], authFetcher);

  if (error) {
    console.error('error fetching game data', error);
    return <Heading>Something weng wrong</Heading>;
  };

  return (
    <main>
      <VStack>
        <Heading>Timer: 01:00</Heading>
        {data?.users.map((p) => (
          <Box key={p.word}>
            user: {p.name} word: {p.word || '-'} point: {p.point}
          </Box>
        ))}
      </VStack>
    </main>
  );
}
