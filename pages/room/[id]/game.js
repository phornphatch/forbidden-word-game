import { VStack, Box, Heading, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import useSWR from "swr";
import { authFetcher } from "../../../lib/fetcher";
import { dayjs } from "../../../lib/dayjs";
import { axiosInstance } from "../../../lib/axios";
import { useFirebase } from "../../../firebase/hooks";
import { child, get, onValue, ref, set } from "firebase/database";

const ROUND_LIMIT = 7;
const roundStatuses = {
  INIT: "init",
  RUNNING: "running",
  LOADING: "loading",
  ENDED: "ended",
};

function roundStatusUpdater(roundStatus, setRoundStatus, useSWRNext) {
  return (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config);
    if (roundStatus === roundStatuses.LOADING) {
      setRoundStatus(roundStatuses.INIT);
    }
    return swr;
  };
}

function atRoundLimit(currentRound, roundLimit) {
  return currentRound === roundLimit;
}

export default function Game() {
  const interval = useRef();
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [roundStatus, setRoundStatus] = useState("init");
  const [displayedTimer, setDisplayedTimer] = useState();
  const [isCreator, setIsCreator] = useState(false);
  const [myWord, setMyWord] = useState("");
  const [round, setRound] = useState(1);
  const router = useRouter();
  const { db } = useFirebase();
  const { data, error, mutate } = useSWR(
    () => {
      if (router.query.id) {
        return [`/api/room/${router.query.id}/user/${userId}/game`];
      }
      return null;
    },
    authFetcher,
    {
      use: [
        (useSWRNext) =>
          roundStatusUpdater(roundStatus, setRoundStatus, useSWRNext),
      ],
    }
  );

  const timerInterval = useCallback(() => {
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
  }, [endTime]);

  useEffect(() => {
    if (
      !localStorage.getItem("fbwg_username") ||
      !localStorage.getItem("fbwg_userid")
    ) {
      router.push("/");
    }

    setUserId(localStorage.getItem("fbwg_userid"));
    setUsername(localStorage.getItem("fbwg_username"));
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
        if (snapshot.exists()) {
          clearInterval(interval.current);
          setEndTime(snapshot.val());
          setRoundStatus(roundStatuses.RUNNING);
          interval.current = timerInterval();
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
        if (snapshot.exists()) {
          setRound(snapshot.val());
        }
      });

      const unsubscribeEnded = onValue(child(roomRef, "/ended"), (snapshot) => {
        if (snapshot.exists && snapshot.val()) {
          router.push(`/room/${router.query.id}/leaderboard`);
        }
      });

      return () => {
        unsubscribe();
        unsubscribeShowAnswer();
        unsubscribeRound();
        unsubscribeEnded();
        clearInterval(interval.current);
      };
    }
  }, [db, endTime, router, router.query.id, timerInterval, userId, username]);

  if (error) {
    console.error("error fetching game data", error);
    return <Heading>Something weng wrong</Heading>;
  }

  return (
    <main>
      <VStack>
        <Heading>Timer: {displayedTimer || "-"}</Heading>
        {!atRoundLimit(round, ROUND_LIMIT) && <Heading>Round: {round}</Heading>}
        <Text>Your score: {username} - 0</Text>
        {myWord !== "" && <Text>Your word: {myWord}</Text>}
        {data?.users?.map((p) => (
          <Box key={p.word}>
            user: {p.name} word: {p.word || "-"} point: {p.point}
          </Box>
        ))}

        {!atRoundLimit(round, ROUND_LIMIT) &&
          roundStatus === roundStatuses.INIT &&
          isCreator && (
            <Button
              onClick={async () => {
                const roomRef = ref(db, `/${router.query.id}`);
                await set(
                  child(roomRef, "/endTime"),
                  dayjs().add(10, "seconds").unix()
                );
              }}
            >
              Start timer
            </Button>
          )}

        {!atRoundLimit(round, ROUND_LIMIT) &&
          isCreator &&
          roundStatus === roundStatuses.ENDED && (
            <>
              <Button
                onClick={async () => {
                  const roomRef = ref(db, `/${router.query.id}`);
                  await set(child(roomRef, "/showAnswer"), true);
                }}
              >
                Show words
              </Button>
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
                    setRoundStatus(roundStatuses.LOADING);
                    mutate(`/api/room/${router.query.id}/user/${userId}/game`);
                  } else {
                    await set(child(roomRef, "/round"), round + 1);
                  }
                }}
              >
                Next round
              </Button>
            </>
          )}

        {atRoundLimit(round, ROUND_LIMIT) && (
          <Button
            onClick={async () => {
              const roomRef = ref(db, `/${router.query.id}`);
              await set(child(roomRef, "/ended"), true);
            }}
          >
            End Game
          </Button>
        )}
      </VStack>
    </main>
  );
}
