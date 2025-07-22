import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Container,
  Heading,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { motion } from 'framer-motion' // eslint-disable-line no-unused-vars

const FAQ = () => {
  const faqs = [
    {
      question: "¿Cuál es la duración del curso?",
      answer: "La duración del curso varía según el paquete elegido, pero generalmente se trabaja en base a la fecha que toque hacer el Barmitzva, con sesiones programadas para asegurar un aprendizaje efectivo."
    },
    {
      question: "¿Se ofrecen materiales adicionales?",
      answer: "Sí, los estudiantes recibirán materiales didácticos, grabaciones de voz y recursos complementarios para apoyar su aprendizaje."
    },
    {
      question: "¿Hay un límite en la cantidad de estudiantes por clase?",
      answer: "Las clases online son personalizadas ya que el curso está diseñado para cada alumno según su nivel académico, su costumbre para las tonadas, registro de voz (tono), su fecha de Barmitzva y Parashá (parte de la torá que tocará leer)."
    },
    {
      question: "¿Qué pasa si no puedo asistir a una clase?",
      answer: "Esto no va a pasar ya que es un curso online que te permite ir a tu ritmo, sin embargo, TE RECOMIENDO TENER DISCIPLINA PARA AVANZAR EN BUEN RITMO."
    },
    {
      question: "¿Puedo contactar contigo si tengo más preguntas?",
      answer: "¡Por supuesto! Estoy aquí para ayudarte. Puedes contactarme a través del formulario de contacto en la página o mediante correo electrónico. También a mi número de WhatsApp."
    },
    {
      question: "¿Puedo asistir a las clases desde cualquier parte del mundo?",
      answer: "Sí, el curso está diseñado para ser accesible online, por lo que puedes participar desde cualquier lugar donde haya conexión a Internet."
    },
    {
      question: "¿Qué necesito para participar en el curso online?",
      answer: "Solo necesitas una computadora o dispositivo móvil con conexión a Internet, y preferiblemente auriculares para mejorar la calidad del audio durante las clases. También recuerda la Kipá, un sidur (si no tienes, me dejas saber por favor) y un lápiz."
    },
    {
      question: "¿Cómo se estructura cada clase?",
      answer: "Cada clase tiene una duración de 30 a 45 min e incluye una combinación de presentación de contenido, ejercicios prácticos, asegurando un aprendizaje dinámico y completo."
    },
    {
      question: "¿Cuándo recibiré mi certificación?",
      answer: "La certificación se entregará al finalizar el curso, una vez que hayas completado todos los requisitos y evaluaciones. Te lo haré llegar."
    },
    {
      question: "¿Hay algún descuento por inscripción anticipada?",
      answer: "Sí, los primeros estudiantes que se inscriban recibirán un descuento como motivación para unirse al curso."
    }
  ]

  return (
    <Box 
      id="faq" 
      py={20} 
      bgGradient="linear(135deg, #FEF3E2 0%, #FED7AA 100%)" 
      position="relative"
    >
      {/* Patrón de fondo decorativo */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.1}
        bgImage="radial-gradient(circle at 25px 25px, #F59E0B 2px, transparent 0), radial-gradient(circle at 75px 75px, #D97706 2px, transparent 0)"
        bgSize="100px 100px"
      />
      
      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack spacing={12}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <VStack spacing={4} textAlign="center">
              <Heading color="gray.800" size="2xl" fontWeight="bold">
                Preguntas Frecuentes
              </Heading>
              <Text fontSize="xl" color="black" maxW="2xl">
                Encuentra respuestas a las preguntas más comunes sobre nuestro curso de preparación para el Barmitzva
              </Text>
            </VStack>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ width: '100%', maxWidth: '4xl', margin: '0 auto' }}
          >
            <Box display="flex" justifyContent="center" w="100%">
              <Accordion 
                allowMultiple 
                w="full" 
                maxW="4xl" 
                bg="white" 
                borderRadius="2xl" 
                boxShadow="2xl"
                border="1px solid"
                borderColor="orange.100"
              >
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <AccordionItem 
                    border="none" 
                    borderBottom={index < faqs.length - 1 ? "1px solid #FED7AA" : "none"}
                  >
                    <h2>
                      <AccordionButton
                        py={6}
                        px={8}
                        _hover={{ 
                          bg: "orange.50", 
                          transform: "translateY(-1px)",
                          boxShadow: "md"
                        }}
                        _expanded={{ 
                          bg: "orange.50", 
                          color: "#D97706",
                          borderBottom: "2px solid #F59E0B"
                        }}
                        transition="all 0.2s ease"
                        borderRadius={
                          index === 0 ? "2xl 2xl 0 0" : 
                          index === faqs.length - 1 ? "0 0 2xl 2xl" : "none"
                        }
                      >
                      <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg" color="black">
                        {faq.question}
                      </Box>
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 + index * 0.5 }}
                      >
                        <AccordionIcon 
                          fontSize="xl" 
                          color="#F59E0B"
                          transition="transform 0.2s ease"
                        />
                      </motion.div>
                    </AccordionButton>
                  </h2>
                  <AccordionPanel 
                    pb={8} 
                    px={8} 
                    color="black" 
                    fontSize="md" 
                    lineHeight="tall"
                    bg="orange.25"
                    borderRadius={index === faqs.length - 1 ? "0 0 2xl 2xl" : "none"}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Text>{faq.answer}</Text>
                    </motion.div>
                  </AccordionPanel>
                </AccordionItem>
              </motion.div>
              ))}
              </Accordion>
            </Box>
          </motion.div>
          
          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <Box 
              bg="white" 
              p={8} 
              borderRadius="2xl" 
              boxShadow="xl"
              textAlign="center"
              border="2px solid"
              borderColor="orange.200"
              maxW="2xl"
              _hover={{
                boxShadow: "2xl",
                borderColor: "orange.300"
              }}
              transition="all 0.3s ease"
            >
              <Text fontSize="lg" color="gray.700" mb={4} fontWeight="medium">
                ¿No encontraste la respuesta que buscabas?
              </Text>
              <Text fontSize="md" color="gray.600">
                Contáctame directamente y te ayudaré con cualquier pregunta específica sobre tu preparación para el Barmitzva.
              </Text>
            </Box>
          </motion.div>
        </VStack>
      </Container>
    </Box>
  )
}

export default FAQ 