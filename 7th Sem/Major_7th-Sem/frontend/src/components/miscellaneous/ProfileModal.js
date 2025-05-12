import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import { MdAccountBox } from "react-icons/md";
import React from 'react'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<MdAccountBox style={{fontSize: "23px"}} />} onClick={onOpen} />
      )}

      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="4xl"
            fontFamily="Work Sans"
            display="flex"
            justifyContent="center"
          >
            {user?.name || 'Unknown User'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody 
            display="flex"
            flexDir="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user?.pic || 'https://via.placeholder.com/150'} // Fallback image
              alt={user?.name || 'User'}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work Sans"
            >
                Email: {user?.email || 'No email provided'}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal;
