import { Box, Container, Heading, Text, SimpleGrid, Icon, VStack, useColorModeValue } from '@chakra-ui/react'
import { FaGraduationCap, FaUsers, FaBook, FaGlobe } from 'react-icons/fa'

const Feature = ({ icon, title, text }) => {
  return (
    <VStack
      p={6}
      bg={useColorModeValue('white', 'gray.800')}
      rounded="xl"
      shadow="lg"
      spacing={4}
      align="start"
    >
      <Icon as={icon} w={10} h={10} color="blue.500" />
      <Heading size="md">{title}</Heading>
      <Text color={useColorModeValue('gray.600', 'gray.400')}>{text}</Text>
    </VStack>
  )
}

const About = () => {
  return (
    <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="container.xl">
        <VStack spacing={12}>
          <Heading textAlign="center">
            Un espacio para aprender, conectar y crecer
          </Heading>
          <Text fontSize="xl" textAlign="center" maxW="3xl">
            Fortaleciendo nuestras bases, tradiciones y valores a través de una educación moderna y accesible.
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10} w="full">
            <Feature
              icon={FaGraduationCap}
              title="Educación Online"
              text="Clases 100% online con metodología probada y efectiva"
            />
            <Feature
              icon={FaUsers}
              title="Comunidad"
              text="Conecta con otros estudiantes y comparte experiencias"
            />
            <Feature
              icon={FaBook}
              title="Material Completo"
              text="Acceso a recursos y materiales exclusivos"
            />
            <Feature
              icon={FaGlobe}
              title="Flexibilidad"
              text="Aprende a tu propio ritmo desde cualquier lugar"
            />
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}

export default About 