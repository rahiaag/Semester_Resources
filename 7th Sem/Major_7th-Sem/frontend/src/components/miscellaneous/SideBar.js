import { Avatar, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import { IoSearch } from "react-icons/io5";
import { TbBellFilled } from "react-icons/tb";
import { FaAngleDown } from "react-icons/fa";
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserCard/UserListItem';
import { getSender } from '../../config/ChatNameFunction';
import NotificationBadge, { Effect } from "react-notification-badge"

const SideBar = () => {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchresult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChats, setLoadingChats] = useState(false)

    const {user , setSelectedChat , chats , setChats , notification , setNotification } = ChatState()
    const navigate = useNavigate()
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure()
    
    const logoutHandler = () => {
        localStorage.removeItem("userInfo")
        navigate("/")
    }

    const handleSearch = async () => {
      if(!search){
        toast({
          title: "Please Enter something in search",
          status: "warning",
          duration: 9000,
          isClosable: true,
          position: "top-left",
          colorScheme: "red"
        })
        return
      }

      try {
        setLoading(true)
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-type" : "application/json",
          },
        }
       const { data } = await axios.get(`/api/user/alluser?search=${search}`, config)

        setLoading(false)
        setSearchresult(data)
      } catch (error) {
        toast({
          title: "Error Occured",
          description: "Failed to load the search results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
          colorScheme: "red"
        })
      }
    }

    const accessChats = async (userId) => {
      
      try {
        setLoadingChats(true)
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`
          },
        }
        
        const { data } = await axios.post("/api/chat" , { userId } , config)

        if(!chats.find((c) => c._id === data._id)) setChats([data , ...chats])
        setSelectedChat(data)
        setLoadingChats(false)
        onClose()
      } catch (error) {
        toast({
          title: "Error accessing the chat",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
          colorScheme: "red"
        })
      }
    }

  return (
    <div>
        <Box 
          display="flex"
          justifyContent="space-between"          
          alignItems="center"
          bg="white"
          p="5px 10px 5px 10px"
          w="100%"
          borderWidth="5px"
        >
          <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
            <Button variant="ghost" onClick={onOpen}>
              <IoSearch style={{fontSize: "25px"}}/>
              <Text display={{base: "none", md: "flex"}} px="4" fontSize="18px">Search User</Text>
            </Button>
          </Tooltip>        

          <Text fontSize="2xl" fontFamily="Work Sans" fontWeight="bold">Chit-Chat</Text>
          <div style={{display: "flex", alignItems: "center"}}>
            <Menu>
                <MenuButton p="1">
                  <NotificationBadge 
                    count={notification.length}
                    effect={Effect.SCALE}
                  />
                   <TbBellFilled style={{fontSize: "28px"}}  />
                </MenuButton>
                <MenuList pl={2}>
                  {Array.isArray(notification) && notification.length === 0 && "No new messages"}
                  {Array.isArray(notification) &&
                    notification.map((notif) => (
                      <MenuItem
                        fontWeight="bold"
                        color="#0047ab"
                        key={notif._id}
                        onClick={() => {
                          setSelectedChat(notif.chat);
                          setNotification(notification.filter((n) => n !== notif));
                        }}
                      >
                          {notif.chat.isGroupChat
                            ? `Message in ${notif.chat.chatName}`
                            : `Message from ${getSender(user, notif.chat.users)}`}
                      </MenuItem>
                    ))}
                </MenuList>

            </Menu>
            <Menu>
            </Menu>
            <Menu>
               <MenuButton as={Button} rightIcon={<FaAngleDown />}>
                <Avatar 
                  size="sm"
                  cursor="pointer"
                  name={user.name}
                  src={user.pic}
                />
               </MenuButton> 
               <MenuList>
                <ProfileModal user={user}>
                 <MenuItem>My Profile</MenuItem>
                </ProfileModal>
                 <MenuDivider />
                 <MenuItem onClick={logoutHandler}>Logout</MenuItem>
               </MenuList>
            </Menu>
          </div>
        </Box>

        <Drawer
          isOpen={isOpen}
          placement='left'
          onClose={onClose}
        >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderWidth="1px">Search User</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb="2">
              <Input
                placeholder="Search by name or email"
                mr="2"
                border="1px black solid"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button colorScheme="blue" onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? <ChatLoading /> : (
                Array.isArray(searchResult) && searchResult.map((user) => (
                  <UserListItem 
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChats(user._id)}
                  />
                ))
              )}
            {loadingChats && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default SideBar
