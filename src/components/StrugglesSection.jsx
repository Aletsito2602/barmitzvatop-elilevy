import { Box, Heading, SimpleGrid, VStack, Text, HStack, Icon, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

const struggles = [
  "No sabes por dónde empezar a prepararte para tu Barmitzva.",
  "Te cuesta aprender los rezos y las melodías.",
  "Sientes que te falta motivación o acompañamiento.",
  "No tienes acceso a clases personalizadas o materiales claros.",
  "Te preocupa no estar listo para el gran día."
];

const needs = [
  "Guía paso a paso para prepararte para tu Barmitzva con seguridad y confianza.",
  "Clases grabadas y materiales exclusivos disponibles siempre.",
  "Curso de Barmitzva completo online 100% autodidacta.",
  "Método probado con +17 años de experiencia con clases presenciales y online.",
  "Aprende a tu ritmo, desde cualquier lugar.",
  "Llega seguro y motivado a tu Barmitzva."
];

const StrugglesSection = () => (
  <Box bg="#FEF3C7" py={20}>
    <Box maxW="1000px" mx="auto" px={4}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Heading
          as="h2"
          size="xl"
          textAlign="center"
          mb={12}
          fontWeight="bold"
          color="#F59E0B"
        >
          ¿Por qué necesitas prepararte con BarmitzvaTop?
        </Heading>
      </motion.div>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          <VStack
            border="2px solid #bae6fd"
            borderRadius="xl"
            p={8}
            align="start"
            bg="white"
            boxShadow="md"
            h="100%"
            _hover={{
              boxShadow: "0 15px 30px rgba(186, 230, 253, 0.3)",
              borderColor: "#3B82F6"
            }}
            transition="all 0.3s ease"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Text fontWeight="bold" color="#D97706" mb={2} fontSize="lg">¿Te pasa esto?</Text>
            </motion.div>
            {struggles.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
              >
                <HStack align="start">
                  <Icon as={WarningIcon} color="#F59E0B" boxSize={5} mt={1} />
                  <Text color="gray.700">{item}</Text>
                </HStack>
              </motion.div>
            ))}
          </VStack>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          <VStack
            border="2px solid #F59E0B"
            borderRadius="xl"
            p={8}
            align="start"
            bg="#FEF3C7"
            boxShadow="0 4px 24px 0 #FED7AA"
            h="100%"
            _hover={{
              boxShadow: "0 20px 40px rgba(245, 158, 11, 0.3)",
              borderColor: "#D97706"
            }}
            transition="all 0.3s ease"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Text fontWeight="bold" color="#F59E0B" mb={2} fontSize="lg">Con BarmitzvaTop obtienes...</Text>
            </motion.div>
            {needs.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                whileHover={{ x: -5, transition: { duration: 0.2 } }}
              >
                <HStack align="start">
                  <Icon as={CheckCircleIcon} color="#D97706" boxSize={5} mt={1} />
                  <Text color="gray.700">{item}</Text>
                </HStack>
              </motion.div>
            ))}
          </VStack>
        </motion.div>
      </SimpleGrid>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Box textAlign="center" mt={12}>
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
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
              Quiero prepararme ahora
            </Button>
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  </Box>
);

export default StrugglesSection;
