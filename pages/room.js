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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { axiosInstance } from "../lib/axios";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import Image from "next/image";

function HowtoPlayModal() {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    <>
      <button
        onClick={onOpen}
        className="button--modal"
      >
        กติกา
      </button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent borderColor="white" backgroundColor="#8C4C94">
          <Box
            borderColor="white"
            backgroundColor="rgba(225, 225, 225, 0.9)"
            margin="5"
            borderRadius="10"
            color="#564681"
          >
            <ModalHeader>
              <Center fontWeight="bold">กติกา</Center>
            </ModalHeader>
            <ModalCloseButton padding="30px" />
            <ModalBody fontWeight="semibold">
              1. เมื่อกดเริ่มเกม ทุกคนจะได้รับคำต้องห้าม 1 คำ
              โดยผู้เล่นแต่ละคนจะไม่รู้คำต้องห้ามของตัวเอง
              <br />
              2. ใครที่หลุดพูดคำต้องห้ามที่ตนเองได้รับจะต้อง ออกจากเกม
              <br />
              <Box>
                3. ในแต่ละเกมจะให้เวลารอบละ 5 นาที{" "}
                <Box color="#E24D7A" display="inline">
                  ใครเหลือรอดจนหมดเวลาจะได้รับ 1 คะแนน{" "}
                </Box>
                และ หากผู้ที่เหลือรอดนั้น
                <Box color="#E24D7A" display="inline">
                  {" "}
                  รู้ว่าคำต้องห้ามของตัวเองคือคำว่าอะไรจะได้คะแนนเพิ่มอีก 1
                  คะแนน
                </Box>
              </Box>
              4.
              ผู้เล่นที่สามารถหลอกล่อให้คนอื่นพูดคำต้องห้ามของเขาได้จะนับว่าทำการ{" "}
              <Box color="#E24D7A" display="inline">
                kill และได้ 1 คะแนน
              </Box>{" "}
              จากการ kill นั้น
            </ModalBody>
            <Center marginTop="20px">
              <Image
                src="/images/rules.png"
                width={180}
                height={120}
                alt="oopsie rules"
              />
            </Center>
            <ModalFooter paddingTop="0" marginTop="-60px">
              <Button
                colorScheme="blue"
                onClick={onClose}
                backgroundColor="#564681"
              >
                Close
              </Button>
            </ModalFooter>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
}

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
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="container">
      <main>
        <div className="index__wrapper">
          <div className="room__subwrapper">
          <Center h="100vh" color="white" marginTop="0px">
            <VStack spacing={8}>
              <Heading
                color="white"
                paddingBottom="20px"
                size="2xl"
                fontWeight="light"
                textTransform="uppercase"
              >
                {username}
              </Heading>
              <HStack spacing={5}>
                <Box>
                  <Image
                    src="/images/host.png"
                    width="100px"
                    height="127px"
                    alt="oopsie king"
                  />
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
                    alt="oopsie group"
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
              <HowtoPlayModal />
            </VStack>
          </Center>
          </div>
        </div>
      </main>
    </div>
  );
}
