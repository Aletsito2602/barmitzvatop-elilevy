import { Box, Heading, SimpleGrid, VStack, Text, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { FaRegLightbulb, FaRegClock, FaChartLine, FaRegMoneyBillAlt, FaRegSmile, FaRegCheckCircle, FaLaptop, FaUserCheck } from 'react-icons/fa';

const benefits = [
  {
    icon: FaLaptop,
    title: 'Clases 100% Online',
    desc: 'Accede a las clases desde cualquier lugar y en cualquier momento, adaptadas a tu ritmo de vida.',
  },
  {
    icon: FaUserCheck,
    title: 'Tu Propio Camino',
    desc: 'Aprende a tu manera, con recursos personalizados y acompañamiento en cada etapa de tu preparación.',
  },
  {
    icon: FaRegLightbulb,
    title: 'Metodología Probada',
    desc: 'Técnicas y estrategias que han ayudado a más de 100 alumnos a lograr su Barmitzva con éxito.',
  },
  {
    icon: FaRegClock,
    title: 'Flexibilidad de Horarios',
    desc: 'Organiza tus estudios según tu disponibilidad, sin presiones ni horarios fijos.',
  },
  {
    icon: FaRegSmile,
    title: 'Acompañamiento Personal',
    desc: 'Soporte y guía durante todo el proceso, para que nunca te sientas solo en el camino.',
  },
  {
    icon: FaRegCheckCircle,
    title: 'Resultados Comprobados',
    desc: 'Testimonios reales de alumnos y familias que avalan la efectividad del curso.',
  },
];

const BenefitsSection = () => (
  <Box id="benefits" bg="#FEF3C7" py={20}>
    <Box maxW="1200px" mx="auto" px={4}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Text
          color="#F59E0B"
          fontWeight="bold"
          letterSpacing="wider"
          textAlign="center"
          mb={2}
        >
          SOLUCIONES A TU MEDIDA
        </Text>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Heading
          as="h2"
          size="xl"
          textAlign="center"
          mb={12}
          fontWeight="bold"
          color="#F59E0B"
        >
          ¿Qué obtendrás conmigo?
        </Heading>
      </motion.div>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
        {benefits.map((benefit, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.5, 
              delay: idx * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              y: -8, 
              scale: 1.03,
              transition: { duration: 0.2 }
            }}
          >
            <VStack
              p={8}
              align="start"
              bg="white"
              borderRadius="xl"
              boxShadow="md"
              spacing={4}
              minH="220px"
              border="2px solid #F59E0B"
              _hover={{
                boxShadow: "0 20px 40px rgba(245, 158, 11, 0.2)",
                borderColor: "#D97706"
              }}
              transition="all 0.3s ease"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 3 + idx * 0.5
                }}
              >
                <Icon as={benefit.icon} w={10} h={10} color="#F59E0B" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
              >
                <Text fontWeight="bold" fontSize="xl" color="#D97706">{benefit.title}</Text>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
              >
                <Text color="gray.700">{benefit.desc}</Text>
              </motion.div>
            </VStack>
          </motion.div>
        ))}
      </SimpleGrid>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Box textAlign="center" mt={12}>
          <motion.div
            whileHover={{ 
              scale: 1.05,
              y: -3
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Box
              as="button"
              bg="#F59E0B"
              color="white"
              fontWeight="bold"
              px={10}
              py={4}
              borderRadius="md"
              boxShadow="md"
              fontSize="lg"
              _hover={{ 
                bg: '#D97706', 
                transform: 'translateY(-2px)', 
                boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4)'
              }}
              transition="all 0.2s ease"
              onClick={() => {
                document.getElementById('pricing')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
            >
              Reserva tu lugar ahora
            </Box>
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  </Box>
);

export default BenefitsSection; 