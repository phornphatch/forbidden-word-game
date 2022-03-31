import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  VStack,
  Container,
  Box,
  HStack,
  Text,
  Button,
  Center,
  Link,
} from "@chakra-ui/react";
import useSWR from "swr";
import { fetcher } from "../../../lib/fetcher";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Leaderboard() {
  const router = useRouter();
  const { data, error } = useSWR(() => {
    if (router.query.id) {
      return `/api/room/${router.query.id}?getRoom=true`;
    }
    return null;
  }, fetcher);

  if (error) {
    return <Heading>Something went wrong.</Heading>;
  }

  return (
    <VStack spacing={6} pt={6}>
      <Heading color="white">Leaderboard</Heading>
      <Container>
        {data && (
          <Table variant="simple" color="white">
            <Thead>
              <Tr>
                <Th color="white">Name</Th>
                <Th color="white">Score</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.room.users.map((u) => (
                <Tr key={u.id}>
                  <Td>
                    <HStack>
                      <Box mr={1}>
                        <Image
                          src="/images/oopsie-orange.png"
                          width="15px"
                          height="15px"
                          alt="oopsie orange"
                        />
                      </Box>
                      <Text fontWeight="bold">{u.name}</Text>
                    </HStack>
                  </Td>
                  <Td>{u.point}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Container>
      <Center>
        <Link href="/room">
        <Button>Return to lobby</Button>
        </Link>
      </Center>
    </VStack>
  );
}
