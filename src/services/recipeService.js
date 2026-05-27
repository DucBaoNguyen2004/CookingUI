import api from './api';

const recipeService = {
    getRecipes: async (params = {}) => {
        const response = await api.get('/recipes', { params });
        return response.data;
    },

    getRecentRecipes: async (limit = 5) => {
        const response = await api.get('/recipes/recent', { params: { limit } });
        return response.data;
    },

    getRecipeById: async (id) => {
        const response = await api.get(`/recipes/${id}`);
        return response.data;
    },

    saveRecipe: async (recipeData) => {
        const response = await api.post('/recipes', recipeData);
        return response.data;
    },

    updateRecipe: async (id, recipeData) => {
        const response = await api.put(`/recipes/${id}`, recipeData);
        return response.data;
    },

    deleteRecipe: async (id) => {
        const response = await api.delete(`/recipes/${id}`);
        return response.data;
    },

    generateRecipe: async (data) => {
        const response = await api.post('/recipes/generate', data);
        return response.data;
    },

    getRecipeStats: async () => {
        const response = await api.get('/recipes/stats');
        return response.data;
    }
};

export default recipeService;
