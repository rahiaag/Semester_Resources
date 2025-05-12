import React, { useState } from 'react'
import {Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast} from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  
  const [show , setShow] = useState(false)
  const [name , setName] = useState()
  const [email , setEmail] = useState()
  const [password , setPassword] = useState()
  const [confirmpassword , setConfirmpassword] = useState()
  const [pic , setPic] = useState()
  const [loading , setLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleClick = () => setShow(!show)

  const submitHandler = async () => {
     setLoading(true)
     if(!name || !email || !password || !confirmpassword){
      toast({
        title: "Please enter all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setLoading(false)
      return
     }

     if(password !== confirmpassword){
      toast({
        title: "Passwords do not match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      return
     }

     try {
       const config = {
         headers : {
          "Content-type": "application/json",
         },
       }

       const { data } = await axios.post(
         "/api/user",
         { name, email, password, pic },
         config
       )
       
       console.log(data)
       toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      
      navigate("/chats")
      localStorage.setItem("userInfo" , JSON.stringify(data))
      setLoading(false)
      

     } catch (error) {
      console.log(error)
      toast({
        title: "Error Occured!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setLoading(false)
     }
  }

  const postDetails = (pics) => {
     setLoading(true)
     if(pics === undefined){
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })

      return
     }

     if(pics.type === "image/jpeg" || pics.type === "image/png"){
        const data = new FormData()
        data.append("file" , pics)
        data.append("upload_preset" , "chat-app")
        data.append("cloud_name", "piyushproj");
        fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  }
  
 
  return (
    <VStack spacing="5px">

      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input 
          placeholder="Enter your name" 
          onChange={(e) => setName(e.target.value)}        
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input 
          placeholder="Enter your email" 
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input 
            type={show ? "text" : "password"}
            placeholder="Enter your password" 
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirmpassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input 
            type={show ? "text" : "password"}
            placeholder="Confirm your password" 
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Upload your picture</FormLabel>
        <Input 
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        color="white"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
       Sign Up
      </Button>

    </VStack>
  )
}

export default Signup
