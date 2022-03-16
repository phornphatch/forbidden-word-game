import { Heading, Input, Text, VStack, Button, Container } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function CreateRoom() {
  const router = useRouter();
  return (
    <main>
      <VStack>
        <Heading>YOUR ROOM WAS CREATED</Heading>
        <Text>Send your room code to your friend</Text>
        <Container>
          <Input disabled value={router.query.id} textAlign='center' fontSize='4xl' py='10' />
        </Container>
        <Link href={`/room/${router.query.id}/users`}>
          <Button>Enter</Button>
        </Link>
      </VStack>
    </main>
  );
}
