import {
  Box,
  Container,
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
} from '@chakra-ui/react';
import { FaCalendarAlt, FaStar, FaExchangeAlt, FaCheckCircle, FaBookOpen, FaUser, FaClock, FaMapMarkerAlt, FaBuilding, FaSpinner, FaHistory, FaTools } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createParashaRequest, getUserParashaRequests } from '../services/parashaService';
import FirebaseSetup from './FirebaseSetup';

const hebrewDaysSpanish = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

const HEBREW_MONTHS = [
  'Tishrei', 'Cheshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar',
  'Nissan', 'Iyar', 'Sivan', 'Tamuz', 'Av', 'Elul'
];

const HEBREW_MONTHS_LEAP = [
  'Tishrei', 'Cheshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar I', 'Adar II',
  'Nissan', 'Iyar', 'Sivan', 'Tamuz', 'Av', 'Elul'
];

// Conversión precisa de calendario gregoriano a hebreo usando algoritmos estándar
const convertToHebrew = (gregorianDate) => {
  try {
    const date = new Date(gregorianDate);
    const dayOfWeek = hebrewDaysSpanish[date.getDay()];
    
    // Convertir fecha gregoriana a día juliano
    const jd = gregorianToJulian(date);
    
    // Convertir día juliano a fecha hebrea
    const hebrewDate = julianToHebrew(jd);
    
    const monthName = getHebrewMonthName(hebrewDate.month, hebrewDate.isLeap);
    const formatted = `${dayOfWeek}, ${hebrewDate.day} de ${monthName}, ${hebrewDate.year}`;
    
    return {
      year: hebrewDate.year,
      month: monthName,
      day: hebrewDate.day,
      dayOfWeek: dayOfWeek,
      formatted: formatted,
      isValid: true
    };
  } catch (error) {
    console.error('Error converting date:', error);
    return {
      year: 'Error',
      month: 'Error',
      day: 'Error',
      dayOfWeek: 'Error',
      formatted: 'Error en la conversión',
      isValid: false
    };
  }
};

// Convierte fecha gregoriana a día juliano
function gregorianToJulian(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const a = Math.floor((14 - month) / 12);
  const y = year - a;
  const m = month + 12 * a - 3;
  
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + 
         Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + 1721119;
}

// Convierte día juliano a fecha hebrea
function julianToHebrew(jd) {
  // Día juliano del epoch hebreo (1 Tishrei 1 = 7 octubre 3761 BCE)
  const HEBREW_EPOCH = 347998;
  
  // Días transcurridos desde el epoch hebreo
  const d = jd - HEBREW_EPOCH;
  
  // Calcular año hebreo aproximado
  let year = Math.floor(d / 365.25) + 1;
  
  // Refinar el año
  while (hebrewElapsedDays(year) < d) {
    year++;
  }
  year--;
  
  // Días transcurridos en el año actual
  const yearStart = hebrewElapsedDays(year);
  const dayInYear = d - yearStart + 1;
  
  // Determinar mes y día
  const isLeap = isHebrewLeapYear(year);
  const monthLengths = getMonthLengths(year);
  
  let month = 1;
  let dayInMonth = dayInYear;
  
  for (let i = 0; i < monthLengths.length; i++) {
    if (dayInMonth <= monthLengths[i]) {
      month = i + 1;
      break;
    }
    dayInMonth -= monthLengths[i];
  }
  
  return {
    year: year,
    month: month,
    day: Math.max(1, Math.floor(dayInMonth)),
    isLeap: isLeap
  };
}

// Calcula días transcurridos desde el epoch hasta el inicio del año dado
function hebrewElapsedDays(year) {
  const monthsElapsed = Math.floor(((235 * year) - 234) / 19);
  const partsElapsed = 12084 + (13753 * monthsElapsed);
  const day = 29 * monthsElapsed + Math.floor(partsElapsed / 25920);
  
  if (((3 * (day + 1)) % 7) < 3) {
    return day + 1;
  } else {
    return day;
  }
}

// Determina si un año hebreo es bisiesto
function isHebrewLeapYear(year) {
  return ((7 * year + 1) % 19) < 7;
}

// Obtiene las longitudes de los meses para un año dado
function getMonthLengths(year) {
  const isLeap = isHebrewLeapYear(year);
  const yearLength = hebrewElapsedDays(year + 1) - hebrewElapsedDays(year);
  
  // Longitudes base de los meses
  let months = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29]; // 12 meses normales
  
  if (isLeap) {
    // Año bisiesto: insertar Adar I antes de Adar
    months.splice(5, 0, 29); // Adar I = 29 días
    months[6] = 29; // Adar II = 29 días
  }
  
  // Ajustar según la longitud del año
  if (yearLength === 353 || yearLength === 383) {
    // Año deficiente: Kislev tiene 29 días
    months[2] = 29;
  } else if (yearLength === 355 || yearLength === 385) {
    // Año abundante: Cheshvan tiene 30 días
    months[1] = 30;
  }
  
  return months;
}

// Obtiene el nombre del mes hebreo
function getHebrewMonthName(monthNum, isLeap) {
  const normalMonths = ['Tishrei', 'Cheshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar', 
                       'Nissan', 'Iyar', 'Sivan', 'Tamuz', 'Av', 'Elul'];
  
  if (isLeap && monthNum >= 6) {
    if (monthNum === 6) return 'Adar I';
    if (monthNum === 7) return 'Adar II';
    return normalMonths[monthNum - 2]; // Ajustar índice para meses después de Adar
  }
  
  return normalMonths[monthNum - 1];
}

const CalendarConverter = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [hebrewDate, setHebrewDate] = useState(null);

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
          {/* Input de fecha */}
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

          {/* Resultado */}
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

          {/* Información adicional */}
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

// Componente para el formulario de Parashá
const ParashaForm = () => {
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

  // Load user's previous requests
  useEffect(() => {
    const loadUserRequests = async () => {
      if (!user?.uid) return;
      
      setIsLoadingRequests(true);
      try {
        const result = await getUserParashaRequests(user.uid);
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
    
    if (!user?.uid) {
      toast({
        title: "Error de autenticación",
        description: "Debes estar logueado para enviar una solicitud",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Validar que todos los campos estén completos
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
      // Crear solicitud en Firebase
      const result = await createParashaRequest({
        userId: user.uid,
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

        // Limpiar formulario
        setFormData({
          nombre: '',
          fechaNacimiento: '',
          horaNacimiento: '',
          lugarNacimiento: '',
          ubicacionBarmitzva: ''
        });

        // Recargar solicitudes del usuario
        const updatedRequests = await getUserParashaRequests(user.uid);
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
            
            {/* Nombre */}
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

            {/* Fecha de nacimiento */}
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

            {/* Hora de nacimiento */}
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

            {/* Lugar de nacimiento */}
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

            {/* Ubicación donde hará el Barmitzva */}
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

            {/* Botón de envío */}
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

            {/* Solicitudes anteriores */}
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
                        <Icon as={FaSpinner} spin color="blue.500" />
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

            {/* Información adicional */}
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

        {/* Configuración de Firebase */}
        <Card>
          <CardHeader>
            <HStack spacing={3}>
              <Icon as={FaTools} color="#F59E0B" boxSize={6} />
              <VStack align="start" spacing={0}>
                <Heading size="md">Configuración de Firebase</Heading>
                <Text fontSize="sm" color="gray.600">
                  Configura Firebase para que los foros funcionen en tiempo real
                </Text>
              </VStack>
            </HStack>
          </CardHeader>
          <CardBody>
            <FirebaseSetup />
          </CardBody>
        </Card>

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