import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, Button, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { getSender, getSenderDetails } from '../config/ChatNameFunction';
import ProfileModal from './miscellaneous/ProfileModal';
import { LuSendHorizonal } from "react-icons/lu";
import axios from 'axios';
import io from "socket.io-client"
import ScrollChat from './ScrollChat';
import Lottie from "react-lottie"
import animationData from "../animations/typing.json"

const END_POINT = "https://chat-app-mern-7uyd.onrender.com"
var socket , selectedChatCompare

const SingleChat = ({ fetchAgain , setFetchAgain }) => {

  const [message , setMessage] = useState([])
  const [NewMessage , setNewMessage] = useState("")
  const [loading , setLoading] = useState(false)
  const [socketConnected , setSocketConnected] = useState(false) 
  const [typing , setTyping] = useState(false)
  const [istyping , setIstyping] = useState(false)

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  
  const toast = useToast()
  const { user , selectedChat , setSelectedChat , notification , setNotification } = ChatState()

  const sendMessages = async (e) => {
    e.preventDefault()

    if(NewMessage){
     try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
      }
      
      setNewMessage("")
      const { data } = await axios.post("/api/message" , {
        content: NewMessage ,
        chatId: selectedChat._id
      } , config)
      
      socket.emit("New Message" , data)
      setMessage([...message , data])      
     } catch (error) {
         toast({
           title: "Error Occured!",
           description: "Failed to send the Message",
           status: "error",
           duration: 5000,
           isClosable: true,
           position: "bottom",
         });
     }
    }
  }

  const fetchMessages = async () => {
    if(!selectedChat) return

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
      }

      const { data } = await axios.get(`/api/message/${selectedChat._id}` , config)  

      setMessage(data)
      setLoading(false)
      socket.emit("chat connect" , selectedChat._id)
    } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to fetch the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
    }
  }

  useEffect(() => {
    socket = io(END_POINT)
    socket.emit("setup", user)
    socket.on("connected", () => setSocketConnected(true))
    socket.on("typing" , () => setIstyping(true))
    socket.on("stop typing" , () => setIstyping(false))
  },[user])

  useEffect(() => {
    fetchMessages()
    selectedChatCompare = selectedChat
  },[selectedChat])

  useEffect(() => {
    socket.on("message received" , (NewMessageReceived) => {
      if(!selectedChatCompare || selectedChatCompare._id !== NewMessageReceived.chat._id){
        if (!notification.some((n) => n._id === NewMessageReceived._id)) {
        setNotification([NewMessageReceived, ...notification]);
        setFetchAgain(!fetchAgain);
      }
      }else{
        setMessage([...message, NewMessageReceived])
      }
    })
  })  

  const typingHandler = (e) => {
     setNewMessage(e.target.value)

     if(!socketConnected) return
     if(!typing){
      setTyping(true)
      socket.emit("typing" , selectedChat._id)
     }

     let lastTypingTime = new Date().getTime()
     let timerLength = 3000
     setTimeout(() => {
       var timeNow = new Date().getTime()
       var timeDiff = timeNow - lastTypingTime
       if(timeDiff >= timerLength && typing){
        socket.emit("stop typing" , selectedChat._id)
        setTyping(false)
       }

     }, timerLength)
  }

  return (
    <>
     {selectedChat ? (
       <>
        <Text
          fontSize={{base: "28px", md: "30px"}}
          fontFamily="Work Sans"
          display="flex"
          justifyContent={{base: "space-between"}}
          alignItems="center"
          w="100%"
          pb="3"
          px="2"
        >
          <IconButton
            mx="2"
            display={{base: "flex", md: "none"}}
            icon={<IoMdArrowRoundBack />}
            onClick={() => setSelectedChat("")} 
          />
          
             {getSender(user , selectedChat.users)}
             <ProfileModal user={getSenderDetails(user , selectedChat.users)} />
            
            
          
        </Text>
        <Box 
          w="100%"
          h="100%"
          p="3"
          display="flex" 
          flexDir="column"
          justifyContent="flex-end"
          bg="#E8E8E8" 
          borderRadius="lg" 
          borderWidth="1px"
          overflowY="hidden"
        >

          {loading ? 
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
              width="100%"
            >
              <Spinner
                size="xl"
                height="20"
                width="20"
              />
            </Box> : 
            (
              <div style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",  
                  msOverflowStyle: "none"                  
                }}
              >
                <ScrollChat message={message} />
              </div>
            )
          }
          <form onSubmit={sendMessages} >
            <FormControl display="flex" mt="3" alignItems="center">
              {istyping ? (
               <Lottie 
                 options={defaultOptions}
                 width={70}
                 style={{ marginBottom: 15, marginLeft: 0 }}               
               />) : (
                <></>
              )}
              <Input 
                p="5"
                mx="2"
                w="100%"
                bg="white"
                variant="filled"
                value={NewMessage}
                placeholder="Enter your message here"
                onChange={typingHandler}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    sendMessages(e);
                  }
                }} 
              />
              <Button 
                p="3"
                colorScheme="teal"
                onClick={sendMessages}
              >  
                <LuSendHorizonal style={{fontSize: "20px"}}/>
              </Button>
            </FormControl>
          </form>
        </Box>
       </>
     ) : (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        h="100%"
      >
        <Text
          pb="3"
          fontFamily="Work Sans"
          fontSize="3xl"   
        >
         Click on a User to start chatting
        </Text>
      </Box>
     )}
      
    </>
  )
}

export default SingleChat
