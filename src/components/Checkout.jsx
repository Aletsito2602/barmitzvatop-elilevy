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
  InputGroup,
  InputRightElement,
  FormControl,
  FormLabel,
  Select,
  Divider,
  Icon,
  SimpleGrid,
  Card,
  CardBody,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Spinner,
  FormErrorMessage,
  IconButton
} from '@chakra-ui/react';
import { FaLock, FaCreditCard, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowLeft, FaCheckCircle, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { supabase } from '../supabase/client';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  // Get plan from state or localStorage
  let selectedPlan = location.state?.plan;

  if (!selectedPlan) {
    try {
      const storedPlan = localStorage.getItem('selectedPlan');
      if (storedPlan) {
        selectedPlan = JSON.parse(storedPlan);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }

  // Default plan if none found
  if (!selectedPlan) {
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
        { text: 'Parashá personalizada según tu fecha' },
        { text: 'Video: Puesta del Tefilín' },
        { text: 'Kidush de Shabat' }
      ]
    };
  }

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Formulario incompleto",
        description: "Por favor completa todos los campos requeridos",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Encode password in base64 for secure transmission
      const encodedPassword = btoa(formData.password);

      // Call Supabase Edge Function to create Stripe Checkout Session
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          country: formData.country,
          planName: selectedPlan.name,
          userPassword: encodedPassword // Send encoded password
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        // Clear localStorage before redirecting
        localStorage.removeItem('selectedPlan');

        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No se recibió URL de pago');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error al procesar",
        description: error.message || "Hubo un problema al crear la sesión de pago. Por favor intenta nuevamente.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

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
          {/* Checkout Form */}
          <Card>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                  <Heading size="md" color="gray.800">
                    <Icon as={FaUser} mr={2} />
                    Información Personal
                  </Heading>

                  <HStack spacing={4}>
                    <FormControl isRequired isInvalid={errors.firstName}>
                      <FormLabel>Nombre</FormLabel>
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Tu nombre"
                        disabled={isLoading}
                      />
                      <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={errors.lastName}>
                      <FormLabel>Apellido</FormLabel>
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Tu apellido"
                        disabled={isLoading}
                      />
                      <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                    </FormControl>
                  </HStack>

                  <FormControl isRequired isInvalid={errors.email}>
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
                      disabled={isLoading}
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Usarás este email para iniciar sesión
                    </Text>
                  </FormControl>

                  <HStack spacing={4}>
                    <FormControl isRequired isInvalid={errors.phone}>
                      <FormLabel>
                        <Icon as={FaPhone} mr={2} />
                        Teléfono
                      </FormLabel>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 234 567 8900"
                        disabled={isLoading}
                      />
                      <FormErrorMessage>{errors.phone}</FormErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={errors.country}>
                      <FormLabel>
                        <Icon as={FaMapMarkerAlt} mr={2} />
                        País
                      </FormLabel>
                      <Select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Selecciona país"
                        disabled={isLoading}
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
                        <option value="Israel">Israel</option>
                        <option value="Otro">Otro</option>
                      </Select>
                      <FormErrorMessage>{errors.country}</FormErrorMessage>
                    </FormControl>
                  </HStack>

                  <Divider />

                  {/* Password Section */}
                  <Heading size="md" color="gray.800">
                    <Icon as={FaLock} mr={2} />
                    Crear tu Cuenta
                  </Heading>

                  <FormControl isRequired isInvalid={errors.password}>
                    <FormLabel>Contraseña</FormLabel>
                    <InputGroup>
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Mínimo 6 caracteres"
                        disabled={isLoading}
                      />
                      <InputRightElement>
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={errors.confirmPassword}>
                    <FormLabel>Confirmar Contraseña</FormLabel>
                    <InputGroup>
                      <Input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Repite tu contraseña"
                        disabled={isLoading}
                      />
                      <InputRightElement>
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                  </FormControl>

                  <Divider />

                  {/* Security Notice */}
                  <Alert status="info" borderRadius="lg">
                    <AlertIcon as={FaShieldAlt} />
                    <Box fontSize="sm">
                      <AlertTitle>Pago seguro con Stripe</AlertTitle>
                      <AlertDescription>
                        Serás redirigido a Stripe para completar el pago.
                        Tu cuenta se creará automáticamente después del pago.
                      </AlertDescription>
                    </Box>
                  </Alert>

                  <Button
                    type="submit"
                    bg={selectedPlan.color}
                    color="white"
                    size="lg"
                    fontWeight="bold"
                    _hover={{ opacity: 0.9, transform: 'translateY(-2px)' }}
                    _active={{ transform: 'translateY(0)' }}
                    leftIcon={isLoading ? <Spinner size="sm" /> : <FaCreditCard />}
                    isDisabled={isLoading}
                    transition="all 0.2s"
                  >
                    {isLoading ? 'Procesando...' : `Pagar $${selectedPlan.price}/año`}
                  </Button>

                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    🔒 Tu información está protegida con encriptación SSL
                  </Text>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Plan Summary */}
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
                        <Icon as={FaCheckCircle} color={selectedPlan.color} />
                        <Text fontSize="sm" color="gray.700">{feature.text}</Text>
                      </HStack>
                    ))}
                  </VStack>
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