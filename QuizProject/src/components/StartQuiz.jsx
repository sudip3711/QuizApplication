import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication without reloading
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) {
      toast.error('Please login to access this quiz');
    }
  }, []);

  // Fetch quiz data
  useEffect(() => {
    if (!id) {
      toast.error('Invalid quiz ID');
      setLoading(false);
      return;
    }

    const fetchQuiz = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/quiz/get/particular/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );
        
        setQuizData(response.data);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again');
        } else {
          toast.error(error.response?.data?.message || 'Failed to load quiz');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleStartQuiz = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) {
      toast.error('Please login to start the quiz');
      return;
    }
    
    if (!quizData?.available) {
      toast.error('Quiz is not available at this time');
      return;
    }

    navigate(`/quiz/${id}/start`);
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Not specified';
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  const getQuizStatus = () => {
    if (!quizData) return 'Loading...';
    
    const now = new Date(quizData.currentTime || new Date());
    const startTime = new Date(quizData.quizSummary?.quizStartTime);
    const endTime = new Date(quizData.quizSummary?.quizEndTime);

    if (now < startTime) {
      return `Quiz will start on ${formatDateTime(quizData.quizSummary.quizStartTime)}`;
    } else if (now > endTime) {
      return `Quiz ended on ${formatDateTime(quizData.quizSummary.quizEndTime)}`;
    } else {
      return `Quiz is active until ${formatDateTime(quizData.quizSummary.quizEndTime)}`;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold mb-2">Quiz not found</h2>
        <p>The requested quiz is unavailable</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 rounded overflow-hidden shadow-lg bg-white p-6">
      <div className="px-6 py-4">
        <h1 className="font-bold text-xl mb-2">{quizData.quizSummary?.title || 'Untitled Quiz'}</h1>
        <div className="mb-4">
          <p className="text-gray-700">{getQuizStatus()}</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Start Time:</span>
            <span>{formatDateTime(quizData.quizSummary?.quizStartTime)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">End Time:</span>
            <span>{formatDateTime(quizData.quizSummary?.quizEndTime)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <span className={`font-semibold ${
              quizData.available ? 'text-green-600' : 'text-red-600'
            }`}>
              {quizData.available ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>
      </div>
      <div className="px-6 pt-2 pb-4 flex justify-between items-center">
        <span className="text-gray-600 text-sm">
          Created: {formatDateTime(quizData.quizSummary?.createdDate)}
        </span>
        <button 
          onClick={handleStartQuiz}
          disabled={!quizData.available}
          className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${
            quizData.available 
              ? 'hover:bg-blue-700' 
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizDetail;

