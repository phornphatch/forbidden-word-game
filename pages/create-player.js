import { Input, VStack, FormLabel, Button } from "@chakra-ui/react";
import Link from "next/link";

export default function CreatePlayer() {
  return (
    <main>
      <form>
        <VStack>
          <FormLabel htmlFor="username">ENTER NAME</FormLabel>
          <Input name="username" type="text" id="username" />
          <Link href="/waiting">
            <Button>DONE</Button>
          </Link>
        </VStack>
      </form>
    </main>
  );
}
