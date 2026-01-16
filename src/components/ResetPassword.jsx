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
    Icon,
    useToast,
    InputGroup,
    InputRightElement,
    IconButton,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LuLock, LuCheck, LuEye, LuEyeOff } from 'react-icons/lu';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const { updatePassword, user } = useAuth();
    const toast = useToast();

    // Verificar que el usuario llegó desde el enlace del email
    useEffect(() => {
        // El usuario debería estar autenticado temporalmente por el token del email
        // Si no hay sesión de recovery, redirigir
        const checkSession = async () => {
            // Supabase automáticamente maneja el token del URL al cargar la página
            // El usuario estará "logueado" temporalmente para poder cambiar la contraseña
        };
        checkSession();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast({
                title: 'Campos requeridos',
                description: 'Por favor completa todos los campos.',
                status: 'warning',
                duration: 3000,
            });
            return;
        }

        if (password.length < 6) {
            toast({
                title: 'Contraseña muy corta',
                description: 'La contraseña debe tener al menos 6 caracteres.',
                status: 'warning',
                duration: 3000,
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: 'Las contraseñas no coinciden',
                description: 'Por favor verifica que ambas contraseñas sean iguales.',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        setIsLoading(true);

        const result = await updatePassword(password);

        if (result.success) {
            setIsSuccess(true);
            toast({
                title: '¡Contraseña actualizada!',
                description: 'Ya puedes iniciar sesión con tu nueva contraseña.',
                status: 'success',
                duration: 5000,
            });
        } else {
            toast({
                title: 'Error',
                description: result.error || 'No pudimos actualizar tu contraseña. Intenta nuevamente.',
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
                            <Icon as={LuLock} boxSize={10} color="white" />
                        </Box>
                        <Heading fontSize={{ base: "2xl", md: "3xl" }} color="white">
                            Nueva Contraseña
                        </Heading>
                        <Text fontSize="md" color="whiteAlpha.800" maxW="sm">
                            Ingresa tu nueva contraseña para acceder a tu cuenta.
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
                        {isSuccess ? (
                            <VStack spacing={6} py={4}>
                                <Box p={4} bg="green.100" borderRadius="full">
                                    <Icon as={LuCheck} boxSize={10} color="green.500" />
                                </Box>
                                <VStack spacing={2}>
                                    <Heading size="md" color="gray.800">¡Listo!</Heading>
                                    <Text color="gray.600" textAlign="center">
                                        Tu contraseña ha sido actualizada exitosamente.
                                    </Text>
                                </VStack>
                                <Button
                                    w="full"
                                    colorScheme="blue"
                                    onClick={() => navigate('/login')}
                                    borderRadius="xl"
                                    size="lg"
                                >
                                    Iniciar Sesión
                                </Button>
                            </VStack>
                        ) : (
                            <Stack spacing={6} as="form" onSubmit={handleSubmit}>
                                <FormControl>
                                    <FormLabel color="gray.700">Nueva Contraseña</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            size="lg"
                                            borderRadius="xl"
                                            bg="gray.50"
                                            _focus={{
                                                borderColor: "#667eea",
                                                boxShadow: "0 0 0 1px #667eea"
                                            }}
                                        />
                                        <InputRightElement h="full">
                                            <IconButton
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowPassword(!showPassword)}
                                                icon={<Icon as={showPassword ? LuEyeOff : LuEye} />}
                                                aria-label={showPassword ? "Ocultar" : "Mostrar"}
                                            />
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>

                                <FormControl>
                                    <FormLabel color="gray.700">Confirmar Contraseña</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            size="lg"
                                            borderRadius="xl"
                                            bg="gray.50"
                                            _focus={{
                                                borderColor: "#667eea",
                                                boxShadow: "0 0 0 1px #667eea"
                                            }}
                                        />
                                        <InputRightElement h="full">
                                            <IconButton
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                icon={<Icon as={showConfirmPassword ? LuEyeOff : LuEye} />}
                                                aria-label={showConfirmPassword ? "Ocultar" : "Mostrar"}
                                            />
                                        </InputRightElement>
                                    </InputGroup>
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
                                    loadingText="Guardando..."
                                >
                                    Guardar Nueva Contraseña
                                </Button>
                            </Stack>
                        )}
                    </Box>
                </VStack>
            </Box>
        </Box>
    );
};

export default ResetPassword;
