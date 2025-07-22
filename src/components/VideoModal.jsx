import { useEffect, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure, Box, IconButton } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

const YOUTUBE_URL = 'https://www.youtube.com/embed/dmGD8aI2Qp4?autoplay=1';

const VideoModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    // Abrir solo al hacer scroll breve (50px)
    const handleScroll = () => {
      if (window.scrollY > 50 && !isOpen && !hasOpened) {
        onOpen();
        setHasOpened(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line
  }, [hasOpened, isOpen, onOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay bg="blackAlpha.700" />
      <ModalContent bg="transparent" boxShadow="none" maxW="700px">
        <Box position="absolute" top={2} right={2} zIndex={2}>
          <IconButton
            icon={<CloseIcon />}
            onClick={onClose}
            aria-label="Cerrar"
            bg="white"
            color="black"
            _hover={{ bg: 'gray.200' }}
            size="sm"
            borderRadius="full"
          />
        </Box>
        <ModalBody p={0} display="flex" justifyContent="center" alignItems="center">
          <Box w="100%" h="0" pb="56.25%" position="relative">
            <iframe
              src={YOUTUBE_URL}
              title="YouTube video"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '16px' }}
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default VideoModal; 