import '@fontsource/noto-sans-thai/thai.css'

import { Box, ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";

import { extendTheme } from "@chakra-ui/react";
import '../styles/globals.scss'

const theme = extendTheme({
  colors: {
    purple: {
      900: "#323862",
      800: "#383D6E",
      700: "#414679",
      500: "#6C42D3",
      300: "#794DE2",
    },
    pink: {
      300: "#FE90B9",
    },
    teal: {
      300: "#2CA9C8",
    },
    blue: {
      300: "#43A2F4",
    },
  },
  fonts: {
    heading: 'Noto Sans Thai, Open Sans, sans-serif',
    body: 'Noto Sans Thai, Raleway, sans-serif',
  },
});

// Custom App to wrap it with context provider
export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>คำต้องห้าม</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  );
}
