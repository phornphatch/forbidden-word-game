import { VStack, Box, Heading, Button } from "@chakra-ui/react";
import Link from "next/link";
import useSWR from "swr";
import { useRouter } from "next/router";
import { authFetcher } from "../../../lib/fetcher";

export default function Waiting() {
  const router = useRouter();
  const { data, error } = useSWR(() => {
    if (router.query.id) {
      return `/api/get-players/${router.query.id}`;
    }

    return null;
  }, authFetcher);

  if (error) return <Heading>Something went wrong</Heading>;

  return (
    <main>
      <VStack>
        <Heading>Waiting for players...</Heading>
        {data?.users.map((p) => (
          <Box key={p.name}>{p.name}</Box>
        ))}
        <Link href="/game">
          <Button>Start</Button>
        </Link>
      </VStack>
    </main>
  );
}
