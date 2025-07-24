import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
  Link,
  Divider,
  SimpleGrid,
  Select,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createUserProfile } from '../services/userService';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();

  const countries = [
    'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica', 
    'Cuba', 'Ecuador', 'El Salvador', 'España', 'Estados Unidos', 'Guatemala', 
    'Honduras', 'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 
    'Puerto Rico', 'República Dominicana', 'Uruguay', 'Venezuela'
  ];

  // Check for pending user data from checkout
  useEffect(() => {
    const pendingData = localStorage.getItem('pendingUserData');
    if (pendingData) {
      try {
        const userData = JSON.parse(pendingData);
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          country: userData.country || '',
          password: userData.password || '',
          confirmPassword: userData.password || ''
        });
        
        toast({
          title: "Datos del pago detectados",
          description: "Hemos completado automáticamente tus datos del proceso de pago",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error parsing pending user data:', error);
      }
    }
  }, [toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!formData.country) {
      newErrors.country = 'El país es requerido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // 1. Create Firebase Auth user
      const authResult = await register(formData.email, formData.password);
      
      if (authResult.success) {
        // 2. Create user profile in Firestore with initial KPIs
        const profileResult = await createUserProfile(authResult.user.uid, {
          name: `${formData.firstName} ${formData.lastName}`,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          uid: authResult.user.uid,
          
          // Initial KPIs and stats - all start at 0
          studyPlan: 'alef',
          totalStudyTime: 0,
          lessonsCompleted: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalLogins: 1, // First login
          averageSessionTime: 0,
          weeklyGoalMinutes: 60, // Default 1 hour per week
          monthlyProgress: 0,
          
          // Profile completion tracking
          profileCompleted: false,
          barmitzvaDateSet: false,
          
          // Preferences
          preferences: {
            language: 'es',
            notifications: true,
            emailNotifications: true,
            timezone: 'America/Panama',
            theme: 'light'
          }
        });

        if (profileResult.success) {
          // Clean up pending user data after successful registration
          localStorage.removeItem('pendingUserData');
          
          toast({
            title: '¡Cuenta creada exitosamente!',
            description: 'Bienvenido a tu plataforma de preparación para el Barmitzva.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          navigate('/dashboard');
        } else {
          throw new Error(profileResult.error);
        }
      } else {
        // Handle Firebase Auth errors
        let friendlyMessage = 'No pudimos crear tu cuenta. Intenta nuevamente.';
        
        if (authResult.error.includes('email-already-in-use')) {
          friendlyMessage = 'Ya existe una cuenta con este email. ¿Te gustaría iniciar sesión?';
        } else if (authResult.error.includes('weak-password')) {
          friendlyMessage = 'La contraseña es muy débil. Usa al menos 6 caracteres.';
        } else if (authResult.error.includes('invalid-email')) {
          friendlyMessage = 'El email no es válido. Verifica que esté bien escrito.';
        }
        
        toast({
          title: 'Error al crear la cuenta',
          description: friendlyMessage,
          status: 'error',
          duration: 6000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Error inesperado',
        description: 'Ocurrió un error al crear tu cuenta. Por favor intenta nuevamente.',
        status: 'error',
        duration: 6000,
        isClosable: true,
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Box 
      minH="100vh" 
      bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={{ base: 4, md: 8, lg: 12 }}
    >
      {/* Patrón de fondo decorativo */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.1}
        bgImage="radial-gradient(circle at 25px 25px, white 2px, transparent 0), radial-gradient(circle at 75px 75px, white 2px, transparent 0)"
        bgSize="100px 100px"
      />
      
      <Box 
        position="relative" 
        zIndex={1} 
        w="100%"
        maxW={{ base: "90%", sm: "500px", md: "700px", lg: "800px", xl: "900px" }}
        mx="auto"
      >
        <VStack spacing={{ base: 6, md: 8 }}>
          <VStack spacing={{ base: 4, md: 6 }} textAlign="center">
            <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} color="white" textShadow="0 2px 4px rgba(0,0,0,0.3)">
              Crear Cuenta
            </Heading>
            <Text fontSize={{ base: "md", md: "lg", lg: "xl" }} color="whiteAlpha.900">
              Únete a la plataforma de preparación para el Barmitzva
            </Text>
          </VStack>

          <Box
            bg="rgba(255, 255, 255, 0.95)"
            backdropFilter="blur(10px)"
            p={{ base: 8, md: 10, lg: 12 }}
            borderRadius="xl"
            boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            w="100%"
            border="1px solid rgba(255, 255, 255, 0.2)"
          >
            <Stack spacing={{ base: 6, md: 8 }} as="form" onSubmit={handleRegister}>
              
              {/* Información Personal */}
              <Box>
                <Heading size="md" mb={4} color="gray.700">Información Personal</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired isInvalid={errors.firstName}>
                    <FormLabel color="gray.700" fontWeight="medium">Nombre*</FormLabel>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Tu nombre"
                      size={{ base: "md", md: "lg" }}
                      bg="white"
                      borderColor="gray.200"
                      _hover={{ borderColor: "#38BDF8" }}
                      _focus={{ borderColor: "#38BDF8", boxShadow: "0 0 0 1px #38BDF8" }}
                    />
                    <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={errors.lastName}>
                    <FormLabel color="gray.700" fontWeight="medium">Apellido*</FormLabel>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Tu apellido"
                      size={{ base: "md", md: "lg" }}
                      bg="white"
                      borderColor="gray.200"
                      _hover={{ borderColor: "#38BDF8" }}
                      _focus={{ borderColor: "#38BDF8", boxShadow: "0 0 0 1px #38BDF8" }}
                    />
                    <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                  </FormControl>
                </SimpleGrid>
              </Box>

              {/* Información de Contacto */}
              <Box>
                <Heading size="md" mb={4} color="gray.700">Información de Contacto</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired isInvalid={errors.email}>
                    <FormLabel color="gray.700" fontWeight="medium">Email*</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                      size={{ base: "md", md: "lg" }}
                      bg="white"
                      borderColor="gray.200"
                      _hover={{ borderColor: "#38BDF8" }}
                      _focus={{ borderColor: "#38BDF8", boxShadow: "0 0 0 1px #38BDF8" }}
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={errors.phone}>
                    <FormLabel color="gray.700" fontWeight="medium">Teléfono*</FormLabel>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 234 567 8900"
                      size={{ base: "md", md: "lg" }}
                      bg="white"
                      borderColor="gray.200"
                      _hover={{ borderColor: "#38BDF8" }}
                      _focus={{ borderColor: "#38BDF8", boxShadow: "0 0 0 1px #38BDF8" }}
                    />
                    <FormErrorMessage>{errors.phone}</FormErrorMessage>
                  </FormControl>
                </SimpleGrid>

                <FormControl isRequired isInvalid={errors.country} mt={4}>
                  <FormLabel color="gray.700" fontWeight="medium">País*</FormLabel>
                  <Select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Selecciona tu país"
                    size={{ base: "md", md: "lg" }}
                    bg="white"
                    borderColor="gray.200"
                    _hover={{ borderColor: "#38BDF8" }}
                    _focus={{ borderColor: "#38BDF8", boxShadow: "0 0 0 1px #38BDF8" }}
                  >
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.country}</FormErrorMessage>
                </FormControl>
              </Box>

              {/* Seguridad */}
              <Box>
                <Heading size="md" mb={4} color="gray.700">Seguridad</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired isInvalid={errors.password}>
                    <FormLabel color="gray.700" fontWeight="medium">Contraseña*</FormLabel>
                    <Input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      size={{ base: "md", md: "lg" }}
                      bg="white"
                      borderColor="gray.200"
                      _hover={{ borderColor: "#38BDF8" }}
                      _focus={{ borderColor: "#38BDF8", boxShadow: "0 0 0 1px #38BDF8" }}
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={errors.confirmPassword}>
                    <FormLabel color="gray.700" fontWeight="medium">Confirmar Contraseña*</FormLabel>
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      size={{ base: "md", md: "lg" }}
                      bg="white"
                      borderColor="gray.200"
                      _hover={{ borderColor: "#38BDF8" }}
                      _focus={{ borderColor: "#38BDF8", boxShadow: "0 0 0 1px #38BDF8" }}
                    />
                    <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                  </FormControl>
                </SimpleGrid>
              </Box>

              <Button
                type="submit"
                bg="#38BDF8"
                color="white"
                size={{ base: "md", md: "lg" }}
                fontSize={{ base: "sm", md: "md" }}
                h={{ base: "50px", md: "56px" }}
                _hover={{
                  bg: '#0ea5e9',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 25px rgba(56, 189, 248, 0.3)',
                }}
                transition="all 0.2s"
                isLoading={isLoading}
                loadingText="Creando cuenta..."
              >
                Crear Mi Cuenta
              </Button>
            </Stack>

            <Divider my={6} borderColor="gray.300" />

            <VStack spacing={4}>
              <Text fontSize="sm" color="gray.600">
                ¿Ya tienes una cuenta?
              </Text>
              <Link
                color="#38BDF8"
                fontWeight="medium"
                onClick={() => navigate('/login')}
                _hover={{ textDecoration: 'underline', color: '#0ea5e9', cursor: 'pointer' }}
                transition="color 0.2s"
              >
                Inicia sesión aquí
              </Link>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default Register;