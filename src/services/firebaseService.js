import { supabase } from '../supabase/client';

export const submitContactForm = async (formData) => {
  try {
    const { data, error } = await supabase
      .from('forms')
      .insert({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        type: 'contact',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    console.log('Contact form submitted with ID: ', data.id);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Error adding document: ', error);
    return { success: false, error: error.message };
  }
};

export const submitCheckoutForm = async (formData) => {
  try {
    const { data, error } = await supabase
      .from('forms')
      .insert({
        name: formData.name || `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        type: 'checkout',
        data: formData, // Store full object as JSON
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    console.log('Checkout form submitted with ID: ', data.id);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Error submitting checkout form: ', error);
    return { success: false, error: error.message };
  }
};