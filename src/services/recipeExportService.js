import api from './api';

const recipeExportService = {
    exportRecipes: async (ids = []) => {
        const params = ids.length > 0 ? { ids: ids.join(',') } : {};
        const response = await api.get('/recipes/export', {
            params,
            responseType: 'blob'
        });

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `recipes_export_${new Date().toISOString().split('T')[0]}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },

    importRecipes: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/recipes/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export default recipeExportService;
