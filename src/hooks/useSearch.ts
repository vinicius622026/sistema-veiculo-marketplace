import { useState, useEffect } from 'react';

const useSearch = (data) => {
    const [query, setQuery] = useState('');
    const [filteredData, setFilteredData] = useState(data);

    useEffect(() => {
        setFilteredData(
            data.filter(item => 
                item.name.toLowerCase().includes(query.toLowerCase())
            )
        );
    }, [query, data]);

    const handleSearchInputChange = (event) => {
        setQuery(event.target.value);
    };

    return {
        query,
        filteredData,
        handleSearchInputChange
    };
};

export default useSearch;