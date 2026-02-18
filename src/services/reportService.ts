import { supabase } from './supabaseClient';

export const reportService = {
    async createReport(reportData) {
        const { data, error } = await supabase
            .from('denuncias')
            .insert([reportData])
            .select();
        if (error) throw error;
        return data[0];
    },

    async getReportById(id) {
        const { data, error } = await supabase
            .from('denuncias')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async getAllReports() {
        const { data, error } = await supabase
            .from('denuncias')
            .select('*')
            .order('data_criacao', { ascending: false });
        if (error) throw error;
        return data;
    },

    async getReportsByStatus(status) {
        const { data, error } = await supabase
            .from('denuncias')
            .select('*')
            .eq('status', status)
            .order('data_criacao', { ascending: false });
        if (error) throw error;
        return data;
    },

    async updateReportStatus(id, status, adminNotes) {
        const { data, error } = await supabase
            .from('denuncias')
            .update({ status, notas_admin: adminNotes, data_atualizacao: new Date().toISOString() })
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    },

    async deleteReport(id) {
        const { error } = await supabase
            .from('denuncias')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    async getUserReports(userId) {
        const { data, error } = await supabase
            .from('denuncias')
            .select('*')
            .eq('usuario_id', userId)
            .order('data_criacao', { ascending: false });
        if (error) throw error;
        return data;
    },

    async getReportStats() {
        const { data, error } = await supabase
            .from('denuncias')
            .select('status, count(*) as total')
            .group('status');
        if (error) throw error;
        return data;
    }
};