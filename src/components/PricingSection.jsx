import { 
  Box, 
  Heading, 
  SimpleGrid, 
  VStack, 
  Text, 
  Button, 
  HStack, 
  Icon, 
  Divider, 
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Badge,
  UnorderedList,
  ListItem
} from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook, FaLightbulb, FaFont, FaPrayingHands, FaVideo, FaMusic, FaFilePdf, FaCertificate, FaPhone, FaCheck, FaPenNib, FaInfoCircle } from 'react-icons/fa';

const plans = [
  {
    name: 'Alef (א)',
    desc: 'Ideal para principiantes que buscan aprender los rezos básicos de manera autodidacta y comenzar su preparación para el Barmitzva.',
    price: 350,
    features: [
      { icon: FaBook, text: 'Introducción al curso' },
      { icon: FaLightbulb, text: 'Consejos para el curso' },
      { icon: FaFont, text: 'Letras y vocales básicas' },
      { icon: FaPrayingHands, text: 'Berajot básicas: Talit, Tefilín, Sheejeiyanu' },
      { icon: FaVideo, text: 'Video: Puesta del Tefilín' },
      { icon: FaPrayingHands, text: 'Kidush de shabat (viernes a la noche)' },
    ],
    color: '#F59E0B',
    detailedInfo: {
      duration: '2-3 meses',
      totalHours: '15 horas de contenido',
      materials: ['Guía de letras hebreas', 'Manual de berajot', 'Videos instructivos'],
      support: 'Email soporte básico',
      certificate: 'Certificado de finalización básico',
      bestFor: 'Niños y jóvenes que comienzan desde cero'
    }
  },
  {
    name: 'Bet (ב)',
    desc: 'Perfecto para quienes desean mejorar pronunciación de manera autodidacta, aprender Taamim y dominar rezos más avanzados.',
    price: 1000,
    features: [
      { icon: FaCheck, text: 'Todo de Opción 1' },
      { icon: FaFont, text: 'Pronunciación avanzada' },
      { icon: FaMusic, text: 'Clase de Taamim' },
      { icon: FaPenNib, text: 'Técnicas de jazanút' },
      { icon: FaPrayingHands, text: 'Berajot y Amida completas' },
      { icon: FaPrayingHands, text: 'Kidush de shabat (viernes a la noche)' },
      { icon: FaPhone, text: 'Clases Privadas: Mensuales.' },
    ],
    color: '#D97706',
    detailedInfo: {
      duration: '4-5 meses',
      totalHours: '30 horas de contenido',
      materials: ['Todo de Alef', 'Libro de Taamim', 'Guía de pronunciación', 'Audio ejemplos'],
      support: 'Clases privadas mensuales (1 hora c/u)',
      certificate: 'Certificado intermedio con evaluación',
      bestFor: 'Jóvenes con conocimientos básicos que quieren perfeccionar'
    }
  },
  {
    name: 'Guimel (ג)',
    desc: 'Para quienes buscan personalizar su Parashá de manera autodidacta, perfeccionar el Kidush y obtener un certificado oficial.',
    price: 2000,
    features: [
      { icon: FaCheck, text: 'Todo de Opción 1' },
      { icon: FaCheck, text: 'Todo de Opción 2' },
      { icon: FaFilePdf, text: 'Herramientas adjuntas (PDF)' },
      { icon: FaMusic, text: 'Rezos cantados' },
      { icon: FaBook, text: 'Parashá personalizada' },
      { icon: FaPrayingHands, text: 'Kidush de shabat (viernes a la noche)' },
      { icon: FaCertificate, text: 'Certificado final' },
      { icon: FaPhone, text: 'Clases Privadas: Quincenales.' },
    ],
    color: '#B45309',
    detailedInfo: {
      duration: '5-6 meses',
      totalHours: '45 horas de contenido',
      materials: ['Todo de Bet', 'Parashá personalizada', 'PDFs especializados', 'Grabaciones de rezos'],
      support: 'Clases privadas quincenales (1.5 horas c/u)',
      certificate: 'Certificado oficial BMTOP',
      bestFor: 'Jóvenes que buscan una preparación completa y personalizada'
    }
  },
  {
    name: 'Dalet (ד)',
    desc: 'Ideal para quienes buscan la preparación más completa de manera autodidacta, intensiva y detallada para su Barmitzva.',
    price: 3000,
    features: [
      { icon: FaCheck, text: 'Todo de Opción 1' },
      { icon: FaCheck, text: 'Todo de Opción 2' },
      { icon: FaCheck, text: 'Todo de Opción 3' },
      { icon: FaPenNib, text: 'Reglas de gramática' },
      { icon: FaLightbulb, text: 'Material de apoyo' },
      { icon: FaPenNib, text: 'Técnicas de Jazanút' },
      { icon: FaPrayingHands, text: 'Kidush de shabat (viernes a la noche)' },
      { icon: FaCertificate, text: 'Certificado oficial de BMTOP' },
      { icon: FaPhone, text: 'Clases Privadas: Semanales.' },
    ],
    color: '#0e7490',
    detailedInfo: {
      duration: '6-8 meses',
      totalHours: '60+ horas de contenido',
      materials: ['Todo de Guimel', 'Gramática hebrea avanzada', 'Biblioteca de recursos', 'Acceso VIP'],
      support: 'Clases privadas semanales (2 horas c/u) + WhatsApp 24/7',
      certificate: 'Certificado Premium BMTOP con honores',
      bestFor: 'Jóvenes que buscan la excelencia y preparación de élite'
    }
  },
];

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionButton = motion(Button);

const PricingSection = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isComingSoonOpen, onOpen: onComingSoonOpen, onClose: onComingSoonClose } = useDisclosure();
  const [selectedPlan, setSelectedPlan] = React.useState(null);
  const navigate = useNavigate();

  const handlePriceClick = (plan) => {
    setSelectedPlan(plan);
    onOpen();
  };

  const handleSignup = (plan) => {
    console.log('Modal signup for plan:', plan);
    
    // Save to localStorage
    localStorage.setItem('selectedPlan', JSON.stringify(plan));
    
    onClose();
    
    // Add delay to ensure modal closes and localStorage is saved
    setTimeout(() => {
      try {
        navigate('/checkout', { state: { plan } });
      } catch (error) {
        console.error('Modal navigate failed:', error);
        window.location.href = '/checkout';
      }
    }, 100);
  };


  return (
    <Box id="pricing" bg={useColorModeValue('#f8fafc', 'gray.900')} py={20}>
      <Box maxW="1200px" mx="auto" px={4}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Heading as="h2" size="2xl" textAlign="center" mb={12} fontWeight="bold" color="black">
            Únete Ahora
          </Heading>
        </motion.div>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
        {plans.map((plan, idx) => (
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
              y: -10, 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <VStack
              bg="white"
              borderRadius="2xl"
              boxShadow="0 4px 24px 0 #bae6fd"
              p={8}
              align="stretch"
              spacing={5}
              border="2px solid #e0e7ef"
              position="relative"
              minH="540px"
              _hover={{
                boxShadow: "0 20px 40px 0 rgba(186, 230, 253, 0.4)",
                borderColor: plan.color
              }}
              transition="all 0.3s ease"
            >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Text fontWeight="bold" fontSize="2xl" color="black" textAlign="center">{plan.name}</Text>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
            >
              <Text color="gray.600" fontSize="md" textAlign="center">{plan.desc}</Text>
            </motion.div>
            <Divider my={2} />
            <motion.div
              whileHover={{ 
                scale: 1.08,
                rotate: [0, 1, -1, 0],
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Box 
                bg={plan.color} 
                color="white" 
                borderRadius="lg" 
                py={4} 
                px={8} 
                textAlign="center" 
                fontWeight="bold" 
                fontSize="2xl" 
                mb={2}
                minH="80px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                onClick={() => handlePriceClick(plan)}
                _hover={{ 
                  transform: 'scale(1.05)', 
                  boxShadow: `0 8px 25px ${plan.color}40`,
                  bgGradient: `linear(45deg, ${plan.color}, ${plan.color}dd)`
                }}
                transition="all 0.2s"
              >
                {idx === 0 ? (
                  <VStack spacing={1}>
                    <Text as="span" fontSize="lg" textDecoration="line-through" color="gray.400">$500</Text>
                    <Text as="span" fontSize="2xl" fontWeight="bold">${plan.price}</Text>
                    <Text as="span" fontSize="md" fontWeight="normal">Anual</Text>
                  </VStack>
                ) : 'Próximamente'}
                <motion.div
                  style={{ display: 'inline-block', marginLeft: '8px' }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Icon as={FaInfoCircle} fontSize="sm" />
                </motion.div>
              </Box>
            </motion.div>
            <VStack align="start" spacing={3} flex={1}>
              {plan.features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 + i * 0.05 }}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <HStack spacing={3} align="center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 + i * 0.2 }}
                    >
                      <Icon as={f.icon} color={plan.color} boxSize={5} />
                    </motion.div>
                    <Text color="gray.700" fontSize="md">{f.text}</Text>
                  </HStack>
                </motion.div>
              ))}
            </VStack>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                mt={4}
                colorScheme="messenger"
                bg={idx === 0 ? plan.color : 'gray.400'}
                color="white"
                size="lg"
                borderRadius="xl"
                fontWeight="bold"
                _hover={idx === 0 ? { 
                  bg: '#D97706', 
                  transform: 'translateY(-2px)', 
                  boxShadow: `0 10px 25px ${plan.color}30`,
                  bgGradient: `linear(45deg, ${plan.color}, ${plan.color}cc)`
                } : { 
                  bg: 'gray.500',
                  transform: 'translateY(-1px)'
                }}
                w="100%"
                transition="all 0.2s ease"
                onClick={() => {
                  if (idx === 0) {
                    console.log('Button clicked for plan:', plan);
                    console.log('Plan name:', plan.name);
                    console.log('Plan price:', plan.price);
                    
                    // Always save to localStorage first
                    localStorage.setItem('selectedPlan', JSON.stringify(plan));
                    
                    // Add a small delay to ensure localStorage is saved
                    setTimeout(() => {
                      try {
                        navigate('/checkout', { state: { plan } });
                      } catch (error) {
                        console.error('Navigate failed, using window.location:', error);
                        // If navigate fails, use window.location but plan should be in localStorage
                        window.location.href = '/checkout';
                      }
                    }, 100);
                  } else {
                    onComingSoonOpen();
                  }
                }}
              >
                {idx === 0 ? 'Ingresar Ahora' : 'Próximamente'}
              </Button>
            </motion.div>
          </VStack>
        </motion.div>
        ))}
      </SimpleGrid>

      {/* Modal de información detallada */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <VStack align="start" spacing={2}>
              <Text fontSize="2xl" fontWeight="bold">{selectedPlan?.name}</Text>
              <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                {selectedPlan?.name === 'Alef (א)' ? `$${selectedPlan?.price} Anual` : 'Próximamente'}
              </Badge>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPlan && (
              <VStack align="start" spacing={6}>
                <Text color="gray.600" fontSize="lg">{selectedPlan.desc}</Text>
                
                <Box>
                  <Text fontWeight="bold" fontSize="lg" mb={2} color={selectedPlan.color}>
                    📅 Duración y Contenido
                  </Text>
                  <UnorderedList spacing={1} ml={4}>
                    <ListItem>Duración estimada: {selectedPlan.detailedInfo.duration}</ListItem>
                    <ListItem>Contenido total: {selectedPlan.detailedInfo.totalHours}</ListItem>
                  </UnorderedList>
                </Box>

                <Box>
                  <Text fontWeight="bold" fontSize="lg" mb={2} color={selectedPlan.color}>
                    📚 Materiales Incluidos
                  </Text>
                  <UnorderedList spacing={1} ml={4}>
                    {selectedPlan.detailedInfo.materials.map((material, idx) => (
                      <ListItem key={idx}>{material}</ListItem>
                    ))}
                  </UnorderedList>
                </Box>

                <Box>
                  <Text fontWeight="bold" fontSize="lg" mb={2} color={selectedPlan.color}>
                    🎯 Ideal Para
                  </Text>
                  <Text ml={4}>{selectedPlan.detailedInfo.bestFor}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" fontSize="lg" mb={2} color={selectedPlan.color}>
                    📞 Soporte Incluido
                  </Text>
                  <Text ml={4}>{selectedPlan.detailedInfo.support}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" fontSize="lg" mb={2} color={selectedPlan.color}>
                    🏆 Certificación
                  </Text>
                  <Text ml={4}>{selectedPlan.detailedInfo.certificate}</Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              bg={selectedPlan?.color}
              color="white"
              size="lg"
              fontWeight="bold"
              _hover={{ opacity: 0.8 }}
              mr={3}
              onClick={() => handleSignup(selectedPlan)}
            >
              Inscribirme Ahora
            </Button>
            <Button variant="ghost" onClick={onClose}>Cerrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Próximamente */}
      <Modal isOpen={isComingSoonOpen} onClose={onComingSoonClose} isCentered>
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent mx={4} borderRadius="2xl" bg="white">
          <ModalHeader textAlign="center" pb={0}>
            <VStack spacing={3}>
              <Box
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                borderRadius="full"
                p={4}
                boxShadow="lg"
              >
                <Text fontSize="3xl">🚀</Text>
              </Box>
              <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                ¡Próximamente!
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center" py={6}>
            <VStack spacing={4}>
              <Text fontSize="lg" color="gray.600" lineHeight="tall">
                Estamos trabajando para traerte más opciones increíbles.
              </Text>
              <Text fontSize="md" color="gray.500">
                Por ahora, puedes comenzar con nuestro plan <strong>Alef (א)</strong>
              </Text>
              <Box 
                bg="gradient-to-r from-blue-50 to-purple-50" 
                p={4} 
                borderRadius="lg" 
                border="1px solid #e2e8f0"
              >
                <Text fontSize="sm" color="gray.600">
                  💡 <strong>Tip:</strong> ¡El plan Alef es perfecto para comenzar tu preparación!
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              size="lg"
              borderRadius="xl"
              px={8}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
              onClick={onComingSoonClose}
            >
              Entendido
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  </Box>
  );
};

export default PricingSection; 