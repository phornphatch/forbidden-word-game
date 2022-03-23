import { VStack, Box, Heading, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { authFetcher } from "../../../lib/fetcher";
import { dayjs } from "../../../lib/dayjs";
import { useFirebase } from "../../../firebase/hooks";
import { child, get, onValue, ref, set } from "firebase/database";
import { axiosInstance } from "../../../lib/axios";

export default function Game() {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [roundEnded, setRoundEnded] = useState(false);
  const [displayedTimer, setDisplayedTimer] = useState();
  const [isCreator, setIsCreator] = useState(false);
  const [myWord, setMyWord] = useState("");
  const router = useRouter();
  const { db } = useFirebase();
  const { data, error } = useSWR(() => {
    if (router.query.id) {
      return [`/api/room/${router.query.id}/user/${userId}/game`];
    }
    return null;
  }, authFetcher);

  if (error) {
    console.error("error fetching game data", error);
    return <Heading>Something weng wrong</Heading>;
  }

  let interval;
  const timerInterval = () => {
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
        clearInterval(interval);
        setRoundEnded(true);
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

    if (!endTime && data?.endTime) {
      setEndTime(data.endTime);
    }

    if (endTime) {
      interval = timerInterval();
      return () => clearInterval(interval);
    }
  }, [endTime, data]);

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
          if (endTime !== snapshot.val()) {
            clearInterval(interval);
            setEndTime(snapshot.val());
            interval = timerInterval();
          }
        }
      });

      return () => {
        unsubscribe();
        clearInterval(interval);
      };
    }
  }, [db]);

  return (
    <main>
      <VStack>
        <Heading>Timer: {displayedTimer || "00:00"}</Heading>
        <Text>Your score: {username} - 0</Text>
        {myWord !== "" && <Text>Your word: {myWord}</Text>}
        {data?.users.map((p) => (
          <Box key={p.word}>
            user: {p.name} word: {p.word || "-"} point: {p.point}
          </Box>
        ))}

        {roundEnded && (
          <Button
            onClick={async () => {
              const {
                data: { word },
              } = await axiosInstance.get(
                `/api/room/${router.query.id}/user/${userId}/myword`
              );

              setMyWord(word);
            }}
          >
            Show answer
          </Button>
        )}

        {isCreator && roundEnded && (
          <>
            <Button
              onClick={async () => {
                const {
                  data: { word },
                } = await axiosInstance.get(
                  `/api/room/${router.query.id}/user/${userId}/myword`
                );

                setMyWord(word);
              }}
            >
              Show answer
            </Button>
            <Button
              onClick={async () => {
                const roomRef = ref(db, `/${router.query.id}`);
                await set(
                  child(roomRef, "/endTime"),
                  dayjs().add(5, "minutes").unix()
                );
              }}
            >
              New round
            </Button>
          </>
        )}
      </VStack>
    </main>
  );
}
