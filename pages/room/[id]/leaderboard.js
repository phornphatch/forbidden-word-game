import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  VStack,
} from "@chakra-ui/react";
import useSWR from "swr";
import { fetcher } from "../../../lib/fetcher";
import { useRouter } from "next/router";

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
    <VStack>
      <Heading>Leaderboard</Heading>
      {data && (
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Score</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.room.users.map((u) => (
              <Tr key={u.id}>
                <Td>{u.name}</Td>
                <Td>{u.point}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </VStack>
  );
}
