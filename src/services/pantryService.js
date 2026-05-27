import api from './api';

const pantryService = {
    getPantryItems: async (params = {}) => {
        const response = await api.get('/pantry', { params });
        return response.data;
    },

    getPantryStats: async () => {
        const response = await api.get('/pantry/stats');
        return response.data;
    },

    getExpiringSoon: async (days = 7) => {
        const response = await api.get('/pantry/expiring', { params: { days } });
        return response.data;
    },

    addPantryItem: async (itemData) => {
        const response = await api.post('/pantry', itemData);
        return response.data;
    },

    updatePantryItem: async (id, itemData) => {
        const response = await api.put(`/pantry/${id}`, itemData);
        return response.data;
    },

    deletePantryItem: async (id) => {
        const response = await api.delete(`/pantry/${id}`);
        return response.data;
    }
};

export default pantryService;
