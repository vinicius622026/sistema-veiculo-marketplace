import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      // Simulate an API call to fetch user data
      const fetchedUser = await new Promise((resolve) => {
        setTimeout(() => resolve({ id: 1, name: 'John Doe' }), 1000);
      });
      setUser(fetchedUser);
      setLoading(false);
    };
    fetchUser();
  }, []);

  return { user, loading };
};

export default useAuth;