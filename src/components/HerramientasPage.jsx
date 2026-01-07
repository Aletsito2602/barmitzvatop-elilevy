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
  Input,
  Button,
  Badge,
  Icon,
  Flex,
  Divider,
  FormControl,
  FormLabel,
  useToast,
  TabPanel,
  TabPanels,
  Spinner,
} from '@chakra-ui/react';
import { FaCalendarAlt, FaStar, FaExchangeAlt, FaCheckCircle, FaBookOpen, FaUser, FaClock, FaMapMarkerAlt, FaBuilding, FaSpinner, FaHistory } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import SupabaseSetup from './SupabaseSetup';
import { createParashaRequest, getUserParashaRequests } from '../services/parashaService';

const hebrewDaysSpanish = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

const CalendarConverter = () => {
  // Simplified for brevity, same logic as before
  const [selectedDate, setSelectedDate] = useState('');
  const [hebrewDate, setHebrewDate] = useState(null);

  // Conversión precisa de calendario gregoriano a hebreo usando algoritmos estándar
  // Helper functions inline or imported
  const convertToHebrew = (gregorianDate) => {
    try {
      const date = new Date(gregorianDate);
      // Simple mock conversion for UI demo if complex logic omitted, 
      // but preserving original logic is better.
      // For brevity in this re-write, I will assume the logic functions are present
      // or I'll just restore them.

      // let's put back the logic functions
      const hebrewDaysSpanish = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const jd = gregorianToJulian(date);
      const hDate = julianToHebrew(jd);
      const monthName = getHebrewMonthName(hDate.month, hDate.isLeap);
      const formatted = `${hebrewDaysSpanish[date.getDay()]}, ${hDate.day} de ${monthName}, ${hDate.year}`;

      return {
        year: hDate.year,
        month: monthName,
        day: hDate.day,
        dayOfWeek: hebrewDaysSpanish[date.getDay()],
        formatted: formatted,
        isValid: true
      };

    } catch (error) {
      console.error(error);
      return { isValid: false, formatted: 'Error' };
    }
  };

  function gregorianToJulian(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const a = Math.floor((14 - month) / 12);
    const y = year - a;
    const m = month + 12 * a - 3;
    return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + 1721119;
  }

  function julianToHebrew(jd) {
    const HEBREW_EPOCH = 347998;
    const d = jd - HEBREW_EPOCH;
    let year = Math.floor(d / 365.25) + 1;
    while (hebrewElapsedDays(year) < d) year++;
    year--;
    const yearStart = hebrewElapsedDays(year);
    const dayInYear = d - yearStart + 1;
    const isLeap = ((7 * year + 1) % 19) < 7;
    const monthLengths = getMonthLengths(year);
    let month = 1;
    let dayInMonth = dayInYear;
    for (let i = 0; i < monthLengths.length; i++) {
      if (dayInMonth <= monthLengths[i]) { month = i + 1; break; }
      dayInMonth -= monthLengths[i];
    }
    return { year, month, day: Math.max(1, Math.floor(dayInMonth)), isLeap };
  }

  function hebrewElapsedDays(year) {
    const monthsElapsed = Math.floor(((235 * year) - 234) / 19);
    const partsElapsed = 12084 + (13753 * monthsElapsed);
    const day = 29 * monthsElapsed + Math.floor(partsElapsed / 25920);
    return ((3 * (day + 1)) % 7) < 3 ? day + 1 : day;
  }

  function getMonthLengths(year) {
    const isLeap = ((7 * year + 1) % 19) < 7;
    const yearLength = hebrewElapsedDays(year + 1) - hebrewElapsedDays(year);
    let months = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
    if (isLeap) { months.splice(5, 0, 29); months[6] = 29; }
    if (yearLength === 353 || yearLength === 383) months[2] = 29;
    else if (yearLength === 355 || yearLength === 385) months[1] = 30;
    return months;
  }

  function getHebrewMonthName(monthNum, isLeap) {
    const normal = ['Tishrei', 'Cheshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar', 'Nissan', 'Iyar', 'Sivan', 'Tamuz', 'Av', 'Elul'];
    if (isLeap && monthNum >= 6) {
      if (monthNum === 6) return 'Adar I';
      if (monthNum === 7) return 'Adar II';
      return normal[monthNum - 2];
    }
    return normal[monthNum - 1];
  }


  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);

    if (date) {
      const converted = convertToHebrew(date);
      setHebrewDate(converted);
    } else {
      setHebrewDate(null);
    }
  };

  const handleToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    const converted = convertToHebrew(today);
    setHebrewDate(converted);
  };

  return (
    <Card>
      <CardHeader>
        <HStack spacing={3}>
          <Icon as={FaCalendarAlt} color="#38BDF8" boxSize={6} />
          <VStack align="start" spacing={0}>
            <Heading size="md">Conversor de Calendario</Heading>
            <Text fontSize="sm" color="gray.600">
              Convierte fechas del calendario gregoriano al hebreo
            </Text>
          </VStack>
        </HStack>
      </CardHeader>

      <CardBody>
        <VStack spacing={6} align="stretch">
          <VStack spacing={3} align="stretch">
            <Text fontWeight="medium" color="gray.700">
              Selecciona una fecha gregoriana:
            </Text>
            <HStack spacing={3}>
              <Input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                size="lg"
                borderColor="gray.300"
                _focus={{ borderColor: "#38BDF8", boxShadow: "0 0 0 1px #38BDF8" }}
              />
              <Button
                onClick={handleToday}
                colorScheme="messenger"
                bg="#38BDF8"
                _hover={{ bg: "#0ea5e9" }}
              >
                Hoy
              </Button>
            </HStack>
          </VStack>

          {hebrewDate && (
            <>
              <Divider />
              <VStack spacing={4} align="stretch">
                <Flex align="center" justify="center">
                  <Icon as={FaExchangeAlt} color="#38BDF8" boxSize={5} />
                </Flex>

                <Card
                  bg={hebrewDate.isValid ? "blue.50" : "red.50"}
                  borderColor={hebrewDate.isValid ? "blue.200" : "red.200"}
                  borderWidth={1}
                >
                  <CardBody>
                    <VStack spacing={3}>
                      <Badge
                        colorScheme={hebrewDate.isValid ? "blue" : "red"}
                        fontSize="sm"
                        px={3}
                        py={1}
                      >
                        {hebrewDate.isValid ? "Fecha Hebrea" : "Error"}
                      </Badge>

                      <VStack spacing={2}>
                        <Text
                          fontSize="xl"
                          fontWeight="bold"
                          textAlign="center"
                          color={hebrewDate.isValid ? "blue.800" : "red.800"}
                        >
                          {hebrewDate.formatted}
                        </Text>

                        {hebrewDate.isValid && (
                          <SimpleGrid columns={3} spacing={4} w="100%">
                            <VStack>
                              <Text fontSize="sm" color="gray.600">Día</Text>
                              <Text fontWeight="medium">{hebrewDate.day}</Text>
                            </VStack>
                            <VStack>
                              <Text fontSize="sm" color="gray.600">Mes</Text>
                              <Text fontWeight="medium">{hebrewDate.month}</Text>
                            </VStack>
                            <VStack>
                              <Text fontSize="sm" color="gray.600">Año</Text>
                              <Text fontWeight="medium">{hebrewDate.year}</Text>
                            </VStack>
                          </SimpleGrid>
                        )}
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </>
          )}

          <Card bg="green.50" borderColor="green.200" borderWidth={1}>
            <CardBody>
              <VStack spacing={2} align="start">
                <HStack spacing={2}>
                  <Icon as={FaCheckCircle} color="green.500" boxSize={4} />
                  <Text fontSize="sm" fontWeight="medium" color="green.800">
                    Conversión Precisa
                  </Text>
                </HStack>
                <Text fontSize="sm" color="green.700">
                  Esta herramienta usa algoritmos matemáticos precisos para conversiones exactas del
                  calendario hebreo. Incluye años bisiestos y es ideal para fechas de festividades.
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </CardBody>
    </Card>
  );
};

const ParashaForm = () => {
  // ... ParashaForm implementation remains largely the same but uses userId correctly
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    fechaNacimiento: '',
    horaNacimiento: '',
    lugarNacimiento: '',
    ubicacionBarmitzva: ''
  });
  const [userRequests, setUserRequests] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const loadUserRequests = async () => {
      // In Supabase Auth, user object has 'id'. In Firebase it had 'uid'.
      // Our useAuth returns session.user which has 'id'. 
      const userId = user?.id || user?.uid;

      if (!userId) return;

      setIsLoadingRequests(true);
      try {
        const result = await getUserParashaRequests(userId);
        if (result.success) {
          setUserRequests(result.data);
        }
      } catch (error) {
        console.error('Error loading requests:', error);
      } finally {
        setIsLoadingRequests(false);
      }
    };

    loadUserRequests();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = user?.id || user?.uid;

    if (!userId) {
      toast({
        title: "Error de autenticación",
        description: "Debes estar logueado para enviar una solicitud",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.nombre || !formData.fechaNacimiento || !formData.horaNacimiento ||
      !formData.lugarNacimiento || !formData.ubicacionBarmitzva) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createParashaRequest({
        userId: userId,
        ...formData
      });

      if (result.success) {
        toast({
          title: "¡Solicitud enviada!",
          description: "Tu solicitud de Parashá ha sido enviada exitosamente. Te notificaremos cuando esté lista.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setFormData({
          nombre: '',
          fechaNacimiento: '',
          horaNacimiento: '',
          lugarNacimiento: '',
          ubicacionBarmitzva: ''
        });

        const updatedRequests = await getUserParashaRequests(userId);
        if (updatedRequests.success) {
          setUserRequests(updatedRequests.data);
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error al enviar solicitud",
        description: "Ocurrió un error al enviar tu solicitud. Por favor intenta nuevamente.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <HStack spacing={3}>
          <Icon as={FaBookOpen} color="#F59E0B" boxSize={6} />
          <VStack align="start" spacing={0}>
            <Heading size="md">Te ayudo a saber tu parashá</Heading>
            <Text fontSize="sm" color="gray.600">
              Completa tus datos para conocer tu parashá
            </Text>
          </VStack>
        </HStack>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            <FormControl isRequired>
              <FormLabel>
                <HStack spacing={2}>
                  <Icon as={FaUser} color="#F59E0B" boxSize={4} />
                  <Text>Nombre completo</Text>
                </HStack>
              </FormLabel>
              <Input
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ingresa tu nombre completo"
                size="lg"
                borderColor="gray.300"
                _focus={{ borderColor: "#F59E0B", boxShadow: "0 0 0 1px #F59E0B" }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>
                <HStack spacing={2}>
                  <Icon as={FaCalendarAlt} color="#F59E0B" boxSize={4} />
                  <Text>Fecha de nacimiento</Text>
                </HStack>
              </FormLabel>
              <Input
                name="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={handleInputChange}
                size="lg"
                borderColor="gray.300"
                _focus={{ borderColor: "#F59E0B", boxShadow: "0 0 0 1px #F59E0B" }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>
                <HStack spacing={2}>
                  <Icon as={FaClock} color="#F59E0B" boxSize={4} />
                  <Text>Hora de nacimiento</Text>
                </HStack>
              </FormLabel>
              <Input
                name="horaNacimiento"
                type="time"
                value={formData.horaNacimiento}
                onChange={handleInputChange}
                size="lg"
                borderColor="gray.300"
                _focus={{ borderColor: "#F59E0B", boxShadow: "0 0 0 1px #F59E0B" }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>
                <HStack spacing={2}>
                  <Icon as={FaMapMarkerAlt} color="#F59E0B" boxSize={4} />
                  <Text>Lugar de nacimiento</Text>
                </HStack>
              </FormLabel>
              <Input
                name="lugarNacimiento"
                value={formData.lugarNacimiento}
                onChange={handleInputChange}
                placeholder="Ciudad, País"
                size="lg"
                borderColor="gray.300"
                _focus={{ borderColor: "#F59E0B", boxShadow: "0 0 0 1px #F59E0B" }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>
                <HStack spacing={2}>
                  <Icon as={FaBuilding} color="#F59E0B" boxSize={4} />
                  <Text>Ubicación donde hará el Barmitzva</Text>
                </HStack>
              </FormLabel>
              <Input
                name="ubicacionBarmitzva"
                value={formData.ubicacionBarmitzva}
                onChange={handleInputChange}
                placeholder="Sinagoga, Ciudad, País"
                size="lg"
                borderColor="gray.300"
                _focus={{ borderColor: "#F59E0B", boxShadow: "0 0 0 1px #F59E0B" }}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="messenger"
              bg="#F59E0B"
              color="white"
              size="lg"
              _hover={{ bg: "#D97706" }}
              leftIcon={<Icon as={FaStar} />}
              isLoading={isSubmitting}
              loadingText="Enviando..."
            >
              Enviar información
            </Button>

            {userRequests.length > 0 && (
              <Card bg="blue.50" borderColor="blue.200" borderWidth={1}>
                <CardBody>
                  <VStack spacing={3} align="start">
                    <HStack spacing={2}>
                      <Icon as={FaHistory} color="blue.600" boxSize={4} />
                      <Text fontSize="sm" fontWeight="medium" color="blue.800">
                        Tus solicitudes anteriores
                      </Text>
                    </HStack>
                    {isLoadingRequests ? (
                      <HStack spacing={2}>
                        <Spinner size="sm" color="blue.500" />
                        <Text fontSize="sm" color="blue.600">Cargando solicitudes...</Text>
                      </HStack>
                    ) : (
                      <VStack spacing={2} align="start" w="100%">
                        {userRequests.slice(0, 3).map((request, index) => (
                          <HStack key={request.id} justify="space-between" w="100%">
                            <VStack align="start" spacing={0}>
                              <Text fontSize="sm" fontWeight="medium" color="blue.700">
                                {request.nombre}
                              </Text>
                              <Text fontSize="xs" color="blue.600">
                                {new Date(request.createdAt).toLocaleDateString('es-ES')}
                              </Text>
                            </VStack>
                            <Badge
                              colorScheme={
                                request.status === 'completada' ? 'green' :
                                  request.status === 'procesando' ? 'blue' :
                                    request.status === 'pendiente' ? 'yellow' : 'red'
                              }
                              size="sm"
                            >
                              {request.status === 'completada' ? 'Completada' :
                                request.status === 'procesando' ? 'Procesando' :
                                  request.status === 'pendiente' ? 'Pendiente' : 'Rechazada'}
                            </Badge>
                          </HStack>
                        ))}
                        {userRequests.length > 3 && (
                          <Text fontSize="xs" color="blue.500">
                            Y {userRequests.length - 3} solicitud(es) más...
                          </Text>
                        )}
                      </VStack>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            )}

            <Card bg="yellow.50" borderColor="yellow.200" borderWidth={1}>
              <CardBody>
                <VStack spacing={2} align="start">
                  <HStack spacing={2}>
                    <Icon as={FaCheckCircle} color="yellow.600" boxSize={4} />
                    <Text fontSize="sm" fontWeight="medium" color="yellow.800">
                      Información segura
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="yellow.700">
                    Tus datos se guardan de forma segura y serán utilizados únicamente para
                    calcular tu parashá y preparar tu Barmitzva.
                  </Text>
                </VStack>
              </CardBody>
            </Card>

          </VStack>
        </form>
      </CardBody>
    </Card>
  );
};

const HerramientasPage = () => {
  return (
    <Box w="100%" maxW="95vw" mx="auto" py={8} px={{ base: 4, md: 6, lg: 8 }}>
      <VStack spacing={8} align="stretch">

        {/* Header */}
        <Box>
          <Heading size="xl" color="gray.800" mb={2}>
            Herramientas
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Recursos útiles para tu preparación del Barmitzva
          </Text>
        </Box>

        {/* Herramientas Grid */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>

          {/* Conversor de Calendario */}
          <CalendarConverter />

          {/* Formulario de Parashá */}
          <ParashaForm />

        </SimpleGrid>

        {/* Información sobre las herramientas */}
        <Card bg="blue.50" borderColor="blue.200" borderWidth={1}>
          <CardBody>
            <VStack spacing={4} align="start">
              <Heading size="md" color="blue.800">
                ¿Qué herramientas encontrarás aquí?
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
                <VStack align="start" spacing={2}>
                  <Text fontWeight="medium" color="blue.700">✓ Conversor de Calendario</Text>
                  <Text fontSize="sm" color="blue.600">
                    Convierte fechas gregorianas a hebreas para conocer fechas importantes
                  </Text>
                </VStack>
                <VStack align="start" spacing={2}>
                  <Text fontWeight="medium" color="blue.700">✓ Te ayudo a saber tu parashá</Text>
                  <Text fontSize="sm" color="blue.600">
                    Completa tus datos para que te calculemos tu parashá personalizada
                  </Text>
                </VStack>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

      </VStack>
    </Box>
  );
};

export default HerramientasPage;