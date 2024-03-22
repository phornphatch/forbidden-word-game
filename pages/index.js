import { useRouter } from "next/router";
import Image from "next/image";
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
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useFirebase } from "../firebase/hooks";

function HowtoPlayModal() {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });

  return (
    <>
      <div
        onClick={onOpen}
        className="button--modal"
      >
        กติกา
      </div>

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

export default function CreatePlayer() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const toast = useToast();

  const { anonUser } = useFirebase();

  useEffect(() => {
    localStorage.removeItem("fbwg_username");
    localStorage.removeItem("fbwg_userid");
  }, []);

  const onSubmit = (data) => {
    try {
      localStorage.setItem("fbwg_username", data.username);
      localStorage.setItem("fbwg_userid", anonUser.uid);
      router.push(`/room`);
    } catch {
      toast({
        title: "Cannot auth.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="index__wrapper">
          <div className="index__subwrapper">
            <div>
              <Image
                src="/images/logo-white.png"
                width={300}
                height={140}
                alt="oopsie logo"
              />
            </div>
            <div>
              <Image
                src="/images/oopsie-purple.png"
                width={120}
                height={128}
                alt="oopsie purple"
              />
            </div>
            <input
              name="username"
              type="text"
              id="username"
              required
              className="input__text"
              placeholder="ENTER YOUR NAME HERE"
              {...register("username", { required: true })}
              
            />

            {errors.username && <span>username is required.</span>}
            <input className="button" type="submit" value="ENTER" />
            <HowtoPlayModal />
          </div>
        </div>
      </form>
    </main>
  );
}
