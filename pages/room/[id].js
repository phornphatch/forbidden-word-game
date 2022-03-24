import {
  Heading,
  Input,
  Text,
  VStack,
  Button,
  Container,
  Center,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";

export default function CreateRoom() {
  const router = useRouter();
  const { data, error } = useSWR(() => {
    if (router.query.id) {
      return `/api/room/${router.query.id}`;
    }

    return null;
  }, fetcher);

  if (error) {
    router.push("/");
  }

  if (!data) {
    return (
      <VStack alignContent="center">
        <Center h="100vh" color="white" marginTop="-50px">
          <Heading>Loading . . </Heading>
        </Center>
      </VStack>
    );
  }

  return (
    <main>
      <VStack alignContent="center">
        <Center h="100vh" color="white" marginTop="-50px">
          <VStack spacing={8}>
            <Heading>YOUR ROOM WAS CREATED</Heading>
            <Text>Send your room code to your friend</Text>
            <Container>
              <Input
                disabled
                value={router.query.id}
                textAlign="center"
                fontSize="4xl"
                py="10"
              />
            </Container>
            <Link href={`/room/${router.query.id}/waiting`} passHref>
              <Button
                borderRadius="30"
                border="1px"
                borderColor="white"
                backgroundColor="rgba(225, 225, 225, 0.3)"
                color="white"
                fontWeight="bold"
                width="300px"
                height="50px"
                cursor="pointer"
                _hover={{
                  bgGradient:
                    "linear(to-r, rgba(31, 79, 109, 0.9), rgba(49, 54, 101, 0.9))",
                }}
              >
                Enter
              </Button>
            </Link>
          </VStack>
        </Center>
      </VStack>
    </main>
  );
}
