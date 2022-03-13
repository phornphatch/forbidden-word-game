import { Heading, FormControl, Button, Input, VStack } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Next.js w/ Firebase Client-Side</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <VStack>
          <Heading>คำต้องห้าม!</Heading>
          <form>
            <FormControl>
              <VStack>
                <Input id="roomId" type="text" name="roomId" />
                <Button>JOIN ROOM</Button>
              </VStack>
            </FormControl>
          </form>
          
          <p>or</p>

          <Link href="/create-room">
            <Button>CREATE ROOM</Button>
          </Link>
        </VStack>
      </main>
    </div>
  );
}
