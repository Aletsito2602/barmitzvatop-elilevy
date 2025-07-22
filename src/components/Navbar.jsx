import { 
  Box, 
  Flex, 
  Button, 
  Link, 
  Stack, 
  IconButton, 
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  Image
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { Link as RouterLink } from 'react-router-dom'

const NavLink = ({ to, children, onClick, isAnchor = false }) => {
  const handleClick = (e) => {
    if (isAnchor) {
      e.preventDefault()
      const element = document.getElementById(to.replace('#', ''))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    if (onClick) onClick()
  }

  return (
    <Link 
      href={isAnchor ? to : undefined}
      as={!isAnchor ? RouterLink : undefined}
      to={!isAnchor ? to : undefined}
      _hover={{ textDecoration: 'none', color: '#F59E0B' }}
      color="white"
      fontSize={{ base: 'lg', md: 'md' }}
      py={{ base: 2, md: 0 }}
      onClick={handleClick}
      cursor="pointer"
    >
      {children}
    </Link>
  )
}

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box 
      position="fixed" 
      w="100%" 
      zIndex={1000}
      bg="rgba(0, 0, 0, 0.8)"
      backdropFilter="blur(10px)"
    >
      <Flex 
        h={16} 
        alignItems={'center'} 
        justifyContent={'space-between'}
        maxW="1200px"
        mx="auto"
        px={4}
      >
        <Image src="/logo.webp" alt="BarmitzvaTop" maxH="32px" />

        {/* Desktop Menu */}
        <Flex alignItems={'center'} display={{ base: 'none', md: 'flex' }}>
          <Stack direction={'row'} spacing={7}>
            <NavLink to="#hero" isAnchor>Inicio</NavLink>
            <NavLink to="#benefits" isAnchor>Beneficios</NavLink>
            <NavLink to="#about-eli" isAnchor>Sobre Eli</NavLink>
            <NavLink to="#pricing" isAnchor>Precios</NavLink>
            <Link 
              href="https://barmitzvaconelilevy.com" 
              isExternal 
              _hover={{ textDecoration: 'none', color: '#F59E0B' }}
              color="white"
              fontSize="md"
            >
              Clases Privadas
            </Link>
            <NavLink to="#faq" isAnchor>FAQ</NavLink>
            <Button
              as={RouterLink}
              to="/login"
              bg="#F59E0B"
              color="white"
              _hover={{
                bg: '#D97706',
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              size="sm"
            >
              Ingresar
            </Button>
          </Stack>
        </Flex>

        {/* Mobile Menu Button */}
        <IconButton
          size={'md'}
          icon={<HamburgerIcon />}
          aria-label={'Abrir Menu'}
          display={{ md: 'none' }}
          onClick={onOpen}
          bg="transparent"
          color="white"
          _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
        />
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="rgba(0, 0, 0, 0.95)" color="white">
          <DrawerCloseButton color="white" />
          <DrawerHeader>
            <Image src="/logo.webp" alt="BarmitzvaTop" maxH="30px" />
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={6} align="start" pt={4}>
              <NavLink to="#hero" isAnchor onClick={onClose}>Inicio</NavLink>
              <NavLink to="#benefits" isAnchor onClick={onClose}>Beneficios</NavLink>
              <NavLink to="#about-eli" isAnchor onClick={onClose}>Sobre Eli</NavLink>
              <NavLink to="#pricing" isAnchor onClick={onClose}>Precios</NavLink>
              <Link 
                href="https://barmitzvaconelilevy.com" 
                isExternal 
                _hover={{ textDecoration: 'none', color: '#F59E0B' }}
                color="white"
                fontSize="lg"
                py={2}
                onClick={onClose}
              >
                Clases Privadas
              </Link>
              <NavLink to="#faq" isAnchor onClick={onClose}>FAQ</NavLink>
              <Button
                as={RouterLink}
                to="/login"
                bg="#F59E0B"
                color="white"
                _hover={{
                  bg: '#D97706',
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                size="md"
                w="full"
                onClick={onClose}
              >
                Ingresar
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default Navbar 