import { useState, useEffect } from 'react';

const useFavorites = () => {
    const [favorites, setFavorites] = useState([]);
    
    useEffect(() => {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);
    
    const addFavorite = (item) => {
        setFavorites((prevFavorites) => {
            const newFavorites = [...prevFavorites, item];
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };
    
    const removeFavorite = (item) => {
        setFavorites((prevFavorites) => {
            const newFavorites = prevFavorites.filter(favorite => favorite !== item);
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };
    
    return { favorites, addFavorite, removeFavorite };
};

export default useFavorites;