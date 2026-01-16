import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Card,
  Badge,
  Icon,
  Spinner,
  Textarea,
  useToast,
  Flex,
  IconButton,
  Tooltip,
  Container,
} from '@chakra-ui/react';
import {
  LuUsers,
  LuMessageCircle,
  LuSend,
  LuGraduationCap,
  LuCheck,
  LuSmile
} from 'react-icons/lu';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '../hooks/useUser';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Servicio de foros
import {
  getForumMessages,
  sendForumMessage,
  getLocalForumMessages,
  checkDatabaseConnection,
  getCommunityStats
} from '../services/forumService';

const ForumMessage = ({ message, currentUser }) => {
  const isOwnMessage = message.userId === currentUser?.id || message.userId === currentUser?.uid;

  return (
    <Box
      w="100%"
      display="flex"
      justifyContent={isOwnMessage ? 'flex-end' : 'flex-start'}
      mb={4}
      px={2}
    >
      {!isOwnMessage && (
        <Avatar
          size="sm"
          name={message.userName}
          src={message.userAvatar}
          mr={3}
          mt={1}
          boxShadow="sm"
        />
      )}

      <Box maxW={{ base: "85%", md: "70%" }}>
        {!isOwnMessage && (
          <Text fontSize="xs" color="gray.500" ml={1} mb={1} fontWeight="medium">
            {message.userName}
          </Text>
        )}

        <Box
          bg={isOwnMessage ? 'blue.600' : 'white'}
          color={isOwnMessage ? 'white' : 'gray.800'}
          px={5}
          py={3}
          borderRadius="2xl"
          borderTopRightRadius={isOwnMessage ? 'sm' : '2xl'}
          borderTopLeftRadius={!isOwnMessage ? 'sm' : '2xl'}
          boxShadow="sm"
          position="relative"
          _hover={{ boxShadow: 'md' }}
          transition="all 0.2s"
        >
          <Text fontSize="md" lineHeight="1.6">
            {message.content}
          </Text>
        </Box>

        <HStack justify={isOwnMessage ? 'flex-end' : 'flex-start'} spacing={1} mt={1} ml={1}>
          <Text fontSize="xs" color="gray.400">
            {message.timestamp?.toDate ?
              formatDistanceToNow(message.timestamp.toDate(), { addSuffix: true, locale: es }) :
              'Ahora'
            }
          </Text>
          {isOwnMessage && <Icon as={LuCheck} color="blue.500" w={3} h={3} opacity={0.8} />}
        </HStack>
      </Box>

      {isOwnMessage && (
        <Avatar
          size="sm"
          name={currentUser?.name || 'Yo'}
          src={currentUser?.profileImage}
          ml={3}
          mt={1}
          boxShadow="sm"
        />
      )}
    </Box>
  );
};

const ForumChat = ({ category, title, icon }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { userProfile } = useUser();
  const toast = useToast();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let cleanupFunction = null;
    let isMounted = true;

    const initializeForum = async () => {
      try {
        const connectionTest = await checkDatabaseConnection();

        if (!isMounted) return;

        if (connectionTest.connected) {
          cleanupFunction = getForumMessages(category, (messagesData, error) => {
            if (!isMounted) return;
            if (error) {
              console.warn('Service error:', error);
            } else {
              setMessages(messagesData);
            }
            setLoading(false);
          });
        } else {
          const localMessages = getLocalForumMessages(category);
          setMessages(localMessages);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing forum:', error);
        setLoading(false);
      }
    };

    initializeForum();

    return () => {
      isMounted = false;
      if (cleanupFunction) {
        try {
          cleanupFunction();
        } catch (error) {
          console.warn('Error cleaning up forum listener:', error);
        }
      }
    };
  }, [category]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const result = await sendForumMessage(
        category,
        newMessage,
        userProfile?.id || userProfile?.uid || 'anonymous',
        userProfile?.name || 'Usuario Anónimo'
      );

      if (result.success) {
        setNewMessage('');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error al enviar",
        description: "No se pudo enviar el mensaje",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card
      h="100%"
      display="flex"
      flexDirection="column"
      bg="white"
      borderRadius={{ base: "0", md: "2xl" }}
      boxShadow={{ base: "none", md: "2xl" }}
      overflow="hidden"
      border="none"
    >
      {/* Header */}
      <Box
        p={4}
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.100"
        boxShadow="sm"
        zIndex="10"
      >
        <Flex justify="space-between" align="center">
          <HStack spacing={4}>
            <Box
              p={2.5}
              bg="blue.50"
              borderRadius="xl"
              color="blue.600"
            >
              <Icon as={icon} boxSize={5} />
            </Box>
            <VStack align="start" spacing={0}>
              <Heading size="sm" color="gray.800">{title}</Heading>
              <HStack spacing={1.5}>
                <Box w={2} h={2} borderRadius="full" bg="green.400" />
                <Text fontSize="xs" color="gray.500" fontWeight="medium">En línea</Text>
              </HStack>
            </VStack>
          </HStack>
        </Flex>
      </Box>

      {/* Messages Area */}
      <Box
        flex={1}
        bg="gray.50"
        p={{ base: 2, md: 6 }}
        overflowY="auto"
        display="flex"
        flexDirection="column"
        css={{
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: '#CBD5E0', borderRadius: '24px' },
        }}
      >
        {loading ? (
          <Flex justify="center" align="center" h="100%">
            <Spinner size="lg" color="blue.500" thickness="3px" />
          </Flex>
        ) : messages.length === 0 ? (
          <Flex justify="center" align="center" h="100%" direction="column" opacity={0.7}>
            <Box p={6} bg="white" borderRadius="full" mb={6} boxShadow="lg">
              <Icon as={LuMessageCircle} boxSize={10} color="blue.400" />
            </Box>
            <Text color="gray.600" fontWeight="semibold" fontSize="lg">
              Comienza la conversación
            </Text>
            <Text fontSize="sm" color="gray.400" mt={1}>
              Este espacio es para ti y tus compañeros
            </Text>
          </Flex>
        ) : (
          <VStack spacing={2} align="stretch" pb={2}>
            {messages.map((message) => (
              <ForumMessage
                key={message.id}
                message={message}
                currentUser={userProfile}
              />
            ))}
            <div ref={messagesEndRef} />
          </VStack>
        )}
      </Box>

      {/* Input Area */}
      <Box p={4} bg="white" borderTop="1px solid" borderColor="gray.100">
        <HStack spacing={3} align="flex-end">
          <Tooltip label="Emojis" hasArrow>
            <IconButton
              icon={<Icon as={LuSmile} boxSize={5} />}
              variant="ghost"
              colorScheme="gray"
              aria-label="Emojis"
              rounded="full"
              color="gray.400"
              _hover={{ color: "gray.600", bg: "gray.100" }}
              h="45px" w="45px"
            />
          </Tooltip>

          <Box flex={1}>
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un mensaje..."
              minH="45px"
              maxH="120px"
              resize="none"
              py={3}
              px={5}
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="2xl"
              _focus={{
                bg: "white",
                borderColor: "blue.400",
                boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.15)",
              }}
              rows={1}
              fontSize="md"
            />
          </Box>

          <IconButton
            icon={isSending ? <Spinner size="sm" /> : <Icon as={LuSend} boxSize={5} />}
            colorScheme="blue"
            onClick={sendMessage}
            isDisabled={!newMessage.trim() || isSending}
            aria-label="Enviar mensaje"
            rounded="xl"
            bg="blue.500"
            _hover={{ bg: "blue.600", transform: "translateY(-1px)", boxShadow: "lg" }}
            _active={{ transform: "translateY(0)" }}
            size="lg"
            h="45px"
            w="45px"
            transition="all 0.2s"
          />
        </HStack>
      </Box>
    </Card>
  );
};

const ComunidadPage = () => {
  const { userProfile, loading } = useUser();
  const [communityStats, setCommunityStats] = useState({
    totalMessages: 0,
    totalUsers: 0
  });

  useEffect(() => {
    const getStats = async () => {
      try {
        const result = await getCommunityStats();
        if (result.success) {
          setCommunityStats(result.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    getStats();
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box
      h={{ base: "calc(100vh - 60px)", md: "auto" }}
      minH={{ md: "100vh" }}
      bg="gray.50"
      py={{ base: 0, md: 6 }}
    >
      <Container
        maxW="container.xl"
        h="100%"
        p={{ base: 0, md: 6 }}
      >
        <Flex direction="column" h="100%" gap={6}>

          {/* Header Section */}
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "start", md: "center" }}
            gap={4}
            display={{ base: "none", md: "flex" }}
            mb={2}
          >
            <Box>
              <Heading size="lg" color="gray.800" fontWeight="800">
                Comunidad
              </Heading>
              <Text color="gray.500" fontSize="md" mt={1}>
                Conecta con tu grupo de estudio
              </Text>
            </Box>

            <HStack spacing={4}>
              <HStack bg="white" px={5} py={2.5} borderRadius="2xl" boxShadow="sm" spacing={3} border="1px solid" borderColor="gray.100">
                <Box p={2} bg="green.50" borderRadius="xl" color="green.500">
                  <Icon as={LuUsers} boxSize={5} />
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.400" fontWeight="bold">EN LÍNEA</Text>
                  <Text fontWeight="800" color="gray.800" fontSize="lg" lineHeight="1">{communityStats.totalUsers || 0}</Text>
                </Box>
              </HStack>
            </HStack>
          </Flex>

          {/* Main Chat Area */}
          <Box flex={1} h="100%">
            <ForumChat
              category="estudiantes"
              title="Estudiantes BarmitzvaTop"
              icon={LuGraduationCap}
            />
          </Box>

        </Flex>
      </Container>
    </Box>
  );
};

export default ComunidadPage;