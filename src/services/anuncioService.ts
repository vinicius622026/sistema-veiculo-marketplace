import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-supabase-url';
const supabaseKey = 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export const anuncioService = {
  async getAll() {
    const { data, error } = await supabase.from('anuncios').select('*');
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase.from('anuncios').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async getByVeiculoId(veiculoId) {
    const { data, error } = await supabase.from('anuncios').select('*').eq('veiculo_id', veiculoId);
    if (error) throw error;
    return data;
  },

  async create(anuncio) {
    const { data, error } = await supabase.from('anuncios').insert([anuncio]);
    if (error) throw error;
    return data;
  },

  async update(id, anuncio) {
    const { data, error } = await supabase.from('anuncios').update(anuncio).eq('id', id);
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { data, error } = await supabase.from('anuncios').delete().eq('id', id);
    if (error) throw error;
    return data;
  },

  async getActive() {
    const { data, error } = await supabase.from('anuncios').select('*').eq('status', 'active');
    if (error) throw error;
    return data;
  },

  async deactivate(id) {
    const { data, error } = await supabase.from('anuncios').update({ status: 'inactive' }).eq('id', id);
    if (error) throw error;
    return data;
  },

  async activate(id) {
    const { data, error } = await supabase.from('anuncios').update({ status: 'active' }).eq('id', id);
    if (error) throw error;
    return data;
  }
};
