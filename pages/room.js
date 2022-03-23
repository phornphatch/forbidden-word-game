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
        <VStack alignContent="center">
          <Center h="100vh" color="white" marginTop="-50px">
            <VStack spacing={8}>
              <Heading color="white" paddingBottom="20px">
              {username}
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
                  <VStack spacing={8}>
                    <Input
                      id="roomId"
                      type="text"
                      name="roomId"
                      {...register("roomId", { required: true })}
                      borderRadius="30"
                      placeholder="ENTER ROOM CODE HERE"
                      color="white"
                      width="500px"
                      height="50px"
                    />
                    {errors.roomId && <span>Room ID is required.</span>}
                    <Input
                      type="submit"
                      value="JOIN ROOM" 
                      borderRadius="30"
                      backgroundColor="rgba(225, 225, 225, 0.3)"              
                      color="white"
                      fontWeight="bold"
                      width="500px"
                      height="50px"
                      cursor="pointer"
                      _hover={{
                        bgGradient: "linear(to-r, rgba(31, 79, 109, 0.9), rgba(49, 54, 101, 0.9))",
                      }}
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
                }}
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
