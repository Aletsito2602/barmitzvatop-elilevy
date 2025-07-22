import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Alert,
  AlertIcon,
  Code,
  useToast,
  Badge,
  Link,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  OrderedList,
  ListItem,
} from '@chakra-ui/react';
import { FaExternalLinkAlt, FaCheck, FaTimes, FaTools } from 'react-icons/fa';
import { useState } from 'react';
import { checkCurrentPermissions, ensureCollectionExists } from '../services/firebaseAdmin';

const FirebaseSetup = () => {
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const toast = useToast();

  const checkPermissions = async () => {
    setIsChecking(true);
    try {
      const result = await checkCurrentPermissions();
      setPermissionStatus(result);
      
      if (result.hasWritePermission) {
        toast({
          title: '✅ Permisos correctos',
          description: 'Firebase está configurado correctamente',
          status: 'success',
          duration: 3000,
        });
      } else {
        toast({
          title: '❌ Sin permisos',
          description: 'Necesitas configurar las reglas de Firebase',
          status: 'error',
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error verificando permisos',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsChecking(false);
    }
  };

  const firebaseRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

  return (
    <Box w="100%" maxW="800px" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Heading size="lg" color="gray.800">
                  🔧 Configuración de Firebase
                </Heading>
                <Badge 
                  colorScheme={permissionStatus?.hasWritePermission ? 'green' : 'red'}
                  fontSize="sm"
                  px={3}
                  py={1}
                >
                  {permissionStatus?.hasWritePermission ? 'Configurado' : 'Pendiente'}
                </Badge>
              </HStack>
              
              <Text color="gray.600">
                Para que los foros funcionen correctamente, necesitas configurar las reglas de Firebase.
              </Text>
              
              <HStack>
                <Button
                  colorScheme="blue"
                  onClick={checkPermissions}
                  isLoading={isChecking}
                  leftIcon={<FaTools />}
                >
                  Verificar Permisos
                </Button>
                
                <Link
                  href="https://console.firebase.google.com/project/barmitzva-top/firestore/rules"
                  isExternal
                >
                  <Button variant="outline" rightIcon={<FaExternalLinkAlt />}>
                    Abrir Firebase Console
                  </Button>
                </Link>
              </HStack>
              
              {permissionStatus && (
                <Alert status={permissionStatus.hasWritePermission ? 'success' : 'error'}>
                  <AlertIcon />
                  {permissionStatus.hasWritePermission 
                    ? '✅ Firebase está configurado correctamente. Los foros funcionarán en tiempo real.'
                    : '❌ Sin permisos de escritura. Los foros funcionan solo en modo local.'
                  }
                </Alert>
              )}
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Accordion allowToggle>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Heading size="md">📋 Instrucciones Paso a Paso</Heading>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack spacing={4} align="stretch">
                    <OrderedList spacing={3}>
                      <ListItem>
                        <Text fontWeight="bold">Abrir Firebase Console</Text>
                        <Text fontSize="sm" color="gray.600">
                          Ve a{' '}
                          <Link 
                            href="https://console.firebase.google.com/project/barmitzva-top" 
                            color="blue.500" 
                            isExternal
                          >
                            Firebase Console
                          </Link>
                        </Text>
                      </ListItem>
                      
                      <ListItem>
                        <Text fontWeight="bold">Navegar a Firestore Rules</Text>
                        <Text fontSize="sm" color="gray.600">
                          En el menú lateral: Firestore Database → Rules
                        </Text>
                      </ListItem>
                      
                      <ListItem>
                        <Text fontWeight="bold">Copiar las nuevas reglas</Text>
                        <Box mt={2}>
                          <Code 
                            display="block" 
                            whiteSpace="pre" 
                            p={4} 
                            bg="gray.50" 
                            borderRadius="md"
                            fontSize="sm"
                          >
                            {firebaseRules}
                          </Code>
                        </Box>
                      </ListItem>
                      
                      <ListItem>
                        <Text fontWeight="bold">Publicar las reglas</Text>
                        <Text fontSize="sm" color="gray.600">
                          Haz clic en "Publicar" en Firebase Console
                        </Text>
                      </ListItem>
                      
                      <ListItem>
                        <Text fontWeight="bold">Verificar funcionamiento</Text>
                        <Text fontSize="sm" color="gray.600">
                          Vuelve aquí y haz clic en "Verificar Permisos"
                        </Text>
                      </ListItem>
                    </OrderedList>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </CardBody>
        </Card>

        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold">💡 Nota Importante</Text>
            <Text fontSize="sm">
              Estas reglas son para desarrollo. En producción, deberías usar reglas más restrictivas 
              que requieran autenticación.
            </Text>
          </VStack>
        </Alert>

      </VStack>
    </Box>
  );
};

export default FirebaseSetup;