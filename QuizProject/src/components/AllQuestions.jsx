import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

const AllQuestions = () => {
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [showQuizSelection, setShowQuizSelection] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  const [token, setToken] = useState(() => {
    const auth = JSON.parse(localStorage.getItem('user'));
    return auth?.token || null;
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) {
      navigate("/"); // Redirect to home if not logged in
    }
  }, [navigate]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          throw new Error('No authentication token');
        }
        
        // Fetch questions
        const questionsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/question/allQuestion`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
          
        });
        setQuestions(questionsResponse.data);
        // console.log(`hear: ${import.meta.env.VITE_API_URL}`)

        // Fetch quizzes
        const quizzesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/quiz/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setQuizzes(quizzesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('auth');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Extract unique categories & difficulty levels
  const categories = ["All Categories", ...new Set(questions.map((q) => q.category))];
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  // Filter questions based on search & filters
  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.questionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "All Categories" || question.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || question.difficultylevel === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleAddToQuiz = (questionId) => {
    setCurrentQuestionId(questionId);
    setShowQuizSelection(true);
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      
      await axios.delete(`${import.meta.env.VITE_API_URL}/question/delete/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      // Refresh questions after deletion
      const updatedQuestions = questions.filter(q => q.id !== questionId);
      setQuestions(updatedQuestions);
      toast.success("Question delete successfully..!")
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const confirmAddToQuiz = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/quiz/addQuestionOnQuiz/${selectedQuizId}/${currentQuestionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setShowQuizSelection(false);
      setSelectedQuizId("");
      toast.success('Question added to quiz successfully!');
    } catch (error) {
      console.error('Error adding question to quiz:', error);
      toast.error('Failed to add question to quiz');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Question Bank</h1>
        <p className="text-gray-600 mt-2">
          Browse our collection of {filteredQuestions.length} questions across various categories.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Search & Filters</h2>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by title or category..."
            className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
            <select
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
            <select
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              {difficulties.map((difficulty, index) => (
                <option key={index} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading questions...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center py-8 text-gray-600">No questions found.</div>
      ) : (
        <div className="space-y-6">
          {filteredQuestions.map((question) => (
            <div key={question.id} className="bg-white p-6 rounded-lg shadow-md relative">
              {/* Action Buttons - Top Right */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => handleAddToQuiz(question.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                >
                  Add to Quiz
                </button>
                <button
                  onClick={() => handleDeleteQuestion(question.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>

              {/* Question Title */}
              <h3 className="text-lg font-medium text-gray-900 pr-20 mt-6">{question.questionTitle}</h3>

              {/* Options - Display only (no radio buttons) */}
              <div className="mt-4 space-y-2">
                {[question.option1, question.option2, question.option3, question.option4].map((option, index) => (
                  <div key={index} className="flex items-center">
                    <div className="ml-3 block text-gray-700">
                      {String.fromCharCode(65 + index)}. {option}
                    </div>
                  </div>
                ))}
              </div>

              {/* Metadata */}
              <div className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {question.category}
                </span>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                    {question.difficultylevel}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    Correct answer: <span className="text-green-600">{question.rightAnswer}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup for adding to quiz */}
      {showQuizSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Select Quiz to Add Question</h3>
            <select
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              value={selectedQuizId}
              onChange={(e) => setSelectedQuizId(e.target.value)}
            >
              <option value="">Select a quiz</option>
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.title}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowQuizSelection(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddToQuiz}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                disabled={!selectedQuizId}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllQuestions;



