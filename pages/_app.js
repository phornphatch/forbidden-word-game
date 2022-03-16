import  { ChakraProvider } from '@chakra-ui/react'
import UserProvider from '../context/userContext'

import { extendTheme } from "@chakra-ui/react"


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
})

// Custom App to wrap it with context provider
export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ChakraProvider>
  )
}
