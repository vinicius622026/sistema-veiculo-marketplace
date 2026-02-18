import { supabase } from './supabaseClient';

export const storageService = {
    async uploadVeiculoImage(veiculoId, file, bucket = 'veiculos') {
        const fileName = `${veiculoId}/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file);
        if (error) throw error;
        return data;
    },

    async uploadProfileImage(userId, file, bucket = 'perfis') {
        const fileName = `${userId}/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file);
        if (error) throw error;
        return data;
    },

    async deleteFile(path, bucket) {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([path]);
        if (error) throw error;
    },

    async getPublicUrl(path, bucket) {
        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);
        return data.publicUrl;
    },

    async listFiles(path, bucket) {
        const { data, error } = await supabase.storage
            .from(bucket)
            .list(path);
        if (error) throw error;
        return data;
    },

    async uploadMultipleImages(veiculoId, files, bucket = 'veiculos') {
        const uploadPromises = files.map(file => 
            this.uploadVeiculoImage(veiculoId, file, bucket)
        );
        return Promise.all(uploadPromises);
    }
};
