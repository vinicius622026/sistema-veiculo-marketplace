import { supabase } from './supabaseClient';

export const analyticsService = {
    async getVeiculoViews(veiculoId) {
        const { data, error } = await supabase
            .from('visualizacoes')
            .select('*')
            .eq('veiculo_id', veiculoId);
        if (error) throw error;
        return data;
    },

    async trackVeiculoView(veiculoId, userId) {
        const { data, error } = await supabase
            .from('visualizacoes')
            .insert([{ veiculo_id: veiculoId, usuario_id: userId }])
            .select();
        if (error) throw error;
        return data[0];
    },

    async getLojaAnalytics(lojaId) {
        const { data, error } = await supabase
            .from('lojas')
            .select(`
                id,
                nome,
                count(veiculos) as total_veiculos,
                count(pagamentos) as total_vendas
            `)
            .eq('id', lojaId);
        if (error) throw error;
        return data[0];
    },

    async getMostViewedVehicles(limit = 10) {
        const { data, error } = await supabase
            .from('visualizacoes')
            .select('veiculo_id, count(*) as total_views')
            .group('veiculo_id')
            .order('total_views', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data;
    },

    async getSalesAnalytics(startDate, endDate) {
        const { data, error } = await supabase
            .from('pagamentos')
            .select('*')
            .gte('data_criacao', startDate)
            .lte('data_criacao', endDate);
        if (error) throw error;
        return data;
    },

    async getUserAnalytics(userId) {
        const { data, error } = await supabase
            .from('usuarios')
            .select(`
                id,
                nome,
                count(pagamentos) as total_compras,
                count(favoritos) as total_favoritos
            `)
            .eq('id', userId);
        if (error) throw error;
        return data[0];
    }
};
