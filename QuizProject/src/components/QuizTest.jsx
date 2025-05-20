import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuizTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token || null;
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        toast.error('Please login to take the quiz');
        navigate('/login');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/quiz/getQuestions/${id}`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const formattedQuestions = response.data.map(question => ({
        id: question.id,
        questionText: question.questionTitle,
        options: [
          question.option1,
          question.option2,
          question.option3,
          question.option4
        ].filter(option => option !== null),
        points: question.points || 1
      }));

      setQuestions(formattedQuestions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError(err.response?.data?.message || 'Failed to load questions. Please try again.');
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [id]);

  const handleAnswerSelect = (questionId, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = getToken();
      if (!token) {
        toast.error('Please login to submit the quiz');
        navigate('/login');
        return;
      }

      // Convert selected answers to backend format
      const formattedResponses = questions.map(question => ({
        id: question.id,
        response: question.options[selectedAnswers[question.id]] || ""
      }));

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/quiz/submit/${id}`,
        formattedResponses,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Quiz submitted successfully!');
      navigate(`/quiz/result/${id}`, {
        state: {
          score: response.data.score,
          totalQuestions: questions.length,
          gainScore: response.data.gainScore
        }
      });
    } catch (err) {
      console.error('Error submitting quiz:', err);
      toast.error(err.response?.data?.error || 'Failed to submit quiz');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchQuestions}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 bg-gray-50 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">No Questions Available</h2>
          <p className="mb-4">This quiz doesn't contain any questions yet.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Quiz Questions</h1>

      <div className="space-y-8">
        {questions.map((question, index) => (
          <div key={question.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-medium">
                <span className="text-blue-600">Q{index + 1}:</span> {question.questionText}
              </h2>
              <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
                {question.points} point{question.points !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="space-y-3">
              {question.options.map((option, i) => (
                <div
                  key={i}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedAnswers[question.id] === i
                      ? 'bg-blue-100 border-blue-500'
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => handleAnswerSelect(question.id, i)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-lg font-medium"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizTest;





