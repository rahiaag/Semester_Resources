import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import UserListItem from '../UserCard/UserListItem'
import UserPinItem from '../UserCard/UserPinItem'

const GroupChatModal = ({ children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [Groupchatname , setGroupchatname] = useState()
    const [selectedUsers , setSelectedUsers] = useState([])
    const [search , setSearch] = useState("")
    const [searchResult , setSearchResult] = useState([])
    const [loading , setLoading] = useState(false)
    
    const toast = useToast()
    const { user , chats , setChats } = ChatState()

    const handleSearch = async (query) => {
        setSearch(query)
       if(!query){
          return
       }

       try {

        setLoading(true)
        const config = {
            headers : {
              Authorization: `Bearer ${user.token}`,
              "Content-type": "application/json",
            },
         }
  
         const { data } = await axios.get(`/api/user/alluser?search=${search}` , config)
         setLoading(false)
         setSearchResult(data)   
       } catch (error) {
          toast({
            title: "Error Occured",
            description: "Failed to load the search results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
            colorScheme: "red"
          })
       }      
    }

    const handleDelete = (deletedUser) => {
        setSelectedUsers(selectedUsers.filter((select) => select._id !== deletedUser._id))
    }

    const handleGroup = (UserToAdd) => {
       if(selectedUsers.includes(UserToAdd)){
        toast({
            title: "User already added",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
            colorScheme: "red"
          })
          return
       }

       setSelectedUsers([...selectedUsers , UserToAdd])
    }

    const handleSubmit = async () => {
        if(!Groupchatname || !selectedUsers){
            toast({
                title: "Please fill aa the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
                colorScheme: "red"
              })
              return 
        }

        try {
            const config = {
                headers : {
                  Authorization: `Bearer ${user.token}`,
                  "Content-type": "application/json",
                },
             }

            const { data } = await axios.post(`/api/chat/group` , 
                {
                 name: Groupchatname ,
                 users: JSON.stringify(selectedUsers.map((u) => u._id))
                } , 
                config 
            )

            setChats([data , ...chats])
            onClose()
            toast({
              title: "New Group Chat Created!",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            })
        } catch (error) {
            toast({
                title: "Error in creating the group",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
                colorScheme: "red"
              })
        }
    }

    return (
      <>
        <span onClick={onOpen}>{children}</span>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader 
              display="flex"
              justifyContent="center"
              fontSize="32px"
              fontFamily="Work Sans"
            >
                Create Group Chat
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDir="column"
              alignItems="center"
            >
                <FormControl>
                    <Input 
                      placeholder="Enter the group chat name"
                      mb="3"
                      onChange={(e) => setGroupchatname(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <Input 
                      placeholder="Add users here .."
                      mb="3"
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                </FormControl>
                <Box
                  display="flex"
                  flexWrap="wrap"
                  w="100%"
                >
                {Array.isArray(selectedUsers) ? (
                  selectedUsers.map((u) => (
                      <UserPinItem 
                         key={u._id}
                         user={u}
                         handleFunction={() => handleDelete(u)}
                      />
                  ))) : (
                    toast({
                    title: "No such users",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                    colorScheme: "red"
                  })
                 )
                }
                </Box>

                {loading ? <Spinner ml="auto" display="flex" /> : (
                    Array.isArray(searchResult) ? (
                      searchResult.slice(0, 4).map((user) => (
                        <UserListItem 
                          key={user._id}
                          user={user}
                          handleFunction={() => handleGroup(user)}
                        />
                      ))
                    ) : (
                      toast({
                        title: "No such users",
                        status: "warning",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom",
                        colorScheme: "red"
                      })                    )                   
                )}
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                Create Group
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default GroupChatModal
