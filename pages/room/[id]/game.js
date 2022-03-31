import {
  VStack,
  Box,
  Heading,
  Text,
  Button,
  Center,
  HStack,
  Container,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { dayjs } from "../../../lib/dayjs";
import { axiosInstance } from "../../../lib/axios";
import { useFirebase } from "../../../firebase/hooks";
import { child, get, onValue, ref, remove, set } from "firebase/database";
import Image from "next/image";
import { isEqual, omit } from "lodash";
import getConfig from "next/config";

const ROUND_LIMIT = 7;
const roundStatuses = {
  INIT: "init",
  RUNNING: "running",
  LOADING: "loading",
  ENDED: "ended",
};

const { publicRuntimeConfig } = getConfig();

function atRoundLimit(currentRound, roundLimit) {
  return currentRound >= roundLimit;
}

export default function Game() {
  const interval = useRef();
  const timerIntervalFunc = useRef();
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [roundStatus, setRoundStatus] = useState(roundStatuses.INIT);
  const [displayedTimer, setDisplayedTimer] = useState();
  const [isCreator, setIsCreator] = useState(false);
  const [myWord, setMyWord] = useState("");
  const [round, setRound] = useState(1);
  const [users, setUsers] = useState([]);
  const [self, setSelf] = useState({});
  const router = useRouter();
  const { db } = useFirebase();

  timerIntervalFunc.current = () => {
    return setInterval(() => {
      const timeLeftInSeconds = dayjs.unix(endTime).diff(dayjs(), "s");
      if (timeLeftInSeconds > 0) {
        const formattedSecondsLeft = dayjs
          .duration(timeLeftInSeconds, "seconds")
          .format("mm:ss");
        if (timeLeftInSeconds < 0) {
          return clearInterval(interval);
        }
        setDisplayedTimer(formattedSecondsLeft);
      } else {
        clearInterval(interval.current);
        setRoundStatus(roundStatuses.ENDED);
        setDisplayedTimer("Times up!");
      }
    }, 1000);
  };

  useEffect(() => {
    if (
      !localStorage.getItem("fbwg_username") ||
      !localStorage.getItem("fbwg_userid")
    ) {
      router.push("/");
    }

    setUserId(localStorage.getItem("fbwg_userid"));
    setUsername(localStorage.getItem("fbwg_username"));
    const getUsers = async (roomId) => {
      const {
        data: { users, self },
      } = await axiosInstance.get(
        `/api/room/${roomId}/user/${localStorage.getItem("fbwg_userid")}/game`
      );
      setUsers(users);
      setSelf(self);
    };
    if (router.query.id) {
      getUsers(router.query.id);
    }
  }, [router]);

  useEffect(() => {
    if (db) {
      const roomRef = ref(db, `/${router.query.id}`);

      const updateIsCreator = async () => {
        const creatorName = await get(child(roomRef, "/creator"));
        setIsCreator(creatorName.val() === username);
      };

      updateIsCreator();

      const unsubscribe = onValue(child(roomRef, "/endTime"), (snapshot) => {
        if (
          snapshot.exists() &&
          [roundStatuses.INIT, roundStatuses.RUNNING].includes(roundStatus)
        ) {
          clearInterval(interval.current);
          setEndTime(snapshot.val());
          setRoundStatus(roundStatuses.RUNNING);
          interval.current = timerIntervalFunc.current();
        }

        if (snapshot.exists && roundStatus === roundStatuses.LOADING) {
          clearInterval(interval.current);
          setRoundStatus(roundStatuses.INIT);
        }
      });

      const unsubscribeShowAnswer = onValue(
        child(roomRef, "/showAnswer"),
        async (snapshot) => {
          if (snapshot.exists() && snapshot.val() === true) {
            const users = await get(child(roomRef, "users"));
            const [currentUser] = users.val().filter(({ id }) => id === userId);
            setMyWord(currentUser.word);
          }

          if (snapshot.val() === false) {
            setMyWord("");
          }
        }
      );

      const unsubscribeRound = onValue(child(roomRef, "/round"), (snapshot) => {
        if (snapshot.exists() && snapshot.val() !== round) {
          clearInterval(interval.current);
          setRoundStatus(roundStatuses.LOADING);
          setDisplayedTimer("-");
          setRound(snapshot.val());
          setEndTime(null);
        }
      });

      const unsubscribeEnded = onValue(child(roomRef, "/ended"), (snapshot) => {
        if (snapshot.exists && snapshot.val()) {
          router.push(`/room/${router.query.id}/leaderboard`);
        }
      });

      const unsubscribeUsers = onValue(child(roomRef, "/users"), (snapshot) => {
        const otherUsers = snapshot
          .val()
          .filter((u) => u.id !== localStorage.getItem("fbwg_userid"));

        const [newSelf] = snapshot
          .val()
          .filter((u) => u.id === localStorage.getItem("fbwg_userid"));

        if (snapshot.exists() && !isEqual(users, otherUsers)) {
          setUsers(otherUsers);
          clearInterval(interval.current);
          setRoundStatus(roundStatuses.INIT);
          setDisplayedTimer("-");
        }

        if (!isEqual(self, omit(newSelf, "word"))) {
          setSelf(omit(newSelf, "word"));
        }
      });

      return () => {
        unsubscribe();
        unsubscribeShowAnswer();
        unsubscribeRound();
        unsubscribeEnded();
        unsubscribeUsers();
        clearInterval(interval.current);
      };
    }
  }, [
    db,
    endTime,
    router,
    router.query.id,
    userId,
    username,
    round,
    users,
    roundStatus,
    self,
  ]);

  return (
    <main>
      <VStack alignContent="center">
        <Center h="100vh" color="white">
          <VStack spacing={6}>
            {!atRoundLimit(round, ROUND_LIMIT) && (
              <Heading>ROUND {round}</Heading>
            )}
            <HStack>
              <VStack
                alignContent="center"
                borderRadius="10"
                border="2px"
                borderColor="white"
                backgroundColor="white"
                color="black"
                fontWeight="bold"
                padding="1"
                width="250px"
              >
                <Heading>{displayedTimer || "-"}</Heading>
              </VStack>
            </HStack>

            {myWord !== "" && <Text>Your word: {myWord}</Text>}
            <Text>Your points: {self.point ?? "-"}</Text>
            {isCreator && (
              <HStack>
                <Button
                  borderColor="white"
                  backgroundColor="rgba(225, 225, 225, 0.3)"
                  _hover={{
                    bgGradient:
                      "linear(to-r, rgba(31, 79, 109, 0.9), rgba(49, 54, 101, 0.9))",
                  }}
                  onClick={async () => {
                    const roomRef = ref(db, `/${router.query.id}`);
                    const users = await get(child(roomRef, "/users"));

                    let currentUserIndex = -1;
                    users.val().forEach(({ id }, i) => {
                      if (id === localStorage.getItem("fbwg_userid")) {
                        currentUserIndex = i;
                      }
                    });

                    const updatedUsers = users.val().map((u, i) => {
                      if (i === currentUserIndex) {
                        return {
                          ...u,
                          point: u.point - 1,
                        };
                      }
                      return u;
                    });

                    await set(child(roomRef, "/users"), updatedUsers);
                  }}
                >
                  -
                </Button>
                <Button
                  borderColor="white"
                  backgroundColor="rgba(225, 225, 225, 0.3)"
                  _hover={{
                    bgGradient:
                      "linear(to-r, rgba(31, 79, 109, 0.9), rgba(49, 54, 101, 0.9))",
                  }}
                  onClick={async () => {
                    const roomRef = ref(db, `/${router.query.id}`);
                    const users = await get(child(roomRef, "/users"));

                    let currentUserIndex = -1;
                    users.val().forEach(({ id }, i) => {
                      if (id === localStorage.getItem("fbwg_userid")) {
                        currentUserIndex = i;
                      }
                    });

                    const updatedUsers = users.val().map((u, i) => {
                      if (i === currentUserIndex) {
                        return {
                          ...u,
                          point: u.point + 1,
                        };
                      }
                      return u;
                    });

                    await set(child(roomRef, "/users"), updatedUsers);
                  }}
                >
                  +
                </Button>
              </HStack>
            )}
            <HStack>
              {users?.map((p) => (
                <Container
                  key={p.id}
                  border="1px"
                  borderColor="white"
                  borderStyle="dashed"
                  borderRadius="10"
                  minW="130px"
                  padding={3}
                >
                  <VStack spacing={2}>
                    <Heading size="md">&quot; {p.word || "-"} &quot;</Heading>
                    <Box>
                      <Image
                        src="/images/oopsie-orange.png"
                        alt="oopsie orange"
                        width="80px"
                        height="85px"
                      />
                    </Box>
                    <Heading size="sm">{p.name} </Heading>
                    <Heading size="sm" fontWeight="light">
                      {isCreator && (
                        <HStack>
                          <Button
                            borderColor="white"
                            backgroundColor="rgba(225, 225, 225, 0.3)"
                            _hover={{
                              bgGradient:
                                "linear(to-r, rgba(31, 79, 109, 0.9), rgba(49, 54, 101, 0.9))",
                            }}
                            onClick={async () => {
                              const roomRef = ref(db, `/${router.query.id}`);
                              const users = await get(child(roomRef, "/users"));

                              let currentUserIndex = -1;
                              users.val().forEach(({ id }, i) => {
                                if (
                                  id === localStorage.getItem("fbwg_userid")
                                ) {
                                  currentUserIndex = i;
                                }
                              });

                              const updatedUsers = users.val().map((u, i) => {
                                if (i === currentUserIndex) {
                                  return {
                                    ...u,
                                    point: u.point - 1,
                                  };
                                }
                                return u;
                              });

                              await set(child(roomRef, "/users"), updatedUsers);
                            }}
                          >
                            -
                          </Button>
                          <Box>points: {p.point}</Box>
                          <Button
                            borderColor="white"
                            backgroundColor="rgba(225, 225, 225, 0.3)"
                            _hover={{
                              bgGradient:
                                "linear(to-r, rgba(31, 79, 109, 0.9), rgba(49, 54, 101, 0.9))",
                            }}
                            onClick={async () => {
                              const roomRef = ref(db, `/${router.query.id}`);
                              const users = await get(child(roomRef, "/users"));

                              let currentUserIndex = -1;
                              users.val().forEach(({ id }, i) => {
                                if (
                                  id === localStorage.getItem("fbwg_userid")
                                ) {
                                  currentUserIndex = i;
                                }
                              });

                              const updatedUsers = users.val().map((u, i) => {
                                if (i === currentUserIndex) {
                                  return {
                                    ...u,
                                    point: u.point + 1,
                                  };
                                }
                                return u;
                              });

                              await set(child(roomRef, "/users"), updatedUsers);
                            }}
                          >
                            +
                          </Button>
                        </HStack>
                      )}
                      {!isCreator && <Box>point: {p.point}</Box>}
                    </Heading>
                  </VStack>
                </Container>
              ))}
            </HStack>

            {!atRoundLimit(round, ROUND_LIMIT) &&
              roundStatus === roundStatuses.INIT &&
              isCreator && (
                <Button
                  onClick={async () => {
                    clearInterval(interval.current);
                    const roomRef = ref(db, `/${router.query.id}`);
                    await set(
                      child(roomRef, "/endTime"),
                      dayjs()
                        .add(publicRuntimeConfig.roundDurationInMin, "minutes")
                        .unix()
                    );
                  }}
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
                  Start timer
                </Button>
              )}
            {isCreator && roundStatus === roundStatuses.ENDED && (
              <Button
                onClick={async () => {
                  const roomRef = ref(db, `/${router.query.id}`);
                  await set(child(roomRef, "/showAnswer"), true);
                }}
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
                Show words
              </Button>
            )}

            {!atRoundLimit(round + 1, ROUND_LIMIT) &&
              isCreator &&
              roundStatus === roundStatuses.ENDED && (
                <Button
                  onClick={async () => {
                    const roomRef = ref(db, `/${router.query.id}`);
                    // Only random words if next round is a valid round
                    if (round + 1 !== ROUND_LIMIT) {
                      await Promise.all([
                        axiosInstance.get(
                          `/api/room/${router.query.id}/user/${userId}/random-word`
                        ),
                        set(child(roomRef, "/showAnswer"), false),
                        set(child(roomRef, "/round"), round + 1),
                      ]);
                    } else {
                      await set(child(roomRef, "/round"), round + 1);
                    }
                  }}
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
                  Next round
                </Button>
              )}
            {isCreator && roundStatus === roundStatuses.RUNNING && (
              <Button
                onClick={async () => {
                  const roomRef = ref(db, `/${router.query.id}`);
                  setRoundStatus(roundStatuses.ENDED);
                  setDisplayedTimer("Ended!");
                  await Promise.all([
                    set(child(roomRef, "/showAnswer"), false),
                    remove(child(roomRef, "/endTime")),
                  ]);
                }}
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
                End round
              </Button>
            )}

            {atRoundLimit(round + 1, ROUND_LIMIT) &&
              roundStatus === roundStatuses.ENDED &&
              isCreator && (
                <Button
                  onClick={async () => {
                    const roomRef = ref(db, `/${router.query.id}`);
                    await set(child(roomRef, "/ended"), true);
                  }}
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
                  End Game
                </Button>
              )}
          </VStack>
        </Center>
      </VStack>
    </main>
  );
}
