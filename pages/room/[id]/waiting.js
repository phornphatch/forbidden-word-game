import { VStack, Box, Heading, Button, Text, Center, Container, HStack, Grid } from "@chakra-ui/react";
import { onValue, child, ref, get, set } from "firebase/database";
import useSWR from "swr";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { authFetcher } from "../../../lib/fetcher";
import { useFirebase } from "../../../firebase/hooks";
import { axiosInstance } from "../../../lib/axios";
import Image from "next/image";

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
  const { db } = useFirebase();

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
  }, [db, router, userId]);

  if (error) return <Heading>Something went wrong</Heading>;

  return (
    <main>
      <VStack alignContent="center">
        <Center h="100vh" color="white">
          <VStack spacing={6}>
            <Heading >WAITING FOR PLAYERS. .</Heading>
            <HStack>
              <Box color="white" size='3xl' fontWeight='light'>
                ROOM CODE: </Box>
              <VStack alignContent="center"
                borderRadius="10"
                border="2px"
                borderColor="white"
                backgroundColor="white"
                color="black"
                fontWeight="bold"
                width="100px"
                height="30px">
                <Box>{router.query.id}</Box>
              </VStack>
            </HStack>

            <Box >
              <Image
                src="/images/waiting.png"
                width={178}
                height={128}
              />
            </Box>

            {!users &&
              <VStack alignContent="center">
                <Center color="white">
                  <Heading>Loading . . </Heading>
                </Center>
              </VStack>
            }
            <Grid templateColumns='repeat(2, 1fr)' gap={3}>
            {users?.map((p) => (
              <VStack key={p.name} borderRadius="10"
                border="1px"
                borderColor="white"
                width="170px"
                height="40px"
                alignItems="center"
                margin="auto"
                justifyContent="center"
              >
                <Box>{p.name}</Box>
              </VStack>
            ))}
            </Grid>

            {isCreator && (
              <Button onClick={async () => await startGame.current()}
                borderRadius="30"
                border="1px"
                borderColor="white"
                backgroundColor="rgba(225, 225, 225, 0.3)"
                color="white"
                fontWeight="bold"
                width="400px"
                height="50px"
                cursor="pointer"
                _hover={{
                  bgGradient:
                    "linear(to-r, rgba(31, 79, 109, 0.9), rgba(49, 54, 101, 0.9))",
                }}
              >
                Start
              </Button>
            )}
          </VStack>
        </Center>
      </VStack>
    </main>
  );
}
