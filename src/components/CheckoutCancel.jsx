import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    VStack,
    Heading,
    Text,
    Button,
    Icon,
    Card,
    CardBody,
    HStack,
    Alert,
    AlertIcon
} from '@chakra-ui/react';
import { FaTimesCircle, FaArrowLeft, FaQuestionCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const CheckoutCancel = () => {
    const navigate = useNavigate();

    return (
        <Box
            minH="100vh"
            bg="gray.50"
            display="flex"
            alignItems="center"
            justifyContent="center"
            py={12}
            px={4}
        >
            <Container maxW="lg">
                <MotionBox
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card
                        borderRadius="2xl"
                        boxShadow="xl"
                        overflow="hidden"
                    >
                        <CardBody p={0}>
                            {/* Cancel Header */}
                            <Box
                                bg="orange.500"
                                py={8}
                                textAlign="center"
                            >
                                <Icon
                                    as={FaTimesCircle}
                                    w={16}
                                    h={16}
                                    color="white"
                                />
                            </Box>

                            <VStack spacing={6} p={8} textAlign="center">
                                <Heading size="lg" color="gray.800">
                                    Pago cancelado
                                </Heading>

                                <Text fontSize="lg" color="gray.600">
                                    Tu pago no fue completado. No te preocupes, no se realizó ningún cargo a tu tarjeta.
                                </Text>

                                <Alert status="info" borderRadius="lg">
                                    <AlertIcon />
                                    <Box fontSize="sm" textAlign="left">
                                        <Text fontWeight="bold">¿Tuviste algún problema?</Text>
                                        <Text>
                                            Si experimentaste dificultades durante el proceso de pago,
                                            no dudes en contactarnos.
                                        </Text>
                                    </Box>
                                </Alert>

                                {/* Action Buttons */}
                                <VStack spacing={3} w="100%" pt={4}>
                                    <Button
                                        bg="#F59E0B"
                                        color="white"
                                        size="lg"
                                        w="100%"
                                        _hover={{ bg: '#D97706', transform: 'translateY(-2px)' }}
                                        transition="all 0.2s"
                                        onClick={() => navigate('/checkout')}
                                    >
                                        Intentar nuevamente
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="md"
                                        leftIcon={<FaArrowLeft />}
                                        onClick={() => navigate('/')}
                                    >
                                        Volver al inicio
                                    </Button>
                                </VStack>

                                {/* Help */}
                                <HStack
                                    color="gray.500"
                                    fontSize="sm"
                                    pt={4}
                                    cursor="pointer"
                                    _hover={{ color: 'gray.700' }}
                                >
                                    <Icon as={FaQuestionCircle} />
                                    <Text>¿Necesitas ayuda? Contáctanos</Text>
                                </HStack>
                            </VStack>
                        </CardBody>
                    </Card>
                </MotionBox>
            </Container>
        </Box>
    );
};

export default CheckoutCancel;
