import { Box, Heading, Text, HStack, VStack, IconButton, Image } from '@chakra-ui/react';
import { FaInstagram, FaFacebook, FaYoutube, FaTiktok } from 'react-icons/fa';

const aboutText = `Soy Eli Levy, profesor de Barmitzva con más de 16 años de experiencia. Comencé a enseñar a los 17 años, inspirado por mi padre, quien me preparó con dedicación para mi propio Barmitzva. He acompañado a más de 100 alumnos, presencial y online, en su camino hacia este día tan especial. Mis clases combinan tradición, técnica y cercanía, para que cada joven se prepare con seguridad, buena pronunciación y entonación perfecta.`;

const AboutEli = () => (
  <Box id="about-eli" bg="white" py={20}>
    <Box maxW="1200px" mx="auto" px={4}>
      <HStack spacing={10} align="start" justify="center" flexDir={{ base: 'column', md: 'row' }}>
        <VStack align="start" spacing={6} flex={1}>
          <Heading as="h2" size="2xl" color="black">Soy Eli Levy</Heading>
          <Text color="gray.700" fontSize="lg" whiteSpace="pre-line">{aboutText}</Text>
          <HStack spacing={4} pt={2}>
            <IconButton as="a" href="https://www.instagram.com/barmitzvatop" target="_blank" rel="noopener noreferrer" icon={<FaInstagram />} aria-label="Instagram" size="lg" variant="ghost" color="black" _hover={{ color: '#F59E0B' }} />
            <IconButton as="a" href="https://www.facebook.com/share/1A8n5FBfM3/" target="_blank" rel="noopener noreferrer" icon={<FaFacebook />} aria-label="Facebook" size="lg" variant="ghost" color="black" _hover={{ color: '#F59E0B' }} />
            <IconButton as="a" href="https://youtube.com/@barmitzvatop" target="_blank" rel="noopener noreferrer" icon={<FaYoutube />} aria-label="YouTube" size="lg" variant="ghost" color="black" _hover={{ color: '#F59E0B' }} />
            <IconButton as="a" href="https://www.tiktok.com/@barmitzvatop" target="_blank" rel="noopener noreferrer" icon={<FaTiktok />} aria-label="TikTok" size="lg" variant="ghost" color="black" _hover={{ color: '#F59E0B' }} />
          </HStack>
        </VStack>
        <Box flex={1} display="flex" justifyContent="center" alignItems="center">
          <Image
            src="/eli levy - quien soy.webp"
            alt="Eli Levy"
            borderRadius="2xl"
            boxShadow="lg"
            maxW="400px"
            w="100%"
            objectFit="cover"
          />
        </Box>
      </HStack>
    </Box>
  </Box>
);

export default AboutEli; 