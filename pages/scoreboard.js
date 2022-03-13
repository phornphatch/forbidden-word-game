import {
  Heading,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  VStack,
  Container,
} from "@chakra-ui/react";

export default function Scoreboard() {
  return (
    <main>
      <VStack>
        <Heading>Scoreboard</Heading>
        <Container>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>username</Th>
                <Th>round 1</Th>
                <Th>round 2</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>tino</Td>
                <Td isNumeric>2</Td>
                <Td isNumeric>2</Td>
              </Tr>
              <Tr>
                <Td>tino</Td>
                <Td isNumeric>2</Td>
                <Td isNumeric>2</Td>
              </Tr>
              <Tr>
                <Td>tino</Td>
                <Td isNumeric>2</Td>
                <Td isNumeric>2</Td>
              </Tr>
            </Tbody>
          </Table>
        </Container>
      </VStack>
    </main>
  );
}
