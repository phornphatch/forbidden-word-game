import { VStack, Box, Heading, Button, Text, Center } from "@chakra-ui/react";
import { onValue, child, ref, get, set } from "firebase/database";
import useSWR from "swr";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { authFetcher } from "../../../lib/fetcher";
import { useFirebaseDB } from "../../../firebase/hooks";
import { axiosInstance } from "../../../lib/axios";

export default function Waiting() {
  const startGame = useRef();
  const router = useRouter();
  const [userId, setUserId] = useState(null);

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
    if (!localStorage.getItem("fbwg_userid")) {
      router.push("/");
    }

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
          router.push(`/room/${router.query.id}/game`);
        }
      });

      const unsubscribeRoom = onValue(child(roomRef, "/users"), (snapshot) => {
        if (snapshot.exists()) {
          setUsers(Object.values(snapshot.val()));
        }
      });

      isCreatorSet();

      startGame.current = async () => {
        await axiosInstance.get(
          `/api/room/${router.query.id}/user/${userId}/random-word`
        );
        await set(child(roomRef, "/start"), true);
      };

      return () => {
        unsubscribeStart();
        unsubscribeRoom();
      };
    }

    setUserId(localStorage.getItem("fbwg_userid"));
  }, [db]);

  if (error) return <Heading>Something went wrong</Heading>;

  return (
    <main>
      <VStack  alignContent="center">
      <Center h="100vh" color="white" marginTop="-50px">
      <VStack spacing={8}>
        <Heading size="2xl">Waiting for players...</Heading>
        <Heading size="xl">Room: {router.query.id}</Heading>
        {!users && <Text>Loading</Text>}
        {users?.map((p) => (
          <Box key={p.name}>{p.name}</Box>
        ))}
        {isCreator && (
          <Button onClick={async () => await startGame.current()}
          borderRadius="30"
                border="1px"
                borderColor="white"
                backgroundColor="rgba(225, 225, 225, 0.3)"
                color="white"
                fontWeight="bold"
                width="500px"
                height="50px"
                cursor="pointer"
                _hover={{
                  bgGradient: "linear(to-r, rgba(31, 79, 109, 0.9), rgba(49, 54, 101, 0.9))",
                }}>Start</Button>
        )}
        </VStack>
        </Center>
      </VStack>
    </main>
  );
}
