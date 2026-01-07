import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Card,
  CardBody,
  Badge,
  Button,
  Divider,
  SimpleGrid,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Spacer,
  IconButton,
} from '@chakra-ui/react';
import { FaUsers, FaComments, FaPlus, FaPaperPlane, FaGlobeAmericas, FaGraduationCap, FaBullhorn } from 'react-icons/fa';
import { useState, useEffect } from 'react';
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
  const isOwnMessage = message.userId === currentUser?.uid;

  return (
    <Box
      alignSelf={isOwnMessage ? 'flex-end' : 'flex-start'}
      maxW="70%"
      mb={3}
    >
      <Card
        bg={isOwnMessage ? '#3B82F6' : 'white'}
        color={isOwnMessage ? 'white' : 'gray.800'}
        size="sm"
      >
        <CardBody p={3}>
          <VStack align="start" spacing={1}>
            <HStack spacing={2} w="100%">
              <Avatar size="xs" name={message.userName} />
              <Text fontSize="xs" fontWeight="bold" opacity={0.8}>
                {message.userName}
              </Text>
              <Spacer />
              <Text fontSize="xs" opacity={0.6}>
                {message.timestamp?.toDate ?
                  formatDistanceToNow(message.timestamp.toDate(), { addSuffix: true, locale: es }) :
                  'Ahora'
                }
              </Text>
            </HStack>
            <Text fontSize="sm">{message.content}</Text>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

const ForumChat = ({ category, title, icon, description }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [useLocalStorage, setUseLocalStorage] = useState(false);
  const { userProfile } = useUser();
  const toast = useToast();

  useEffect(() => {
    let cleanupFunction = null;
    let isMounted = true;

    const initializeForum = async () => {
      try {
        // Verificar conexión (Supabase)
        const connectionTest = await checkDatabaseConnection();

        if (!isMounted) return;

        if (connectionTest.connected) {
          // Usar Supabase
          cleanupFunction = getForumMessages(category, (messagesData, error) => {
            if (!isMounted) return;

            if (error) {
              console.warn('Service error, falling back to localStorage:', error);
              setUseLocalStorage(true);
              const localMessages = getLocalForumMessages(category);
              setMessages(localMessages);

              if (isMounted) {
                toast({
                  title: "Modo sin conexión",
                  description: "Los mensajes se guardarán localmente",
                  status: "warning",
                  duration: 3000,
                });
              }
            } else {
              setUseLocalStorage(false);
              setMessages(messagesData);
            }
            setLoading(false);
          });
        } else {
          // Usar localStorage como fallback
          setUseLocalStorage(true);
          const localMessages = getLocalForumMessages(category);
          setMessages(localMessages);
          setLoading(false);

          if (isMounted) {
            toast({
              title: "Modo sin conexión",
              description: "Los mensajes se guardarán localmente",
              status: "info",
              duration: 4000,
            });
          }
        }
      } catch (error) {
        console.error('Error initializing forum:', error);
        if (isMounted) {
          setUseLocalStorage(true);
          const localMessages = getLocalForumMessages(category);
          setMessages(localMessages);
          setLoading(false);
        }
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
  }, [category, toast]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const result = await sendForumMessage(
        category,
        newMessage,
        userProfile?.id || 'anonymous',
        userProfile?.name || 'Usuario Anónimo'
      );

      if (result.success) {
        setNewMessage('');

        // Si estamos usando localStorage, actualizar la lista manualmente
        if (useLocalStorage || result.isLocal) {
          const localMessages = getLocalForumMessages(category);
          setMessages(localMessages);
        }

        toast({
          title: result.isLocal ? "Mensaje guardado localmente" : "Mensaje enviado",
          status: "success",
          duration: 2000,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error al enviar mensaje",
        description: error.message || "Por favor intenta nuevamente",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card h="600px" display="flex" flexDirection="column">
      <CardBody p={0} display="flex" flexDirection="column" h="100%">
        {/* Header */}
        <Box p={4} borderBottom="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Icon as={icon} color="#3B82F6" boxSize={6} />
            <VStack align="start" spacing={0}>
              <HStack>
                <Heading size="md">{title}</Heading>
                {useLocalStorage && (
                  <Badge colorScheme="orange" size="sm">
                    Sin conexión
                  </Badge>
                )}
              </HStack>
              <Text fontSize="sm" color="gray.600">{description}</Text>
            </VStack>
          </HStack>
        </Box>

        {/* Messages Area */}
        <Box
          flex={1}
          p={4}
          overflowY="auto"
          display="flex"
          flexDirection="column"
          minH={0}
        >
          {loading ? (
            <Flex justify="center" align="center" h="100%">
              <Spinner size="lg" color="blue.500" />
            </Flex>
          ) : messages.length === 0 ? (
            <Flex justify="center" align="center" h="100%" direction="column">
              <Icon as={FaComments} boxSize={12} color="gray.300" mb={4} />
              <Text color="gray.500" textAlign="center">
                ¡Sé el primero en escribir en este foro!
              </Text>
            </Flex>
          ) : (
            <VStack spacing={0} align="stretch">
              {messages.map((message) => (
                <ForumMessage
                  key={message.id}
                  message={message}
                  currentUser={userProfile}
                />
              ))}
            </VStack>
          )}
        </Box>

        {/* Input Area */}
        <Box p={4} borderTop="1px solid" borderColor="gray.200">
          <HStack spacing={2}>
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              size="sm"
              resize="none"
              rows={2}
              flex={1}
            />
            <IconButton
              icon={<FaPaperPlane />}
              colorScheme="blue"
              onClick={sendMessage}
              isDisabled={!newMessage.trim()}
              aria-label="Enviar mensaje"
            />
          </HStack>
        </Box>
      </CardBody>
    </Card>
  );
};

const ComunidadPage = () => {
  const { userProfile, loading } = useUser();
  const [communityStats, setCommunityStats] = useState({
    totalMessages: 0,
    totalUsers: 0,
    messagesGeneralCount: 0,
    messagesStudentsCount: 0,
    messagesAnnouncementsCount: 0,
    recentActivity: []
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Hook para obtener estadísticas de la comunidad
  useEffect(() => {
    const getStats = async () => {
      try {
        setLoadingStats(true);

        const result = await getCommunityStats();

        if (result.success) {
          setCommunityStats(result.data);
        } else {
          console.warn('Failed to get stats, using blank/cache');
        }

        setLoadingStats(false);

      } catch (error) {
        console.error('Error setting up stats listener:', error);
        setLoadingStats(false);
      }
    };

    getStats();
  }, []);

  if (loading || loadingStats) {
    return (
      <Box w="100%" maxW="95vw" mx="auto" py={8} px={{ base: 4, md: 6, lg: 8 }}>
        <VStack spacing={4} align="center" justify="center" minH="400px">
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.600">Cargando comunidad...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box w="100%" maxW="95vw" mx="auto" py={8} px={{ base: 4, md: 6, lg: 8 }}>
      <VStack spacing={8} align="stretch">

        {/* Header */}
        <Box textAlign="center">
          <Heading size="xl" color="gray.800" mb={2}>
            Comunidad BarmitzvaTop
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Conecta con otros estudiantes, comparte experiencias y aprende juntos
          </Text>
        </Box>

        {/* Community Stats */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card>
            <CardBody>
              <HStack spacing={4}>
                <Box p={3} bg="blue.100" borderRadius="lg">
                  <Icon as={FaComments} color="blue.600" boxSize={6} />
                </Box>
                <VStack align="start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    {communityStats.totalMessages}
                  </Text>
                  <Text fontSize="sm" color="gray.600">Mensajes Totales</Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <HStack spacing={4}>
                <Box p={3} bg="green.100" borderRadius="lg">
                  <Icon as={FaUsers} color="green.600" boxSize={6} />
                </Box>
                <VStack align="start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    {communityStats.totalUsers}
                  </Text>
                  <Text fontSize="sm" color="gray.600">Usuarios Activos</Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <HStack spacing={4}>
                <Box p={3} bg="purple.100" borderRadius="lg">
                  <Icon as={FaGlobeAmericas} color="purple.600" boxSize={6} />
                </Box>
                <VStack align="start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    {communityStats.messagesGeneralCount}
                  </Text>
                  <Text fontSize="sm" color="gray.600">Foro General</Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <HStack spacing={4}>
                <Box p={3} bg="orange.100" borderRadius="lg">
                  <Icon as={FaGraduationCap} color="orange.600" boxSize={6} />
                </Box>
                <VStack align="start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    {communityStats.messagesStudentsCount}
                  </Text>
                  <Text fontSize="sm" color="gray.600">Estudiantes</Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Welcome Card */}
        <Card bg="gradient-to-r from-blue-50 to-indigo-50" borderColor="#3B82F6" borderWidth={2}>
          <CardBody>
            <HStack spacing={4}>
              <Avatar
                size="lg"
                name={userProfile?.name || 'Estudiante'}
                bg="#3B82F6"
              />
              <VStack align="start" spacing={1} flex={1}>
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                  ¡Hola, {userProfile?.name || 'Estudiante'}!
                </Text>
                <Text color="gray.600">
                  {communityStats.totalMessages > 0
                    ? `Únete a ${communityStats.totalMessages} mensajes de ${communityStats.totalUsers} estudiantes activos`
                    : 'Sé el primero en participar en la comunidad'
                  }
                </Text>
              </VStack>
              <Icon as={FaUsers} boxSize={8} color="#3B82F6" />
            </HStack>
          </CardBody>
        </Card>

        {/* Recent Activity */}
        {communityStats.recentActivity.length > 0 && (
          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md" color="gray.800">
                  📈 Actividad Reciente
                </Heading>
                <VStack spacing={3} align="stretch">
                  {communityStats.recentActivity.map((activity, index) => (
                    <Box key={activity.id || index} p={3} bg="gray.50" borderRadius="md">
                      <HStack spacing={3}>
                        <Avatar size="sm" name={activity.userName} />
                        <VStack align="start" spacing={1} flex={1}>
                          <HStack spacing={2}>
                            <Text fontSize="sm" fontWeight="bold">{activity.userName}</Text>
                            <Badge
                              size="sm"
                              colorScheme={
                                activity.category === 'general' ? 'blue' :
                                  activity.category === 'estudiantes' ? 'green' : 'orange'
                              }
                            >
                              {activity.category === 'general' ? 'General' :
                                activity.category === 'estudiantes' ? 'Estudiantes' : 'Anuncios'}
                            </Badge>
                          </HStack>
                          <Text fontSize="sm" color="gray.600" noOfLines={2}>
                            {activity.content}
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            {activity.timestamp?.toDate ?
                              formatDistanceToNow(activity.timestamp.toDate(), { addSuffix: true, locale: es }) :
                              'Hace poco'
                            }
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Forums */}
        <Card>
          <CardBody>
            <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align={{ base: 'start', sm: 'center' }} mb={4} gap={3}>
              <Heading size="lg" color="gray.800">
                💬 Foros de la Comunidad
              </Heading>
              <HStack spacing={2} bg="gray.100" px={3} py={1} borderRadius="full">
                <Box w={2} h={2} bg="green.400" borderRadius="full" />
                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                  {communityStats.totalUsers} usuarios activos
                </Text>
              </HStack>
            </Flex>

            <Tabs variant="soft-rounded" colorScheme="blue" size="sm">
              <TabList overflowX="auto" py={2} css={{
                scrollbarWidth: 'none',
                '::-webkit-scrollbar': { display: 'none' },
                '-webkit-overflow-scrolling': 'touch'
              }}>
                <Tab minW="fit-content" mr={2} _selected={{ color: 'white', bg: 'blue.500' }}>
                  <Icon as={FaGlobeAmericas} mr={2} />
                  General ({communityStats.messagesGeneralCount})
                </Tab>
                <Tab minW="fit-content" mr={2} _selected={{ color: 'white', bg: 'blue.500' }}>
                  <Icon as={FaGraduationCap} mr={2} />
                  Estudiantes ({communityStats.messagesStudentsCount})
                </Tab>
                <Tab minW="fit-content" _selected={{ color: 'white', bg: 'blue.500' }}>
                  <Icon as={FaBullhorn} mr={2} />
                  Anuncios ({communityStats.messagesAnnouncementsCount})
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={0} pt={6}>
                  <ForumChat
                    category="general"
                    title="Foro General"
                    icon={FaGlobeAmericas}
                    description="Conversaciones generales sobre la preparación del Barmitzva"
                  />
                </TabPanel>

                <TabPanel p={0} pt={6}>
                  <ForumChat
                    category="estudiantes"
                    title="Foro de Estudiantes"
                    icon={FaGraduationCap}
                    description="Espacio para que los estudiantes compartan experiencias y se apoyen mutuamente"
                  />
                </TabPanel>

                <TabPanel p={0} pt={6}>
                  <ForumChat
                    category="anuncios"
                    title="Anuncios"
                    icon={FaBullhorn}
                    description="Noticias importantes y actualizaciones del curso"
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>

      </VStack>
    </Box>
  );
};

export default ComunidadPage;