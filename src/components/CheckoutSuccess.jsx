import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Box,
    Container,
    VStack,
    Heading,
    Text,
    Button,
    Icon,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Card,
    CardBody,
    HStack,
    Divider
} from '@chakra-ui/react';
import { FaCheckCircle, FaSignInAlt, FaArrowRight, FaBook, FaKey } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const CheckoutSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        // Wait for webhook to process (usually takes 2-5 seconds)
        const timer = setTimeout(() => {
            setIsVerifying(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, [sessionId]);

    if (isVerifying) {
        return (
            <Box
                minH="100vh"
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={4}
            >
                <VStack spacing={6} textAlign="center">
                    <Spinner size="xl" color="white" thickness="4px" />
                    <Heading color="white" size="lg">
                        Procesando tu pago...
                    </Heading>
                    <Text color="whiteAlpha.800" fontSize="lg">
                        Estamos creando tu cuenta. Por favor espera unos segundos.
                    </Text>
                </VStack>
            </Box>
        );
    }

    return (
        <Box
            minH="100vh"
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            position="relative"
            py={12}
            px={4}
        >
            {/* Background pattern */}
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

            <Container maxW="2xl" position="relative" zIndex={1}>
                <MotionBox
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Card
                        borderRadius="2xl"
                        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                        overflow="hidden"
                    >
                        <CardBody p={0}>
                            {/* Success Header */}
                            <Box
                                bg="green.500"
                                py={8}
                                textAlign="center"
                            >
                                <MotionBox
                                    animate={{
                                        scale: [1, 1.1, 1],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        repeatDelay: 2
                                    }}
                                >
                                    <Icon
                                        as={FaCheckCircle}
                                        w={20}
                                        h={20}
                                        color="white"
                                    />
                                </MotionBox>
                            </Box>

                            <VStack spacing={6} p={8} textAlign="center">
                                <Heading size="xl" color="gray.800">
                                    ¡Pago Exitoso! 🎉
                                </Heading>

                                <Text fontSize="lg" color="gray.600" maxW="md">
                                    ¡Bienvenido a Barmitzvatop! Tu cuenta está lista para usar.
                                </Text>

                                <Divider />

                                {/* Next Steps */}
                                <VStack spacing={4} w="100%" align="start">
                                    <Text fontWeight="bold" color="gray.700" fontSize="lg">
                                        ✅ Tu cuenta está activa:
                                    </Text>

                                    <HStack
                                        bg="green.50"
                                        p={4}
                                        borderRadius="lg"
                                        w="100%"
                                        spacing={4}
                                    >
                                        <Icon as={FaKey} color="green.500" boxSize={6} />
                                        <Box textAlign="left">
                                            <Text fontWeight="bold" color="gray.800">
                                                Usa tus credenciales
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                Inicia sesión con el email y la contraseña que elegiste durante el registro.
                                            </Text>
                                        </Box>
                                    </HStack>

                                    <HStack
                                        bg="blue.50"
                                        p={4}
                                        borderRadius="lg"
                                        w="100%"
                                        spacing={4}
                                    >
                                        <Icon as={FaSignInAlt} color="blue.500" boxSize={6} />
                                        <Box textAlign="left">
                                            <Text fontWeight="bold" color="gray.800">
                                                Accede a tu dashboard
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                Haz clic en el botón de abajo para ir a la página de login.
                                            </Text>
                                        </Box>
                                    </HStack>

                                    <HStack
                                        bg="purple.50"
                                        p={4}
                                        borderRadius="lg"
                                        w="100%"
                                        spacing={4}
                                    >
                                        <Icon as={FaBook} color="purple.500" boxSize={6} />
                                        <Box textAlign="left">
                                            <Text fontWeight="bold" color="gray.800">
                                                Comienza tu preparación
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                Tendrás acceso a todas las clases, ejercicios y materiales de tu plan.
                                            </Text>
                                        </Box>
                                    </HStack>
                                </VStack>

                                <Divider />

                                {/* Action Buttons */}
                                <VStack spacing={3} w="100%">
                                    <Button
                                        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                        color="white"
                                        size="lg"
                                        w="100%"
                                        rightIcon={<FaArrowRight />}
                                        _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                                        transition="all 0.2s"
                                        onClick={() => navigate('/login')}
                                    >
                                        Iniciar Sesión Ahora
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="md"
                                        color="gray.600"
                                        onClick={() => navigate('/')}
                                    >
                                        Volver al inicio
                                    </Button>
                                </VStack>

                                {/* Help Note */}
                                <Alert status="info" borderRadius="lg" mt={4}>
                                    <AlertIcon />
                                    <Box fontSize="sm" textAlign="left">
                                        <AlertTitle>¿Tienes problemas para ingresar?</AlertTitle>
                                        <AlertDescription>
                                            Si no puedes iniciar sesión, espera unos segundos y vuelve a intentar.
                                            Si el problema persiste, contactanos a soporte@barmitzvatop.com
                                        </AlertDescription>
                                    </Box>
                                </Alert>
                            </VStack>
                        </CardBody>
                    </Card>
                </MotionBox>
            </Container>
        </Box>
    );
};

export default CheckoutSuccess;
