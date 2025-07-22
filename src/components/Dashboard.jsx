import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Progress,
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
} from '@chakra-ui/react';
import { FaPlay, FaUsers, FaBook, FaClock, FaAward, FaCalendarAlt, FaBookOpen, FaStar } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useClasses } from '../hooks/useClasses';
import { calculateSkillProgress } from '../services/userService';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import DashboardNavbar from './DashboardNavbar';
import ComunidadPage from './ComunidadPage';
import HerramientasPage from './HerramientasPage';
import CRMPage from './CRMPage';
import ClasesPage from './ClasesPage';
import PerfilPage from './PerfilPage';

const StatCard = ({ icon, title, value, color = '#F59E0B' }) => (
  <Card>
    <CardBody>
      <HStack spacing={4}>
        <Box
          p={3}
          bg={`${color}20`}
          borderRadius="lg"
        >
          <Icon as={icon} color={color} boxSize={6} />
        </Box>
        <VStack align="start" spacing={1}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            {value}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {title}
          </Text>
        </VStack>
      </HStack>
    </CardBody>
  </Card>
);

const QuickAction = ({ icon, title, description, color = '#F59E0B' }) => (
  <Card _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }} transition="all 0.2s">
    <CardBody>
      <VStack spacing={4} align="start">
        <Icon as={icon} color={color} boxSize={8} />
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold" fontSize="lg">
            {title}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {description}
          </Text>
        </VStack>
        <Button colorScheme="messenger" bg={color} size="sm">
          Ver más
        </Button>
      </VStack>
    </CardBody>
  </Card>
);

// Componente de inicio del dashboard
const DashboardHome = () => {
  const { userProfile, userProgress, userActivities, personalParasha, loading, error } = useUser();
  const { classes, loading: classesLoading } = useClasses();
  
  // Calcular estadísticas reales
  const totalClasses = classes.length;
  const completedClasses = userProgress?.completedClasses?.length || 0;
  const totalDuration = classes.reduce((total, cls) => total + (parseInt(cls.duration) || 0), 0);
  const studyHours = Math.round((completedClasses / (totalClasses || 1)) * (totalDuration / 60) * 10) / 10;

  if (loading) {
    return (
      <Box w="100%" maxW="95vw" mx="auto" py={8} px={{ base: 4, md: 6, lg: 8 }}>
        <VStack spacing={4} align="center" justify="center" minH="400px">
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.600">Cargando tu información...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box w="100%" maxW="95vw" mx="auto" py={8} px={{ base: 4, md: 6, lg: 8 }}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          Error al cargar los datos: {error}
        </Alert>
      </Box>
    );
  }

  // Calculate real-time skill progress based on completed classes
  const realSkillProgress = calculateSkillProgress(
    userProgress?.completedClasses || [],
    userProgress?.totalLessons || 24
  );

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
                bg="#3B82F6" 
              />
              <VStack align="start" spacing={1}>
                <Heading size="lg" color="gray.800">
                  ¡Bienvenido de vuelta, {userProfile?.name || 'Estudiante'}!
                </Heading>
                <Text color="gray.600">
                  Continúa tu preparación para el Barmitzva
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* Tu Parashá Section - Dynamic */}
          {userProfile?.personalParasha ? (
            <Card bg="gradient-to-r from-orange-50 to-yellow-50" borderColor="#F59E0B" borderWidth={2}>
              <CardBody>
                <HStack spacing={4} align="center">
                  <Box
                    p={3}
                    bg="#F59E0B"
                    borderRadius="full"
                    color="white"
                  >
                    <Icon as={FaBookOpen} boxSize={6} />
                  </Box>
                  <VStack align="start" spacing={1} flex={1}>
                    <HStack spacing={2}>
                      <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        Tu parashá es:
                      </Text>
                      <Icon as={FaStar} color="#F59E0B" boxSize={4} />
                    </HStack>
                    <Text fontSize="xl" fontWeight="bold" color="#3B82F6">
                      {userProfile.personalParasha.name} - {userProfile.personalParasha.hebrew}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {userProfile.personalParasha.reference} • Personalizada
                    </Text>
                  </VStack>
                <Badge
                  colorScheme="green"
                  fontSize="xs"
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
            <Card bg="gradient-to-r from-blue-50 to-indigo-50" borderColor="#3B82F6" borderWidth={2}>
              <CardBody>
                <HStack spacing={4} align="center">
                  <Box
                    p={3}
                    bg="#3B82F6"
                    borderRadius="full"
                    color="white"
                  >
                    <Icon as={FaBookOpen} boxSize={6} />
                  </Box>
                  <VStack align="start" spacing={1} flex={1}>
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                      ¿Cuál es tu Parashá?
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Solicita tu Parashá personalizada basada en tu fecha de nacimiento
                    </Text>
                  </VStack>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => window.location.href = '/dashboard/herramientas'}
                  >
                    Solicitar Parashá
                  </Button>
                </HStack>
              </CardBody>
            </Card>
          )}

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            <StatCard
              icon={FaPlay}
              title="Clases Completadas"
              value={`${completedClasses}/${totalClasses}`}
              color="#3B82F6"
            />
            <StatCard
              icon={FaClock}
              title="Horas de Estudio"
              value={`${studyHours}h`}
              color="#1E40AF"
            />
            <StatCard
              icon={FaBook}
              title="Nivel Actual"
              value={
                userProgress?.currentLevel === 'beginner' || userProgress?.currentLevel === 'basico' ? 'Básico' : 
                userProgress?.currentLevel === 'intermediate' || userProgress?.currentLevel === 'intermedio' ? 'Intermedio' : 
                userProgress?.currentLevel === 'advanced' || userProgress?.currentLevel === 'avanzado' ? 'Avanzado' : 'Básico'
              }
              color="#1E3A8A"
            />
          </SimpleGrid>


          {/* Quick Actions */}
          <Box>
            <Heading size="md" mb={6}>Accesos Rápidos</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              <QuickAction
                icon={FaPlay}
                title="Continuar Clase"
                description={`Lección ${completedClasses + 1}: ${completedClasses < 5 ? 'Rezos Básicos' : 'Taamim Avanzados'}`}
                color="#3B82F6"
              />
              <QuickAction
                icon={FaUsers}
                title="Comunidad"
                description="Conecta con otros estudiantes"
                color="#1E40AF"
              />
              <QuickAction
                icon={FaCalendarAlt}
                title="Próxima Sesión"
                description={userProfile?.studyPlan === 'alef' ? 'Estudio autodidacta' : 'Clase privada programada'}
                color="#1E3A8A"
              />
            </SimpleGrid>
          </Box>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <Heading size="md">Actividad Reciente</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {userActivities && userActivities.length > 0 ? (
                  userActivities.map((activity, index) => (
                    <HStack key={index} justify="space-between">
                      <HStack spacing={3}>
                        <Icon 
                          as={activity.type === 'lesson_completed' ? FaPlay : activity.type === 'achievement_unlocked' ? FaAward : FaUsers} 
                          color="#3B82F6" 
                        />
                        <Text>{activity.description || activity.content || 'Actividad registrada'}</Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        {activity.timestamp ? formatDistanceToNow(activity.timestamp.toDate(), { addSuffix: true, locale: es }) : 'Reciente'}
                      </Text>
                    </HStack>
                  ))
                ) : (
                  <Text color="gray.500" textAlign="center" py={4}>
                    No hay actividad reciente. ¡Comienza a estudiar para ver tu progreso aquí!
                  </Text>
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
  
  // Determinar la página actual basado en la URL
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path.includes('/comunidad')) return 'comunidad';
    if (path.includes('/clases')) return 'clases';
    if (path.includes('/herramientas')) return 'herramientas';
    if (path.includes('/crm')) return 'crm';
    if (path.includes('/perfil')) return 'perfil';
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
      return <CRMPage />;
    } else if (path.includes('/perfil')) {
      return <PerfilPage />;
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