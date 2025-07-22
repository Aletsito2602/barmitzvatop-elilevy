import { Box, Heading, SimpleGrid, VStack, Text, HStack, Icon } from '@chakra-ui/react';
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
  "Guía paso a paso para prepararte con confianza.",
  "Clases online y materiales exclusivos, disponibles siempre.",
  "Acompañamiento personalizado en cada etapa.",
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
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatDelay: 3 + idx * 0.3
                    }}
                  >
                    <Icon as={WarningIcon} color="#F59E0B" boxSize={5} mt={1} />
                  </motion.div>
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
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      scale: { duration: 1.5, repeat: Infinity, repeatDelay: 2 + idx * 0.3 },
                      rotate: { duration: 3, repeat: Infinity, repeatDelay: 5 + idx * 0.5 }
                    }}
                  >
                    <Icon as={CheckCircleIcon} color="#D97706" boxSize={5} mt={1} />
                  </motion.div>
                  <Text color="gray.700">{item}</Text>
                </HStack>
              </motion.div>
            ))}
          </VStack>
        </motion.div>
      </SimpleGrid>
    </Box>
  </Box>
);

export default StrugglesSection; 