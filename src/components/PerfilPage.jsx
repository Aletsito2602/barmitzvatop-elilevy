import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
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
  Flex,
  Container,
} from '@chakra-ui/react';
import {
  LuUser,
  LuCalendar,
  LuPencil,
  LuSave,
  LuMapPin,
  LuClock,
  LuGraduationCap,
  LuBookOpen,
  LuStar,
  LuAward,
  LuHeart,
  LuMail,
  LuPhone,
  LuCake
} from 'react-icons/lu';
import { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { updateUserProfile, createUserProfile } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const InfoItem = ({ icon, label, value, color = "gray.800", highlight = false }) => (
  <Box py={3} borderBottom="1px solid" borderColor="gray.50" _last={{ borderBottom: "none" }}>
    <HStack spacing={3} align="start">
      <Box p={2} bg={highlight ? "blue.50" : "gray.50"} borderRadius="lg" color={highlight ? "blue.500" : "gray.400"}>
        <Icon as={icon} boxSize={4} />
      </Box>
      <Box flex={1}>
        <Text fontSize="xs" color="gray.400" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" mb={0.5}>
          {label}
        </Text>
        <Text fontSize="md" color={value ? color : "gray.400"} fontWeight={value ? "medium" : "normal"}>
          {value || "Sin especificar"}
        </Text>
      </Box>
    </HStack>
  </Box>
);

const PerfilPage = () => {
  const { user } = useAuth();
  const { userProfile, userProgress, loading, error, refreshUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const toast = useToast();

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
    if (!birthDate) return null;
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

    if (diffDays < 0) return 'Completado';
    if (diffDays === 0) return '¡Hoy!';
    if (diffDays === 1) return '¡Mañana!';
    return `${diffDays} días`;
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="80vh">
        <Spinner size="xl" color="blue.500" thickness="3px" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md" py={8}>
        <Alert status="error" borderRadius="2xl">
          <AlertIcon />
          Error al cargar el perfil: {error}
        </Alert>
      </Container>
    );
  }

  if (!loading && user && !userProfile) {
    return (
      <Container maxW="container.md" py={16}>
        <VStack spacing={8} align="center" justify="center">
          <Box p={6} bg="gray.50" borderRadius="full">
            <Icon as={LuUser} color="gray.300" boxSize={16} />
          </Box>
          <VStack spacing={2}>
            <Heading size="lg" color="gray.600">Perfil no encontrado</Heading>
            <Text color="gray.400" textAlign="center" maxW="md">
              Parece que es tu primera vez aquí. Vamos a crear tu perfil.
            </Text>
          </VStack>
          <Button
            colorScheme="blue"
            size="lg"
            leftIcon={<Icon as={LuUser} />}
            onClick={handleCreateProfile}
            isLoading={isCreatingProfile}
            borderRadius="xl"
          >
            Crear Mi Perfil
          </Button>
        </VStack>
      </Container>
    );
  }

  const daysUntilBM = getDaysUntilBarmitzva(userProfile?.barmitzvaDate);

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">

          {/* Header Card */}
          <Card
            bg="white"
            borderRadius="3xl"
            boxShadow="xl"
            overflow="hidden"
            border="1px solid"
            borderColor="gray.100"
          >
            {/* Top Gradient */}
            <Box h="120px" bgGradient="linear(to-r, blue.500, blue.600)" position="relative">
              <Box
                position="absolute"
                bottom="-50px"
                left={{ base: "50%", md: "40px" }}
                transform={{ base: "translateX(-50%)", md: "none" }}
              >
                <Avatar
                  size="2xl"
                  name={userProfile?.name || 'Usuario'}
                  src={userProfile?.profileImage}
                  bg="blue.400"
                  border="4px solid white"
                  boxShadow="lg"
                />
              </Box>
            </Box>

            <CardBody pt="70px" pb={6} px={{ base: 4, md: 8 }}>
              <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align={{ base: "center", md: "flex-end" }}
                gap={4}
              >
                <VStack align={{ base: "center", md: "start" }} spacing={2}>
                  <Heading size="xl" color="gray.800">
                    {userProfile?.name || 'Usuario'}
                  </Heading>
                  <Text color="gray.500" fontSize="lg">
                    Mi Perfil de Barmitzva
                  </Text>
                  <HStack spacing={2} flexWrap="wrap" justify={{ base: "center", md: "start" }}>
                    <Badge
                      colorScheme="blue"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="bold"
                    >
                      PLAN {userProfile?.studyPlan?.toUpperCase() || 'ALEF'}
                    </Badge>
                    <Badge
                      colorScheme="green"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="bold"
                    >
                      {userProgress?.lessonsCompleted || 0} CLASES COMPLETADAS
                    </Badge>
                  </HStack>
                </VStack>

                <Button
                  leftIcon={<Icon as={LuPencil} />}
                  colorScheme="blue"
                  onClick={() => setIsEditing(true)}
                  borderRadius="xl"
                  size="lg"
                  px={6}
                >
                  Editar Perfil
                </Button>
              </Flex>
            </CardBody>
          </Card>

          {/* Countdown Card */}
          {daysUntilBM && daysUntilBM !== 'Completado' && (
            <Card
              bgGradient="linear(to-r, orange.400, yellow.400)"
              borderRadius="2xl"
              boxShadow="lg"
              overflow="hidden"
            >
              <CardBody py={6}>
                <Flex justify="center" align="center" gap={4}>
                  <Icon as={LuStar} color="white" boxSize={8} />
                  <VStack spacing={0}>
                    <Text fontSize="3xl" fontWeight="800" color="white">
                      {daysUntilBM}
                    </Text>
                    <Text fontSize="sm" color="whiteAlpha.900" fontWeight="medium">
                      para tu Barmitzva
                    </Text>
                  </VStack>
                  <Icon as={LuStar} color="white" boxSize={8} />
                </Flex>
              </CardBody>
            </Card>
          )}

          {/* Main Content Grid */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>

            {/* Personal Info Card */}
            <Card
              bg="white"
              borderRadius="2xl"
              boxShadow="lg"
              border="1px solid"
              borderColor="gray.100"
              overflow="hidden"
            >
              <Box bg="blue.50" px={6} py={4} borderBottom="1px solid" borderColor="blue.100">
                <HStack spacing={3}>
                  <Box p={2} bg="blue.500" borderRadius="lg" color="white">
                    <Icon as={LuUser} boxSize={5} />
                  </Box>
                  <Heading size="md" color="gray.800">Información Personal</Heading>
                </HStack>
              </Box>
              <CardBody p={6}>
                <VStack spacing={0} align="stretch">
                  <InfoItem
                    icon={LuUser}
                    label="Nombre Completo"
                    value={userProfile?.name}
                  />
                  <InfoItem
                    icon={LuMail}
                    label="Correo Electrónico"
                    value={userProfile?.email}
                  />
                  <InfoItem
                    icon={LuPhone}
                    label="Teléfono"
                    value={userProfile?.phone}
                  />
                  <InfoItem
                    icon={LuCake}
                    label="Fecha de Nacimiento"
                    value={userProfile?.birthDate ? new Date(userProfile.birthDate).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }) : null}
                  />
                  <InfoItem
                    icon={LuClock}
                    label="Edad"
                    value={calculateAge(userProfile?.birthDate)}
                    color="blue.600"
                    highlight
                  />
                  <InfoItem
                    icon={LuMapPin}
                    label="Lugar de Nacimiento"
                    value={userProfile?.birthPlace}
                  />
                </VStack>
              </CardBody>
            </Card>

            {/* Barmitzva Info Card */}
            <Card
              bg="white"
              borderRadius="2xl"
              boxShadow="lg"
              border="1px solid"
              borderColor="gray.100"
              overflow="hidden"
            >
              <Box bg="orange.50" px={6} py={4} borderBottom="1px solid" borderColor="orange.100">
                <HStack spacing={3}>
                  <Box p={2} bg="orange.500" borderRadius="lg" color="white">
                    <Icon as={LuGraduationCap} boxSize={5} />
                  </Box>
                  <Heading size="md" color="gray.800">Barmitzva</Heading>
                </HStack>
              </Box>
              <CardBody p={6}>
                <VStack spacing={0} align="stretch">
                  <InfoItem
                    icon={LuCalendar}
                    label="Fecha del Barmitzva"
                    value={userProfile?.barmitzvaDate ? new Date(userProfile.barmitzvaDate).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }) : null}
                  />
                  <InfoItem
                    icon={LuMapPin}
                    label="Sinagoga / Ubicación"
                    value={userProfile?.barmitzvaLocation}
                  />
                  <InfoItem
                    icon={LuClock}
                    label="Días Restantes"
                    value={daysUntilBM}
                    color={
                      daysUntilBM === '¡Hoy!' ? 'green.500' :
                        daysUntilBM === '¡Mañana!' ? 'orange.500' :
                          daysUntilBM === 'Completado' ? 'purple.500' :
                            'blue.600'
                    }
                    highlight
                  />
                  <Box py={4}>
                    <Text fontSize="xs" color="gray.400" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" mb={2}>
                      Plan de Estudio
                    </Text>
                    <HStack>
                      <Badge
                        colorScheme={
                          userProfile?.studyPlan === 'alef' ? 'green' :
                            userProfile?.studyPlan === 'bet' ? 'blue' :
                              userProfile?.studyPlan === 'guimel' ? 'purple' : 'gray'
                        }
                        fontSize="sm"
                        px={4}
                        py={1.5}
                        borderRadius="full"
                      >
                        PLAN {userProfile?.studyPlan?.toUpperCase() || 'ALEF'}
                      </Badge>
                      <Text fontSize="sm" color="gray.500">
                        ({userProfile?.studyPlan === 'alef' ? 'Básico' :
                          userProfile?.studyPlan === 'bet' ? 'Intermedio' :
                            userProfile?.studyPlan === 'guimel' ? 'Avanzado' : 'Básico'})
                      </Text>
                    </HStack>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Biography Card */}
          {userProfile?.bio && (
            <Card
              bg="white"
              borderRadius="2xl"
              boxShadow="lg"
              border="1px solid"
              borderColor="gray.100"
              overflow="hidden"
            >
              <Box bg="red.50" px={6} py={4} borderBottom="1px solid" borderColor="red.100">
                <HStack spacing={3}>
                  <Box p={2} bg="red.500" borderRadius="lg" color="white">
                    <Icon as={LuHeart} boxSize={5} />
                  </Box>
                  <Heading size="md" color="gray.800">Sobre mí</Heading>
                </HStack>
              </Box>
              <CardBody p={6}>
                <Text lineHeight="1.8" color="gray.700">{userProfile.bio}</Text>
              </CardBody>
            </Card>
          )}

        </VStack>
      </Container>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} size="4xl">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="2xl" maxH="90vh" overflow="hidden">
          <ModalHeader bg="blue.500" color="white" py={5}>
            <HStack>
              <Icon as={LuPencil} />
              <Text>Editar Perfil</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />

          <ModalBody overflowY="auto" py={6}>
            <VStack spacing={8}>

              {/* Personal Information */}
              <Box w="100%">
                <Heading size="sm" mb={4} color="gray.600">Información Personal</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Nombre completo</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Tu nombre completo"
                      borderRadius="xl"
                      size="lg"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                      borderRadius="xl"
                      size="lg"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Fecha de Nacimiento</FormLabel>
                    <Input
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      borderRadius="xl"
                      size="lg"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Lugar de Nacimiento</FormLabel>
                    <Input
                      name="birthPlace"
                      value={formData.birthPlace}
                      onChange={handleInputChange}
                      placeholder="Ciudad, País"
                      borderRadius="xl"
                      size="lg"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Teléfono</FormLabel>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+507 1234-5678"
                      borderRadius="xl"
                      size="lg"
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Barmitzva Information */}
              <Box w="100%">
                <Heading size="sm" mb={4} color="gray.600">Información del Barmitzva</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Fecha del Barmitzva</FormLabel>
                    <Input
                      name="barmitzvaDate"
                      type="date"
                      value={formData.barmitzvaDate}
                      onChange={handleInputChange}
                      borderRadius="xl"
                      size="lg"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Ubicación del Barmitzva</FormLabel>
                    <Input
                      name="barmitzvaLocation"
                      value={formData.barmitzvaLocation}
                      onChange={handleInputChange}
                      placeholder="Sinagoga, Ciudad"
                      borderRadius="xl"
                      size="lg"
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Additional Information */}
              <Box w="100%">
                <Heading size="sm" mb={4} color="gray.600">Información Adicional</Heading>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Sobre mí</FormLabel>
                    <Textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Cuéntanos un poco sobre ti..."
                      rows={4}
                      borderRadius="xl"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Metas y Objetivos</FormLabel>
                    <Textarea
                      name="goals"
                      value={formData.goals}
                      onChange={handleInputChange}
                      placeholder="¿Qué esperas lograr con tu preparación?"
                      rows={3}
                      borderRadius="xl"
                    />
                  </FormControl>
                </VStack>
              </Box>

            </VStack>
          </ModalBody>

          <ModalFooter borderTop="1px solid" borderColor="gray.100" bg="gray.50">
            <HStack spacing={3}>
              <Button
                variant="ghost"
                onClick={() => setIsEditing(false)}
                borderRadius="xl"
              >
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                leftIcon={<Icon as={LuSave} />}
                onClick={handleUpdateProfile}
                isLoading={isUpdating}
                borderRadius="xl"
                px={6}
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