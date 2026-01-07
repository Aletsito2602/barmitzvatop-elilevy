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