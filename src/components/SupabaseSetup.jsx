import React, { useState } from 'react';
import {
  Box,
  Button,
  Code,
  Heading,
  Text,
  VStack,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react';
import { checkDatabaseConnection } from '../services/forumService';

const SCHEMA_SQL = `-- 1. Forum Messages (Comunidad)
create table if not exists public.forum_messages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  user_name text,
  category text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.forum_messages enable row level security;
create policy "Forum messages viewable by everyone" on public.forum_messages for select using (true);
create policy "Authenticated users can insert messages" on public.forum_messages for insert with check (auth.role() = 'authenticated');

-- 2. Community Posts (Optional)
create table if not exists public.community_posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  category text default 'general',
  likes integer default 0,
  replies_count integer default 0,
  is_active boolean default true,
  last_activity timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.community_posts enable row level security;
create policy "Community posts viewable by everyone" on public.community_posts for select using (true);
create policy "Authenticated users can insert posts" on public.community_posts for insert with check (auth.role() = 'authenticated');
create policy "Users can update own posts" on public.community_posts for update using (auth.uid() = user_id);

-- 3. Administrators (CRM Protection)
create table if not exists public.administrators (
  user_id uuid references auth.users not null primary key,
  role text default 'admin',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.administrators enable row level security;
create policy "Read own admin status" on public.administrators for select using (auth.uid() = user_id);

-- 4. Parasha Requests (Herramientas)
create table if not exists public.parasha_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  full_name text not null,
  birth_date date not null,
  birth_time text,
  birth_place text,
  barmitzva_location text,
  status text default 'pendiente',
  assigned_parasha jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  processed_at timestamp with time zone
);
alter table public.parasha_requests enable row level security;
create policy "Users manage own requests" on public.parasha_requests for all using (auth.uid() = user_id);
create policy "Users can create requests" on public.parasha_requests for insert with check (auth.uid() = user_id);
`;

const SupabaseSetup = () => {
  const [status, setStatus] = useState('unknown'); // unknown, connected, error
  const toast = useToast();

  const handleCheck = async () => {
    const result = await checkDatabaseConnection();
    if (result.connected) {
      setStatus('connected');
      toast({
        title: 'Conexión exitosa',
        description: 'Las tablas de Supabase están configuradas correctamente.',
        status: 'success',
        duration: 3000,
      });
    } else {
      setStatus('error');
      toast({
        title: 'Error de conexión',
        description: 'Parece que faltan tablas en la base de datos.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(SCHEMA_SQL);
    toast({
      title: 'SQL copiado',
      description: 'Pega este código en el Editor SQL de Supabase Dashboard.',
      status: 'success',
      duration: 3000,
    });
  };

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" bg="white" shadow="md">
      <VStack spacing={4} align="stretch">
        <Heading size="md">Estado de la Base de Datos</Heading>
        <Text fontSize="sm" color="gray.600">
          Verifica y configura TODAS las tablas necesarias (Foro, Administradores, Parashá).
        </Text>

        <Button onClick={handleCheck} colorScheme="blue" size="sm" alignSelf="start">
          Verificar Conexión
        </Button>

        {status === 'connected' && (
          <Alert status="success">
            <AlertIcon />
            Todo está listo. La base de datos está disponible.
          </Alert>
        )}

        {status === 'error' && (
          <Alert status="error" flexDirection="column" alignItems="start">
            <Box display="flex" alignItems="center" mb={2}>
              <AlertIcon />
              <AlertTitle>Faltan tablas requeridas</AlertTitle>
            </Box>
            <AlertDescription fontSize="sm">
              Es probable que falten tablas como <b>parasha_requests</b>, <b>forum_messages</b> o <b>administrators</b>.
            </AlertDescription>

            <Box mt={4} width="100%">
              <Text fontWeight="bold" mb={2}>Instrucciones:</Text>
              <Text as="ol" pl={4} mb={4} fontSize="sm">
                <li>Ve al <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Dashboard de Supabase</a>.</li>
                <li>Abre el <b>SQL Editor</b>.</li>
                <li>Crea una <b>New Query</b>.</li>
                <li>Copia el siguiente código SQL COMPLETO y ejecútalo.</li>
                <li>Esto creará todas las tablas faltantes.</li>
              </Text>

              <Button size="xs" onClick={copyToClipboard} mb={2} colorScheme="green">
                Copiar SQL Completo
              </Button>

              <Accordion allowToggle>
                <AccordionItem border="none">
                  <AccordionButton px={0}>
                    <Box flex="1" textAlign="left" fontSize="xs" fontWeight="bold">
                      Ver SQL Completo
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4} px={0}>
                    <Code p={4} borderRadius="md" display="block" whiteSpace="pre-wrap" fontSize="xs" maxH="300px" overflowY="auto">
                      {SCHEMA_SQL}
                    </Code>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Box>
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default SupabaseSetup;
