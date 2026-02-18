import { supabase } from './supabaseClient';

export const lojaService = {
    async getAll() {
        const { data, error } = await supabase.from('lojas').select('*');
        if (error) throw error;
        return data;
    },

    async getById(id: string) {
        const { data, error } = await supabase.from('lojas').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    async getByUserId(userId: string) {
        const { data, error } = await supabase.from('lojas').select('*').eq('owner_id', userId);
        if (error) throw error;
        return data;
    },

    async create(loja: any) {
        const { data, error } = await supabase.from('lojas').insert([loja]).select();
        if (error) throw error;
        return data[0];
    },

    async update(id: string, updates: any) {
        const { data, error } = await supabase.from('lojas').update(updates).eq('id', id).select();
        if (error) throw error;
        return data[0];
    },

    async delete(id: string) {
        const { error } = await supabase.from('lojas').delete().eq('id', id);
        if (error) throw error;
    },

    async getPending() {
        const { data, error } = await supabase.from('lojas').select('*').eq('status', 'pendente');
        if (error) throw error;
        return data;
    },

    async approve(id: string) {
        const { data, error } = await supabase.from('lojas').update({ status: 'aprovada', data_aprovacao: new Date().toISOString() }).eq('id', id).select();
        if (error) throw error;
        return data[0];
    },

    async reject(id: string, motivo: string) {
        const { data, error } = await supabase.from('lojas').update({ status: 'rejeitada', motivo_rejeicao: motivo }).eq('id', id).select();
        if (error) throw error;
        return data[0];
    }
};