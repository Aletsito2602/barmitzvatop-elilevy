import { Box, Heading, Text, HStack, VStack, IconButton, Image, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Box textAlign="center" mt={12}>
          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              bg="#F59E0B"
              color="white"
              fontWeight="bold"
              px={{ base: 6, md: 8 }}
              py={{ base: 4, md: 5 }}
              borderRadius="full"
              boxShadow="0 6px 20px rgba(245, 158, 11, 0.35)"
              fontSize="md"
              _hover={{
                bg: '#D97706',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 30px rgba(245, 158, 11, 0.45)',
              }}
              transition="all 0.3s ease"
              onClick={() => {
                document.getElementById('pricing')?.scrollIntoView({
                  behavior: 'smooth'
                });
              }}
            >
              Empieza tu preparación hoy
            </Button>
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  </Box>
);

export default AboutEli; 