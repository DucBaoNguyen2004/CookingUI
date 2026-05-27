import api from './api';

const mealPlanService = {
    getMealPlans: async (params = {}) => {
        const response = await api.get('/meal-plan', { params });
        return response.data;
    },

    addMealPlan: async (planData) => {
        const response = await api.post('/meal-plan', planData);
        return response.data;
    },

    deleteMealPlan: async (id) => {
        const response = await api.delete(`/meal-plan/${id}`);
        return response.data;
    }
};

export default mealPlanService;
