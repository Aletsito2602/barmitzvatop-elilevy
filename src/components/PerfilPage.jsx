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
  Button,
  Avatar,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
  Progress,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { 
  FaUser, 
  FaCalendarAlt, 
  FaEdit, 
  FaSave, 
  FaMapMarkerAlt,
  FaClock,
  FaGraduationCap,
  FaBookOpen,
  FaStar,
  FaAward,
  FaHeart
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { updateUserProfile, createUserProfile } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const PerfilPage = () => {
  const { user } = useAuth();
  const { userProfile, userProgress, loading, error, refreshUser } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const toast = useToast();

  // Debug: log user data
  console.log('🔍 PerfilPage Debug:', {
    userProfile,
    userProgress,
    loading,
    error
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthDate: '',
    barmitzvaDate: '',
    birthPlace: '',
    barmitzvaLocation: '',
    phone: '',
    bio: '',
    studyPlan: 'alef',
    goals: ''
  });

  // Update form data when user profile loads
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        birthDate: userProfile.birthDate || '',
        barmitzvaDate: userProfile.barmitzvaDate || '',
        birthPlace: userProfile.birthPlace || '',
        barmitzvaLocation: userProfile.barmitzvaLocation || '',
        phone: userProfile.phone || '',
        bio: userProfile.bio || '',
        studyPlan: userProfile.studyPlan || 'alef',
        goals: userProfile.goals || ''
      });
    }
  }, [userProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateProfile = async () => {
    if (!user?.uid) return;

    setIsCreatingProfile(true);
    
    try {
      const result = await createUserProfile(user.uid, {
        name: user.displayName || '',
        email: user.email || '',
        uid: user.uid
      });

      if (result.success) {
        toast({
          title: 'Perfil creado',
          description: 'Tu perfil ha sido creado exitosamente',
          status: 'success',
          duration: 3000,
        });
        refreshUser();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'No se pudo crear el perfil',
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
      setIsCreatingProfile(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user?.uid) return;

    setIsUpdating(true);
    
    try {
      const result = await updateUserProfile(user.uid, {
        ...formData,
        updatedAt: new Date()
      });

      if (result.success) {
        toast({
          title: 'Perfil actualizado',
          description: 'Tus datos han sido guardados exitosamente',
          status: 'success',
          duration: 3000,
        });
        setIsEditing(false);
        refreshUser();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'No se pudo actualizar el perfil',
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
      setIsUpdating(false);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'No especificado';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return `${age} años`;
  };

  const getDaysUntilBarmitzva = (barmitzvaDate) => {
    if (!barmitzvaDate) return null;
    const today = new Date();
    const bmDate = new Date(barmitzvaDate);
    const diffTime = bmDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Barmitzva realizado';
    if (diffDays === 0) return '¡Hoy es el día!';
    if (diffDays === 1) return '¡Mañana!';
    return `${diffDays} días`;
  };


  if (loading) {
    return (
      <Box w="100%" maxW="95vw" mx="auto" py={8} px={{ base: 4, md: 6, lg: 8 }}>
        <VStack spacing={4} align="center" justify="center" minH="400px">
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.600">Cargando perfil...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box w="100%" maxW="95vw" mx="auto" py={8} px={{ base: 4, md: 6, lg: 8 }}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          Error al cargar el perfil: {error}
        </Alert>
      </Box>
    );
  }

  // If user is logged in but no profile exists, show create profile option
  if (!loading && user && !userProfile) {
    return (
      <Box w="100%" maxW="95vw" mx="auto" py={8} px={{ base: 4, md: 6, lg: 8 }}>
        <VStack spacing={8} align="center" justify="center" minH="400px">
          <Icon as={FaUser} color="gray.300" boxSize={16} />
          <Heading size="lg" color="gray.500">Perfil no encontrado</Heading>
          <Text color="gray.400" textAlign="center" maxW="md">
            Parece que es tu primera vez aquí. Vamos a crear tu perfil para comenzar tu preparación del Barmitzva.
          </Text>
          <Button
            colorScheme="blue"
            size="lg"
            leftIcon={<Icon as={FaUser} />}
            onClick={handleCreateProfile}
            isLoading={isCreatingProfile}
          >
            Crear Mi Perfil
          </Button>
        </VStack>
      </Box>
    );
  }

  const daysUntilBM = getDaysUntilBarmitzva(userProfile?.barmitzvaDate);

  return (
    <Box w="100%" maxW="95vw" mx="auto" py={8} px={{ base: 4, md: 6, lg: 8 }}>
      <VStack spacing={8} align="stretch">
        
        {/* Header */}
        <Flex align="center" justify="space-between" flexWrap="wrap" gap={4}>
          <HStack spacing={4}>
            <Avatar 
              size="xl" 
              name={userProfile?.name || 'Usuario'} 
              src={userProfile?.profileImage}
              bg="#3B82F6"
            />
            <VStack align="start" spacing={1}>
              <Heading size="xl" color="gray.800">
                {userProfile?.name || 'Usuario'}
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Mi Perfil de Barmitzva
              </Text>
              <HStack spacing={2}>
                <Badge colorScheme="blue" px={2} py={1}>
                  Plan {userProfile?.studyPlan?.toUpperCase() || 'ALEF'}
                </Badge>
                <Badge colorScheme="green" px={2} py={1}>
                  {userProgress?.lessonsCompleted || 0} clases completadas
                </Badge>
              </HStack>
            </VStack>
          </HStack>
          
          <Button
            leftIcon={<Icon as={FaEdit} />}
            colorScheme="blue"
            onClick={() => setIsEditing(true)}
          >
            Editar Perfil
          </Button>
        </Flex>

        {/* Countdown to Barmitzva */}
        {daysUntilBM && daysUntilBM !== 'Barmitzva realizado' && (
          <Card bg="gradient-to-r from-orange-50 to-yellow-50" borderColor="#F59E0B" borderWidth={2}>
            <CardBody>
              <HStack spacing={4} align="center" justify="center">
                <Icon as={FaStar} color="#F59E0B" boxSize={8} />
                <VStack spacing={1}>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    {daysUntilBM}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    para tu Barmitzva
                  </Text>
                </VStack>
                <Icon as={FaStar} color="#F59E0B" boxSize={8} />
              </HStack>
            </CardBody>
          </Card>
        )}


        {/* Profile Information */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <HStack>
                <Icon as={FaUser} color="#3B82F6" />
                <Heading size="md">Información Personal</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.600">Nombre Completo</Text>
                  <Text fontSize="md" color={userProfile?.name ? "gray.800" : "gray.400"}>
                    {userProfile?.name || 'Agregar nombre en editar perfil'}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.600">Correo Electrónico</Text>
                  <Text fontSize="md" color={userProfile?.email ? "gray.800" : "gray.400"}>
                    {userProfile?.email || 'Agregar email en editar perfil'}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.600">Teléfono</Text>
                  <Text fontSize="md" color={userProfile?.phone ? "gray.800" : "gray.400"}>
                    {userProfile?.phone || 'Agregar teléfono en editar perfil'}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.600">Fecha de Nacimiento</Text>
                  <Text fontSize="md" color={userProfile?.birthDate ? "gray.800" : "gray.400"}>
                    {userProfile?.birthDate ? new Date(userProfile.birthDate).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Agregar fecha de nacimiento'}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.600">Edad</Text>
                  <Text fontSize="md" color={userProfile?.birthDate ? "blue.600" : "gray.400"} fontWeight="medium">
                    {userProfile?.birthDate ? calculateAge(userProfile.birthDate) : 'Se calcula automáticamente'}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.600">Lugar de Nacimiento</Text>
                  <Text fontSize="md" color={userProfile?.birthPlace ? "gray.800" : "gray.400"}>
                    {userProfile?.birthPlace || 'Agregar lugar de nacimiento'}
                  </Text>
                </Box>
                {userProfile?.createdAt && (
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.600">Miembro desde</Text>
                    <Text fontSize="sm" color="green.600">
                      {userProfile.createdAt?.toDate ? 
                        formatDistanceToNow(userProfile.createdAt.toDate(), { addSuffix: true, locale: es }) :
                        'Recientemente'
                      }
                    </Text>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Barmitzva Info */}
          <Card>
            <CardHeader>
              <HStack>
                <Icon as={FaGraduationCap} color="#F59E0B" />
                <Heading size="md">Barmitzva</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.600">Fecha del Barmitzva</Text>
                  <Text fontSize="md" color={userProfile?.barmitzvaDate ? "gray.800" : "gray.400"}>
                    {userProfile?.barmitzvaDate ? new Date(userProfile.barmitzvaDate).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Agregar fecha del Barmitzva'}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.600">Sinagoga / Ubicación</Text>
                  <Text fontSize="md" color={userProfile?.barmitzvaLocation ? "gray.800" : "gray.400"}>
                    {userProfile?.barmitzvaLocation || 'Agregar ubicación del evento'}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.600">Días restantes</Text>
                  <Text fontSize="lg" fontWeight="bold" color={
                    daysUntilBM === '¡Hoy es el día!' ? 'green.500' : 
                    daysUntilBM === '¡Mañana!' ? 'orange.500' :
                    daysUntilBM === 'Barmitzva realizado' ? 'purple.500' :
                    daysUntilBM ? 'blue.600' : 'gray.400'
                  }>
                    {daysUntilBM || 'Se calcula automáticamente'}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.600">Plan de Estudio</Text>
                  <HStack>
                    <Badge colorScheme={
                      userProfile?.studyPlan === 'alef' ? 'green' :
                      userProfile?.studyPlan === 'bet' ? 'blue' :
                      userProfile?.studyPlan === 'guimel' ? 'purple' : 'gray'
                    } fontSize="sm" px={3} py={1}>
                      Plan {userProfile?.studyPlan?.toUpperCase() || 'ALEF'}
                    </Badge>
                    <Text fontSize="xs" color="gray.500">
                      ({userProfile?.studyPlan === 'alef' ? 'Básico' :
                        userProfile?.studyPlan === 'bet' ? 'Intermedio' :
                        userProfile?.studyPlan === 'guimel' ? 'Avanzado' : 'Básico'})
                    </Text>
                  </HStack>
                </Box>
                {userProfile?.goals && (
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.600">Objetivos</Text>
                    <Text fontSize="sm" color="gray.700" fontStyle="italic">
                      "{userProfile.goals}"
                    </Text>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>


        </SimpleGrid>

        {/* Biography */}
        {userProfile?.bio && (
          <Card>
            <CardHeader>
              <HStack>
                <Icon as={FaHeart} color="#EF4444" />
                <Heading size="md">Sobre mí</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <Text lineHeight="1.6">{userProfile.bio}</Text>
            </CardBody>
          </Card>
        )}

      </VStack>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} size="4xl">
        <ModalOverlay />
        <ModalContent maxH="90vh">
          <ModalHeader>Editar Perfil</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody overflowY="auto">
            <VStack spacing={6}>
              
              {/* Personal Information */}
              <Box w="100%">
                <Heading size="sm" mb={4} color="gray.700">Información Personal</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Nombre completo</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Tu nombre completo"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Fecha de Nacimiento</FormLabel>
                    <Input
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Lugar de Nacimiento</FormLabel>
                    <Input
                      name="birthPlace"
                      value={formData.birthPlace}
                      onChange={handleInputChange}
                      placeholder="Ciudad, País"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Teléfono</FormLabel>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+507 1234-5678"
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Barmitzva Information */}
              <Box w="100%">
                <Heading size="sm" mb={4} color="gray.700">Información del Barmitzva</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Fecha del Barmitzva</FormLabel>
                    <Input
                      name="barmitzvaDate"
                      type="date"
                      value={formData.barmitzvaDate}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Ubicación del Barmitzva</FormLabel>
                    <Input
                      name="barmitzvaLocation"
                      value={formData.barmitzvaLocation}
                      onChange={handleInputChange}
                      placeholder="Sinagoga, Ciudad"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Plan de Estudio</FormLabel>
                    <Select
                      name="studyPlan"
                      value={formData.studyPlan}
                      onChange={handleInputChange}
                    >
                      <option value="alef">Plan Alef</option>
                      <option value="bet">Plan Bet</option>
                      <option value="guimel">Plan Guimel</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Additional Information */}
              <Box w="100%">
                <Heading size="sm" mb={4} color="gray.700">Información Adicional</Heading>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Sobre mí</FormLabel>
                    <Textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Cuéntanos un poco sobre ti..."
                      rows={4}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Metas y Objetivos</FormLabel>
                    <Textarea
                      name="goals"
                      value={formData.goals}
                      onChange={handleInputChange}
                      placeholder="¿Qué esperas lograr con tu preparación?"
                      rows={3}
                    />
                  </FormControl>
                </VStack>
              </Box>

            </VStack>
          </ModalBody>

          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                leftIcon={<Icon as={FaSave} />}
                onClick={handleUpdateProfile}
                isLoading={isUpdating}
              >
                Guardar Cambios
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PerfilPage;