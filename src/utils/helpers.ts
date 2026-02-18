// Utility functions for formatting and other utilities

// Format CPF
export const formatCPF = (cpf: string): string => {
    return cpf.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

// Format CNPJ
export const formatCNPJ = (cnpj: string): string => {
    return cnpj.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{5})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

// Format phone number
export const formatPhone = (phone: string): string => {
    return phone.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d)/, '($1) $2-$3');
};

// Format CEP
export const formatCEP = (cep: string): string => {
    return cep.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');
};

// Format vehicle plate
export const formatPlate = (plate: string): string => {
    return plate.toUpperCase(); // Simple conversion to uppercase
};

// Format currency
export const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Format date
export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

// Debounce function
export const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout | null;
    return (...args: any[]) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};

// Throttle function
export const throttle = (func: Function, limit: number) => {
    let lastFunc: ReturnType<typeof setTimeout>;
    let lastRan: number;
    return function(...args: any[]) {
        if (!lastRan) {
            func.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if (Date.now() - lastRan >= limit) {
                    func.apply(this, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
};
