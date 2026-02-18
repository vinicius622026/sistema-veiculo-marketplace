import { supabase } from './supabaseClient';

export const usuarioService = {
    async getUserById(id) {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async getUserByEmail(email) {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .single();
        if (error) throw error;
        return data;
    },

    async updateUser(id, updates) {
        const { data, error } = await supabase
            .from('usuarios')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    },

    async getUserProfile(id) {
        const { data, error } = await supabase
            .from('usuarios')
            .select('id, nome, email, fotoPerfil, bio, dataRegistro, status')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async updateUserProfile(id, profileData) {
        const { data, error } = await supabase
            .from('usuarios')
            .update(profileData)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    },

    async getUserStats(userId) {
        const { data, error } = await supabase
            .from('usuarios')
            .select('id, count(pagamentos) as total_compras')
            .eq('id', userId);
        if (error) throw error;
        return data;
    },

    async searchUsers(searchTerm) {
        const { data, error } = await supabase
            .from('usuarios')
            .select('id, nome, email, fotoPerfil')
            .ilike('nome', `%${searchTerm}%`);
        if (error) throw error;
        return data;
    }
};
