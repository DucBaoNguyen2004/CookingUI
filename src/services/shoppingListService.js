import api from './api';

const shoppingListService = {
    getShoppingList: async (params = {}) => {
        const response = await api.get('/shopping-list', { params });
        return response.data;
    },

    addItem: async (itemData) => {
        const response = await api.post('/shopping-list', itemData);
        return response.data;
    },

    updateItem: async (id, itemData) => {
        const response = await api.put(`/shopping-list/${id}`, itemData);
        return response.data;
    },

    toggleChecked: async (id) => {
        const response = await api.patch(`/shopping-list/${id}/toggle`);
        return response.data;
    },

    deleteItem: async (id) => {
        const response = await api.delete(`/shopping-list/${id}`);
        return response.data;
    },

    clearChecked: async () => {
        const response = await api.post('/shopping-list/clear-checked');
        return response.data;
    },

    clearAll: async () => {
        const response = await api.post('/shopping-list/clear-all');
        return response.data;
    },

    addCheckedToPantry: async () => {
        const response = await api.post('/shopping-list/add-to-pantry');
        return response.data;
    },

    generateFromMealPlan: async (startDate, endDate) => {
        const response = await api.post('/shopping-list/generate', { startDate, endDate });
        return response.data;
    }
};

export default shoppingListService;
