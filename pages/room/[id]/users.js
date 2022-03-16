import { Input, VStack, FormLabel, Button, Container } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../../../lib/axios";

export default function CreatePlayer() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = async (data) => {
    await axiosInstance.post('/api/create-user', {
      username: data.username,
      roomId: router.query.id
    });

    localStorage.setItem('username', data.username);
    router.push(`/room/${router.query.id}/waiting`);
  };

  return (
    <main>
      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack>
            <FormLabel htmlFor="username">ENTER NAME</FormLabel>
            <Input name="username" type="text" id="username" {...register('username', { required: true })} />
            {errors.username && <span>username is required.</span>}
            <Input type='submit' value='DONE' />
          </VStack>
        </form>
      </Container>
    </main>
  );
}
