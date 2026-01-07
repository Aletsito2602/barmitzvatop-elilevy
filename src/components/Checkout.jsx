import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  Divider,
  Badge,
  Icon,
  SimpleGrid,
  Card,
  CardBody,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast
} from '@chakra-ui/react';
import { FaLock, FaCreditCard, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowLeft, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Intentar obtener plan desde state o localStorage
  let selectedPlan = location.state?.plan;
  
  console.log('Location state plan:', location.state?.plan);
  console.log('Current selectedPlan:', selectedPlan);
  
  if (!selectedPlan) {
    try {
      const storedPlan = localStorage.getItem('selectedPlan');
      console.log('Stored plan in localStorage:', storedPlan);
      if (storedPlan) {
        selectedPlan = JSON.parse(storedPlan);
        console.log('Parsed stored plan:', selectedPlan);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }
  
  // Si aún no hay plan, crear uno por defecto para Alef
  if (!selectedPlan) {
    console.log('No plan found, creating default Alef plan');
    selectedPlan = {
      name: 'Alef (א)',
      desc: 'Ideal para principiantes que buscan aprender los rezos básicos de manera autodidacta y comenzar su preparación para el Barmitzva.',
      price: 350,
      color: '#F59E0B',
      features: [
        { text: 'Introducción al curso' },
        { text: 'Consejos para el curso' },
        { text: 'Letras y vocales básicas' },
        { text: 'Berajot principales: Talit, Tefilín, Sheejeyanu' },
        { text: 'Rezo H\' melej (cantado)' },
        { text: 'Rezo Shema (con taamim)' },
        { text: 'Parashá (según tu fecha de nacimiento, te ayudaré a saber cuál es tu Parashá y la asignaré para ti en la plataforma)' },
        { text: 'Video: Puesta del Tefilín' },
        { text: 'Kidush de Shabat (viernes a la noche)' }
      ]
    };
    // Guardar el plan por defecto
    localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
  }
  
  console.log('Final selectedPlan:', selectedPlan);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    password: '',
    confirmPassword: '',
    comments: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAlreadyPaid, setShowAlreadyPaid] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validar que la contraseña tenga al menos 6 caracteres
    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Guardar datos del usuario en localStorage para registro posterior
    localStorage.setItem('pendingUserData', JSON.stringify({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      password: formData.password,
      plan: selectedPlan.name
    }));
    
    // Limpiar localStorage del plan
    localStorage.removeItem('selectedPlan');
    
    // Redirigir a Stripe para el plan Alef
    console.log('Selected plan name:', selectedPlan.name);
    if (selectedPlan.name === 'Alef (א)' || selectedPlan.name.includes('Alef')) {
      window.open('https://buy.stripe.com/4gM7sM3p5epA8Z0aSH8IU03', '_blank');
      
      toast({
        title: "Redirigiendo a Stripe",
        description: "Se abrió una nueva ventana para completar el pago. Cuando termines, regresa aquí y presiona 'Ya Pagué'.",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      
      // Mostrar botón "Ya Pagué" inmediatamente
      setShowAlreadyPaid(true);
    } else {
      toast({
        title: "Plan no disponible",
        description: "Este plan estará disponible próximamente",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAlreadyPaid = () => {
    toast({
      title: "¡Excelente!",
      description: "Redirigiendo al login para acceder a tu cuenta",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  // Eliminamos el check de plan no seleccionado ya que ahora siempre creamos un plan por defecto

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="7xl">
        {/* Header */}
        <VStack spacing={6} mb={8}>
          <Button
            leftIcon={<FaArrowLeft />}
            variant="ghost"
            alignSelf="start"
            onClick={() => navigate('/')}
          >
            Volver a Precios
          </Button>
          <Heading textAlign="center" color="gray.800">
            Finalizar Inscripción
          </Heading>
          <Text textAlign="center" color="gray.600" fontSize="lg">
            Completa tu información para acceder a Barmitzvatop
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Formulario de Checkout */}
          <Card>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                  <Heading size="md" color="gray.800">
                    <Icon as={FaUser} mr={2} />
                    Información Personal
                  </Heading>

                  <HStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Nombre</FormLabel>
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Tu nombre"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Apellido</FormLabel>
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Tu apellido"
                      />
                    </FormControl>
                  </HStack>

                  <FormControl isRequired>
                    <FormLabel>
                      <Icon as={FaEnvelope} mr={2} />
                      Email
                    </FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                    />
                  </FormControl>

                  <HStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>
                        <Icon as={FaPhone} mr={2} />
                        Teléfono
                      </FormLabel>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 234 567 8900"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>
                        <Icon as={FaMapMarkerAlt} mr={2} />
                        País
                      </FormLabel>
                      <Select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Selecciona país"
                      >
                        <option value="Argentina">Argentina</option>
                        <option value="México">México</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Chile">Chile</option>
                        <option value="Perú">Perú</option>
                        <option value="Venezuela">Venezuela</option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Estados Unidos">Estados Unidos</option>
                        <option value="España">España</option>
                        <option value="Panamá">Panamá</option>
                        <option value="Otro">Otro</option>
                      </Select>
                    </FormControl>
                  </HStack>

                  <Divider />

                  <Heading size="md" color="gray.800">
                    <Icon as={FaLock} mr={2} />
                    Crear tu Cuenta
                  </Heading>

                  <FormControl isRequired>
                    <FormLabel>Contraseña</FormLabel>
                    <HStack>
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Mínimo 6 caracteres"
                      />
                      <Button
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                        p={2}
                      >
                        <Icon as={showPassword ? FaEyeSlash : FaEye} />
                      </Button>
                    </HStack>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Confirmar Contraseña</FormLabel>
                    <HStack>
                      <Input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Repite tu contraseña"
                      />
                      <Button
                        variant="ghost"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        p={2}
                      >
                        <Icon as={showConfirmPassword ? FaEyeSlash : FaEye} />
                      </Button>
                    </HStack>
                  </FormControl>

                  <Divider />


                  <FormControl>
                    <FormLabel>Comentarios adicionales (opcional)</FormLabel>
                    <Textarea
                      name="comments"
                      value={formData.comments}
                      onChange={handleInputChange}
                      placeholder="¿Algo específico que quieras comentar sobre tu preparación?"
                      rows={3}
                    />
                  </FormControl>

                  {!showAlreadyPaid ? (
                    <Button
                      type="submit"
                      bg={selectedPlan.color}
                      color="white"
                      size="lg"
                      fontWeight="bold"
                      _hover={{ opacity: 0.8 }}
                      leftIcon={<FaCreditCard />}
                    >
                      Proceder al Pago - ${selectedPlan.price}
                    </Button>
                  ) : (
                    <VStack spacing={3}>
                      <Alert status="success" borderRadius="lg">
                        <AlertIcon />
                        <Box>
                          <AlertTitle>¡Pago en proceso!</AlertTitle>
                          <AlertDescription>
                            ¿Ya completaste tu pago en Stripe?
                          </AlertDescription>
                        </Box>
                      </Alert>
                      <Button
                        bg="green.500"
                        color="white"
                        size="lg"
                        fontWeight="bold"
                        _hover={{ bg: "green.600" }}
                        leftIcon={<FaCheckCircle />}
                        onClick={handleAlreadyPaid}
                        w="100%"
                      >
                        ✅ Ya Pagué - Acceder a mi Cuenta
                      </Button>
                    </VStack>
                  )}

                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    🔒 Tu información está protegida con encriptación SSL
                  </Text>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Resumen del Plan */}
          <Card>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <Heading size="md" color="gray.800">
                  Resumen de tu Plan
                </Heading>

                <Box
                  bg={selectedPlan.color}
                  color="white"
                  p={6}
                  borderRadius="xl"
                  textAlign="center"
                >
                  <Text fontSize="3xl" fontWeight="bold">{selectedPlan.name}</Text>
                  <Text fontSize="4xl" fontWeight="bold" mt={2}>
                    ${selectedPlan.price}
                    <Text as="span" fontSize="lg" fontWeight="normal"> /año</Text>
                  </Text>
                </Box>

                <Text color="gray.600" fontSize="lg">{selectedPlan.desc}</Text>

                <Box>
                  <Text fontWeight="bold" mb={3} color="gray.800">
                    ✨ Lo que incluye tu plan:
                  </Text>
                  <VStack align="start" spacing={2}>
                    {selectedPlan.features.map((feature, idx) => (
                      <HStack key={idx} spacing={3}>
                        <Icon as={feature.icon} color={selectedPlan.color} />
                        <Text fontSize="sm" color="gray.700">{feature.text}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>

                {selectedPlan.detailedInfo && (
                  <Box>
                    <Text fontWeight="bold" mb={3} color="gray.800">
                      📋 Detalles del curso:
                    </Text>
                    <VStack align="start" spacing={2} fontSize="sm" color="gray.600">
                      <Text>⏱️ Duración: {selectedPlan.detailedInfo.duration}</Text>
                      <Text>📚 Contenido: {selectedPlan.detailedInfo.totalHours}</Text>
                      <Text>🎯 {selectedPlan.detailedInfo.bestFor}</Text>
                      <Text>📞 {selectedPlan.detailedInfo.support}</Text>
                      <Text>🏆 {selectedPlan.detailedInfo.certificate}</Text>
                    </VStack>
                  </Box>
                )}

                <Alert status="info" borderRadius="lg">
                  <AlertIcon />
                  <Box fontSize="sm">
                    <AlertTitle>¡Acceso inmediato!</AlertTitle>
                    <AlertDescription>
                      Una vez completado el pago, recibirás acceso instantáneo a la plataforma.
                    </AlertDescription>
                  </Box>
                </Alert>

                <Box bg="green.50" p={4} borderRadius="lg" border="1px solid" borderColor="green.200">
                  <Text fontWeight="bold" color="green.700" mb={2}>
                    🎉 Garantía de satisfacción
                  </Text>
                  <Text fontSize="sm" color="green.600">
                    Si no estás completamente satisfecho, tienes 30 días para solicitar un reembolso completo.
                  </Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Checkout; 