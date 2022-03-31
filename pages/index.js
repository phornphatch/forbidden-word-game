import { useRouter } from "next/router";
import Image from "next/image";
import {
  VStack,
  Container,
  useToast,
  Input,
  Center,
  Box,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useFirebase } from "../firebase/hooks";

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
      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack alignContent="center">
            <Center h="100vh" color="white" marginTop="-50px">
              <VStack spacing={8}>
                <Box>
                  <Image
                    src="/images/logo-white.png"
                    width={300}
                    height={140}
                    alt="oopsie logo"
                  />
                </Box>
                <Box>
                  <Image
                    src="/images/oopsie-purple.png"
                    width={120}
                    height={128}
                    alt="oopsie purple"
                  />
                </Box>
                <Input
                  name="username"
                  type="text"
                  id="username"
                  {...register("username", { required: true })}
                  borderRadius="30"
                  placeholder="ENTER YOUR NAME HERE"
                  color="white"
                  width="400px"
                  height="50px"
                />
                {errors.username && <span>username is required.</span>}
                <Input
                  type="submit"
                  value="ENTER"
                  borderRadius="30"
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
                />
              </VStack>
            </Center>
          </VStack>
        </form>
      </Container>
    </main>
  );
}
