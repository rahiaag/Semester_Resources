import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div>
      <Box
        onClick={handleFunction}
        w="100%"
        cursor="pointer"
        display="flex"
        alignItems="center"
        bg="#E8E8E8"
        _hover={{
          background: "teal",
          color: "white",
        }}
        px={2}
        py={2}
        mb={2}
        borderRadius="lg"
      >

        <Avatar 
          mr="2"
          size="sm"
          cursor="pointer"
          name={user.name}
          src={user.pic}
        />
        <Box>
          <Text>{user.name}</Text>
          <Text fontSize="xs"><b>Email : </b>{user.email}</Text>
        </Box>
        
      </Box>
    </div>
  )
}

export default UserListItem
