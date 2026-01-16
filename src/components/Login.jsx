import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
  Link,
  Icon,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LuLogIn, LuEye, LuEyeOff, LuMail, LuLock } from 'react-icons/lu';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast({
        title: '¡Bienvenido!',
        description: 'Has iniciado sesión exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    } else {
      // Mensajes de error más amigables
      let friendlyMessage = 'Por favor, revisa tus datos e intenta nuevamente.';

      if (result.error.includes('user-not-found') || result.error.includes('User not found')) {
        friendlyMessage = 'No encontramos una cuenta con este email.';
      } else if (result.error.includes('wrong-password') || result.error.includes('invalid-credential') || result.error.includes('Invalid login')) {
        friendlyMessage = 'La contraseña no es correcta.';
      } else if (result.error.includes('invalid-email')) {
        friendlyMessage = 'Por favor, ingresa un email válido.';
      } else if (result.error.includes('too-many-requests')) {
        friendlyMessage = 'Demasiados intentos. Espera unos minutos.';
      }

      toast({
        title: 'No pudimos acceder',
        description: friendlyMessage,
        status: 'error',
        duration: 5000,
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
      p={{ base: 4, md: 8 }}
    >
      {/* Patrón de fondo decorativo */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.1}
        bgImage="radial-gradient(circle at 25px 25px, white 2px, transparent 0)"
        bgSize="50px 50px"
      />

      <Box
        position="relative"
        zIndex={1}
        w="100%"
        maxW="450px"
        mx="auto"
      >
        <VStack spacing={6}>
          {/* Header */}
          <VStack spacing={3} textAlign="center">
            <Box p={4} bg="whiteAlpha.200" borderRadius="full">
              <Icon as={LuLogIn} boxSize={10} color="white" />
            </Box>
            <Heading fontSize={{ base: "2xl", md: "3xl" }} color="white" textShadow="0 2px 4px rgba(0,0,0,0.2)">
              Inicia Sesión
            </Heading>
            <Text fontSize="md" color="whiteAlpha.800">
              Accede a tu plataforma de aprendizaje
            </Text>
          </VStack>

          {/* Form Card */}
          <Box
            bg="white"
            p={{ base: 6, md: 8 }}
            borderRadius="2xl"
            boxShadow="2xl"
            w="100%"
          >
            <Stack spacing={6} as="form" onSubmit={handleLogin}>
              <FormControl id="email">
                <FormLabel color="gray.700" fontSize="sm" fontWeight="medium">
                  Correo Electrónico
                </FormLabel>
                <InputGroup>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    size="lg"
                    borderRadius="xl"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{ borderColor: "#667eea" }}
                    _focus={{
                      borderColor: "#667eea",
                      boxShadow: "0 0 0 1px #667eea",
                      bg: "white"
                    }}
                    pl={4}
                  />
                </InputGroup>
              </FormControl>

              <FormControl id="password">
                <FormLabel color="gray.700" fontSize="sm" fontWeight="medium">
                  Contraseña
                </FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    size="lg"
                    borderRadius="xl"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{ borderColor: "#667eea" }}
                    _focus={{
                      borderColor: "#667eea",
                      boxShadow: "0 0 0 1px #667eea",
                      bg: "white"
                    }}
                    pl={4}
                  />
                  <InputRightElement h="full">
                    <IconButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      icon={<Icon as={showPassword ? LuEyeOff : LuEye} color="gray.400" />}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      _hover={{ bg: "gray.100" }}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Stack spacing={4} pt={2}>
                <Button
                  type="submit"
                  bg="#38BDF8"
                  color="white"
                  size="lg"
                  borderRadius="xl"
                  h="56px"
                  fontSize="md"
                  fontWeight="semibold"
                  _hover={{
                    bg: '#0ea5e9',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 25px rgba(56, 189, 248, 0.3)',
                  }}
                  _active={{
                    transform: 'translateY(0)',
                  }}
                  transition="all 0.2s"
                  isLoading={isLoading}
                  loadingText="Ingresando..."
                >
                  Ingresar a la Plataforma
                </Button>

                <Link
                  as={RouterLink}
                  to="/forgot-password"
                  color="#667eea"
                  fontSize="sm"
                  textAlign="center"
                  fontWeight="medium"
                  _hover={{ textDecoration: 'underline', color: '#764ba2' }}
                  transition="color 0.2s"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </Stack>
            </Stack>
          </Box>

          {/* Footer Link */}
          <Text color="whiteAlpha.800" fontSize="sm">
            ¿No tienes cuenta?{' '}
            <Link
              as={RouterLink}
              to="/checkout"
              color="white"
              fontWeight="bold"
              _hover={{ textDecoration: 'underline' }}
            >
              Regístrate aquí
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;