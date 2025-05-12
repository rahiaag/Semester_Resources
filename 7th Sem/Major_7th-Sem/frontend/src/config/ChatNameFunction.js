export const getSender = (loggedInUser, users) => {
  if (!users || users.length < 2 || !loggedInUser) return '';

  return users[0]?._id === loggedInUser?._id ? users[1]?.name : users[0]?.name;
};


export const getSenderDetails = ( loggedInUser , users ) => {
    return (users[0]?._id === loggedInUser?._id ? users[1] : users[0])
}

export const isSameSenderMargin = (message, m, i, userId) => {
 
    if (
      i < message.length - 1 &&
      message[i + 1].sender._id === m.sender._id &&
      message[i].sender._id !== userId
    )
      return 33;
    else if (
      (i < message.length - 1 &&
        message[i + 1].sender._id !== m.sender._id &&
        message[i].sender._id !== userId) ||
      (i === message.length - 1 && message[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
  };
  
  export const isSameSender = (message, m, i, userId) => {
    return (
      i < message.length - 1 &&
      (message[i + 1].sender._id !== m.sender._id ||
        message[i + 1].sender._id === undefined) &&
      message[i].sender._id !== userId
    );
  };
  
  export const isLastMessage = (message, i, userId) => {
    return (
      i === message.length - 1 &&
      message[message.length - 1].sender._id !== userId &&
      message[message.length - 1].sender._id
    );
  };
  
  export const isSameUser = (message, m, i) => {
    return i > 0 && message[i - 1].sender._id === m.sender._id;
  };