import { VStack, Box, Heading, Button, Text } from "@chakra-ui/react";
import { onValue, child, ref, get, set } from "firebase/database";
import useSWR from "swr";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { authFetcher } from "../../../lib/fetcher";
import { useFirebaseDB } from "../../../firebase/hooks";

export default function Waiting() {
  const startGame = useRef();
  const router = useRouter();
  const { data, error } = useSWR(() => {
    if (router.query.id) {
      return `/api/get-players/${router.query.id}`;
    }

    return null;
  }, authFetcher);

  const [users, setUsers] = useState(data?.users);
  const [isCreator, setIsCreator] = useState(false);
  const { db } = useFirebaseDB();

  useEffect(() => {
    if (db) {
      const roomRef = ref(db, `/${router.query.id}`);

      const isCreatorSet = async () => {
        const creatorName = await get(child(roomRef, "/creator"));
        setIsCreator(
          creatorName.val() === localStorage.getItem("fbwg_username")
        );
      };

      const unsubscribeStart = onValue(child(roomRef, "/start"), (snapshot) => {
        if (snapshot.exists() && snapshot.val() === true) {
          router.push("/game");
        }
      });

      const unsubscribeRoom = onValue(child(roomRef, "/users"), (snapshot) => {
        if (snapshot.exists()) {
          setUsers(Object.values(snapshot.val()));
        }
      });

      isCreatorSet();

      startGame.current = async () => {
        await set(child(roomRef, '/start'), true);
      };

      return () => {
        unsubscribeStart();
        unsubscribeRoom();
      };
    }
  }, [db]);

  if (error) return <Heading>Something went wrong</Heading>;

  return (
    <main>
      <VStack>
        <Heading>Waiting for players...</Heading>
        {!users && <Text>Loading</Text>}
        {users?.map((p) => (
          <Box key={p.name}>{p.name}</Box>
        ))}
        {isCreator && (
          <Button onClick={async () => await startGame.current()}>Start</Button>
        )}
      </VStack>
    </main>
  );
}
