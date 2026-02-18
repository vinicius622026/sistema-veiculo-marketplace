import { supabase } from './supabaseClient';

export const searchService = {
    async searchVehicles(filters) {
        let query = supabase.from('veiculos').select('*');

        if (filters.marca) query = query.ilike('marca', `%${filters.marca}%`);
        if (filters.modelo) query = query.ilike('modelo', `%${filters.modelo}%`);
        if (filters.minPreco) query = query.gte('valor', filters.minPreco);
        if (filters.maxPreco) query = query.lte('valor', filters.maxPreco);
        if (filters.ano) query = query.eq('ano', filters.ano);
        if (filters.combustivel) query = query.eq('combustivel', filters.combustivel);
        if (filters.cambio) query = query.eq('cambio', filters.cambio);

        const { data, error } = await query.order('data_criacao', { ascending: false });
        if (error) throw error;
        return data;
    },

    async advancedSearch(searchTerm) {
        const { data, error } = await supabase
            .from('veiculos')
            .select('*')
            .or(`marca.ilike.%${searchTerm}%,modelo.ilike.%${searchTerm}%,descricao.ilike.%${searchTerm}%`);
        if (error) throw error;
        return data;
    },

    async getFilterOptions() {
        const { data: marcas } = await supabase
            .from('veiculos')
            .select('marca')
            .distinct();
        
        const { data: combustiveis } = await supabase
            .from('veiculos')
            .select('combustivel')
            .distinct();

        const { data: cambios } = await supabase
            .from('veiculos')
            .select('cambio')
            .distinct();

        return { marcas, combustiveis, cambios };
    },

    async getSuggestionsForSearch(term) {
        const { data, error } = await supabase
            .from('veiculos')
            .select('marca, modelo')
            .or(`marca.ilike.%${term}%,modelo.ilike.%${term}%`)
            .limit(10);
        if (error) throw error;
        return data;
    }
};