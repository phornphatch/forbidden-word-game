import { VStack, Box, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { authFetcher } from "../../../lib/fetcher";

export default function Game() {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const router = useRouter();
  const { data, error } = useSWR([`/api/room/${router.query.id}/user/${userId}/game`], authFetcher);

  if (error) {
    console.error('error fetching game data', error);
    return <Heading>Something weng wrong</Heading>;
  };

  useEffect(() => {
    if (!localStorage.getItem("fbwg_username") || !localStorage.getItem("fbwg_userid")) {
      router.push("/");
    }

    setUserId(localStorage.getItem("fbwg_userid"))
    setUsername(localStorage.getItem("fbwb_username"))
  }, [])

  return (
    <main>
      <VStack>
        <Heading>Timer: 01:00</Heading>
        <Text>Your score: {username} - 0</Text>
        {data?.users.map((p) => (
          <Box key={p.word}>
            user: {p.name} word: {p.word || '-'} point: {p.point}
          </Box>
        ))}
      </VStack>
    </main>
  );
}
