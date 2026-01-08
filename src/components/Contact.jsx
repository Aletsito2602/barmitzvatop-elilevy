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
  Textarea,
  VStack,
  useColorModeValue,
  useToast
} from '@chakra-ui/react'
import { useState } from 'react'
import { submitContactForm } from '../services/firebaseService'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        toast({
          title: '¡Mensaje enviado!',
          description: 'Hemos recibido tu mensaje. Te responderemos pronto.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        // Reset form
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'Error al enviar mensaje',
        description: 'Ha ocurrido un error. Por favor, inténtalo nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    setIsLoading(false);
  };
  return (
    <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="container.xl">
        <Stack spacing={12} direction={{ base: 'column', lg: 'row' }} align="center">
          <VStack spacing={6} align="start" flex={1}>
            <Heading>Get In Touch</Heading>
            <Text fontSize="lg">
              ¿Tienes preguntas? Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
            </Text>
            <VStack spacing={4} align="start">
              <Text>
                <strong>Ubicación:</strong> Punta pacifica, Panama
              </Text>
              <Text>
                <strong>Email:</strong> elilevy91@gmail.com
              </Text>
            </VStack>
          </VStack>

          <Box
            as="form"
            onSubmit={handleSubmit}
            flex={1}
            w="full"
            bg={useColorModeValue('white', 'gray.800')}
            p={8}
            rounded="xl"
            shadow="lg"
          >
            <Stack spacing={4}>
              <FormControl id="name" isRequired>
                <FormLabel>Nombre</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Tu nombre completo"
                />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                />
              </FormControl>
              <FormControl id="message" isRequired>
                <FormLabel>Mensaje</FormLabel>
                <Textarea
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Escribe tu mensaje aquí..."
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                isLoading={isLoading}
                loadingText="Enviando..."
                w="full"
              >
                Enviar Mensaje
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default Contact 