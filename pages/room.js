import {
  Heading,
  FormControl,
  Button,
  Input,
  VStack,
  useToast,
  Text,
  Center,
  HStack,
  Box,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { axiosInstance } from "../lib/axios";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function CreatRoom() {
  const router = useRouter();
  const toast = useToast();
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (
      !localStorage.getItem("fbwg_username") ||
      !localStorage.getItem("fbwg_userid")
    ) {
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
          <Center h="100vh" color="white" marginTop="-40px">
            <VStack spacing={8}>
              <Heading color="white" paddingBottom="20px" size="2xl" fontWeight="light" textTransform="uppercase">
                {username}
              </Heading>
              <HStack spacing={5}>
                <Box>
                  <Image src="/images/host.png" width="100px" height="127px" />
                </Box>
                <VStack alignItems="flex-start">
                  <Heading size="xl">HOST</Heading>
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
                    width="400px"
                    height="50px"
                    cursor="pointer"
                    _hover={{
                      bgGradient:
                        "linear(to-r, rgba(31, 79, 109, 0.9), rgba(49, 54, 101, 0.9))",
                    }}
                  >
                    CREATE ROOM
                  </Button>
                </VStack>
              </HStack>

              <Text color="white"> - or - </Text>
              <HStack spacing={5}>
                <Box>
                  <Image
                    src="/images/players.png"
                    width="150px"
                    height="144px"
                  />
                </Box>
                <VStack alignItems="flex-start">
                <Heading size="xl">Play with friends</Heading>

                  <form
                    onSubmit={handleSubmit(async (data) => {
                      try {
                        await axiosInstance.post(
                          `/api/room/${data.roomId}/user/${userId}`,
                          { username }
                        );
                        router.push(`/room/${data.roomId}/waiting`);
                      } catch (e) {
                        toast({
                          title: "Room not existed.",
                          status: "error",
                          duration: 3000,
                          isClosable: true,
                        });
                      }
                    })}
                  >
                    <FormControl>
                      <HStack spacing={2}>
                        <Input
                          id="roomId"
                          type="text"
                          name="roomId"
                          {...register("roomId", { required: true })}
                          borderRadius="30"
                          placeholder="ENTER ROOM CODE HERE"
                          color="white"
                          width="300px"
                          height="50px"
                        />
                        {errors.roomId && <span>Room ID is required.</span>}
                        <Input
                          type="submit"
                          value="JOIN"
                          borderRadius="30"
                          backgroundColor="rgba(225, 225, 225, 0.3)"
                          color="white"
                          fontWeight="bold"
                          width="130px"
                          height="50px"
                          cursor="pointer"
                          _hover={{
                            bgGradient:
                              "linear(to-r, rgba(31, 79, 109, 0.9), rgba(49, 54, 101, 0.9))",
                          }}
                        />
                      </HStack>
                    </FormControl>
                  </form>
                </VStack>
              </HStack>
            </VStack>
          </Center>
        </VStack>
      </main>
    </div>
  );
}
