import React , { useState } from 'react'
import {Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {

  const [show , setShow] = useState(false)
  const [email , setEmail] = useState()
  const [password , setPassword] = useState()
  const [loading , setLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()
 
  const handleClick = () => setShow(!show)

  const submitHandler= async () => {
    setLoading(true)
     if(!email || !password){
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

     try {
       const config = {
         headers : {
          "Content-type": "application/json",
         },
       }

       const { data } = await axios.post(
         "/api/user/login",
         { email, password, },
         config
       )
       
       console.log(data)
       toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })

      localStorage.setItem("userInfo" , JSON.stringify(data))
      navigate("/chats")
      setLoading(false)

     } catch (error) {
      console.log(error)
      toast({
        title: "Please enter correct email or password",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setLoading(false)
     }
  }

  return (
    <VStack spacing="5px">

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input 
          value={email}
          placeholder="Enter your email" 
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input 
            value={password}
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

      <Button
        colorScheme="blue"
        width="100%"
        color="white"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
       Login
      </Button>


    </VStack>
  )
}

export default Login
