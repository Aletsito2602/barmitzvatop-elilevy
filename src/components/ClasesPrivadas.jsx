import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Icon, 
  Divider, 
  SimpleGrid,
  Button,
  Badge,
  useColorModeValue,
  Container,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
import { 
  FaCheck, 
  FaHeart, 
  FaClock, 
  FaDollarSign, 
  FaTrophy, 
  FaWhatsapp,
  FaGlobe,
  FaPhone,
  FaStar,
  FaBook,
  FaMusic,
  FaPrayingHands
} from 'react-icons/fa';

const ClasesPrivadas = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  const features = [
    'Clases semanales 100% personalizadas (presenciales u online)',
    'Enseñanza desde cero de lectura en hebreo con fluidez',
    'Pronunciación y entonación correcta',
    'Estudio del rezo de Shajrit completo (con melodías y técnicas vocales)',
    'Aprendizaje del Shemá Israel, Amidá, Kadish, Hamelej, Aleinu y otros rezos esenciales',
    'Estudio y práctica de la Parashá con Taamim',
    'Aprendizaje del Kidush de Shabat cantado',
    'Enseñanza y práctica de la colocación del Tefilín',
    'Significado y sentido de cada rezo, historia e identidad judía',
    'Técnicas de proyección vocal y escénica (por mi experiencia como cantante profesional)',
    'Acompañamiento continuo vía WhatsApp para dudas y seguimiento',
    'Apoyo emocional y motivacional durante todo el proceso',
    'Prácticas intensivas previas al Bar Mitzvá',
    'Posibilidad de ensayo general y acompañamiento en el evento (consultar disponibilidad)'
  ];

  const resultados = [
    'El alumno podrá dirigir con seguridad su ceremonia de Bar Mitzvá',
    'Sentirá orgullo, conexión y dominio de su herencia judía',
    'La familia vivirá un momento emotivo, digno y bien preparado',
    'Será una experiencia transformadora para su identidad'
  ];

  return (
    <Box id="clases-privadas" bg={useColorModeValue('#f8fafc', 'gray.900')} py={20}>
      <Container maxW="1200px">
        <VStack spacing={12} align="stretch">
          
          {/* Header */}
          <VStack spacing={6} textAlign="center">
            <Heading as="h2" size="2xl" color="black" fontWeight="bold">
              ✡️ Clases Privadas
            </Heading>
            <Heading as="h3" size="lg" color="#F59E0B" fontWeight="semibold">
              Propuesta de Curso Personalizado de Bar Mitzvá
            </Heading>
            <Text fontSize="xl" color="gray.600" fontWeight="medium">
              Dictado por Eli Levy – Curso Premium Anual
            </Text>
          </VStack>

          {/* Introducción Personal */}
          <Box bg={bgColor} p={8} borderRadius="2xl" boxShadow="lg" border={`2px solid ${borderColor}`}>
            <VStack spacing={4} align="start">
              <HStack>
                <Text fontSize="2xl">🎓</Text>
                <Heading size="lg" color="#F59E0B">Shalom</Heading>
              </HStack>
              <Text fontSize="lg" lineHeight="1.8" color="gray.700">
                Mi nombre es <Text as="span" fontWeight="bold" color="black">Eli Levy</Text>, tengo más de 17 años de experiencia enseñando Bar Mitzvá de forma personalizada, presencial y online. Acompañar a un joven en su preparación para este momento tan importante no es solo un trabajo para mí, sino una misión de vida que hago con mucha entrega, amor y excelencia.
              </Text>
            </VStack>
          </Box>

          {/* Objetivo del Curso */}
          <Box bg={bgColor} p={8} borderRadius="2xl" boxShadow="lg" border={`2px solid ${borderColor}`}>
            <VStack spacing={4} align="start">
              <HStack>
                <Icon as={FaTrophy} color="#FFD700" boxSize={8} />
                <Heading size="lg" color="#F59E0B">Objetivo del Curso</Heading>
              </HStack>
              <Text fontSize="lg" lineHeight="1.8" color="gray.700">
                Guiar y preparar al alumno para vivir su Bar Mitzvá con seguridad, conocimiento y conexión, dominando el rezo, la lectura, el significado de lo que hace y la experiencia espiritual que conlleva.
              </Text>
            </VStack>
          </Box>

          {/* ¿Qué incluye el curso? */}
          <Box bg={bgColor} p={8} borderRadius="2xl" boxShadow="lg" border={`2px solid ${borderColor}`}>
            <VStack spacing={6} align="start">
              <HStack>
                <Icon as={FaBook} color="#F59E0B" boxSize={8} />
                <Heading size="lg" color="#F59E0B">¿Qué incluye el curso?</Heading>
              </HStack>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
                {features.map((feature, idx) => (
                  <HStack key={idx} align="start" spacing={3}>
                    <Icon as={FaCheck} color="#10B981" boxSize={5} mt={1} />
                    <Text fontSize="md" color="gray.700" lineHeight="1.6">{feature}</Text>
                  </HStack>
                ))}
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Detalles del Curso */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            
            {/* Duración y Modalidad */}
            <Box bg={bgColor} p={6} borderRadius="xl" boxShadow="lg" border={`2px solid ${borderColor}`}>
              <VStack spacing={4} align="start">
                <HStack>
                  <Icon as={FaClock} color="#F59E0B" boxSize={6} />
                  <Heading size="md" color="#F59E0B">Duración y Modalidad</Heading>
                </HStack>
                <VStack align="start" spacing={2}>
                  <Text><Text as="span" fontWeight="bold">Duración:</Text> 12 a 14 meses</Text>
                  <Text><Text as="span" fontWeight="bold">Modalidad:</Text> Presencial o virtual</Text>
                  <Text><Text as="span" fontWeight="bold">Frecuencia:</Text> 1 clase por semana</Text>
                </VStack>
              </VStack>
            </Box>

            {/* Valor del Curso */}
            <Box bg={bgColor} p={6} borderRadius="xl" boxShadow="lg" border={`2px solid ${borderColor}`}>
              <VStack spacing={4} align="center" textAlign="center">
                <HStack>
                  <Icon as={FaDollarSign} color="#10B981" boxSize={6} />
                  <Heading size="md" color="#F59E0B">Valor del Curso</Heading>
                </HStack>
                <Badge colorScheme="green" fontSize="2xl" p={4} borderRadius="lg">
                  $5,000 USD
                </Badge>
                <Text fontSize="sm" color="gray.600">por alumno completo</Text>
              </VStack>
            </Box>

            {/* Forma de Pago */}
            <Box bg={bgColor} p={6} borderRadius="xl" boxShadow="lg" border={`2px solid ${borderColor}`}>
              <VStack spacing={4} align="start">
                <HStack>
                  <Icon as={FaDollarSign} color="#8B5CF6" boxSize={6} />
                  <Heading size="md" color="#F59E0B">Forma de Pago</Heading>
                </HStack>
                <VStack align="start" spacing={2}>
                  <Text>• 50% al iniciar</Text>
                  <Text>• 50% previo a la ceremonia</Text>
                  <Text fontSize="sm" color="gray.600" fontStyle="italic">
                    (Se contemplan otras formas fraccionadas)
                  </Text>
                </VStack>
              </VStack>
            </Box>
          </SimpleGrid>

          {/* Resultado Final Esperado */}
          <Box bg={bgColor} p={8} borderRadius="2xl" boxShadow="lg" border={`2px solid ${borderColor}`}>
            <VStack spacing={6} align="start">
              <HStack>
                <Icon as={FaTrophy} color="#FFD700" boxSize={8} />
                <Heading size="lg" color="#F59E0B">Resultado Final Esperado</Heading>
              </HStack>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
                {resultados.map((resultado, idx) => (
                  <HStack key={idx} align="start" spacing={3}>
                    <Icon as={FaStar} color="#FFD700" boxSize={5} mt={1} />
                    <Text fontSize="md" color="gray.700" lineHeight="1.6">{resultado}</Text>
                  </HStack>
                ))}
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Comentario Final */}
          <Box bg="#F59E0B" p={8} borderRadius="2xl" boxShadow="xl" color="white">
            <VStack spacing={4} textAlign="center">
              <Icon as={FaHeart} boxSize={8} color="white" />
              <Heading size="lg" color="white">Comentario Final</Heading>
              <Text fontSize="lg" lineHeight="1.8" textAlign="center">
                Estoy comprometido con cada alumno como si fuera parte de mi familia. No enseño solo rezos, enseño confianza, historia, valores y amor por nuestras raíces.
              </Text>
              <Text fontSize="lg" fontWeight="bold">
                Estoy aquí para acompañarte y hacer que este Bar Mitzvá sea inolvidable.
              </Text>
            </VStack>
          </Box>

          {/* Información de Contacto */}
          <Box bg={bgColor} p={8} borderRadius="2xl" boxShadow="lg" border={`2px solid ${borderColor}`}>
            <VStack spacing={6} textAlign="center">
              <Heading size="lg" color="#F59E0B">Eli Levy</Heading>
              <Text fontSize="lg" color="gray.600">
                Profesor de Bar Mitzvá | Cantante | Educador judío
              </Text>
              <VStack spacing={4}>
                <HStack spacing={6} justify="center" flexWrap="wrap">
                  <HStack>
                    <Icon as={FaWhatsapp} color="#25D366" boxSize={6} />
                    <Text fontWeight="bold">WhatsApp disponible</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaGlobe} color="#F59E0B" boxSize={6} />
                    <Text fontWeight="bold">www.barmitzvatop.com</Text>
                  </HStack>
                </HStack>
                <Button
                  size="lg"
                  bg="#25D366"
                  color="white"
                  leftIcon={<FaWhatsapp />}
                  _hover={{ bg: "#128C7E", transform: 'translateY(-2px)' }}
                  borderRadius="xl"
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="bold"
                >
                  Contactar para más información
                </Button>
              </VStack>
            </VStack>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
};

export default ClasesPrivadas; 