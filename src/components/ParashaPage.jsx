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
    Button
} from '@chakra-ui/react';
import {
    LuPlay,
    LuCalendar,
    LuBookOpen,
    LuArrowLeft,
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
                    <Card
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

                        <CardBody p={{ base: 4, lg: 8 }}>
                            <VStack spacing={8} align="stretch">

                                {/* Video Section - FULL WIDTH */}
                                <Box
                                    borderRadius="2xl"
                                    overflow="hidden"
                                    boxShadow="xl"
                                    bg="gray.900"
                                >
                                    {parasha.videoUrl ? (
                                        <UniversalVideoPlayer
                                            videoUrl={parasha.videoUrl}
                                            videoType={getVideoType(parasha.videoUrl)}
                                            title={`Parashá ${parasha.name}`}
                                        />
                                    ) : (
                                        <AspectRatio ratio={16 / 9}>
                                            <Flex direction="column" justify="center" align="center" bg="gray.100" color="gray.500">
                                                <Icon as={LuPlay} boxSize={16} mb={4} opacity={0.3} strokeWidth={1} />
                                                <Text fontWeight="semibold" color="gray.600" fontSize="lg">Video aún no disponible</Text>
                                                <Text fontSize="sm">Tu profesor te asignará el video pronto</Text>
                                            </Flex>
                                        </AspectRatio>
                                    )}
                                </Box>

                                {/* Info Section - Parasha Name + Countdown */}
                                <Flex
                                    direction={{ base: "column", lg: "row" }}
                                    justify="space-between"
                                    align={{ base: "stretch", lg: "center" }}
                                    gap={6}
                                    pt={4}
                                >
                                    {/* Parasha Info */}
                                    <VStack align="start" spacing={3}>
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
                                        <Heading size="2xl" color="gray.900" fontFamily="'Playfair Display', serif" fontWeight="900">
                                            {parasha.name}
                                        </Heading>
                                        <Heading size="xl" color="blue.600" fontFamily="'Playfair Display', serif" fontWeight="700">
                                            {parasha.hebrew}
                                        </Heading>
                                        <HStack spacing={3} color="gray.600" fontSize="md" py={2} px={4} bg="gray.50" borderRadius="xl">
                                            <Icon as={LuBookOpen} color="blue.500" strokeWidth={2.5} />
                                            <Text fontWeight="600">{parasha.reference}</Text>
                                        </HStack>
                                    </VStack>

                                    {/* Countdown Section */}
                                    {eventDate && (
                                        <Box
                                            bg="gradient"
                                            bgGradient="linear(to-br, blue.50, blue.100)"
                                            p={6}
                                            borderRadius="2xl"
                                            textAlign="center"
                                            minW={{ lg: "320px" }}
                                        >
                                            <Text fontSize="xs" fontWeight="bold" color="blue.600" mb={3} textTransform="uppercase" letterSpacing="widest">
                                                ⏰ Tiempo restante
                                            </Text>
                                            <HStack spacing={4} justify="center" mb={4}>
                                                <CountdownUnit value={timeLeft.days} label="Días" />
                                                <CountdownUnit value={timeLeft.hours} label="Horas" />
                                                <CountdownUnit value={timeLeft.minutes} label="Min" />
                                            </HStack>
                                            <HStack color="blue.600" fontSize="sm" justify="center">
                                                <Icon as={LuCalendar} />
                                                <Text fontWeight="medium">
                                                    {format(eventDate, "d 'de' MMMM 'de' yyyy", { locale: es })}
                                                </Text>
                                            </HStack>
                                        </Box>
                                    )}
                                </Flex>

                            </VStack>
                        </CardBody>
                    </Card>

                </VStack>
            </Container>
        </Box>
    );
};

export default ParashaPage;
