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
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@chakra-ui/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

      if (result.error.includes('user-not-found')) {
        friendlyMessage = 'No encontramos una cuenta con este email. ¿Te gustaría registrarte?';
      } else if (result.error.includes('wrong-password') || result.error.includes('invalid-credential')) {
        friendlyMessage = 'La contraseña no es correcta. ¿Olvidaste tu contraseña?';
      } else if (result.error.includes('invalid-email')) {
        friendlyMessage = 'Por favor, ingresa un email válido.';
      } else if (result.error.includes('too-many-requests')) {
        friendlyMessage = 'Demasiados intentos. Por favor, espera unos minutos antes de intentar nuevamente.';
      }

      toast({
        title: 'No pudimos acceder a tu cuenta',
        description: friendlyMessage,
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
        maxW={{ base: "90%", sm: "400px", md: "500px", lg: "600px", xl: "700px" }}
        mx="auto"
      >
        <VStack spacing={{ base: 6, md: 8 }}>
          <VStack spacing={{ base: 4, md: 6 }} textAlign="center">
            <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} color="white" textShadow="0 2px 4px rgba(0,0,0,0.3)">
              Inicia Sesión
            </Heading>
            <Text fontSize={{ base: "md", md: "lg", lg: "xl" }} color="whiteAlpha.900">
              Accede a tu plataforma de aprendizaje
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
            <Stack spacing={{ base: 6, md: 8, lg: 10 }} as="form" onSubmit={handleLogin}>
              <FormControl id="email">
                <FormLabel color="gray.700" fontWeight="medium">Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  size={{ base: "md", md: "lg" }}
                  bg="white"
                  borderColor="gray.200"
                  _hover={{ borderColor: "#38BDF8" }}
                  _focus={{ borderColor: "#38BDF8", boxShadow: "0 0 0 1px #38BDF8" }}
                />
              </FormControl>

              <FormControl id="password">
                <FormLabel color="gray.700" fontWeight="medium">Contraseña</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  size={{ base: "md", md: "lg" }}
                  bg="white"
                  borderColor="gray.200"
                  _hover={{ borderColor: "#38BDF8" }}
                  _focus={{ borderColor: "#38BDF8", boxShadow: "0 0 0 1px #38BDF8" }}
                />
              </FormControl>

              <Stack spacing={4}>
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
                  loadingText="Ingresando..."
                >
                  Ingresar a la Plataforma
                </Button>

                <Link
                  color="#38BDF8"
                  fontSize="sm"
                  textAlign="center"
                  _hover={{ textDecoration: 'underline', color: '#0ea5e9' }}
                  transition="color 0.2s"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </Stack>
            </Stack>


          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login; 