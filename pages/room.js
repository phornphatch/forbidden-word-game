import {
  Heading,
  FormControl,
  Button,
  Input,
  VStack,
  useToast,
  Text,
  Center,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { axiosInstance } from "../lib/axios";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export default function CreatRoom() {
  const router = useRouter();
  const toast = useToast();
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("fbwg_username") || !localStorage.getItem("fbwg_userid")) {
      router.push("/");
    } else {
      setUsername(localStorage.getItem("fbwg_username"));
      setUserId(localStorage.getItem("fbwg_userid"));
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="container">
      <main>
        <VStack bg="purple.900" h="100vh" alignContent="center">
          <Center h="100vh" color="white">
            <VStack>
              <Heading color="white" paddingBottom="20px">
                Forbidden Word Game
              </Heading>
              <form onSubmit={handleSubmit(async (data) => {
                 try {
                  await axiosInstance.post(`/api/room/${data.roomId}/user/${userId}`, { username });
                  router.push(`/room/${data.roomId}/waiting`);
                } catch (e) {
                  toast({
                    title: "Room not existed.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                }
              })}>
                <FormControl>
                  <VStack>
                    <Input
                      id="roomId"
                      type="text"
                      name="roomId"
                      {...register("roomId", { required: true })}
                      bg="purple.700"
                      border="none"
                      borderRadius="30"
                      placeholder="| ENTER ROOM CODE HERE"
                      color="white"
                      width="500px"
                      height="50px"
                      marginBottom="10px"
                    />
                    {errors.roomId && <span>Room ID is required.</span>}
                    <Input
                      type="submit"
                      value="JOIN ROOM"
                      color="white"
                      bg="purple.700"
                      border="none"
                      _hover={{
                        bgGradient: "linear(to-t, purple.500, purple.300)",
                      }}
                      borderRadius="30"
                      width="500px"
                      height="50px"
                    />
                  </VStack>
                </FormControl>
              </form>
              <Text color="white">or</Text>

              <Button
                onClick={async () => {
                  const { data } = await axiosInstance.post(
                    "/api/create-room",
                    { username, userId }
                  );
                  router.push(`/room/${data.roomId}`);
                }}
                color="white"
                bg="purple.700"
                border="none"
                _hover={{ bgGradient: "linear(to-t, purple.500, purple.300)" }}
                borderRadius="30"
                width="500px"
                height="50px"
              >
                CREATE ROOM
              </Button>
            </VStack>
          </Center>
        </VStack>
      </main>
    </div>
  );
}
