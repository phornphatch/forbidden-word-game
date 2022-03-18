import { Input, VStack, FormLabel, Container, toast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

export default function CreatePlayer() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  useEffect(() => {
    localStorage.removeItem('fbwg_username');
  }, [])

  const onSubmit = (data) => {
    try {
      localStorage.setItem('fbwg_username', data.username);
      router.push(`/room`);
    } catch {
      toast({
        title: 'Cannot auth.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
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
