import { useState, useEffect } from 'react';

export function useClientManagement() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchClients = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/clients`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setClients(data.data || []);
            } else {
                throw new Error('Failed to fetch clients');
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
            setError('Failed to load clients');
        } finally {
            setLoading(false);
        }
    };

    const createClient = async (clientData) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/clients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify(clientData)
            });

            if (response.ok) {
                const newClient = await response.json();
                setClients(prev => [...prev, newClient.data]);
                return { success: true, data: newClient.data };
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create client');
            }
        } catch (error) {
            console.error('Error creating client:', error);
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    return {
        clients,
        loading,
        error,
        fetchClients,
        createClient
    };
}