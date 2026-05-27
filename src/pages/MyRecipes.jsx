import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, ChefHat, Trash2, Download, Upload } from 'lucide-react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import recipeService from '../services/recipeService';
import recipeExportService from '../services/recipeExportService';

const MyRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [loading, setLoading] = useState(true);
    const [isImporting, setIsImporting] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchRecipes = async () => {
        try {
            setLoading(true);
            const result = await recipeService.getRecipes();
            if (result.success) {
                setRecipes(result.data.recipes);
            }
        } catch (error) {
            console.error('Failed to fetch recipes:', error);
            toast.error('Failed to load recipes');
        } finally {
            setLoading(false);
        }
    };

    const cuisines = ['All', 'Italian', 'Mexican', 'Indian', 'Chinese', 'Japanese', 'Thai', 'French', 'Mediterranean', 'American'];
    const difficulties = ['All', 'easy', 'medium', 'hard'];

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                const result = await recipeService.getRecipes();
                if (result.success) {
                    setRecipes(result.data.recipes);
                }
            } catch (error) {
                console.error('Failed to fetch recipes:', error);
                toast.error('Failed to load recipes');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    useEffect(() => {
        filterRecipes();
    }, [recipes, searchQuery, selectedCuisine, selectedDifficulty]);

    const filterRecipes = () => {
        let filtered = recipes;

        if (searchQuery) {
            filtered = filtered.filter(recipe =>
                recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCuisine !== 'All') {
            filtered = filtered.filter(recipe => recipe.cuisine_type === selectedCuisine);
        }

        if (selectedDifficulty !== 'All') {
            filtered = filtered.filter(recipe => recipe.difficulty === selectedDifficulty);
        }

        setFilteredRecipes(filtered);
    };

    const handleToggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === filteredRecipes.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredRecipes.map(r => r.id));
        }
    };

    const handleExport = async () => {
        try {
            await recipeExportService.exportRecipes(selectedIds);
            toast.success('Recipes exported successfully');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export recipes');
        }
    };

    const handleImport = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsImporting(true);
            const result = await recipeExportService.importRecipes(file);
            if (result.success) {
                toast.success(result.message);
                fetchRecipes(); // Refresh the list
            } else {
                toast.error(result.message || 'Failed to import recipes');
            }
        } catch (error) {
            console.error('Import error:', error);
            toast.error(error.response?.data?.message || 'An error occurred during import');
        } finally {
            setIsImporting(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this recipe?')) return;

        try {
            const result = await recipeService.deleteRecipe(id);
            if (result.success) {
                setRecipes(recipes.filter(recipe => recipe.id !== id));
                toast.success('Recipe deleted');
            } else {
                toast.error(result.message || 'Failed to delete recipe');
            }
        } catch (error) {
            console.error('Delete recipe error:', error);
            toast.error('An error occurred while deleting the recipe');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
                        <p className="text-gray-600 mt-1">Your collection of saved recipes</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Hidden file input for import */}
                        <input
                            type="file"
                            id="recipe-import"
                            className="hidden"
                            accept=".xlsx, .xls, .csv"
                            onChange={handleImport}
                            disabled={isImporting}
                        />
                        <button
                            onClick={() => document.getElementById('recipe-import').click()}
                            disabled={isImporting}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            <Upload className="w-4 h-4" />
                            {isImporting ? 'Importing...' : 'Import'}
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            {selectedIds.length > 0 ? `Export (${selectedIds.length})` : 'Export All'}
                        </button>
                    </div>
                </div>

                {/* Bulk Actions & Count */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filteredRecipes.length > 0 && selectedIds.length === filteredRecipes.length}
                                onChange={handleSelectAll}
                                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Select All</span>
                        </label>
                        {selectedIds.length > 0 && (
                            <span className="text-sm text-emerald-600 font-medium">
                                {selectedIds.length} recipe{selectedIds.length > 1 ? 's' : ''} selected
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600">
                        Showing {filteredRecipes.length} of {recipes.length} recipes
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search recipes..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            />
                        </div>

                        {/* Cuisine Filter */}
                        <select
                            value={selectedCuisine}
                            onChange={(e) => setSelectedCuisine(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        >
                            {cuisines.map(cuisine => (
                                <option key={cuisine} value={cuisine}>
                                    {cuisine === 'All' ? 'All Cuisines' : cuisine}
                                </option>
                            ))}
                        </select>

                        {/* Difficulty Filter */}
                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        >
                            {difficulties.map(diff => (
                                <option key={diff} value={diff}>
                                    {diff === 'All' ? 'All Difficulties' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Recipe Count */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        Showing {filteredRecipes.length} of {recipes.length} recipes
                    </p>
                </div>

                {/* Recipes Grid */}
                {filteredRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRecipes.map(recipe => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                isSelected={selectedIds.includes(recipe.id)}
                                onToggleSelect={() => handleToggleSelect(recipe.id)}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">
                            {recipes.length === 0 ? 'No recipes yet' : 'No recipes match your filters'}
                        </p>
                        {recipes.length === 0 && (
                            <Link
                                to="/generate"
                                className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                            >
                                Generate Your First Recipe
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const RecipeCard = ({ recipe, isSelected, onToggleSelect, onDelete }) => {
    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

    return (
        <div className={`bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all group relative ${isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-200'}`}>
            {/* Selection Checkbox */}
            <div className="absolute top-3 left-3 z-10">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onToggleSelect}
                    className="w-5 h-5 text-emerald-600 border-gray-300 rounded-md focus:ring-emerald-500 bg-white/90 backdrop-blur-xs cursor-pointer shadow-sm"
                />
            </div>
            {/* Recipe Image Placeholder */}
            <div className="h-48 bg-linear-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                <ChefHat className="w-16 h-16 text-emerald-600" />
            </div>

            {/* Recipe Content */}
            <div className="p-5">
                <Link to={`/recipes/${recipe.id}`} className="block mb-3">
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {recipe.name}
                    </h3>
                    {recipe.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{recipe.description}</p>
                    )}
                </Link>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {recipe.cuisine_type && (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                            {recipe.cuisine_type}
                        </span>
                    )}
                    {recipe.difficulty && (
                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${recipe.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                            recipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                            {recipe.difficulty}
                        </span>
                    )}
                    {recipe.dietary_tags && recipe.dietary_tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{totalTime} mins</span>
                    </div>
                    {recipe.calories && (
                        <span>{recipe.calories} cal</span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <Link
                        to={`/recipes/${recipe.id}`}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-center py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                        View Recipe
                    </Link>
                    <button
                        onClick={() => onDelete(recipe.id)}
                        className="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyRecipes;
