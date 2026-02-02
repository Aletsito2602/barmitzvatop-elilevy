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
  Badge,
  Icon,
  Button,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Alert,
  AlertIcon,
  Flex,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Avatar,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FaUsers, FaTrash, FaDownload, FaEye, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaBuilding, FaUser, FaPlus, FaVideo, FaGraduationCap, FaBookOpen, FaStar, FaSearch, FaEdit } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { createClass, getAllClasses, deleteClass, initializeSampleClasses } from '../services/classesService';
import { testDatabaseConnection, initializeDatabaseCollections } from '../services/debugService';
import { useClasses } from '../hooks/useClasses';
import {
  calculateParashaFromDate,
  assignParashaToRequest,
  getAllParashaRequests,
  deleteParashaRequest,
  getAllUsersWithParasha,
  assignParashaToUser,
  removeParashaFromUser,
  PARASHAT_CATALOG
} from '../services/parashaService';
import { updateUserProfile } from '../services/userService';

const CRMPage = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const { classes, loading: classesLoading, refreshClasses } = useClasses();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const { isOpen: isAssignOpen, onOpen: onAssignOpen, onClose: onAssignClose } = useDisclosure();
  const { isOpen: isUserParashaOpen, onOpen: onUserParashaOpen, onClose: onUserParashaClose } = useDisclosure();
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [isAssigningParasha, setIsAssigningParasha] = useState(false);
  const [parashaForm, setParashaForm] = useState({ name: '', hebrew: '', reference: '', meaning: '', videoUrl: '', eventDate: '' });
  const [classForm, setClassForm] = useState({
    title: '',
    classNumber: '',
    youtubeLink: '',
    videoType: 'youtube',
    description: '',
    duration: '',
    difficulty: 'basico',
    category: 'alef'
  });

  // Estados para Gestión de Parashot Personales
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [parashaFilter, setParashaFilter] = useState('all'); // 'all', 'with', 'without'
  const [selectedCatalogParasha, setSelectedCatalogParasha] = useState('');
  const [isAssigningUserParasha, setIsAssigningUserParasha] = useState(false);

  const toast = useToast();

  // Cargar solicitudes desde Supabase
  const loadSolicitudes = async () => {
    try {
      const result = await getAllParashaRequests();
      if (result.success) {
        setSolicitudes(result.data);
      } else {
        toast({
          title: "Error cargando solicitudes",
          description: result.error,
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Cargar todos los usuarios con sus parashot
  const loadAllUsers = async () => {
    setUsersLoading(true);
    try {
      const result = await getAllUsersWithParasha();
      if (result.success) {
        setAllUsers(result.data);
      } else {
        toast({
          title: "Error cargando usuarios",
          description: result.error,
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    loadSolicitudes();
    loadAllUsers();
  }, []);

  // Filtrar usuarios según búsqueda y filtro de parashá
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = userSearchTerm === '' ||
      user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearchTerm.toLowerCase());

    const matchesFilter = parashaFilter === 'all' ||
      (parashaFilter === 'with' && user.hasParasha) ||
      (parashaFilter === 'without' && !user.hasParasha);

    return matchesSearch && matchesFilter;
  });

  // Abrir modal para asignar parashá a usuario
  const abrirModalParashaUsuario = (user) => {
    setSelectedUser(user);
    setSelectedCatalogParasha('');
    if (user.personalParasha) {
      setParashaForm({
        name: user.personalParasha.name || '',
        hebrew: user.personalParasha.hebrew || '',
        reference: user.personalParasha.reference || '',
        meaning: user.personalParasha.meaning || '',
        videoUrl: user.personalParasha.videoUrl || '',
        eventDate: user.personalParasha.eventDate || ''
      });
    } else {
      setParashaForm({ name: '', hebrew: '', reference: '', meaning: '', videoUrl: '', eventDate: '' });
    }
    onUserParashaOpen();
  };

  // Seleccionar parashá del catálogo
  const handleSelectCatalogParasha = (index) => {
    if (index === '') {
      setSelectedCatalogParasha('');
      return;
    }
    const parasha = PARASHAT_CATALOG[parseInt(index)];
    setSelectedCatalogParasha(index);
    setParashaForm({
      ...parashaForm,
      name: parasha.name,
      hebrew: parasha.hebrew,
      reference: parasha.reference
    });
  };

  // Asignar parashá a usuario
  const asignarParashaAUsuario = async () => {
    if (!parashaForm.name || !parashaForm.hebrew) {
      toast({
        title: "Campos requeridos",
        description: "Completa al menos el nombre y texto hebreo",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setIsAssigningUserParasha(true);

    try {
      const parashaData = {
        name: parashaForm.name,
        hebrew: parashaForm.hebrew,
        reference: parashaForm.reference || '',
        meaning: parashaForm.meaning || '',
        videoUrl: parashaForm.videoUrl || '',
        eventDate: parashaForm.eventDate || ''
      };

      const result = await assignParashaToUser(selectedUser.id, parashaData);

      if (!result.success) throw new Error(result.error);

      toast({
        title: "¡Parashá asignada!",
        description: `Se ha asignado ${parashaData.name} a ${selectedUser.name || selectedUser.email}`,
        status: "success",
        duration: 5000,
      });

      loadAllUsers();
      onUserParashaClose();

    } catch (error) {
      console.error('Error assigning parasha to user:', error);
      toast({
        title: "Error al asignar",
        description: error.message || "Error desconocido",
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsAssigningUserParasha(false);
    }
  };

  // Eliminar parashá de usuario
  const eliminarParashaDeUsuario = async (userId, userName) => {
    if (window.confirm(`¿Estás seguro de eliminar la parashá de ${userName}?`)) {
      try {
        const result = await removeParashaFromUser(userId);
        if (result.success) {
          toast({
            title: "Parashá eliminada",
            description: `Se ha eliminado la parashá de ${userName}`,
            status: "success",
            duration: 3000,
          });
          loadAllUsers();
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        toast({
          title: "Error al eliminar",
          description: error.message,
          status: "error",
          duration: 3000,
        });
      }
    }
  };

  // Eliminar una solicitud específica
  const eliminarSolicitud = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta solicitud?')) {
      const result = await deleteParashaRequest(id);
      if (result.success) {
        setSolicitudes(prev => prev.filter(s => s.id !== id));
        toast({
          title: "Solicitud eliminada",
          status: "success",
          duration: 3000,
        });
      } else {
        toast({
          title: "Error al eliminar",
          description: result.error,
          status: "error",
          duration: 3000,
        });
      }
    }
  };

  // Limpiar todas las solicitudes (deshabilitado en DB real por seguridad o implementar loop delete)
  const limpiarTodas = () => {
    // Implementación pendiente o deshabilitada para evitar borrado masivo accidental en producción
    toast({
      title: "Función restringida",
      description: "El borrado masivo está deshabilitado por seguridad en base de datos.",
      status: "info",
      duration: 3000,
    });
  };

  // Exportar datos (simulado)
  const exportarDatos = () => {
    const dataStr = JSON.stringify(solicitudes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `parasha-requests-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Datos exportados",
      description: "Las solicitudes han sido descargadas como archivo JSON",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Ver detalles de solicitud
  const verDetalles = (solicitud) => {
    setSelectedSolicitud(solicitud);
    onDetailOpen();
  };

  // Abrir modal para asignar Parashá
  const abrirModalAsignar = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setParashaForm({ name: '', hebrew: '', reference: '', meaning: '' });
    onAssignOpen();
  };

  // Asignar Parashá manualmente
  const asignarParashaManual = async () => {
    if (!parashaForm.name || !parashaForm.hebrew) {
      toast({
        title: "Campos requeridos",
        description: "Completa nombre y texto hebreo",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setIsAssigningParasha(true);

    try {
      const parashaData = {
        name: parashaForm.name,
        hebrew: parashaForm.hebrew,
        reference: parashaForm.reference || 'Manual',
        meaning: parashaForm.meaning || 'Asignación manual'
      };

      // 1. Actualizar la solicitud en DB
      const assignResult = await assignParashaToRequest(selectedSolicitud.id, parashaData);

      if (!assignResult.success) throw new Error(assignResult.error);

      // 2. Actualizar el perfil del usuario con la Parashá (para que la vea en Dashboard)
      if (selectedSolicitud.userId) {
        await updateUserProfile(selectedSolicitud.userId, {
          personalParasha: parashaData,
          parashaAssignedAt: new Date().toISOString()
        });
      }

      toast({
        title: "¡Parashá asignada!",
        description: `Se ha asignado ${parashaData.name} a ${selectedSolicitud.nombre}`,
        status: "success",
        duration: 5000,
      });

      // Recargar lista
      loadSolicitudes();
      onAssignClose();

    } catch (error) {
      console.error('Error assigning parasha:', error);
      toast({
        title: "Error al asignar",
        description: error.message || "Error desconocido",
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsAssigningParasha(false);
    }
  };

  return (
    <Box w="100%" maxW="95vw" mx="auto" py={8} px={{ base: 4, md: 6, lg: 8 }}>
      <VStack spacing={8} align="stretch">

        {/* Header */}
        <Flex align="center" justify="space-between" flexWrap="wrap" gap={4}>
          <Box>
            <Heading size="xl" color="gray.800" mb={2}>
              Panel de Administración
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Gestión de solicitudes y clases del curso
            </Text>
          </Box>

          <HStack spacing={3}>
            <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
              {solicitudes.length} solicitudes
            </Badge>
            {solicitudes.length > 0 && (
              <>
                <Button
                  leftIcon={<Icon as={FaDownload} />}
                  colorScheme="green"
                  variant="outline"
                  onClick={exportarDatos}
                  size="sm"
                >
                  Exportar
                </Button>
                <Button
                  leftIcon={<Icon as={FaTrash} />}
                  colorScheme="red"
                  variant="outline"
                  onClick={limpiarTodas}
                  size="sm"
                >
                  Limpiar todo
                </Button>
              </>
            )}
          </HStack>
        </Flex>

        {/* Tabs for different sections */}
        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab _hover={{ bg: "blue.50", color: "blue.600" }}>
              <Icon as={FaStar} mr={2} />
              Parashot Personales
            </Tab>
            <Tab _hover={{ bg: "blue.50", color: "blue.600" }}>
              <Icon as={FaUser} mr={2} />
              Solicitudes Parashá
            </Tab>
            <Tab _hover={{ bg: "blue.50", color: "blue.600" }}>
              <Icon as={FaGraduationCap} mr={2} />
              Gestión de Clases
            </Tab>
          </TabList>

          <TabPanels>
            {/* NUEVA PESTAÑA: Gestión de Parashot Personales */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                {/* Header y filtros */}
                <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                  <Box>
                    <Heading size="lg" color="gray.800">
                      Parashot Personales
                    </Heading>
                    <Text color="gray.600">
                      Asigna y gestiona las parashot de cada usuario
                    </Text>
                  </Box>
                  <HStack spacing={3}>
                    <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                      {allUsers.filter(u => u.hasParasha).length} con parashá
                    </Badge>
                    <Badge colorScheme="orange" fontSize="md" px={3} py={1}>
                      {allUsers.filter(u => !u.hasParasha).length} sin parashá
                    </Badge>
                  </HStack>
                </Flex>

                {/* Filtros y búsqueda */}
                <HStack spacing={4} flexWrap="wrap">
                  <InputGroup maxW="300px">
                    <InputLeftElement>
                      <Icon as={FaSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Buscar por nombre o email..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                  <Select
                    value={parashaFilter}
                    onChange={(e) => setParashaFilter(e.target.value)}
                    maxW="200px"
                  >
                    <option value="all">Todos los usuarios</option>
                    <option value="with">Con parashá</option>
                    <option value="without">Sin parashá</option>
                  </Select>
                </HStack>

                {/* Lista de usuarios */}
                {usersLoading ? (
                  <Card>
                    <CardBody>
                      <VStack spacing={4} py={12}>
                        <Text color="gray.500">Cargando usuarios...</Text>
                      </VStack>
                    </CardBody>
                  </Card>
                ) : filteredUsers.length === 0 ? (
                  <Card>
                    <CardBody>
                      <VStack spacing={4} py={12}>
                        <Icon as={FaUsers} color="gray.300" boxSize={16} />
                        <Heading size="md" color="gray.500">No se encontraron usuarios</Heading>
                        <Text color="gray.400" textAlign="center">
                          Intenta cambiar los filtros de búsqueda
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <Heading size="md">Usuarios ({filteredUsers.length})</Heading>
                    </CardHeader>
                    <CardBody>
                      <TableContainer>
                        <Table variant="simple" size="sm">
                          <Thead>
                            <Tr>
                              <Th>Usuario</Th>
                              <Th>Email</Th>
                              <Th>Parashá Asignada</Th>
                              <Th>Plan</Th>
                              <Th>Acciones</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {filteredUsers.map((user) => (
                              <Tr key={user.id}>
                                <Td>
                                  <HStack>
                                    <Avatar size="sm" name={user.name || user.email} src={user.avatar} />
                                    <Text fontWeight="medium">{user.name || 'Sin nombre'}</Text>
                                  </HStack>
                                </Td>
                                <Td>
                                  <Text fontSize="sm" color="gray.600">{user.email}</Text>
                                </Td>
                                <Td>
                                  {user.personalParasha ? (
                                    <VStack align="start" spacing={0}>
                                      <HStack>
                                        <Badge colorScheme="green" fontSize="xs">Asignada</Badge>
                                        <Text fontWeight="bold" color="blue.600">
                                          {user.personalParasha.name}
                                        </Text>
                                      </HStack>
                                      <Text fontSize="xs" color="gray.500">
                                        {user.personalParasha.hebrew}
                                      </Text>
                                    </VStack>
                                  ) : (
                                    <Badge colorScheme="orange" fontSize="xs">Sin parashá</Badge>
                                  )}
                                </Td>
                                <Td>
                                  <Badge
                                    colorScheme={user.studyPlan === 'dalet' ? 'purple' : user.studyPlan === 'guimel' ? 'blue' : user.studyPlan === 'bet' ? 'green' : 'gray'}
                                    fontSize="xs"
                                  >
                                    {user.studyPlan?.toUpperCase() || 'ALEF'}
                                  </Badge>
                                </Td>
                                <Td>
                                  <HStack spacing={2}>
                                    <Button
                                      size="xs"
                                      colorScheme={user.hasParasha ? "blue" : "green"}
                                      leftIcon={<Icon as={user.hasParasha ? FaEdit : FaBookOpen} />}
                                      onClick={() => abrirModalParashaUsuario(user)}
                                    >
                                      {user.hasParasha ? 'Editar' : 'Asignar'}
                                    </Button>
                                    {user.hasParasha && (
                                      <Button
                                        size="xs"
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => eliminarParashaDeUsuario(user.id, user.name || user.email)}
                                        title="Eliminar parashá"
                                      >
                                        <Icon as={FaTrash} />
                                      </Button>
                                    )}
                                  </HStack>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </CardBody>
                  </Card>
                )}
              </VStack>
            </TabPanel>

            {/* Solicitudes Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                {/* Estadísticas */}
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                  <Card>
                    <CardBody>
                      <HStack>
                        <Icon as={FaUsers} color="#F59E0B" boxSize={8} />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                            {solicitudes.length}
                          </Text>
                          <Text fontSize="sm" color="gray.600">Total Solicitudes</Text>
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody>
                      <HStack>
                        <Icon as={FaCalendarAlt} color="#10B981" boxSize={8} />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                            {solicitudes.filter(s => new Date(s.fechaCreacion).toDateString() === new Date().toDateString()).length}
                          </Text>
                          <Text fontSize="sm" color="gray.600">Hoy</Text>
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody>
                      <HStack>
                        <Icon as={FaClock} color="#8B5CF6" boxSize={8} />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                            {solicitudes.filter(s => {
                              const fechaSolicitud = new Date(s.fechaCreacion);
                              const hace7Dias = new Date();
                              hace7Dias.setDate(hace7Dias.getDate() - 7);
                              return fechaSolicitud >= hace7Dias;
                            }).length}
                          </Text>
                          <Text fontSize="sm" color="gray.600">Últimos 7 días</Text>
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody>
                      <HStack>
                        <Icon as={FaEye} color="#EF4444" boxSize={8} />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                            {solicitudes.length > 0 ? solicitudes.reduce((total, s) => total + s.nombre.length, 0) / solicitudes.length : 0}
                          </Text>
                          <Text fontSize="sm" color="gray.600">Promedio caracteres</Text>
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Contenido principal */}
                {solicitudes.length === 0 ? (
                  <Card>
                    <CardBody>
                      <VStack spacing={4} py={12}>
                        <Icon as={FaUsers} color="gray.300" boxSize={16} />
                        <Heading size="md" color="gray.500">No hay solicitudes aún</Heading>
                        <Text color="gray.400" textAlign="center">
                          Las solicitudes de parashá aparecerán aquí cuando los usuarios completen el formulario
                        </Text>
                        <Alert status="info" borderRadius="md" maxW="md">
                          <AlertIcon />
                          <Text fontSize="sm">
                            Ve a la sección "Herramientas" para probar el formulario
                          </Text>
                        </Alert>
                      </VStack>
                    </CardBody>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <Heading size="md">Solicitudes registradas</Heading>
                    </CardHeader>
                    <CardBody>
                      <TableContainer>
                        <Table variant="simple" size="sm">
                          <Thead>
                            <Tr>
                              <Th>Nombre</Th>
                              <Th>Fecha Nacimiento</Th>
                              <Th>Hora</Th>
                              <Th>Lugar Nacimiento</Th>
                              <Th>Ubicación Barmitzva</Th>
                              <Th>Fecha Solicitud</Th>
                              <Th>Acciones</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {solicitudes.map((solicitud) => (
                              <Tr key={solicitud.id}>
                                <Td>
                                  <HStack>
                                    <Icon as={FaUser} color="#F59E0B" boxSize={4} />
                                    <Text fontWeight="medium">{solicitud.nombre}</Text>
                                  </HStack>
                                </Td>
                                <Td>
                                  <HStack>
                                    <Icon as={FaCalendarAlt} color="#10B981" boxSize={4} />
                                    <Text>{new Date(solicitud.fechaNacimiento).toLocaleDateString('es-ES')}</Text>
                                  </HStack>
                                </Td>
                                <Td>
                                  <HStack>
                                    <Icon as={FaClock} color="#8B5CF6" boxSize={4} />
                                    <Text>{solicitud.horaNacimiento}</Text>
                                  </HStack>
                                </Td>
                                <Td>
                                  <HStack>
                                    <Icon as={FaMapMarkerAlt} color="#EF4444" boxSize={4} />
                                    <Text>{solicitud.lugarNacimiento}</Text>
                                  </HStack>
                                </Td>
                                <Td>
                                  <HStack>
                                    <Icon as={FaBuilding} color="#06B6D4" boxSize={4} />
                                    <Text>{solicitud.ubicacionBarmitzva}</Text>
                                  </HStack>
                                </Td>
                                <Td>
                                  {solicitud.createdAt && new Date(solicitud.createdAt).toLocaleDateString('es-ES')}
                                </Td>
                                <Td>
                                  <HStack spacing={2}>
                                    <Button
                                      size="xs"
                                      colorScheme="blue"
                                      variant="ghost"
                                      onClick={() => verDetalles(solicitud)}
                                      title="Ver detalles"
                                    >
                                      <Icon as={FaEye} />
                                    </Button>
                                    <Button
                                      size="xs"
                                      colorScheme="green"
                                      variant="ghost"
                                      onClick={() => abrirModalAsignar(solicitud)}
                                      title="Asignar Parashá"
                                    >
                                      <Icon as={FaBookOpen} />
                                    </Button>
                                    <Button
                                      size="xs"
                                      colorScheme="red"
                                      variant="ghost"
                                      onClick={() => eliminarSolicitud(solicitud.id)}
                                      title="Eliminar"
                                    >
                                      <Icon as={FaTrash} />
                                    </Button>
                                  </HStack>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </CardBody>
                  </Card>
                )}
              </VStack>
            </TabPanel>

            {/* Classes Management Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                {/* Classes Header */}
                <Flex justify="space-between" align="center">
                  <Box>
                    <Heading size="lg" color="gray.800">
                      Gestión de Clases
                    </Heading>
                    <Text color="gray.600">
                      Administra las clases del curso Barmitzva
                    </Text>
                  </Box>
                  <HStack spacing={3} flexWrap="wrap">
                    <Button
                      colorScheme="orange"
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        const result = await testDatabaseConnection();
                        toast({
                          title: result.success ? 'Conexión exitosa' : 'Error de conexión',
                          description: result.success ? result.message : result.error,
                          status: result.success ? 'success' : 'error',
                          duration: 5000,
                        });
                      }}
                    >
                      🔧 Test Supabase
                    </Button>

                    {classes.length === 0 && (
                      <>
                        <Button
                          colorScheme="purple"
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const result = await initializeDatabaseCollections();
                            if (result.success) {
                              refreshClasses();
                              toast({
                                title: 'Inicialización completa',
                                description: 'Se ha configurado Firebase correctamente',
                                status: 'success',
                                duration: 3000,
                              });
                            } else {
                              toast({
                                title: 'Error de inicialización',
                                description: result.error,
                                status: 'error',
                                duration: 5000,
                              });
                            }
                          }}
                        >
                          🚀 Inicializar Firebase
                        </Button>
                        <Button
                          leftIcon={<Icon as={FaGraduationCap} />}
                          colorScheme="green"
                          variant="outline"
                          onClick={async () => {
                            const result = await initializeSampleClasses();
                            if (result.success) {
                              refreshClasses();
                              toast({
                                title: 'Clases de muestra creadas',
                                description: 'Se han añadido 5 clases de ejemplo al sistema',
                                status: 'success',
                                duration: 3000,
                              });
                            }
                          }}
                        >
                          Crear Clases de Muestra
                        </Button>
                      </>
                    )}
                    <Button
                      leftIcon={<Icon as={FaPlus} />}
                      colorScheme="blue"
                      onClick={onOpen}
                    >
                      Añadir Clase
                    </Button>
                  </HStack>
                </Flex>

                {/* Classes Stats */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                  <Card>
                    <CardBody>
                      <HStack>
                        <Icon as={FaGraduationCap} color="#3B82F6" boxSize={8} />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                            {classes.length}
                          </Text>
                          <Text fontSize="sm" color="gray.600">Total Clases</Text>
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody>
                      <HStack>
                        <Icon as={FaVideo} color="#10B981" boxSize={8} />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                            {classes.filter(c => c.youtubeLink).length}
                          </Text>
                          <Text fontSize="sm" color="gray.600">Con Video</Text>
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody>
                      <HStack>
                        <Icon as={FaClock} color="#8B5CF6" boxSize={8} />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                            {classes.reduce((total, c) => total + (parseInt(c.duration) || 0), 0)}m
                          </Text>
                          <Text fontSize="sm" color="gray.600">Duración Total</Text>
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Classes List */}
                {classesLoading ? (
                  <Card>
                    <CardBody>
                      <VStack spacing={4} py={12}>
                        <Text color="gray.500">Cargando clases...</Text>
                      </VStack>
                    </CardBody>
                  </Card>
                ) : classes.length === 0 ? (
                  <Card>
                    <CardBody>
                      <VStack spacing={4} py={12}>
                        <Icon as={FaGraduationCap} color="gray.300" boxSize={16} />
                        <Heading size="md" color="gray.500">No hay clases aún</Heading>
                        <Text color="gray.400" textAlign="center">
                          Comienza agregando tu primera clase al curso
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <Heading size="md">Clases del Curso</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        {classes.map((clase) => (
                          <Card key={clase.id} variant="outline">
                            <CardBody>
                              <HStack spacing={4} align="start">
                                <Badge
                                  colorScheme="blue"
                                  fontSize="md"
                                  px={3}
                                  py={1}
                                  borderRadius="full"
                                >
                                  Clase {clase.classNumber}
                                </Badge>
                                <VStack align="start" spacing={2} flex={1}>
                                  <Heading size="sm" color="gray.800">
                                    {clase.title}
                                  </Heading>
                                  {clase.description && (
                                    <Text fontSize="sm" color="gray.600" noOfLines={2}>
                                      {clase.description}
                                    </Text>
                                  )}
                                  <HStack spacing={4}>
                                    <HStack spacing={1}>
                                      <Icon as={FaClock} color="gray.500" boxSize={3} />
                                      <Text fontSize="xs" color="gray.500">
                                        {clase.duration}min
                                      </Text>
                                    </HStack>
                                    <Badge
                                      size="sm"
                                      colorScheme={
                                        (clase.difficulty === 'beginner' || clase.difficulty === 'basico') ? 'green' :
                                          (clase.difficulty === 'intermediate' || clase.difficulty === 'intermedio') ? 'yellow' : 'red'
                                      }
                                    >
                                      {clase.difficulty === 'beginner' ? 'Básico' :
                                        clase.difficulty === 'intermediate' ? 'Intermedio' :
                                          clase.difficulty === 'advanced' ? 'Avanzado' :
                                            clase.difficulty === 'basico' ? 'Básico' :
                                              clase.difficulty === 'intermedio' ? 'Intermedio' :
                                                clase.difficulty === 'avanzado' ? 'Avanzado' : 'Básico'}
                                    </Badge>
                                    {clase.youtubeLink && (
                                      <HStack spacing={1}>
                                        <Icon as={FaVideo} color={
                                          clase.videoType === 'youtube' ? 'red.500' :
                                            clase.videoType === 'vimeo' ? 'blue.500' : 'green.500'
                                        } boxSize={3} />
                                        <Text fontSize="xs" color="gray.500">
                                          {clase.videoType === 'youtube' ? 'YouTube' :
                                            clase.videoType === 'vimeo' ? 'Vimeo' : 'Personalizado'}
                                        </Text>
                                      </HStack>
                                    )}
                                  </HStack>
                                </VStack>
                                <Button
                                  size="sm"
                                  colorScheme="red"
                                  variant="ghost"
                                  onClick={async () => {
                                    const result = await deleteClass(clase.id);
                                    if (result.success) {
                                      refreshClasses();
                                      toast({
                                        title: 'Clase eliminada',
                                        status: 'success',
                                        duration: 3000,
                                      });
                                    }
                                  }}
                                >
                                  <Icon as={FaTrash} />
                                </Button>
                              </HStack>
                            </CardBody>
                          </Card>
                        ))}
                      </VStack>
                    </CardBody>
                  </Card>
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>

      </VStack>

      {/* Add Class Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Añadir Nueva Clase</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Título de la Clase</FormLabel>
                <Input
                  value={classForm.title}
                  onChange={(e) => setClassForm({ ...classForm, title: e.target.value })}
                  placeholder="Ej: Introducción a los Taamim"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Número de Clase</FormLabel>
                <Input
                  type="number"
                  value={classForm.classNumber}
                  onChange={(e) => setClassForm({ ...classForm, classNumber: e.target.value })}
                  placeholder="Ej: 1"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Tipo de Video</FormLabel>
                <Select
                  value={classForm.videoType || 'youtube'}
                  onChange={(e) => setClassForm({ ...classForm, videoType: e.target.value })}
                  mb={3}
                >
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="personalizado">Personalizado</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>
                  {classForm.videoType === 'youtube' ? 'Link de YouTube' :
                    classForm.videoType === 'vimeo' ? 'Link de Vimeo' :
                      'Link de Video Personalizado'}
                </FormLabel>
                <Input
                  value={classForm.youtubeLink}
                  onChange={(e) => setClassForm({ ...classForm, youtubeLink: e.target.value })}
                  placeholder={
                    classForm.videoType === 'youtube' ? 'https://www.youtube.com/watch?v=...' :
                      classForm.videoType === 'vimeo' ? 'https://vimeo.com/...' :
                        'https://ejemplo.com/video.mp4'
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel>Descripción</FormLabel>
                <Textarea
                  value={classForm.description}
                  onChange={(e) => setClassForm({ ...classForm, description: e.target.value })}
                  placeholder="Descripción de la clase..."
                  rows={3}
                />
              </FormControl>

              <HStack spacing={4} w="full">
                <FormControl>
                  <FormLabel>Duración (minutos)</FormLabel>
                  <Input
                    type="number"
                    value={classForm.duration}
                    onChange={(e) => setClassForm({ ...classForm, duration: e.target.value })}
                    placeholder="30"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Dificultad</FormLabel>
                  <Select
                    value={classForm.difficulty}
                    onChange={(e) => setClassForm({ ...classForm, difficulty: e.target.value })}
                  >
                    <option value="basico">Básico</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </Select>
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Categoría</FormLabel>
                <Select
                  value={classForm.category}
                  onChange={(e) => setClassForm({ ...classForm, category: e.target.value })}
                >
                  <option value="alef">Alef</option>
                  <option value="bet">Bet</option>
                  <option value="guimel">Guimel</option>
                  <option value="dalet">Dalet</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              isLoading={isCreatingClass}
              onClick={async () => {
                if (!classForm.title || !classForm.classNumber || !classForm.youtubeLink) {
                  toast({
                    title: 'Error',
                    description: 'Por favor completa todos los campos requeridos',
                    status: 'error',
                    duration: 3000,
                  });
                  return;
                }

                setIsCreatingClass(true);
                const result = await createClass(classForm);

                if (result.success) {
                  toast({
                    title: 'Clase creada',
                    description: 'La clase se ha añadido exitosamente',
                    status: 'success',
                    duration: 3000,
                  });

                  // Reset form
                  setClassForm({
                    title: '',
                    classNumber: '',
                    youtubeLink: '',
                    videoType: 'youtube',
                    description: '',
                    duration: '',
                    difficulty: 'basico',
                    category: 'alef'
                  });

                  refreshClasses();
                  onClose();
                } else {
                  toast({
                    title: 'Error',
                    description: result.error,
                    status: 'error',
                    duration: 3000,
                  });
                }

                setIsCreatingClass(false);
              }}
            >
              Crear Clase
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={isDetailOpen} onClose={onDetailClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack spacing={3}>
              <Icon as={FaEye} color="#3B82F6" />
              <Text>Detalles de la Solicitud</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedSolicitud && (
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text fontWeight="bold" color="gray.600" fontSize="sm">Nombre Completo</Text>
                    <Text fontSize="lg" fontWeight="medium">{selectedSolicitud.nombre}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color="gray.600" fontSize="sm">Estado</Text>
                    <Badge
                      colorScheme={
                        selectedSolicitud.status === 'completada' ? 'green' :
                          selectedSolicitud.status === 'procesando' ? 'blue' :
                            selectedSolicitud.status === 'pendiente' ? 'yellow' : 'red'
                      }
                      fontSize="sm"
                      px={3}
                      py={1}
                    >
                      {selectedSolicitud.status === 'completada' ? 'Completada' :
                        selectedSolicitud.status === 'procesando' ? 'Procesando' :
                          selectedSolicitud.status === 'pendiente' ? 'Pendiente' : 'Rechazada'}
                    </Badge>
                  </Box>
                </SimpleGrid>

                <Divider />

                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontWeight="bold" color="gray.600" fontSize="sm" mb={2}>
                      <Icon as={FaCalendarAlt} mr={2} />
                      Información de Nacimiento
                    </Text>
                    <SimpleGrid columns={2} spacing={3}>
                      <Box>
                        <Text fontSize="sm" color="gray.500">Fecha</Text>
                        <Text>{new Date(selectedSolicitud.fechaNacimiento).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500">Hora</Text>
                        <Text>{selectedSolicitud.horaNacimiento}</Text>
                      </Box>
                    </SimpleGrid>
                    <Box mt={3}>
                      <Text fontSize="sm" color="gray.500">Lugar</Text>
                      <Text>{selectedSolicitud.lugarNacimiento}</Text>
                    </Box>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" color="gray.600" fontSize="sm" mb={2}>
                      <Icon as={FaBuilding} mr={2} />
                      Ubicación del Barmitzva
                    </Text>
                    <Text>{selectedSolicitud.ubicacionBarmitzva}</Text>
                  </Box>

                  {selectedSolicitud.parashaAsignada && (
                    <Box>
                      <Text fontWeight="bold" color="gray.600" fontSize="sm" mb={2}>
                        <Icon as={FaBookOpen} mr={2} />
                        Parashá Asignada
                      </Text>
                      <Card bg="green.50" border="1px solid" borderColor="green.200">
                        <CardBody>
                          <VStack align="start" spacing={2}>
                            <Text fontSize="lg" fontWeight="bold" color="green.800">
                              {selectedSolicitud.parashaAsignada.name}
                            </Text>
                            <Text fontSize="md" color="green.700">
                              {selectedSolicitud.parashaAsignada.hebrew}
                            </Text>
                            <Text fontSize="sm" color="green.600">
                              {selectedSolicitud.parashaAsignada.reference}
                            </Text>
                            <Text fontSize="sm" color="green.600" fontStyle="italic">
                              "{selectedSolicitud.parashaAsignada.meaning}"
                            </Text>
                          </VStack>
                        </CardBody>
                      </Card>
                    </Box>
                  )}

                  <Box>
                    <Text fontWeight="bold" color="gray.600" fontSize="sm" mb={2}>
                      <Icon as={FaClock} mr={2} />
                      Fechas Importantes
                    </Text>
                    <SimpleGrid columns={1} spacing={2}>
                      <Box>
                        <Text fontSize="sm" color="gray.500">Solicitud enviada</Text>
                        <Text fontSize="sm">{selectedSolicitud.fechaCreacionFormatted || 'No disponible'}</Text>
                      </Box>
                      {selectedSolicitud.completedAt && (
                        <Box>
                          <Text fontSize="sm" color="gray.500">Completada</Text>
                          <Text fontSize="sm">{new Date(selectedSolicitud.completedAt).toLocaleDateString('es-ES')}</Text>
                        </Box>
                      )}
                    </SimpleGrid>
                  </Box>
                </VStack>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            {selectedSolicitud && !selectedSolicitud.parashaAsignada && (
              <Button
                colorScheme="green"
                mr={3}
                leftIcon={<Icon as={FaBookOpen} />}
                onClick={() => {
                  abrirModalAsignar(selectedSolicitud);
                  onDetailClose();
                }}
              >
                Asignar Parashá
              </Button>
            )}
            <Button variant="ghost" onClick={onDetailClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal para Asignar Parashá */}
      <Modal isOpen={isAssignOpen} onClose={onAssignClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack spacing={3}>
              <Icon as={FaBookOpen} color="#10B981" />
              <Text>Asignar Parashá a {selectedSolicitud?.nombre}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nombre de la Parashá</FormLabel>
                <Input
                  value={parashaForm.name}
                  onChange={(e) => setParashaForm({ ...parashaForm, name: e.target.value })}
                  placeholder="Ej: Bereshit"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Texto en Hebreo</FormLabel>
                <Input
                  value={parashaForm.hebrew}
                  onChange={(e) => setParashaForm({ ...parashaForm, hebrew: e.target.value })}
                  placeholder="Ej: בראשית"
                  dir="rtl"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Referencia</FormLabel>
                <Input
                  value={parashaForm.reference}
                  onChange={(e) => setParashaForm({ ...parashaForm, reference: e.target.value })}
                  placeholder="Ej: Génesis 1:1-6:8"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Significado</FormLabel>
                <Textarea
                  value={parashaForm.meaning}
                  onChange={(e) => setParashaForm({ ...parashaForm, meaning: e.target.value })}
                  placeholder="Descripción del significado de la Parashá"
                  rows={3}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={asignarParashaManual}
              isLoading={isAssigningParasha}
            >
              Asignar Parashá
            </Button>
            <Button variant="ghost" onClick={onAssignClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal para Asignar/Editar Parashá de Usuario */}
      <Modal isOpen={isUserParashaOpen} onClose={onUserParashaClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack spacing={3}>
              <Icon as={FaStar} color="#F59E0B" />
              <VStack align="start" spacing={0}>
                <Text>{selectedUser?.hasParasha ? 'Editar' : 'Asignar'} Parashá Personal</Text>
                <Text fontSize="sm" fontWeight="normal" color="gray.500">
                  {selectedUser?.name || selectedUser?.email}
                </Text>
              </VStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={5}>
              {/* Selector de Catálogo */}
              <FormControl>
                <FormLabel>
                  <HStack>
                    <Icon as={FaBookOpen} color="blue.500" />
                    <Text>Seleccionar del Catálogo (54 Parashot)</Text>
                  </HStack>
                </FormLabel>
                <Select
                  placeholder="-- Selecciona una parashá del catálogo --"
                  value={selectedCatalogParasha}
                  onChange={(e) => handleSelectCatalogParasha(e.target.value)}
                >
                  <optgroup label="📖 Bereshit (Génesis)">
                    {PARASHAT_CATALOG.filter(p => p.book === 'Bereshit').map((p, idx) => (
                      <option key={idx} value={PARASHAT_CATALOG.indexOf(p)}>
                        {p.name} - {p.hebrew}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="📖 Shemot (Éxodo)">
                    {PARASHAT_CATALOG.filter(p => p.book === 'Shemot').map((p, idx) => (
                      <option key={idx} value={PARASHAT_CATALOG.indexOf(p)}>
                        {p.name} - {p.hebrew}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="📖 Vayikrá (Levítico)">
                    {PARASHAT_CATALOG.filter(p => p.book === 'Vayikrá').map((p, idx) => (
                      <option key={idx} value={PARASHAT_CATALOG.indexOf(p)}>
                        {p.name} - {p.hebrew}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="📖 Bamidbar (Números)">
                    {PARASHAT_CATALOG.filter(p => p.book === 'Bamidbar').map((p, idx) => (
                      <option key={idx} value={PARASHAT_CATALOG.indexOf(p)}>
                        {p.name} - {p.hebrew}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="📖 Devarim (Deuteronomio)">
                    {PARASHAT_CATALOG.filter(p => p.book === 'Devarim').map((p, idx) => (
                      <option key={idx} value={PARASHAT_CATALOG.indexOf(p)}>
                        {p.name} - {p.hebrew}
                      </option>
                    ))}
                  </optgroup>
                </Select>
              </FormControl>

              <Divider />

              <Text fontSize="sm" color="gray.500" alignSelf="start">
                O ingresa los datos manualmente:
              </Text>

              <HStack spacing={4} w="full">
                <FormControl isRequired flex={1}>
                  <FormLabel>Nombre de la Parashá</FormLabel>
                  <Input
                    value={parashaForm.name}
                    onChange={(e) => setParashaForm({ ...parashaForm, name: e.target.value })}
                    placeholder="Ej: Bereshit"
                  />
                </FormControl>

                <FormControl isRequired flex={1}>
                  <FormLabel>Texto en Hebreo</FormLabel>
                  <Input
                    value={parashaForm.hebrew}
                    onChange={(e) => setParashaForm({ ...parashaForm, hebrew: e.target.value })}
                    placeholder="Ej: בראשית"
                    dir="rtl"
                  />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Referencia Bíblica</FormLabel>
                <Input
                  value={parashaForm.reference}
                  onChange={(e) => setParashaForm({ ...parashaForm, reference: e.target.value })}
                  placeholder="Ej: Génesis 1:1 - 6:8"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Significado / Descripción</FormLabel>
                <Textarea
                  value={parashaForm.meaning}
                  onChange={(e) => setParashaForm({ ...parashaForm, meaning: e.target.value })}
                  placeholder="Descripción o significado de la parashá..."
                  rows={2}
                />
              </FormControl>

              <Divider />

              <Text fontSize="sm" color="gray.500" alignSelf="start" fontWeight="bold">
                Contenido Multimedia (opcional):
              </Text>

              <FormControl>
                <FormLabel>
                  <HStack>
                    <Icon as={FaVideo} color="red.500" />
                    <Text>URL del Video</Text>
                  </HStack>
                </FormLabel>
                <Input
                  value={parashaForm.videoUrl}
                  onChange={(e) => setParashaForm({ ...parashaForm, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=... o https://vimeo.com/..."
                />
              </FormControl>

              <FormControl>
                <FormLabel>
                  <HStack>
                    <Icon as={FaCalendarAlt} color="green.500" />
                    <Text>Fecha del Bar Mitzvá</Text>
                  </HStack>
                </FormLabel>
                <Input
                  type="date"
                  value={parashaForm.eventDate}
                  onChange={(e) => setParashaForm({ ...parashaForm, eventDate: e.target.value })}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={asignarParashaAUsuario}
              isLoading={isAssigningUserParasha}
              leftIcon={<Icon as={FaStar} />}
            >
              {selectedUser?.hasParasha ? 'Actualizar Parashá' : 'Asignar Parashá'}
            </Button>
            <Button variant="ghost" onClick={onUserParashaClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CRMPage; 