import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import ScrollableFeed from "react-scrollable-feed"
import { Avatar, Tooltip } from '@chakra-ui/react'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatNameFunction'

const ScrollChat = ({ message }) => {

  const { user } = ChatState()

  return (
    <ScrollableFeed>
       {Array.isArray(message) && message.map((m, i) => (
           <div style={{ display: "flex" }} key={m._id}>
           {(isSameSender(message, m, i, user._id) ||
             isLastMessage(message, i, user._id)) && (
             <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
               <Avatar
                 mt="7px"
                 mr={1}
                 size="sm"
                 cursor="pointer"
                 name={m.sender.name}
                 src={m.sender.pic}
               />
             </Tooltip>
             )}
             <span
               style={{
                 backgroundColor: `${m.sender._id === user._id ? "#00416a" : "#555555"}`,
                 color: "white",
                 marginLeft: isSameSenderMargin(message, m, i, user._id),
                 marginTop: isSameUser(message, m, i, user._id) ? 3 : 10,
                 borderRadius: "20px",
                 padding: "5px 15px",
                 maxWidth: "75%",
               }}
             >
               {m.content}
             </span>
            </div>
       ))}
    </ScrollableFeed>
  )
}

export default ScrollChat
