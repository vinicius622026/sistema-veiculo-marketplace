import { supabase } from './supabaseClient';

export const favoriteService = {
    async addToFavorites(userId, veiculoId) {
        const { data, error } = await supabase
            .from('favoritos')
            .insert([{ usuario_id: userId, veiculo_id: veiculoId }])
            .select();
        if (error) throw error;
        return data[0];
    },

    async removeFromFavorites(userId, veiculoId) {
        const { error } = await supabase
            .from('favoritos')
            .delete()
            .eq('usuario_id', userId)
            .eq('veiculo_id', veiculoId);
        if (error) throw error;
    },

    async getUserFavorites(userId) {
        const { data, error } = await supabase
            .from('favoritos')
            .select(`
                id,
                veiculos (*)
            `)
            .eq('usuario_id', userId);
        if (error) throw error;
        return data;
    },

    async isFavorite(userId, veiculoId) {
        const { data, error } = await supabase
            .from('favoritos')
            .select('id')
            .eq('usuario_id', userId)
            .eq('veiculo_id', veiculoId)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return !!data;
    },

    async getFavoriteCount(userId) {
        const { count, error } = await supabase
            .from('favoritos')
            .select('*', { count: 'exact', head: true })
            .eq('usuario_id', userId);
        if (error) throw error;
        return count || 0;
    },

    async clearFavorites(userId) {
        const { error } = await supabase
            .from('favoritos')
            .delete()
            .eq('usuario_id', userId);
        if (error) throw error;
    }
};