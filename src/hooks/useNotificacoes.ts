// useNotificacoes.ts

import { useState, useEffect } from 'react';

const useNotificacoes = () => {
    const [notificacoes, setNotificacoes] = useState<Array<string>>([]);

    useEffect(() => {
        // lógica para buscar notificações
        // Exemplo: setNotificacoes(['Notificação 1', 'Notificação 2']);
    }, []);

    return notificacoes;
};

export default useNotificacoes;