import { Box } from '@chakra-ui/react'
import React from 'react'
import { IoIosClose } from "react-icons/io";

const UserPinItem = ({ user , handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      alignItems="center"
      display="flex"
      px="2"
      py="1"
      m="1"
      mb="2"
      variant="solid"
      cursor="pointer"
      bg="#343680"
      color="white"
      borderRadius="lg"
    >
        {user.name}
        <IoIosClose style={{fontSize: "25px"}}/>

    </Box>
  )
}

export default UserPinItem
