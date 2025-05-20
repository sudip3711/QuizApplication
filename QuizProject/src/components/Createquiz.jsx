import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    numQuestions: 5,
    quizStartTime: '',
    quizEndTime: '',
    isActive: false,
    defaultPointsPerQuestion: 1
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [creationMode, setCreationMode] = useState('full');
  const navigate = useNavigate();

  const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token || null;
  };

  useEffect(() => {
    const token = getToken();
    if (!token) navigate("/");
    
    const fetchData = async () => {
      try {
        const [categoriesRes, questionsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/question/category`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/question/allQuestion`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        setCategories(categoriesRes.data);
        setTotalQuestions(questionsRes.data.length);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load initial data');
      }
    };

    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) throw new Error('Authentication required');

      const params = new URLSearchParams();
      params.append('title', formData.title);

      if (creationMode === 'full') {
        if (totalQuestions === 0) throw new Error('No questions available');
        params.append('category', formData.category);
        params.append('numQ', Math.min(formData.numQuestions, totalQuestions));
      }

      if (formData.quizStartTime) params.append('quizStartTime', formData.quizStartTime);
      if (formData.quizEndTime) params.append('quizEndTime', formData.quizEndTime);
      params.append('isActive', formData.isActive);
      params.append('defaultPointsPerQuestion', formData.defaultPointsPerQuestion);

      const endpoint = creationMode === 'full' 
        ? `${import.meta.env.VITE_API_URL}/quiz/create` 
        : `${import.meta.env.VITE_API_URL}/quiz/createUseTitle`;

      await axios.post(`${endpoint}?${params.toString()}`, null, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      navigate('/quizzes');
    } catch (error) {
      console.error('Error creating quiz:', error);
      setError(error.response?.data?.message || error.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      {/* Form Section */}
      <div className="md:w-2/3 bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Quiz</h1>
        
        <div className="mb-6 flex border-b">
          <button
            type="button"
            className={`px-4 py-2 font-medium ${
              creationMode === 'full' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setCreationMode('full')}
          >
            Full Quiz
          </button>
          <button
            type="button"
            className={`px-4 py-2 font-medium ${
              creationMode === 'titleOnly' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setCreationMode('titleOnly')}
          >
            Title Only
          </button>
        </div>

        {/* Question Availability Status Panel */}
        {creationMode === 'full' && (
          <div className={`mb-6 p-4 rounded-lg ${
            totalQuestions === 0 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            <div className="flex justify-between items-center">
              <span>
                {totalQuestions === 0
                  ? '⚠️ No questions available'
                  : `✅ ${totalQuestions} questions available`}
              </span>
              <button 
                onClick={() => navigate('/add-question')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {totalQuestions === 0 ? 'Add Questions' : 'Manage Questions'}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Quiz Title *
            </label>
            <input
              type="text"
              name="title"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {creationMode === 'full' && (
            <>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Category
                </label>
                <select
                  name="category"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Number of Questions *
                </label>
                <input
                  type="number"
                  name="numQuestions"
                  min="1"
                  max={totalQuestions}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  value={formData.numQuestions}
                  onChange={handleChange}
                  required
                  disabled={totalQuestions === 0}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {totalQuestions > 0 ? `Max available: ${totalQuestions}` : 'No questions available'}
                </p>
              </div>
            </>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Start Time
            </label>
            <input
              type="datetime-local"
              name="quizStartTime"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={formData.quizStartTime}
              onChange={handleDateTimeChange}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              End Time
            </label>
            <input
              type="datetime-local"
              name="quizEndTime"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={formData.quizEndTime}
              onChange={handleDateTimeChange}
            />
          </div>

          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              className="mr-2 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <label htmlFor="isActive" className="text-gray-700">
              Active Immediately
            </label>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Points Per Question
            </label>
            <input
              type="number"
              name="defaultPointsPerQuestion"
              min="1"
              max="10"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={formData.defaultPointsPerQuestion}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loading || (creationMode === 'full' && totalQuestions === 0)}
          >
            {loading ? 'Creating...' : 'Create Quiz'}
          </button>
        </form>
      </div>

      {/* Instructions Section */}
      <div className="md:w-1/3 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Instructions</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>Title is required for all quizzes</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>Use the datetime picker for start/end times</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>Default points per question is 1</span>
          </li>
          {creationMode === 'full' && (
            <>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>Select a category to filter questions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>Number of questions cannot exceed available questions</span>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CreateQuiz;








