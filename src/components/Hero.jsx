import { Box, Button, Heading, Text, VStack, HStack, Image } from '@chakra-ui/react'
import { motion } from 'framer-motion' // eslint-disable-line no-unused-vars

const Hero = () => {
  return (
    <Box
      id="hero"
      position="relative"
      width="100%"
      pt={40}
      pb={32}
      minH="700px"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        inset: 0,
        bgImage: 'url(/TRM_1352-scaled.jpg)',
        bgSize: 'cover',
        bgPosition: 'center',
        zIndex: 0,
        opacity: 0.45,
      }}
      bg="black"
    >
      <Box maxW="1200px" mx="auto" px={4} position="relative" zIndex={1}>
        <HStack spacing={12} align="center" justify="center">
          <VStack spacing={6} align="center" flex={1}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Text
                fontSize="xl"
                color="#3B82F6"
                fontWeight="bold"
                letterSpacing="wider"
                textAlign="center"
              >
                Profesor internacional - Costumbre Sefardí
              </Text>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Heading
                as="h1"
                size="2xl"
                color="white"
                lineHeight="1.2"
                fontWeight="bold"
                bgGradient="linear(to-r, white, #E5E7EB)"
                bgClip="text"
                textAlign="center"
              >
                Preparación para tu Barmitzva
              </Heading>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Text fontSize="xl" color="gray.200" maxW="2xl" lineHeight="tall" textAlign="center">
                Profesor con más de 16 años de experiencia. Más de 100 alumnos preparados exitosamente presencial y online. Clases que combinan tradición, técnica y cercanía para una preparación con seguridad, buena pronunciación y entonación perfecta.
              </Text>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                bgGradient="linear(to-r, #3B82F6, #1E40AF)"
                color="white"
                px={10}
                py={6}
                fontSize="lg"
                fontWeight="bold"
                borderRadius="xl"
                boxShadow="0 10px 25px rgba(59, 130, 246, 0.3)"
                _hover={{
                  bgGradient: 'linear(to-r, #1E40AF, #1E3A8A)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 15px 35px rgba(59, 130, 246, 0.4)',
                }}
                transition="all 0.3s ease"
                onClick={() => {
                  document.getElementById('pricing')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                Comenzar Ahora
              </Button>
            </motion.div>
          </VStack>
          <Box flex={1} display={{ base: 'none', md: 'block' }} position="relative" justifyContent="center" alignItems="center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Box
                bgGradient="linear(135deg, #EBF4FF 0%, #C3DAFE 100%)"
                borderRadius="2xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                h="400px"
                w="100%"
                boxShadow="0 25px 50px rgba(59, 130, 246, 0.15)"
                position="relative"
                border="1px solid rgba(59, 130, 246, 0.1)"
                _hover={{
                  transform: "scale(1.02)",
                  boxShadow: "0 30px 60px rgba(59, 130, 246, 0.2)"
                }}
                transition="all 0.3s ease"
                cursor="pointer"
              >
                <Box
                  as="iframe"
                  src="https://www.youtube.com/embed/nJ0syOHobpk"
                  title="Barmitzva Preparation Video"
                  width="100%"
                  height="100%"
                  borderRadius="2xl"
                  border="none"
                  allowFullScreen
                  position="absolute"
                  top="0"
                  left="0"
                  filter="drop-shadow(0 10px 20px rgba(59, 130, 246, 0.3))"
                />
              </Box>
            </motion.div>
          </Box>
        </HStack>
      </Box>
    </Box>
  )
}

export default Hero 