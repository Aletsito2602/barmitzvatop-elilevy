import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  CardHeader,
  Icon,
  Badge,
  Avatar,
  Spinner,
  Alert,
  AlertIcon,
  Image,
  Flex
} from '@chakra-ui/react';
import {
  LuPlay,
  LuUsers,
  LuBook,
  LuClock,
  LuAward,
  LuCalendar,
  LuBookOpen,
  LuStar,
  LuArrowRight
} from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useClasses } from '../hooks/useClasses'; // Asegurarse de tener estos hooks
import { getVideoThumbnail } from '../services/classesService'; // Nuevo import
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import DashboardNavbar from './DashboardNavbar';
import ComunidadPage from './ComunidadPage';
import HerramientasPage from './HerramientasPage';
import CRMPage from './CRMPage';
import ClasesPage from './ClasesPage';
import PerfilPage from './PerfilPage';
import ParashaPage from './ParashaPage';

const StatCard = ({ icon, title, value, color = '#F59E0B' }) => (
  <Card borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
    <CardBody>
      <HStack spacing={4}>
        <Box
          p={3}
          bg={`${color}10`}
          borderRadius="xl"
          color={color}
        >
          <Icon as={icon} boxSize={6} strokeWidth={2} />
        </Box>
        <VStack align="start" spacing={0}>
          <Text fontSize="2xl" fontWeight="800" color="gray.800" letterSpacing="-0.02em">
            {value}
          </Text>
          <Text fontSize="sm" color="gray.500" fontWeight="medium">
            {title}
          </Text>
        </VStack>
      </HStack>
    </CardBody>
  </Card>
);

const QuickAction = ({ icon, title, description, color = '#F59E0B', onClick }) => (
  <Card
    _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg', cursor: 'pointer', borderColor: color }}
    transition="all 0.2s"
    onClick={onClick}
    borderRadius="2xl"
    boxShadow="sm"
    border="1px solid"
    borderColor="gray.100"
    role="group"
  >
    <CardBody>
      <VStack spacing={4} align="start">
        <Box
          p={3}
          bg={`${color}10`}
          borderRadius="xl"
          color={color}
          transition="all 0.2s"
          _groupHover={{ bg: color, color: 'white' }}
        >
          <Icon as={icon} boxSize={6} strokeWidth={2} />
        </Box>
        <VStack align="start" spacing={1}>
          <Text fontWeight="700" fontSize="lg" color="gray.800">
            {title}
          </Text>
          <Text fontSize="sm" color="gray.500" lineHeight="tall">
            {description}
          </Text>
        </VStack>
        <Button
          variant="link"
          colorScheme="blue"
          size="sm"
          rightIcon={<Icon as={LuArrowRight} />}
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick();
          }}
          fontWeight="semibold"
        >
          Acceder
        </Button>
      </VStack>
    </CardBody>
  </Card>
);

// Componente de inicio del dashboard
const DashboardHome = () => {
  const { userProfile, userProgress, userActivities, loading, error } = useUser();
  const { classes } = useClasses();
  const navigate = useNavigate();

  // Calcular estadísticas reales
  const totalClasses = classes?.length || 0;
  const completedClasses = userProgress?.completedClasses?.length || 0;
  const totalDuration = classes?.reduce((total, cls) => total + (parseInt(cls.duration) || 0), 0) || 0;
  const studyHours = Math.round((completedClasses / (totalClasses || 1)) * (totalDuration / 60) * 10) / 10;

  if (loading) {
    return (
      <Box w="100%" h="80vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="blue.500" thickness="3px" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={8}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          Error al cargar los datos: {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box w="100%" maxW="95vw" mx="auto" py={8} px={{ base: 4, md: 6, lg: 8 }}>
      <VStack spacing={8} align="stretch">

        {/* Welcome Section */}
        <Box>
          <HStack spacing={4} mb={2}>
            <Avatar
              size="lg"
              name={userProfile?.name || 'Estudiante'}
              src={userProfile?.profileImage}
              bg="blue.500"
              color="white"
            />
            <VStack align="start" spacing={0}>
              <Heading size="lg" color="gray.800" letterSpacing="-0.02em">
                ¡Hola, {userProfile?.name?.split(' ')[0] || 'Estudiante'}! 👋
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Vamos a continuar con tu preparación.
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* PARASHA VIDEO SECTION - PREMIUM WIDGET */}
        {userProfile?.personalParasha?.videoUrl ? (
          <Box
            borderRadius="2xl"
            overflow="hidden"
            boxShadow="2xl"
            position="relative"
            h={{ base: "250px", md: "320px" }}
            bg="gray.900"
            role="group"
            cursor="pointer"
            onClick={() => navigate('/dashboard/parasha')}
            transition="all 0.3s"
            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
          >
            {/* Thumbnail */}
            <Image
              src={getVideoThumbnail(userProfile.personalParasha.videoUrl)}
              w="100%" h="100%" objectFit="cover"
              opacity={0.6}
              transition="transform 0.5s ease"
              _groupHover={{ transform: "scale(1.05)", opacity: 0.5 }}
            />

            {/* Gradient Overlay */}
            <Box position="absolute" top={0} left={0} w="100%" h="100%" bg="linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)" />

            {/* Play Button Center Overlay */}
            <Flex position="absolute" top="0" left="0" w="100%" h="100%" justify="center" align="center" opacity={0} _groupHover={{ opacity: 1, transform: "scale(1.1)" }} transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)">
              <Box p={5} bg="whiteAlpha.300" borderRadius="full" backdropFilter="blur(5px)" border="1px solid" borderColor="whiteAlpha.400" boxShadow="lg">
                <Icon as={LuPlay} boxSize={8} color="white" fill="white" ml={1} />
              </Box>
            </Flex>

            {/* Content */}
            <Flex position="absolute" bottom={0} left={0} w="100%" p={{ base: 6, md: 10 }} direction="column" justify="flex-end" align="start">
              <HStack mb={3} spacing={3}>
                <Badge colorScheme="yellow" px={2.5} py={0.5} borderRadius="full" fontSize="xs" fontWeight="bold" letterSpacing="wide" boxShadow="md">
                  <HStack spacing={1}>
                    <Icon as={LuStar} />
                    <Text>TU PARASHÁ</Text>
                  </HStack>
                </Badge>
                {userProfile.personalParasha.eventDate && (
                  <Badge colorScheme="blue" px={2.5} py={0.5} borderRadius="full" fontSize="xs" fontWeight="bold" letterSpacing="wide" boxShadow="md">
                    <HStack spacing={1}>
                      <Icon as={LuCalendar} />
                      <Text>FALTAN {Math.max(0, differenceInDays(new Date(userProfile.personalParasha.eventDate), new Date()))} DÍAS</Text>
                    </HStack>
                  </Badge>
                )}
              </HStack>

              <Heading color="white" size="2xl" fontFamily="'Playfair Display', serif" mb={1} textShadow="0 2px 10px rgba(0,0,0,0.5)">
                {userProfile.personalParasha.name}
              </Heading>

              <Text color="gray.300" fontSize="xl" fontWeight="medium" textShadow="0 1px 4px rgba(0,0,0,0.5)" fontFamily="serif">
                {userProfile.personalParasha.hebrew}
              </Text>
            </Flex>
          </Box>
        ) : userProfile?.personalParasha ? (
          <Card bg="gradient-to-r from-orange-50 to-yellow-50" borderColor="orange.200" borderWidth={1} borderRadius="2xl" overflow="hidden">
            <CardBody>
              <HStack spacing={5} align="center">
                <Box
                  p={4}
                  bg="orange.500"
                  borderRadius="2xl"
                  color="white"
                  boxShadow="lg"
                >
                  <Icon as={LuBookOpen} boxSize={8} />
                </Box>
                <VStack align="start" spacing={1} flex={1}>
                  <HStack spacing={2}>
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                      Tu parashá asignada:
                    </Text>
                    <Icon as={LuStar} color="orange.500" boxSize={4} fill="currentColor" />
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600" fontFamily="serif">
                    {userProfile.personalParasha.name} - {userProfile.personalParasha.hebrew}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {userProfile.personalParasha.reference}
                  </Text>
                </VStack>
                <Badge
                  colorScheme="green"
                  fontSize="sm"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  Asignada
                </Badge>
              </HStack>
            </CardBody>
          </Card>
        ) : (
          <Card bgGradient="linear(to-r, blue.50, indigo.50)" borderColor="blue.100" borderWidth={1} borderRadius="2xl">
            <CardBody p={8}>
              <Flex direction={{ base: 'column', md: 'row' }} align="center" gap={6}>
                <Box
                  p={4}
                  bg="blue.500"
                  borderRadius="2xl"
                  color="white"
                  boxShadow="xl"
                >
                  <Icon as={LuBookOpen} boxSize={8} />
                </Box>
                <VStack align="start" spacing={2} flex={1}>
                  <Heading size="md" color="gray.800">
                    ¿Cuál es tu Parashá?
                  </Heading>
                  <Text color="gray.600">
                    Solicita tu Parashá personalizada basada en tu fecha de nacimiento hebrea.
                  </Text>
                </VStack>
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={() => navigate('/dashboard/herramientas')}
                  rightIcon={<Icon as={LuArrowRight} />}
                  shadow="md"
                >
                  Solicitar Parashá
                </Button>
              </Flex>
            </CardBody>
          </Card>
        )}

        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <StatCard
            icon={LuPlay}
            title="Clases Completadas"
            value={`${completedClasses}/${totalClasses}`}
            color="#3B82F6"
          />
          <StatCard
            icon={LuClock}
            title="Horas de Estudio"
            value={`${studyHours}h`}
            color="#1E40AF"
          />
          <StatCard
            icon={LuAward}
            title="Nivel Actual"
            value={
              userProgress?.currentLevel === 'beginner' || userProgress?.currentLevel === 'basico' ? 'Básico' :
                userProgress?.currentLevel === 'intermediate' || userProgress?.currentLevel === 'intermedio' ? 'Intermedio' :
                  userProgress?.currentLevel === 'advanced' || userProgress?.currentLevel === 'avanzado' ? 'Avanzado' : 'Básico'
            }
            color="#7C3AED"
          />
        </SimpleGrid>

        {/* Quick Actions */}
        <Box>
          <Heading size="md" mb={6} color="gray.800">Accesos Rápidos</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            <QuickAction
              icon={LuPlay}
              title="Continuar Clase"
              description={`Lección ${completedClasses + 1}: ${completedClasses < 5 ? 'Rezos Básicos' : 'Taamim'}`}
              color="#3B82F6"
              onClick={() => navigate('/dashboard/clases')}
            />
            <QuickAction
              icon={LuUsers}
              title="Comunidad"
              description="Chat de estudiantes"
              color="#10B981"
              onClick={() => navigate('/dashboard/comunidad')}
            />
            <QuickAction
              icon={LuCalendar}
              title="Próxima Sesión"
              description={userProfile?.studyPlan === 'alef' ? 'Estudio autodidacta' : 'Clase privada'}
              color="#F59E0B"
              onClick={() => navigate('/dashboard/herramientas')}
            />
          </SimpleGrid>
        </Box>

        {/* Recent Activity */}
        <Card borderRadius="2xl" border="1px solid" borderColor="gray.100" boxShadow="sm">
          <CardHeader borderBottom="1px solid" borderColor="gray.50" pb={4}>
            <Heading size="md" color="gray.800">Actividad Reciente</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {userActivities && userActivities.length > 0 ? (
                userActivities.map((activity, index) => (
                  <HStack key={index} justify="space-between" p={3} _hover={{ bg: 'gray.50', borderRadius: 'lg' }} transition="all 0.2s">
                    <HStack spacing={4}>
                      <Box p={2} bg="blue.50" borderRadius="full" color="blue.500">
                        <Icon
                          as={activity.type === 'lesson_completed' ? LuPlay : activity.type === 'achievement_unlocked' ? LuAward : LuUsers}
                          boxSize={4}
                        />
                      </Box>
                      <Text fontWeight="medium" color="gray.700">{activity.description || activity.content || 'Actividad registrada'}</Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.400" fontWeight="medium">
                      {activity.timestamp ? formatDistanceToNow(activity.timestamp.toDate(), { addSuffix: true, locale: es }) : 'Reciente'}
                    </Text>
                  </HStack>
                ))
              ) : (
                <Flex direction="column" align="center" justify="center" py={8} opacity={0.5}>
                  <Icon as={LuClock} boxSize={8} mb={2} />
                  <Text>No hay actividad reciente</Text>
                </Flex>
              )}
            </VStack>
          </CardBody>
        </Card>

      </VStack>
    </Box>
  );
};

// Componente principal del Dashboard
const Dashboard = () => {
  const location = useLocation();
  const { isAdmin, loading } = useUser();

  // Determinar la página actual basado en la URL
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path.includes('/comunidad')) return 'comunidad';
    if (path.includes('/clases')) return 'clases';
    if (path.includes('/herramientas')) return 'herramientas';
    if (path.includes('/crm')) return 'crm';
    if (path.includes('/perfil')) return 'perfil';
    if (path.includes('/parasha')) return 'parasha';
    return 'inicio';
  };

  // Determinar qué contenido mostrar basado en la URL
  const renderContent = () => {
    const path = location.pathname;

    if (path.includes('/comunidad')) {
      return <ComunidadPage />;
    } else if (path.includes('/clases')) {
      return <ClasesPage />;
    } else if (path.includes('/herramientas')) {
      return <HerramientasPage />;
    } else if (path.includes('/crm')) {
      if (loading) return <Spinner />;
      return isAdmin ? <CRMPage /> : (
        <Alert status="error" m={4}>
          <AlertIcon />
          Acceso denegado. Solo administradores.
        </Alert>
      );
    } else if (path.includes('/perfil')) {
      return <PerfilPage />;
    } else if (path.includes('/parasha')) {
      return <ParashaPage />;
    } else {
      return <DashboardHome />;
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <DashboardNavbar currentPage={getCurrentPage()} />
      {renderContent()}
    </Box>
  );
};

export default Dashboard;