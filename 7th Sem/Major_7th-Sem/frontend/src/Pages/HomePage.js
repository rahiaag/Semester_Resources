import React from 'react';
import { Container, Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Login from '../components/authentication/Login';
import Signup from '../components/authentication/Signup';

const HomePage = () => {
  return (
    <Container
      maxW="100vw"
      maxH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      centerContent
      p={0}
    >
      <Box
        bg="white"
        p={4}
        color="black"
        borderRadius="lg"
        borderWidth="10px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        w="full"
        maxW="lg"
      >
        <Tabs variant='soft-rounded' colorScheme='blue'>
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default HomePage;
