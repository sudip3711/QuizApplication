
import { useState,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AddQuestion() {
  const [question, setQuestion] = useState({
    questionTitle: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    rightAnswer: '',
    category: '',
    difficultylevel: 'Easy'
  });

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const categories = ['Java', 'JavaScript', 'Python', 'General', 'Spring', 'React', 'HTML/CSS', 'SQL'];


  // Function to get JWT token from localStorage
  const getAuthToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) {
      navigate("/"); // Redirect to home if not logged in
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index) => {
    setQuestion(prev => ({
      ...prev,
      rightAnswer: prev[`option${index+1}`]
    }));
  };

  const selectCategory = (category) => {
    setQuestion(prev => ({
      ...prev,
      category
    }));
    setShowCategoryDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const token = getAuthToken();
    if (!token) {
      setError('No authentication token found. Please login again.');
      setIsSubmitting(false);
      navigate('/');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/question/add`, question, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      toast.success('Question added successfully!');
      // Reset form
      setQuestion({
        questionTitle: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        rightAnswer: '',
        category: '',
        difficultylevel: 'Easy'
      });
    } catch (error) {
      console.error('Error adding question:', error);
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         'Failed to add question';
      setError(errorMessage);
      
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem('user');
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md my-5">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Question</h1>
      <p className="mb-8 text-gray-600">Contribute to our question bank by adding a new question</p>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Question Title</label>
          <input
            type="text"
            name="questionTitle"
            value={question.questionTitle}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter the question"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Options</label>
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center mb-2">
              <input
                type="radio"
                name="rightAnswer"
                checked={question.rightAnswer === question[`option${num}`]}
                onChange={() => handleOptionChange(num-1)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                required={num === 4}
              />
              <input
                type="text"
                name={`option${num}`}
                value={question[`option${num}`]}
                onChange={handleChange}
                className="ml-3 flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Option ${num}`}
                required
              />
            </div>
          ))}
          <p className="text-sm text-gray-500 mt-2">Select the radio button next to the correct answer</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <div className="relative">
              <input
                type="text"
                name="category"
                value={question.category}
                onChange={handleChange}
                onFocus={() => setShowCategoryDropdown(true)}
                onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Select or type category"
                required
              />
              {showCategoryDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {categories
                    .filter(cat => cat.toLowerCase().includes(question.category.toLowerCase()))
                    .map((category) => (
                      <div
                        key={category}
                        className="cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                        onMouseDown={() => selectCategory(category)}
                      >
                        <span className="font-normal block truncate">
                          {category}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
            <select
              name="difficultylevel"
              value={question.difficultylevel}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Adding Question...' : 'Add Question'}
        </button>
      </form>
    </div>
  );
}