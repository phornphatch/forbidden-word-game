import { Heading, Input, Text, VStack, Button } from "@chakra-ui/react";
import Link from "next/link";

export default function CreateRoom() {
  return (
    <main>
      <VStack>
        <Heading>YOUR ROOM WAS CREATED</Heading>
        <Text>Send your room code to your friend</Text>
        <Input disabled value="https://sharable.link" />
        <Link href="/create-player">
          <Button>Enter</Button>
        </Link>
      </VStack>
    </main>
  );
}
