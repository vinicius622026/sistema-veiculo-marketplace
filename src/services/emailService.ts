import { supabase } from './supabaseClient';

export const emailService = {
    async sendWelcomeEmail(email, userName) {
        const { data, error } = await supabase.functions.invoke('send-welcome-email', {
            body: { email, userName }
        });
        if (error) throw error;
        return data;
    },

    async sendOrderConfirmation(email, orderId, orderDetails) {
        const { data, error } = await supabase.functions.invoke('send-order-confirmation', {
            body: { email, orderId, orderDetails }
        });
        if (error) throw error;
        return data;
    },

    async sendPaymentReceipt(email, paymentId, amount) {
        const { data, error } = await supabase.functions.invoke('send-payment-receipt', {
            body: { email, paymentId, amount }
        });
        if (error) throw error;
        return data;
    },

    async sendPasswordResetEmail(email, resetLink) {
        const { data, error } = await supabase.functions.invoke('send-password-reset', {
            body: { email, resetLink }
        });
        if (error) throw error;
        return data;
    },

    async sendNotificationEmail(email, message, subject) {
        const { data, error } = await supabase.functions.invoke('send-notification', {
            body: { email, message, subject }
        });
        if (error) throw error;
        return data;
    },

    async sendReviewNotification(email, veiculoNome) {
        const { data, error } = await supabase.functions.invoke('send-review-notification', {
            body: { email, veiculoNome }
        });
        if (error) throw error;
        return data;
    }
};