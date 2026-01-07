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
  Image,
  HStack,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { FaHome, FaUsers, FaPlay, FaTools, FaSignOutAlt, FaChartBar, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const NavLink = ({ to, children, icon, onClick, isActive = false }) => (
  <HStack
    as={Link}
    href={to}
    spacing={3}
    px={4}
    py={2}
    borderRadius="lg"
    bg={isActive ? '#F59E0B' : 'transparent'}
    color={isActive ? 'white' : 'black'}
    _hover={{
      bg: isActive ? '#D97706' : '#FEF3C7',
      textDecoration: 'none',
      color: isActive ? 'white' : '#F59E0B',
    }}
    fontSize={{ base: 'lg', md: 'md' }}
    onClick={onClick}
  >
    <Box as={icon} boxSize={5} />
    <Text>{children}</Text>
  </HStack>
);

const DashboardNavbar = ({ currentPage = 'inicio' }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { isAdmin } = useUser();

  const handleLogout = () => {
    // Simular logout y redirigir al home
    navigate('/');
  };

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: FaHome, to: '/dashboard' },
    { id: 'comunidad', label: 'Comunidad', icon: FaUsers, to: '/dashboard/comunidad' },
    { id: 'clases', label: 'Clases', icon: FaPlay, to: '/dashboard/clases' },
    { id: 'herramientas', label: 'Herramientas', icon: FaTools, to: '/dashboard/herramientas' },
    { id: 'perfil', label: 'Perfil', icon: FaUser, to: '/dashboard/perfil' },
    ...(isAdmin ? [{ id: 'crm', label: 'CRM', icon: FaChartBar, to: '/dashboard/crm' }] : []),
  ];

  return (
    <Box bg="white" borderBottom="1px" borderColor="gray.200" position="sticky" top={0} zIndex={1000}>
      <Flex
        h={16}
        alignItems="center"
        justifyContent="space-between"
        maxW="95vw"
        mx="auto"
        px={{ base: 4, md: 6, lg: 8 }}
      >
        {/* Logo */}
        <HStack spacing={3}>
          <Image src="/favicon.png" alt="BMTop Academy" maxH="40px" />
          <Text fontWeight="bold" fontSize="lg" color="#F59E0B">
            BarmitzvaTop
          </Text>
        </HStack>

        {/* Desktop Menu */}
        <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              icon={item.icon}
              isActive={currentPage === item.id}
            >
              {item.label}
            </NavLink>
          ))}
        </HStack>

        {/* Desktop Logout */}
        <Button
          leftIcon={<FaSignOutAlt />}
          onClick={handleLogout}
          variant="ghost"
          color="gray.600"
          _hover={{ color: '#F59E0B' }}
          display={{ base: 'none', md: 'flex' }}
        >
          Salir
        </Button>

        {/* Mobile Menu Button */}
        <IconButton
          size="md"
          icon={<HamburgerIcon />}
          aria-label="Abrir Menu"
          display={{ md: 'none' }}
          onClick={onOpen}
          bg="transparent"
          color="gray.700"
          _hover={{ bg: '#FEF3C7' }}
        />
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <HStack spacing={3}>
              <Image src="/favicon.png" alt="BMTop Academy" maxH="30px" />
              <Text fontWeight="bold" color="#F59E0B">BarmitzvaTop</Text>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" pt={4}>
              {menuItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.to}
                  icon={item.icon}
                  isActive={currentPage === item.id}
                  onClick={onClose}
                >
                  {item.label}
                </NavLink>
              ))}
              <Button
                leftIcon={<FaSignOutAlt />}
                onClick={() => {
                  onClose();
                  handleLogout();
                }}
                variant="ghost"
                color="gray.600"
                _hover={{ color: '#F59E0B' }}
                justifyContent="flex-start"
                mt={4}
              >
                Salir
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default DashboardNavbar; 