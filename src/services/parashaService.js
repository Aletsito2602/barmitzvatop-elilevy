import { supabase } from '../supabase/client';

// Parasha Requests Management
export const createParashaRequest = async (requestData) => {
  try {
    console.log('Creating parasha request with data:', requestData);

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('User not authenticated');
      return { success: false, error: 'Usuario no autenticado' };
    }

    console.log('Current user:', user.id);

    const { data: newRequest, error } = await supabase
      .from('parasha_requests')
      .insert({
        user_id: requestData.userId || user.id,
        full_name: requestData.nombre,
        birth_date: requestData.fechaNacimiento,
        birth_time: requestData.horaNacimiento,
        birth_place: requestData.lugarNacimiento,
        barmitzva_location: requestData.ubicacionBarmitzva,
        status: 'pendiente'
      })
      .select()
      .single();

    if (error) throw error;

    console.log('Parasha request created with ID: ', newRequest.id);
    return { success: true, id: newRequest.id };
  } catch (error) {
    console.error('Error creating parasha request:', error);
    return { success: false, error: error.message };
  }
};

export const getAllParashaRequests = async () => {
  try {
    console.log('Getting parasha requests from Supabase...');

    const { data, error } = await supabase
      .from('parasha_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const requests = data.map(req => ({
      id: req.id,
      userId: req.user_id,
      nombre: req.full_name,
      fechaNacimiento: req.birth_date,
      horaNacimiento: req.birth_time,
      lugarNacimiento: req.birth_place,
      ubicacionBarmitzva: req.barmitzva_location,
      status: req.status,
      parashaAsignada: req.assigned_parasha,
      createdAt: new Date(req.created_at),
      updatedAt: new Date(req.updated_at),
      processedAt: req.processed_at ? new Date(req.processed_at) : null
    }));

    console.log('Parasha requests loaded successfully:', requests.length);
    return { success: true, data: requests };
  } catch (error) {
    console.error('Error getting parasha requests:', error);
    return { success: false, error: error.message };
  }
};

export const getUserParashaRequests = async (userId) => {
  try {
    console.log('Getting parasha requests for user:', userId);

    const { data, error } = await supabase
      .from('parasha_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const requests = data.map(req => ({
      id: req.id,
      userId: req.user_id,
      nombre: req.full_name,
      fechaNacimiento: req.birth_date,
      horaNacimiento: req.birth_time,
      lugarNacimiento: req.birth_place,
      ubicacionBarmitzva: req.barmitzva_location,
      status: req.status,
      parashaAsignada: req.assigned_parasha,
      createdAt: new Date(req.created_at),
      updatedAt: new Date(req.updated_at),
      processedAt: req.processed_at ? new Date(req.processed_at) : null
    }));

    console.log('User parasha requests loaded from Supabase:', requests.length);
    return { success: true, data: requests };

  } catch (error) {
    console.error('Error getting user parasha requests:', error);
    return { success: false, error: error.message };
  }
};

export const updateParashaRequest = async (requestId, updates) => {
  try {
    const dbUpdates = {};
    if (updates.nombre) dbUpdates.full_name = updates.nombre;
    if (updates.fechaNacimiento) dbUpdates.birth_date = updates.fechaNacimiento;
    if (updates.parashaAsignada) dbUpdates.assigned_parasha = updates.parashaAsignada;
    if (updates.status) dbUpdates.status = updates.status;

    const { error } = await supabase
      .from('parasha_requests')
      .update({
        ...dbUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating parasha request:', error);
    return { success: false, error: error.message };
  }
};

export const assignParashaToRequest = async (requestId, parashaData) => {
  try {
    const { error } = await supabase
      .from('parasha_requests')
      .update({
        status: 'completada',
        assigned_parasha: parashaData,
        processed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error assigning parasha:', error);
    return { success: false, error: error.message };
  }
};

export const deleteParashaRequest = async (requestId) => {
  try {
    const { error } = await supabase
      .from('parasha_requests')
      .delete()
      .eq('id', requestId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting parasha request:', error);
    return { success: false, error: error.message };
  }
};

// Utility functions for Parasha calculations
export const calculateParashaFromDate = (birthDate, birthTime, birthPlace) => {
  try {
    // This is a simplified calculation - in reality this would be more complex
    const birth = new Date(birthDate);
    const currentYear = new Date().getFullYear();

    // Calculate Barmitzva date (13 years after birth)
    const barmitzvaDate = new Date(birth);
    barmitzvaDate.setFullYear(birth.getFullYear() + 13);

    // Sample Parashas - in reality this would be based on Hebrew calendar calculations
    const parashas = [
      {
        name: 'Parashat Bereshit',
        hebrew: 'בְּרֵאשִׁית',
        reference: 'Génesis 1:1-6:8',
        meaning: 'En el principio',
        themes: ['Creación', 'Responsabilidad', 'Nuevos comienzos']
      },
      {
        name: 'Parashat Noach',
        hebrew: 'נֹחַ',
        reference: 'Génesis 6:9-11:32',
        meaning: 'Descanso',
        themes: ['Renovación', 'Esperanza', 'Alianza']
      },
      {
        name: 'Parashat Lech-Lecha',
        hebrew: 'לֶךְ-לְךָ',
        reference: 'Génesis 12:1-17:27',
        meaning: 'Vete por ti',
        themes: ['Viaje espiritual', 'Fe', 'Transformación']
      },
      {
        name: 'Parashat Vayera',
        hebrew: 'וַיֵּרָא',
        reference: 'Génesis 18:1-22:24',
        meaning: 'Y apareció',
        themes: ['Hospitalidad', 'Justicia', 'Pruebas de fe']
      },
      {
        name: 'Parashat Chayei Sarah',
        hebrew: 'חַיֵּי שָׂרָה',
        reference: 'Génesis 23:1-25:18',
        meaning: 'Vida de Sara',
        themes: ['Legado', 'Continuidad', 'Elección']
      }
    ];

    // Simple assignment based on birth month (for demo purposes)
    const monthIndex = birth.getMonth() % parashas.length;
    const selectedParasha = parashas[monthIndex];

    return {
      success: true,
      parasha: selectedParasha,
      barmitzvaDate: barmitzvaDate,
      calculatedAt: new Date(),
      birthInfo: {
        date: birthDate,
        time: birthTime,
        place: birthPlace
      }
    };
  } catch (error) {
    console.error('Error calculating parasha:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const getRequestStatusColor = (status) => {
  switch (status) {
    case 'pendiente': return 'yellow';
    case 'procesando': return 'blue';
    case 'completada': return 'green';
    case 'rechazada': return 'red';
    default: return 'gray';
  }
};

export const getRequestStatusText = (status) => {
  switch (status) {
    case 'pendiente': return 'Pendiente';
    case 'procesando': return 'Procesando';
    case 'completada': return 'Completada';
    case 'rechazada': return 'Rechazada';
    default: return 'Desconocido';
  }
};

// =====================================================
// GESTIÓN DE PARASHOT PERSONALES (CRM)
// =====================================================

// Obtener todos los usuarios con sus parashot asignadas
export const getAllUsersWithParasha = async () => {
  try {
    console.log('Getting all users with parasha data...');

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, personal_parasha, study_plan, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const users = data.map(user => ({
      id: user.id,
      email: user.email,
      name: user.full_name,
      avatar: user.avatar_url,
      personalParasha: user.personal_parasha,
      studyPlan: user.study_plan,
      createdAt: new Date(user.created_at),
      hasParasha: !!user.personal_parasha
    }));

    console.log('Users loaded successfully:', users.length);
    return { success: true, data: users };
  } catch (error) {
    console.error('Error getting users with parasha:', error);
    return { success: false, error: error.message };
  }
};

// Asignar parashá directamente a un usuario (sin solicitud previa)
export const assignParashaToUser = async (userId, parashaData) => {
  try {
    console.log('Assigning parasha to user:', userId, parashaData);

    const { error } = await supabase
      .from('profiles')
      .update({
        personal_parasha: parashaData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;

    console.log('Parasha assigned successfully to user:', userId);
    return { success: true };
  } catch (error) {
    console.error('Error assigning parasha to user:', error);
    return { success: false, error: error.message };
  }
};

// Eliminar parashá de un usuario
export const removeParashaFromUser = async (userId) => {
  try {
    console.log('Removing parasha from user:', userId);

    const { error } = await supabase
      .from('profiles')
      .update({
        personal_parasha: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;

    console.log('Parasha removed successfully from user:', userId);
    return { success: true };
  } catch (error) {
    console.error('Error removing parasha from user:', error);
    return { success: false, error: error.message };
  }
};

// Catálogo de parashot predefinidas (las 54 parashot del ciclo anual)
export const PARASHAT_CATALOG = [
  // Bereshit (Génesis)
  { name: 'Bereshit', hebrew: 'בְּרֵאשִׁית', reference: 'Génesis 1:1 - 6:8', book: 'Bereshit' },
  { name: 'Noaj', hebrew: 'נֹחַ', reference: 'Génesis 6:9 - 11:32', book: 'Bereshit' },
  { name: 'Lej Lejá', hebrew: 'לֶךְ־לְךָ', reference: 'Génesis 12:1 - 17:27', book: 'Bereshit' },
  { name: 'Vayerá', hebrew: 'וַיֵּרָא', reference: 'Génesis 18:1 - 22:24', book: 'Bereshit' },
  { name: 'Jayei Sará', hebrew: 'חַיֵּי שָׂרָה', reference: 'Génesis 23:1 - 25:18', book: 'Bereshit' },
  { name: 'Toldot', hebrew: 'תּוֹלְדֹת', reference: 'Génesis 25:19 - 28:9', book: 'Bereshit' },
  { name: 'Vayetzé', hebrew: 'וַיֵּצֵא', reference: 'Génesis 28:10 - 32:3', book: 'Bereshit' },
  { name: 'Vayishlaj', hebrew: 'וַיִּשְׁלַח', reference: 'Génesis 32:4 - 36:43', book: 'Bereshit' },
  { name: 'Vayéshev', hebrew: 'וַיֵּשֶׁב', reference: 'Génesis 37:1 - 40:23', book: 'Bereshit' },
  { name: 'Miketz', hebrew: 'מִקֵּץ', reference: 'Génesis 41:1 - 44:17', book: 'Bereshit' },
  { name: 'Vayigash', hebrew: 'וַיִּגַּשׁ', reference: 'Génesis 44:18 - 47:27', book: 'Bereshit' },
  { name: 'Vayejí', hebrew: 'וַיְחִי', reference: 'Génesis 47:28 - 50:26', book: 'Bereshit' },
  // Shemot (Éxodo)
  { name: 'Shemot', hebrew: 'שְׁמוֹת', reference: 'Éxodo 1:1 - 6:1', book: 'Shemot' },
  { name: 'Vaerá', hebrew: 'וָאֵרָא', reference: 'Éxodo 6:2 - 9:35', book: 'Shemot' },
  { name: 'Bo', hebrew: 'בֹּא', reference: 'Éxodo 10:1 - 13:16', book: 'Shemot' },
  { name: 'Beshalaj', hebrew: 'בְּשַׁלַּח', reference: 'Éxodo 13:17 - 17:16', book: 'Shemot' },
  { name: 'Yitró', hebrew: 'יִתְרוֹ', reference: 'Éxodo 18:1 - 20:23', book: 'Shemot' },
  { name: 'Mishpatim', hebrew: 'מִשְׁפָּטִים', reference: 'Éxodo 21:1 - 24:18', book: 'Shemot' },
  { name: 'Terumá', hebrew: 'תְּרוּמָה', reference: 'Éxodo 25:1 - 27:19', book: 'Shemot' },
  { name: 'Tetzavé', hebrew: 'תְּצַוֶּה', reference: 'Éxodo 27:20 - 30:10', book: 'Shemot' },
  { name: 'Ki Tisá', hebrew: 'כִּי תִשָּׂא', reference: 'Éxodo 30:11 - 34:35', book: 'Shemot' },
  { name: 'Vayakhel', hebrew: 'וַיַּקְהֵל', reference: 'Éxodo 35:1 - 38:20', book: 'Shemot' },
  { name: 'Pekudei', hebrew: 'פְקוּדֵי', reference: 'Éxodo 38:21 - 40:38', book: 'Shemot' },
  // Vayikrá (Levítico)
  { name: 'Vayikrá', hebrew: 'וַיִּקְרָא', reference: 'Levítico 1:1 - 5:26', book: 'Vayikrá' },
  { name: 'Tzav', hebrew: 'צַו', reference: 'Levítico 6:1 - 8:36', book: 'Vayikrá' },
  { name: 'Sheminí', hebrew: 'שְּׁמִינִי', reference: 'Levítico 9:1 - 11:47', book: 'Vayikrá' },
  { name: 'Tazría', hebrew: 'תַזְרִיעַ', reference: 'Levítico 12:1 - 13:59', book: 'Vayikrá' },
  { name: 'Metzorá', hebrew: 'מְּצֹרָע', reference: 'Levítico 14:1 - 15:33', book: 'Vayikrá' },
  { name: 'Ajarei Mot', hebrew: 'אַחֲרֵי מוֹת', reference: 'Levítico 16:1 - 18:30', book: 'Vayikrá' },
  { name: 'Kedoshim', hebrew: 'קְדֹשִׁים', reference: 'Levítico 19:1 - 20:27', book: 'Vayikrá' },
  { name: 'Emor', hebrew: 'אֱמֹר', reference: 'Levítico 21:1 - 24:23', book: 'Vayikrá' },
  { name: 'Behar', hebrew: 'בְּהַר', reference: 'Levítico 25:1 - 26:2', book: 'Vayikrá' },
  { name: 'Bejukotai', hebrew: 'בְּחֻקֹּתַי', reference: 'Levítico 26:3 - 27:34', book: 'Vayikrá' },
  // Bamidbar (Números)
  { name: 'Bamidbar', hebrew: 'בְּמִדְבַּר', reference: 'Números 1:1 - 4:20', book: 'Bamidbar' },
  { name: 'Nasó', hebrew: 'נָשֹׂא', reference: 'Números 4:21 - 7:89', book: 'Bamidbar' },
  { name: 'Behaalotejá', hebrew: 'בְּהַעֲלֹתְךָ', reference: 'Números 8:1 - 12:16', book: 'Bamidbar' },
  { name: 'Shelaj', hebrew: 'שְׁלַח־לְךָ', reference: 'Números 13:1 - 15:41', book: 'Bamidbar' },
  { name: 'Koraj', hebrew: 'קֹרַח', reference: 'Números 16:1 - 18:32', book: 'Bamidbar' },
  { name: 'Jukat', hebrew: 'חֻקַּת', reference: 'Números 19:1 - 22:1', book: 'Bamidbar' },
  { name: 'Balak', hebrew: 'בָּלָק', reference: 'Números 22:2 - 25:9', book: 'Bamidbar' },
  { name: 'Pinjás', hebrew: 'פִּינְחָס', reference: 'Números 25:10 - 30:1', book: 'Bamidbar' },
  { name: 'Matot', hebrew: 'מַּטּוֹת', reference: 'Números 30:2 - 32:42', book: 'Bamidbar' },
  { name: 'Masei', hebrew: 'מַסְעֵי', reference: 'Números 33:1 - 36:13', book: 'Bamidbar' },
  // Devarim (Deuteronomio)
  { name: 'Devarim', hebrew: 'דְּבָרִים', reference: 'Deuteronomio 1:1 - 3:22', book: 'Devarim' },
  { name: 'Vaetjanán', hebrew: 'וָאֶתְחַנַּן', reference: 'Deuteronomio 3:23 - 7:11', book: 'Devarim' },
  { name: 'Ekev', hebrew: 'עֵקֶב', reference: 'Deuteronomio 7:12 - 11:25', book: 'Devarim' },
  { name: 'Reé', hebrew: 'רְאֵה', reference: 'Deuteronomio 11:26 - 16:17', book: 'Devarim' },
  { name: 'Shoftim', hebrew: 'שֹׁפְטִים', reference: 'Deuteronomio 16:18 - 21:9', book: 'Devarim' },
  { name: 'Ki Tetzé', hebrew: 'כִּי־תֵצֵא', reference: 'Deuteronomio 21:10 - 25:19', book: 'Devarim' },
  { name: 'Ki Tavó', hebrew: 'כִּי־תָבוֹא', reference: 'Deuteronomio 26:1 - 29:8', book: 'Devarim' },
  { name: 'Nitzavim', hebrew: 'נִצָּבִים', reference: 'Deuteronomio 29:9 - 30:20', book: 'Devarim' },
  { name: 'Vayélej', hebrew: 'וַיֵּלֶךְ', reference: 'Deuteronomio 31:1 - 31:30', book: 'Devarim' },
  { name: 'Haazinu', hebrew: 'הַאֲזִינוּ', reference: 'Deuteronomio 32:1 - 32:52', book: 'Devarim' },
  { name: 'Vezot Haberajá', hebrew: 'וְזֹאת הַבְּרָכָה', reference: 'Deuteronomio 33:1 - 34:12', book: 'Devarim' }
];