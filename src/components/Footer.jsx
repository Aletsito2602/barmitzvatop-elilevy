import { Box, Container, Stack, Text, IconButton, HStack, VStack, Link, SimpleGrid, Image } from '@chakra-ui/react';
import { FaInstagram, FaFacebook, FaYoutube, FaTiktok } from 'react-icons/fa';
import { MdLocationOn, MdEmail } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box bg="white" color="gray.700" pt={12} pb={4}>
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} alignItems="flex-start">
          {/* Columna 1: Logo y descripción */}
          <VStack align="start" spacing={4}>
            <Image src="/logo.webp" alt="BMTop" maxH="70px" />
            <Text fontWeight="bold" fontSize="lg" letterSpacing="wide">BARMITZVATOP</Text>
            <Text color="gray.400" maxW="250px">
              Un espacio para aprender, conectar y crecer, fortaleciendo nuestras bases, tradiciones y valores.
            </Text>
            <HStack spacing={4} pt={2}>
              <IconButton as="a" href="#" icon={<FaInstagram />} aria-label="Instagram" size="lg" variant="ghost" color="black" _hover={{ color: '#38BDF8' }} />
              <IconButton as="a" href="#" icon={<FaFacebook />} aria-label="Facebook" size="lg" variant="ghost" color="black" _hover={{ color: '#38BDF8' }} />
              <IconButton as="a" href="#" icon={<FaYoutube />} aria-label="YouTube" size="lg" variant="ghost" color="black" _hover={{ color: '#38BDF8' }} />
              <IconButton as="a" href="#" icon={<FaTiktok />} aria-label="TikTok" size="lg" variant="ghost" color="black" _hover={{ color: '#38BDF8' }} />
            </HStack>
          </VStack>

          {/* Columna 2: Navegación */}
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold" fontSize="xl" mb={2}>Navegar</Text>
            <Link as={RouterLink} to="/" color="gray.500" _hover={{ color: '#38BDF8' }}>Inicio</Link>
            <Link as={RouterLink} to="/barmitzva" color="gray.500" _hover={{ color: '#38BDF8' }}>Tu Barmitzva</Link>
            <Link as={RouterLink} to="/nosotros" color="gray.500" _hover={{ color: '#38BDF8' }}>Nosotros</Link>
            <Link as={RouterLink} to="/faq" color="gray.500" _hover={{ color: '#38BDF8' }}>Preguntas Frecuentes</Link>
            <Link as={RouterLink} to="/contacto" color="gray.500" _hover={{ color: '#38BDF8' }}>Contáctanos</Link>
          </VStack>

          {/* Columna 3: Contacto */}
          <VStack align="start" spacing={3}>
            <Text fontWeight="bold" fontSize="xl" mb={2}>Get In Touch</Text>
            <HStack>
              <Box as={MdLocationOn} color="green.500" boxSize={5} />
              <Text color="gray.500">Punta pacifica, Panama</Text>
            </HStack>
            <HStack>
              <Box as={MdEmail} color="green.500" boxSize={5} />
              <Text color="gray.500">elilevy@barmitzvatop.com</Text>
            </HStack>
          </VStack>
        </SimpleGrid>
        <Text textAlign="center" color="gray.400" fontSize="sm" mt={10}>
          Copyright © 2025 Bartmizva | Powered by Bartmizva
        </Text>
      </Container>
    </Box>
  );
};

export default Footer; 