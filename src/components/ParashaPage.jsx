import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    Container,
    Card,
    CardBody,
    AspectRatio,
    Badge,
    Icon,
    Flex,
    SimpleGrid,
    Divider,
    Button
} from '@chakra-ui/react';
import {
    LuPlay,
    LuCalendar,
    LuBookOpen,
    LuDownload,
    LuArrowLeft,
    LuClock,
    LuStar
} from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { format, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import UniversalVideoPlayer from './UniversalVideoPlayer';
import { getVideoType, getVideoThumbnail } from '../services/classesService';
import { useState, useEffect } from 'react';

const CountdownUnit = ({ value, label }) => (
    <VStack
        spacing={0}
        bg="white"
        p={4}
        borderRadius="2xl"
        boxShadow="sm"
        minW="90px"
        border="1px solid"
        borderColor="gray.100"
        justify="center"
    >
        <Text fontSize="3xl" fontWeight="800" color="blue.600" lineHeight="1.2">
            {String(value).padStart(2, '0')}
        </Text>
        <Text fontSize="10px" color="gray.400" textTransform="uppercase" letterSpacing="widest" fontWeight="bold">
            {label}
        </Text>
    </VStack>
);

const ParashaPage = () => {
    const { userProfile, loading } = useUser();
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

    const parasha = userProfile?.personalParasha;
    const eventDate = parasha?.eventDate ? new Date(parasha.eventDate) : null;

    useEffect(() => {
        if (!eventDate) return;

        const timer = setInterval(() => {
            const now = new Date();
            if (now > eventDate) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0 });
                clearInterval(timer);
                return;
            }

            const days = differenceInDays(eventDate, now);
            const hours = differenceInHours(eventDate, now) % 24;
            const minutes = differenceInMinutes(eventDate, now) % 60;

            setTimeLeft({ days, hours, minutes });
        }, 1000 * 60); // Update every minute

        // Initial call
        const now = new Date();
        if (now <= eventDate) {
            const days = differenceInDays(eventDate, now);
            const hours = differenceInHours(eventDate, now) % 24;
            const minutes = differenceInMinutes(eventDate, now) % 60;
            setTimeLeft({ days, hours, minutes });
        }

        return () => clearInterval(timer);
    }, [eventDate]);

    if (loading) return null;

    if (!parasha) {
        return (
            <Container maxW="container.md" py={12} textAlign="center">
                <Heading size="lg" mb={4}>No tienes una Parashá asignada</Heading>
                <Button onClick={() => navigate('/dashboard')} colorScheme="blue">Volver al Inicio</Button>
            </Container>
        );
    }

    return (
        <Box minH="100vh" bg="gray.50" py={8}>
            <Container maxW="container.xl">
                <Button
                    leftIcon={<Icon as={LuArrowLeft} />}
                    variant="ghost"
                    mb={8}
                    onClick={() => navigate('/dashboard')}
                    color="gray.500"
                    _hover={{ color: "gray.800", bg: "gray.100" }}
                >
                    Volver al Dashboard
                </Button>

                <VStack spacing={8} align="stretch">
                    {/* Header Hero Section */}
                    <Box
                        bg="white"
                        borderRadius="3xl"
                        boxShadow="2xl"
                        overflow="hidden"
                        border="1px solid"
                        borderColor="gray.100"
                        position="relative"
                    >
                        {/* Top accent */}
                        <Box position="absolute" top={0} left={0} right={0} h="6px" bgGradient="linear(to-r, blue.500, blue.600)" />

                        <CardBody p={{ base: 6, lg: 10 }}>
                            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center">
                                <VStack align="start" spacing={6}>
                                    <Badge
                                        colorScheme="blue"
                                        variant="subtle"
                                        fontSize="xs"
                                        px={3}
                                        py={1.5}
                                        borderRadius="full"
                                        display="flex"
                                        alignItems="center"
                                        gap={2}
                                    >
                                        <Icon as={LuStar} size="12px" />
                                        MI PARASHÁ PERSONAL
                                    </Badge>

                                    <Box>
                                        <Heading size="4xl" color="gray.900" mb={3} fontFamily="'Playfair Display', serif" fontWeight="900" letterSpacing="-0.02em">
                                            {parasha.name}
                                        </Heading>
                                        <Heading size="2xl" color="blue.600" fontFamily="'Playfair Display', serif" mb={6} fontWeight="700">
                                            {parasha.hebrew}
                                        </Heading>

                                        <HStack spacing={3} color="gray.600" fontSize="lg" py={2} px={4} bg="gray.50" borderRadius="xl" display="inline-flex">
                                            <Icon as={LuBookOpen} color="blue.500" strokeWidth={2.5} />
                                            <Text fontWeight="600">Lectura: {parasha.reference}</Text>
                                        </HStack>
                                    </Box>

                                    {eventDate && (
                                        <Box w="100%" mt={2}>
                                            <Text fontSize="xs" fontWeight="bold" color="gray.400" mb={4} textTransform="uppercase" letterSpacing="widest">
                                                TIEMPO RESTANTE PARA TU BARMITZVA
                                            </Text>
                                            <HStack spacing={3} wrap="wrap">
                                                <CountdownUnit value={timeLeft.days} label="Días" />
                                                <CountdownUnit value={timeLeft.hours} label="Horas" />
                                                <CountdownUnit value={timeLeft.minutes} label="Minutos" />
                                            </HStack>
                                            <HStack mt={5} color="gray.500" fontSize="sm" bg="blue.50" py={2} px={3} borderRadius="lg" display="inline-flex">
                                                <Icon as={LuCalendar} color="blue.500" />
                                                <Text fontWeight="medium">Fecha del evento: {format(eventDate, "d 'de' MMMM 'de' yyyy", { locale: es })}</Text>
                                            </HStack>
                                        </Box>
                                    )}
                                </VStack>

                                {/* Video Section */}
                                <Box
                                    borderRadius="2xl"
                                    overflow="hidden"
                                    boxShadow="2xl"
                                    bg="gray.900"
                                    position="relative"
                                    transform={{ lg: "scale(1.02)" }}
                                    transition="all 0.3s"
                                >
                                    {parasha.videoUrl ? (
                                        <UniversalVideoPlayer
                                            videoUrl={parasha.videoUrl}
                                            videoType={getVideoType(parasha.videoUrl)}
                                            title={`Parashá ${parasha.name}`}
                                        />
                                    ) : (
                                        <AspectRatio ratio={16 / 9}>
                                            <Flex direction="column" justify="center" align="center" bg="gray.50" color="gray.500">
                                                <Icon as={LuPlay} boxSize={12} mb={4} opacity={0.2} strokeWidth={1} />
                                                <Text fontWeight="semibold" color="gray.600">Video aún no disponible</Text>
                                                <Text fontSize="sm">Tu profesor te asignará el video pronto</Text>
                                            </Flex>
                                        </AspectRatio>
                                    )}
                                </Box>
                            </SimpleGrid>
                        </CardBody>
                    </Box>

                    {/* Resources / Additional Info Section */}
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                        <Card bg="white" borderRadius="2xl" boxShadow="lg" border="none" overflow="hidden">
                            <CardBody p={6}>
                                <VStack align="start" spacing={4}>
                                    <Box p={3} bg="orange.50" borderRadius="xl" color="orange.500">
                                        <Icon as={LuBookOpen} boxSize={6} strokeWidth={2} />
                                    </Box>
                                    <Box>
                                        <Heading size="md" color="gray.800" mb={1}>Texto de Estudio</Heading>
                                        <Text color="gray.500" fontSize="sm">
                                            Accede al texto completo de tu Parashá en hebreo y fonética.
                                        </Text>
                                    </Box>
                                    <Button variant="outline" colorScheme="orange" size="sm" width="full" borderRadius="xl">Ver texto</Button>
                                </VStack>
                            </CardBody>
                        </Card>

                        <Card bg="white" borderRadius="2xl" boxShadow="lg" border="none" overflow="hidden">
                            <CardBody p={6}>
                                <VStack align="start" spacing={4}>
                                    <Box p={3} bg="green.50" borderRadius="xl" color="green.500">
                                        <Icon as={LuDownload} boxSize={6} strokeWidth={2} />
                                    </Box>
                                    <Box>
                                        <Heading size="md" color="gray.800" mb={1}>Audio Taamim</Heading>
                                        <Text color="gray.500" fontSize="sm">
                                            Descarga los audios para practicar la cantilación (Taamim).
                                        </Text>
                                    </Box>
                                    <Button variant="outline" colorScheme="green" size="sm" width="full" borderRadius="xl">Descargar</Button>
                                </VStack>
                            </CardBody>
                        </Card>

                        <Card bg="white" borderRadius="2xl" boxShadow="lg" border="none" overflow="hidden">
                            <CardBody p={6}>
                                <VStack align="start" spacing={4}>
                                    <Box p={3} bg="purple.50" borderRadius="xl" color="purple.500">
                                        <Icon as={LuClock} boxSize={6} strokeWidth={2} />
                                    </Box>
                                    <Box>
                                        <Heading size="md" color="gray.800" mb={1}>Práctica Diaria</Heading>
                                        <Text color="gray.500" fontSize="sm">
                                            Agenda tus sesiones de práctica recomendadas.
                                        </Text>
                                    </Box>
                                    <Button variant="outline" colorScheme="purple" size="sm" width="full" borderRadius="xl">Ver calendario</Button>
                                </VStack>
                            </CardBody>
                        </Card>
                    </SimpleGrid>

                </VStack>
            </Container>
        </Box>
    );
};

export default ParashaPage;
