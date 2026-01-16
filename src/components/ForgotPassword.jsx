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
    Link as ChakraLink,
    Icon,
    Alert,
    AlertIcon,
    useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LuMail, LuArrowLeft, LuCheck } from 'react-icons/lu';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const navigate = useNavigate();
    const { resetPassword } = useAuth();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast({
                title: 'Email requerido',
                description: 'Por favor ingresa tu correo electrónico.',
                status: 'warning',
                duration: 3000,
            });
            return;
        }

        setIsLoading(true);

        const result = await resetPassword(email);

        if (result.success) {
            setIsEmailSent(true);
            toast({
                title: '¡Correo enviado!',
                description: 'Revisa tu bandeja de entrada para restablecer tu contraseña.',
                status: 'success',
                duration: 5000,
            });
        } else {
            toast({
                title: 'Error',
                description: result.error || 'No pudimos enviar el correo. Intenta nuevamente.',
                status: 'error',
                duration: 5000,
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
            {/* Patrón de fondo */}
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
                            <Icon as={LuMail} boxSize={10} color="white" />
                        </Box>
                        <Heading fontSize={{ base: "2xl", md: "3xl" }} color="white">
                            Recuperar Contraseña
                        </Heading>
                        <Text fontSize="md" color="whiteAlpha.800" maxW="sm">
                            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
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
                        {isEmailSent ? (
                            <VStack spacing={6} py={4}>
                                <Box p={4} bg="green.100" borderRadius="full">
                                    <Icon as={LuCheck} boxSize={10} color="green.500" />
                                </Box>
                                <VStack spacing={2}>
                                    <Heading size="md" color="gray.800">¡Correo enviado!</Heading>
                                    <Text color="gray.600" textAlign="center">
                                        Hemos enviado un enlace a <strong>{email}</strong> para restablecer tu contraseña.
                                    </Text>
                                    <Text fontSize="sm" color="gray.500" textAlign="center">
                                        Revisa también tu carpeta de spam si no lo encuentras.
                                    </Text>
                                </VStack>
                                <Button
                                    w="full"
                                    colorScheme="blue"
                                    onClick={() => navigate('/login')}
                                    borderRadius="xl"
                                >
                                    Volver al Login
                                </Button>
                            </VStack>
                        ) : (
                            <Stack spacing={6} as="form" onSubmit={handleSubmit}>
                                <FormControl id="email">
                                    <FormLabel color="gray.700">Correo Electrónico</FormLabel>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="tu@email.com"
                                        size="lg"
                                        borderRadius="xl"
                                        bg="gray.50"
                                        _focus={{
                                            borderColor: "#667eea",
                                            boxShadow: "0 0 0 1px #667eea"
                                        }}
                                    />
                                </FormControl>

                                <Button
                                    type="submit"
                                    bg="#38BDF8"
                                    color="white"
                                    size="lg"
                                    borderRadius="xl"
                                    _hover={{
                                        bg: '#0ea5e9',
                                        transform: 'translateY(-2px)',
                                        boxShadow: 'lg',
                                    }}
                                    isLoading={isLoading}
                                    loadingText="Enviando..."
                                >
                                    Enviar Enlace de Recuperación
                                </Button>

                                <ChakraLink
                                    as={RouterLink}
                                    to="/login"
                                    color="gray.500"
                                    fontSize="sm"
                                    textAlign="center"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    gap={2}
                                    _hover={{ color: "#667eea" }}
                                >
                                    <Icon as={LuArrowLeft} />
                                    Volver al inicio de sesión
                                </ChakraLink>
                            </Stack>
                        )}
                    </Box>
                </VStack>
            </Box>
        </Box>
    );
};

export default ForgotPassword;
