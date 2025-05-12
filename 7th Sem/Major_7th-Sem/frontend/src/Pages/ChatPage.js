import { Box } from "@chakra-ui/react"
import { ChatState } from "../Context/ChatProvider"
import SideBar from "../components/miscellaneous/SideBar"
import ChatLog from "../components/ChatLog"
import ChatBox from "../components/ChatBox"
import { useState } from "react"

const ChatPage = () => {

  const { user } = ChatState()
  const [fetchAgain , setFetchAgain] = useState()

  return (
    <div style={{width: "100%"}}>
      {user && <SideBar />}
      
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10">
        {user && <ChatLog fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>

    </div>
  )
}

export default ChatPage
