import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export const submitContactForm = async (formData) => {
  try {
    const docRef = await addDoc(collection(db, 'forms'), {
      ...formData,
      timestamp: serverTimestamp(),
      type: 'contact'
    });
    console.log('Document written with ID: ', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding document: ', error);
    return { success: false, error: error.message };
  }
};

export const submitCheckoutForm = async (formData) => {
  try {
    const docRef = await addDoc(collection(db, 'forms'), {
      ...formData,
      timestamp: serverTimestamp(),
      type: 'checkout'
    });
    console.log('Checkout form submitted with ID: ', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error submitting checkout form: ', error);
    return { success: false, error: error.message };
  }
};