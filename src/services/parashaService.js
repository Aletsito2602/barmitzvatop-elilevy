import { collection, addDoc, query, orderBy, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, where } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

// Parasha Requests Management
export const createParashaRequest = async (requestData) => {
  try {
    console.log('Creating parasha request with data:', requestData);
    
    // Check if user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('User not authenticated');
      return { success: false, error: 'Usuario no autenticado' };
    }
    
    console.log('Current user:', currentUser.uid);
    
    const requestsRef = collection(db, 'parashaRequests');
    const newRequest = {
      userId: requestData.userId || currentUser.uid,
      nombre: requestData.nombre,
      fechaNacimiento: requestData.fechaNacimiento,
      horaNacimiento: requestData.horaNacimiento,
      lugarNacimiento: requestData.lugarNacimiento,
      ubicacionBarmitzva: requestData.ubicacionBarmitzva,
      
      // Status tracking
      status: 'pendiente', // pendiente, procesando, completada, rechazada
      parashaAsignada: null,
      
      // Timestamps
      createdAt: new Date().toISOString(), // Use regular timestamp instead of serverTimestamp
      updatedAt: new Date().toISOString(),
      processedAt: null,
      completedAt: null
    };
    
    console.log('Attempting to add document to Firestore...');
    console.log('New request object:', newRequest);
    
    const docRef = await addDoc(requestsRef, newRequest);
    console.log('Parasha request created with ID: ', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating parasha request:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    
    // Fallback: Use localStorage if Firestore fails
    try {
      const fallbackId = Date.now().toString();
      const fallbackRequest = {
        id: fallbackId,
        ...requestData,
        status: 'pendiente',
        createdAt: new Date().toISOString(),
        fallback: true
      };
      
      const existingRequests = JSON.parse(localStorage.getItem('parashaRequests') || '[]');
      existingRequests.push(fallbackRequest);
      localStorage.setItem('parashaRequests', JSON.stringify(existingRequests));
      
      console.log('Saved to localStorage as fallback');
      return { success: true, id: fallbackId, fallback: true };
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return { success: false, error: error.message };
    }
  }
};

export const getAllParashaRequests = async () => {
  try {
    console.log('Getting parasha requests from Firebase...');
    const requestsRef = collection(db, 'parashaRequests');
    const q = query(requestsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const requests = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      requests.push({ 
        id: doc.id, 
        ...data,
        // Convert Firestore timestamps to readable format
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        processedAt: data.processedAt?.toDate?.() || null,
        completedAt: data.completedAt?.toDate?.() || null
      });
    });
    
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
    
    // Try to get from Firestore first
    try {
      const requestsRef = collection(db, 'parashaRequests');
      const q = query(
        requestsRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const requests = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        requests.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
          processedAt: data.processedAt?.toDate?.() || null,
          completedAt: data.completedAt?.toDate?.() || null
        });
      });
      
      console.log('User parasha requests loaded from Firestore:', requests.length);
      return { success: true, data: requests };
    } catch (firestoreError) {
      console.log('Firestore failed, trying localStorage fallback...');
      
      // Fallback to localStorage
      const allRequests = JSON.parse(localStorage.getItem('parashaRequests') || '[]');
      const userRequests = allRequests
        .filter(request => request.userId === userId)
        .map(request => ({
          ...request,
          createdAt: new Date(request.createdAt),
          updatedAt: new Date(request.updatedAt || request.createdAt)
        }))
        .sort((a, b) => b.createdAt - a.createdAt);
      
      console.log('User parasha requests loaded from localStorage:', userRequests.length);
      return { success: true, data: userRequests };
    }
  } catch (error) {
    console.error('Error getting user parasha requests:', error);
    return { success: false, error: error.message };
  }
};

export const updateParashaRequest = async (requestId, updates) => {
  try {
    const requestRef = doc(db, 'parashaRequests', requestId);
    await updateDoc(requestRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating parasha request:', error);
    return { success: false, error: error.message };
  }
};

export const assignParashaToRequest = async (requestId, parashaData) => {
  try {
    const requestRef = doc(db, 'parashaRequests', requestId);
    await updateDoc(requestRef, {
      status: 'completada',
      parashaAsignada: parashaData,
      processedAt: serverTimestamp(),
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error assigning parasha:', error);
    return { success: false, error: error.message };
  }
};

export const deleteParashaRequest = async (requestId) => {
  try {
    const requestRef = doc(db, 'parashaRequests', requestId);
    await deleteDoc(requestRef);
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
    
    // Calculate Bar Mitzvah date (13 years after birth)
    const barMitzvahDate = new Date(birth);
    barMitzvahDate.setFullYear(birth.getFullYear() + 13);
    
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
      barMitzvahDate: barMitzvahDate,
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