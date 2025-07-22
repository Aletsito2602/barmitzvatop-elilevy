import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Icon,
  Badge,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Image,
  Progress,
  Container,
  Flex,
  Spacer,
  AspectRatio,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
} from '@chakra-ui/react';
import { 
  FaPlay, 
  FaClock, 
  FaGraduationCap, 
  FaVideo, 
  FaBook,
  FaCheckCircle,
  FaLock,
  FaYoutube,
  FaStar,
  FaUsers,
  FaChevronRight
} from 'react-icons/fa';
import { useState } from 'react';
import { useClasses } from '../hooks/useClasses';
import { useUser } from '../hooks/useUser';
import { extractYouTubeVideoId, getYouTubeThumbnail, getVideoType, getVideoThumbnail } from '../services/classesService';
import { markClassAsCompleted, unmarkClassAsCompleted, updateLastWatchedClass } from '../services/userService';
import UniversalVideoPlayer from './UniversalVideoPlayer';

const ClasesPage = () => {
  const { classes, loading, error } = useClasses();
  const { userProfile, userProgress, loading: userLoading, error: userError } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedClass, setSelectedClass] = useState(null);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);
  const [showWatchedButton, setShowWatchedButton] = useState(false);
  const toast = useToast();

  const openClassModal = async (clase) => {
    setSelectedClass(clase);
    setVideoWatched(!clase.youtubeLink); // If no video, mark as watched
    setShowWatchedButton(false);
    onOpen();
    
    // Update last watched class when opening modal
    if (userProfile?.uid) {
      await updateLastWatchedClass(userProfile.uid, clase.classNumber);
    }
    
    // Show "Ya vi este video" button after 30 seconds only if there's a video
    if (clase.youtubeLink) {
      setTimeout(() => {
        setShowWatchedButton(true);
      }, 30000);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'basico': return 'green';
      case 'intermedio': return 'yellow';
      case 'avanzado': return 'red';
      // Compatibilidad con valores antiguos
      case 'beginner': return 'green';
      case 'intermediate': return 'yellow';
      case 'advanced': return 'red';
      default: return 'gray';
    }
  };

  const translateDifficulty = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'Básico';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      case 'basico': return 'Básico';
      case 'intermedio': return 'Intermedio';
      case 'avanzado': return 'Avanzado';
      default: return 'Básico';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'introduccion': return FaGraduationCap;
      case 'hebreo': return FaBook;
      case 'berajot': return FaStar;
      case 'taamim': return FaVideo;
      case 'tefila': return FaUsers;
      default: return FaBook;
    }
  };

  const isClassCompleted = (classNumber) => {
    return userProgress?.completedClasses?.includes(parseInt(classNumber)) || false;
  };

  const isClassLocked = (classNumber) => {
    return false; // Todas las clases están siempre disponibles
  };

  const getClassStatus = (classNumber) => {
    const num = parseInt(classNumber);
    if (isClassCompleted(num)) return 'completed';
    if (num === (userProgress?.currentClass || 1)) return 'current';
    if (isClassLocked(num)) return 'locked';
    return 'available';
  };

  const handleMarkAsCompleted = async () => {
    if (!selectedClass || !userProfile?.uid) return;
    
    setIsMarkingComplete(true);
    
    try {
      const result = await markClassAsCompleted(
        userProfile.uid, 
        selectedClass.id, 
        selectedClass.classNumber, 
        selectedClass.duration
      );
      
      if (result.success) {
        toast({
          title: 'Clase completada',
          description: `Has completado la Clase ${selectedClass.classNumber}`,
          status: 'success',
          duration: 3000,
        });
        onClose();
        // The useUser hook should automatically refresh the data
        window.location.reload(); // Force refresh to update progress
      } else {
        toast({
          title: 'Error',
          description: result.error || 'No se pudo marcar la clase como completada',
          status: 'error',
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const handleUnmarkAsCompleted = async () => {
    if (!selectedClass || !userProfile?.uid) return;
    
    setIsMarkingComplete(true);
    
    try {
      const result = await unmarkClassAsCompleted(
        userProfile.uid, 
        selectedClass.classNumber
      );
      
      if (result.success) {
        toast({
          title: 'Clase desmarcada',
          description: `Has desmarcado la Clase ${selectedClass.classNumber}`,
          status: 'info',
          duration: 3000,
        });
        onClose();
        window.location.reload(); // Force refresh to update progress
      } else {
        toast({
          title: 'Error',
          description: result.error || 'No se pudo desmarcar la clase',
          status: 'error',
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsMarkingComplete(false);
    }
  };

  if (loading || userLoading) {
    return (
      <Box w="100%" maxW="95vw" mx="auto" py={8} px={{ base: 4, md: 6, lg: 8 }}>
        <VStack spacing={4} align="center" justify="center" minH="400px">
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.600">Cargando clases...</Text>
        </VStack>
      </Box>
    );
  }

  if (error || userError) {
    return (
      <Box w="100%" maxW="95vw" mx="auto" py={8} px={{ base: 4, md: 6, lg: 8 }}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          Error al cargar las clases: {error || userError}
        </Alert>
      </Box>
    );
  }

  if (classes.length === 0) {
    return (
      <Box w="100%" maxW="95vw" mx="auto" py={8} px={{ base: 4, md: 6, lg: 8 }}>
        <VStack spacing={6} align="center" py={12}>
          <Icon as={FaGraduationCap} color="gray.300" boxSize={16} />
          <Heading size="lg" color="gray.500">No hay clases disponibles</Heading>
          <Text color="gray.400" textAlign="center">
            Las clases se están preparando. Pronto tendrás acceso al contenido completo del curso.
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box w="100%" maxW="95vw" mx="auto" py={8} px={{ base: 4, md: 6, lg: 8 }}>
      <VStack spacing={8} align="stretch">
        
        {/* Header */}
        <Box>
          <Heading size="xl" color="gray.800" mb={2}>
            📚 Mis Clases
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Curso Barmitzva con Eli Levy
          </Text>
        </Box>

        {/* Progress Overview */}
        <Card bg="gradient-to-r from-blue-50 to-indigo-50" borderColor="#3B82F6" borderWidth={2}>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between" align="center">
                <VStack align="start" spacing={1}>
                  <Text fontSize="lg" fontWeight="bold" color="gray.800">
                    Tu Progreso en el Curso
                  </Text>
                  <Text color="gray.600">
                    {userProgress?.completedClasses?.length || 0} de {classes.length} clases completadas
                  </Text>
                  {userProgress?.lastWatchedClass && (
                    <Text color="blue.600" fontSize="sm" fontWeight="medium">
                      📖 Última clase vista: Clase {userProgress.lastWatchedClass}
                    </Text>
                  )}
                </VStack>
                <Badge
                  colorScheme="blue"
                  fontSize="md"
                  px={4}
                  py={2}
                  borderRadius="full"
                >
                  {Math.round(((userProgress?.completedClasses?.length || 0) / classes.length) * 100)}% Completado
                </Badge>
              </HStack>
              <Progress 
                value={((userProgress?.completedClasses?.length || 0) / classes.length) * 100} 
                colorScheme="blue" 
                bg="gray.200"
                size="lg"
                borderRadius="full"
              />
              <HStack spacing={6} fontSize="sm" color="gray.600">
                <HStack>
                  <Icon as={FaClock} boxSize={4} />
                  <Text>{Math.round((userProgress?.studyHours || 0) * 60)} min estudiados</Text>
                </HStack>
                <HStack>
                  <Icon as={FaGraduationCap} boxSize={4} />
                  <Text>Clase actual: {userProgress?.currentClass || 1}</Text>
                </HStack>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Classes Grid */}
        <Box>
          <Heading size="md" mb={6} color="gray.800">
            Contenido del Curso
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {classes.map((clase) => {
              const status = getClassStatus(clase.classNumber);
              const videoType = clase.videoType || getVideoType(clase.youtubeLink);
              const thumbnail = getVideoThumbnail(clase.youtubeLink, videoType);
              const CategoryIcon = getCategoryIcon(clase.category);
              
              return (
                <Card 
                  key={clase.id} 
                  variant="outline" 
                  _hover={{ 
                    transform: 'translateY(-4px)', 
                    boxShadow: 'xl',
                    cursor: 'pointer'
                  }}
                  transition="all 0.2s"
                  opacity={1}
                  onClick={() => openClassModal(clase)}
                  borderColor={status === 'current' ? '#3B82F6' : 'gray.200'}
                  borderWidth={status === 'current' ? 2 : 1}
                  bg={status === 'completed' ? 'green.50' : 'white'}
                >
                  <CardBody p={0}>
                    {/* Video Thumbnail */}
                    <Box position="relative">
                      <AspectRatio ratio={16/9}>
                        <Box
                          bgImage={thumbnail ? `url(${thumbnail})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}
                          bgSize="cover"
                          bgPosition="center"
                          borderTopRadius="md"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {status === 'locked' ? (
                            <Icon as={FaLock} color="white" boxSize={8} />
                          ) : (
                            <Icon as={FaPlay} color="white" boxSize={8} />
                          )}
                        </Box>
                      </AspectRatio>
                      
                      {/* Status Badge */}
                      <Badge
                        position="absolute"
                        top={3}
                        right={3}
                        colorScheme={
                          status === 'completed' ? 'green' :
                          status === 'current' ? 'blue' :
                          status === 'locked' ? 'gray' : 'yellow'
                        }
                        borderRadius="full"
                        px={3}
                        py={1}
                      >
                        {status === 'completed' && <Icon as={FaCheckCircle} mr={1} />}
                        {status === 'locked' && <Icon as={FaLock} mr={1} />}
                        {status === 'current' && <Icon as={FaPlay} mr={1} />}
                        Clase {clase.classNumber}
                      </Badge>
                    </Box>

                    {/* Content */}
                    <VStack spacing={3} p={4} align="stretch">
                      <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={1} flex={1}>
                          <Text fontWeight="bold" fontSize="lg" color="gray.800" noOfLines={2}>
                            {clase.title}
                          </Text>
                          <Text fontSize="sm" color="gray.600" noOfLines={2}>
                            {clase.description}
                          </Text>
                        </VStack>
                        <Icon as={CategoryIcon} color="#3B82F6" boxSize={5} />
                      </HStack>

                      <HStack justify="space-between" fontSize="sm" color="gray.500">
                        <HStack spacing={4}>
                          <HStack spacing={1}>
                            <Icon as={FaClock} boxSize={3} />
                            <Text>{clase.duration}min</Text>
                          </HStack>
                        </HStack>
                        <Badge 
                          size="sm" 
                          colorScheme={getDifficultyColor(clase.difficulty)}
                        >
                          {translateDifficulty(clase.difficulty)}
                        </Badge>
                      </HStack>

                      <Button
                        colorScheme="blue"
                        size="sm"
                        leftIcon={<Icon as={FaPlay} />}
                        rightIcon={<Icon as={FaChevronRight} />}
                      >
                        {status === 'completed' ? 'Repasar' : status === 'current' ? 'Continuar' : 'Comenzar'}
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              );
            })}
          </SimpleGrid>
        </Box>

      </VStack>

      {/* Class Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent maxH="90vh">
          <ModalHeader>
            <HStack spacing={3}>
              <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                Clase {selectedClass?.classNumber}
              </Badge>
              <Text fontSize="xl">{selectedClass?.title}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody overflowY="auto">
            <VStack spacing={6} align="stretch">
              
              {/* Video Player */}
              {selectedClass?.youtubeLink && (
                <Box position="relative">
                  <UniversalVideoPlayer
                    videoUrl={selectedClass.youtubeLink}
                    videoType={selectedClass.videoType || getVideoType(selectedClass.youtubeLink)}
                    title={selectedClass.title}
                    onProgress={(time) => {
                      // Handle progress updates
                      console.log('Video progress:', time);
                    }}
                    onComplete={() => {
                      // Auto-mark as completed when video finishes
                      setVideoWatched(true);
                      setShowWatchedButton(true);
                    }}
                  />
                  
                  {/* "Ya vi este video" button */}
                  {showWatchedButton && !isClassCompleted(selectedClass?.classNumber) && (
                    <Box
                      position="absolute"
                      bottom={4}
                      right={4}
                      zIndex={20}
                    >
                      <Button
                        size="sm"
                        colorScheme="green"
                        variant="solid"
                        leftIcon={<Icon as={FaCheckCircle} />}
                        onClick={() => {
                          setVideoWatched(true);
                          toast({
                            title: 'Video marcado como visto',
                            description: 'Ahora puedes marcar la clase como completada',
                            status: 'success',
                            duration: 3000,
                          });
                        }}
                        boxShadow="lg"
                        bg="green.500"
                        _hover={{ bg: 'green.600' }}
                      >
                        Ya vi este video
                      </Button>
                    </Box>
                  )}
                </Box>
              )}

              {/* Class Info */}
              <VStack spacing={4} align="stretch">
                <HStack spacing={6} flexWrap="wrap">
                  <HStack>
                    <Icon as={FaClock} color="gray.500" />
                    <Text color="gray.600">Duración: {selectedClass?.duration} min</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaGraduationCap} color="gray.500" />
                    <Text color="gray.600">Nivel: {translateDifficulty(selectedClass?.difficulty)}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaBook} color="gray.500" />
                    <Text color="gray.600">Categoría: {selectedClass?.category}</Text>
                  </HStack>
                  {videoWatched && (
                    <HStack>
                      <Icon as={FaCheckCircle} color="green.500" />
                      <Text color="green.600" fontWeight="medium">Video visto</Text>
                    </HStack>
                  )}
                </HStack>

                {selectedClass?.description && (
                  <Box>
                    <Heading size="sm" mb={2}>Descripción</Heading>
                    <Text color="gray.700" lineHeight="1.6">
                      {selectedClass.description}
                    </Text>
                  </Box>
                )}
              </VStack>

            </VStack>
          </ModalBody>

          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onClose}>
                Cerrar
              </Button>
              <Button
                colorScheme="green"
                leftIcon={<Icon as={FaCheckCircle} />}
                onClick={handleMarkAsCompleted}
                isLoading={isMarkingComplete}
                size="lg"
                bg="green.500"
                _hover={{ bg: "green.600" }}
                color="white"
                fontWeight="bold"
              >
                Clase Completada
              </Button>
              {isClassCompleted(selectedClass?.classNumber) && (
                <Button
                  colorScheme="orange"
                  leftIcon={<Icon as={FaCheckCircle} />}
                  onClick={handleUnmarkAsCompleted}
                  isLoading={isMarkingComplete}
                  size="sm"
                  variant="outline"
                >
                  Desmarcar
                </Button>
              )}
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ClasesPage;