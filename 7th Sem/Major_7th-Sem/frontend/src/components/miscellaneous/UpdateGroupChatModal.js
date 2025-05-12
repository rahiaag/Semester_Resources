import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { MdAccountBox } from "react-icons/md"
import { ChatState } from '../../Context/ChatProvider'
import UserPinItem from '../UserCard/UserPinItem'
import { BiExit } from "react-icons/bi"
import axios from 'axios'
import UserListItem from '../UserCard/UserListItem'

const UpdateGroupChatModal = ({ fetchAgain , setFetchAgain , fetchMessages }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [Groupchatname , setGroupchatname] = useState()
    const [search , setSearch] = useState("")
    const [searchResult , setSearchResult] = useState([])
    const [loading , setLoading] = useState(false)
    const [renameLoading , setRenameLoading] = useState(false)

    const toast = useToast()
    const { user , selectedChat , setSelectedChat } = ChatState()
    
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

    const handleRename = async () => {
       if(!Groupchatname) return

       try {
        setRenameLoading(true)
        const config = {
            headers : {
              Authorization: `Bearer ${user.token}`,
              "Content-type": "application/json",
            },
         }

        const { data } = await axios.put("/api/chat/grouprename" , {
            chatId: selectedChat._id ,
            chatName: Groupchatname
         } , config)
        
        setSelectedChat(data)
        setFetchAgain(!fetchAgain)
        setRenameLoading(false)     
       } catch (error) {
          toast({
            title: "Error Occured",
            description: "Failed to change the name of the group",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            colorScheme: "red"
          })
          setRenameLoading(false);
       }

       setGroupchatname("")
    }

    const handleKick = async ( UserToKick ) => {
        if(selectedChat.groupAdmin._id !== user._id && user._id !== UserToKick._id){
            toast({
                title: "Only admins can remove someone",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
                colorScheme: "red"
            })
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
 
         const { data } = await axios.put("/api/chat/groupremove" , {
             chatId: selectedChat._id ,
             userId: UserToKick._id
          } , config)
         
         user._id === UserToKick._id ? setSelectedChat() : setSelectedChat(data)
         setFetchAgain(!fetchAgain)
         fetchMessages()
         setLoading(false)  
        } catch (error) {
            toast({
                title: "Error Occured",
                description: "Failed to remove the user",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
                colorScheme: "red"
            })
            setLoading(false); 
        }
    }

    const handleAddUser = async (NewUser) => {
        if(selectedChat.users.find((u) => u._id === NewUser._id)){
            toast({
                title: "User already added",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
                colorScheme: "red"
            })
            return
        }

        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: "Only admins can add someone",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
                colorScheme: "red"
            })
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
 
         const { data } = await axios.put("/api/chat/groupadd" , {
             chatId: selectedChat._id ,
             userId: NewUser._id
          } , config)
         
         setSelectedChat(data)
         setFetchAgain(!fetchAgain)
         setLoading(false)  
        } catch (error) {
            toast({
                title: "Error Occured",
                description: "Failed to remove the user",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
                colorScheme: "red"
            })
            setLoading(false); 
        }
    }

    return (
      <>
        <IconButton d={{ base: "flex" }} icon={<MdAccountBox style={{fontSize: "23px"}} />} onClick={onOpen} />

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              display="flex"
              justifyContent="center"
              fontSize="20px"
              fontFamily="Work Sans"
            >
                {selectedChat.chatName}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" flexDir="column" alignItems="center">
                <Box
                  display="flex"
                  flexWrap="wrap"
                  w="100%"
                  pb="3"
                >
                    {selectedChat && Array.isArray(selectedChat.users) ? (
                      selectedChat.users.map((u) => (
                        <UserPinItem 
                          key={u._id}
                          user={u}
                          handleFunction={() => handleKick(u)}
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
                      })                      )}

                </Box>
                <FormControl display="flex" >
                    <Input 
                      placeholder="Update chat name"
                      mb="3"
                      mx="1"
                      ml="1"
                      value={Groupchatname}
                      onChange={(e) => setGroupchatname(e.target.value)}
                    />
                    <Button
                      variant="solid"
                      p="4"
                      colorScheme="teal"
                      isLoading={renameLoading}
                      onClick={handleRename}
                    >
                        Update
                    </Button>
                </FormControl>
                <FormControl>
                    <Input 
                      placeholder="Add users here .."
                      mb="3"
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                </FormControl>
                {loading ? <Spinner ml="auto" display="flex" /> : (
                    Array.isArray(searchResult) ? (
                      searchResult.slice(0, 4).map((user) => (
                        <UserListItem 
                          key={user._id}
                          user={user}
                          handleFunction={() => handleAddUser(user)}
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
                      })                      
                    ))
                }
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='red' mr={3} onClick={() => handleKick(user)}>
                Exit Group <BiExit style={{ fontSize: "20px"}}/>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default UpdateGroupChatModal
