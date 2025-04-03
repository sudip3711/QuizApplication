// import React, { useState, useEffect } from 'react';

// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const QuizTest = () => {
//   const { id } = useParams(); // Gets ID from URL (e.g., /quiz/3)
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

//   // Fetch questions when component mounts
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const user = JSON.parse(localStorage.getItem("user"));
//         if (!user?.token) {
//           toast.error('Please login to take the quiz');
//           navigate('/login');
//           return;
//         }

//         const response = await axios.get(
//           `http://localhost:8080/quiz/getQuestions/${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${user.token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );

//         setQuestions(response.data);
//       } catch (error) {
//         console.error('Error fetching questions:', error);
//         toast.error(error.response?.data?.message || 'Failed to load questions');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, [id, navigate]);

//   // Timer countdown
//   useEffect(() => {
//     if (timeLeft <= 0) {
//       handleSubmit();
//       return;
//     }

//     const timer = setInterval(() => {
//       setTimeLeft(prev => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   const handleAnswerSelect = (questionId, answerIndex) => {
//     setSelectedAnswers(prev => ({
//       ...prev,
//       [questionId]: answerIndex
//     }));
//   };

//   const goToNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     }
//   };

//   const goToPreviousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(prev => prev - 1);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       const response = await axios.post(
//         `http://localhost:8080/quiz/submit/${id}`,
//         {
//           answers: selectedAnswers
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       toast.success('Quiz submitted successfully!');
//       navigate(`/quiz/results/${id}`, { state: { score: response.data.score } });
//     } catch (error) {
//       console.error('Error submitting quiz:', error);
//       toast.error(error.response?.data?.message || 'Failed to submit quiz');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-xl">No questions available for this quiz</p>
//       </div>
//     );
//   }

//   const currentQuestion = questions[currentQuestionIndex];
//   const minutes = Math.floor(timeLeft / 60);
//   const seconds = timeLeft % 60;

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Quiz Test</h1>
//         <div className="text-lg font-semibold">
//           Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
//         </div>
//       </div>

//       <div className="mb-6">
//         <div className="flex justify-between mb-2">
//           <span className="text-gray-600">
//             Question {currentQuestionIndex + 1} of {questions.length}
//           </span>
//           <span className="font-semibold">
//             {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
//           </span>
//         </div>
//         <h2 className="text-xl mb-4">{currentQuestion.text}</h2>
        
//         <div className="space-y-3">
//           {currentQuestion.options.map((option, index) => (
//             <div 
//               key={index}
//               className={`p-3 border rounded-lg cursor-pointer ${
//                 selectedAnswers[currentQuestion.id] === index 
//                   ? 'bg-blue-100 border-blue-500' 
//                   : 'hover:bg-gray-50'
//               }`}
//               onClick={() => handleAnswerSelect(currentQuestion.id, index)}
//             >
//               {option}
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="flex justify-between mt-6">
//         <button
//           onClick={goToPreviousQuestion}
//           disabled={currentQuestionIndex === 0}
//           className={`px-4 py-2 rounded ${
//             currentQuestionIndex === 0 
//               ? 'bg-gray-300 cursor-not-allowed' 
//               : 'bg-gray-200 hover:bg-gray-300'
//           }`}
//         >
//           Previous
//         </button>
        
//         {currentQuestionIndex < questions.length - 1 ? (
//           <button
//             onClick={goToNextQuestion}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Next
//           </button>
//         ) : (
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//           >
//             Submit Quiz
//           </button>
//         )}
//       </div>

//       <div className="mt-6 flex flex-wrap gap-2">
//         {questions.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentQuestionIndex(index)}
//             className={`w-10 h-10 rounded-full ${
//               currentQuestionIndex === index
//                 ? 'bg-blue-500 text-white'
//                 : selectedAnswers[questions[index].id] !== undefined
//                 ? 'bg-green-100 text-green-800'
//                 : 'bg-gray-200'
//             }`}
//           >
//             {index + 1}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default QuizTest;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const QuizTest = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(600);

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const user = JSON.parse(localStorage.getItem("user"));
//         if (!user?.token) {
//           toast.error('Please login to take the quiz');
//           navigate('/login');
//           return;
//         }

//         const response = await axios.get(
//           `http://localhost:8080/quiz/getQuestions/${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${user.token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );

//         // Validate response data structure
//         if (!Array.isArray(response.data)) {
//           throw new Error('Invalid questions format');
//         }

//         const validatedQuestions = response.data.map(q => ({
//           id: q.id || Math.random().toString(36).substr(2, 9),
//           text: q.text || 'Question text not available',
//           options: Array.isArray(q.options) ? q.options : [],
//           points: Number(q.points) || 1
//         }));

//         setQuestions(validatedQuestions);
//       } catch (error) {
//         console.error('Error fetching questions:', error);
//         setError(error.message);
//         toast.error('Failed to load questions');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, [id, navigate]);

//   // ... (keep other functions the same)

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center p-6 bg-red-50 rounded-lg">
//           <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Quiz</h2>
//           <p className="mb-4">{error}</p>
//           <button 
//             onClick={() => window.location.reload()}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center">
//           <h2 className="text-xl font-bold mb-2">No Questions Available</h2>
//           <p>This quiz doesn't have any questions yet.</p>
//         </div>
//       </div>
//     );
//   }

//   const currentQuestion = questions[currentQuestionIndex];
  
//   // Additional safety check
//   if (!currentQuestion || !Array.isArray(currentQuestion.options)) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center text-red-500">
//           <h2 className="text-xl font-bold mb-2">Invalid Question Format</h2>
//           <p>Please contact support.</p>
//         </div>
//       </div>
//     );
//   }

//   // Rest of your render code...
//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       {/* Quiz UI remains the same */}
//       {currentQuestion.options.map((option, index) => (
//         <div 
//           key={index}
//           className={`p-3 border rounded-lg cursor-pointer ${
//             selectedAnswers[currentQuestion.id] === index 
//               ? 'bg-blue-100 border-blue-500' 
//               : 'hover:bg-gray-50'
//           }`}
//           onClick={() => handleAnswerSelect(currentQuestion.id, index)}
//         >
//           {option}
//         </div>
//       ))}
//       {/* ... */}
//     </div>
//   );
// };

// export default QuizTest;







// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const QuizTest = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [questionsLoading, setQuestionsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
//   const [selectedQuiz, setSelectedQuiz] = useState(null);

//   const getToken = () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     return user?.token || null;
//   };

//   const fetchQuestions = async (quizId) => {
//     try {
//       setQuestionsLoading(true);
//       setQuestions([]);
//       const token = getToken();
      
//       if (!token) {
//         toast.error('Please login to take the quiz');
//         navigate('/login');
//         return;
//       }

//       const response = await axios.get(
//         `http://localhost:8080/quiz/getQuestions/${quizId}`,
//         {
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       const formattedQuestions = response.data.map(question => ({
//         id: question.id || Math.random().toString(36).substr(2, 9),
//         questionText: question.questionTitle,
//         options: [
//           question.option1,
//           question.option2,
//           question.option3,
//           question.option4
//         ].filter(option => option !== null),
//         points: question.points || 1
//       }));

//       setQuestions(formattedQuestions);
//       setSelectedQuiz(quizzes.find(q => q.id === quizId) || null);
//     } catch (err) {
//       console.error('Error fetching questions:', err);
//       setError(err.response?.data?.message || 'Failed to load questions. Please try again.');
//       toast.error('Failed to load questions');
//     } finally {
//       setQuestionsLoading(false);
//     }
//   };

//   // Timer effect
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft(prev => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           handleSubmit();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   // Fetch questions on mount
//   useEffect(() => {
//     fetchQuestions(id);
//   }, [id]);

//   const handleAnswerSelect = (questionId, optionIndex) => {
//     setSelectedAnswers(prev => ({
//       ...prev,
//       [questionId]: optionIndex
//     }));
//   };

//   const goToNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     }
//   };

//   const goToPreviousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(prev => prev - 1);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const token = getToken();
//       const response = await axios.post(
//         `http://localhost:8080/quiz/submit/${id}`,
//         {
//           answers: selectedAnswers,
//           timeSpent: 600 - timeLeft // Total time minus remaining time
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       toast.success('Quiz submitted successfully!');
//       navigate(`/quiz/results/${id}`, { 
//         state: { 
//           score: response.data.score,
//           totalQuestions: questions.length 
//         } 
//       });
//     } catch (err) {
//       console.error('Error submitting quiz:', err);
//       toast.error(err.response?.data?.message || 'Failed to submit quiz');
//     }
//   };

//   if (questionsLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
//           <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
//           <p className="mb-4">{error}</p>
//           <button
//             onClick={() => fetchQuestions(id)}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center p-6 bg-gray-50 rounded-lg max-w-md">
//           <h2 className="text-xl font-bold mb-2">No Questions Available</h2>
//           <p className="mb-4">This quiz doesn't contain any questions yet.</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Back to Quizzes
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const currentQuestion = questions[currentQuestionIndex];
//   const minutes = Math.floor(timeLeft / 60);
//   const seconds = timeLeft % 60;

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">
//           {selectedQuiz?.title || 'Quiz Test'}
//         </h1>
//         <div className="text-lg font-semibold bg-gray-100 px-3 py-1 rounded">
//           Time: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
//         </div>
//       </div>

//       <div className="mb-6">
//         <div className="flex justify-between mb-4">
//           <span className="text-gray-600">
//             Question {currentQuestionIndex + 1} of {questions.length}
//           </span>
//           <span className="font-semibold">
//             {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
//           </span>
//         </div>
        
//         <h2 className="text-xl font-medium mb-4">{currentQuestion.questionText}</h2>
        
//         <div className="space-y-3">
//           {currentQuestion.options.map((option, index) => (
//             <div
//               key={index}
//               className={`p-3 border rounded-lg cursor-pointer transition-colors ${
//                 selectedAnswers[currentQuestion.id] === index
//                   ? 'bg-blue-100 border-blue-500'
//                   : 'hover:bg-gray-50 border-gray-200'
//               }`}
//               onClick={() => handleAnswerSelect(currentQuestion.id, index)}
//             >
//               {option}
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="flex justify-between mt-8">
//         <button
//           onClick={goToPreviousQuestion}
//           disabled={currentQuestionIndex === 0}
//           className={`px-4 py-2 rounded ${
//             currentQuestionIndex === 0
//               ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//               : 'bg-gray-200 hover:bg-gray-300'
//           }`}
//         >
//           Previous
//         </button>

//         {currentQuestionIndex < questions.length - 1 ? (
//           <button
//             onClick={goToNextQuestion}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Next Question
//           </button>
//         ) : (
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//           >
//             Submit Quiz
//           </button>
//         )}
//       </div>

//       <div className="mt-6 flex flex-wrap gap-2 justify-center">
//         {questions.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentQuestionIndex(index)}
//             className={`w-10 h-10 rounded-full flex items-center justify-center ${
//               currentQuestionIndex === index
//                 ? 'bg-blue-500 text-white'
//                 : selectedAnswers[questions[index].id] !== undefined
//                 ? 'bg-green-100 text-green-800 border border-green-300'
//                 : 'bg-gray-100 border border-gray-300'
//             }`}
//           >
//             {index + 1}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default QuizTest;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const QuizTest = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [questionsLoading, setQuestionsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
//   const [selectedQuiz, setSelectedQuiz] = useState(null);
//   const [showQuestionsModal, setShowQuestionsModal] = useState(false);
//   const [quizzes, setQuizzes] = useState([]); // Added quizzes state

//   const getToken = () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     return user?.token || null;
//   };

//   const fetchQuestions = async (quizId) => {
//     try {
//       setQuestionsLoading(true);
//       setQuestions([]);
//       const token = getToken();
      
//       if (!token) {
//         toast.error('Please login to take the quiz');
//         navigate('/login');
//         return;
//       }

//       const response = await axios.get(
//         `http://localhost:8080/quiz/getQuestions/${quizId}`,
//         {
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       const formattedQuestions = response.data.map(question => ({
//         id: question.id || Math.random().toString(36).substr(2, 9),
//         questionText: question.questionTitle,
//         options: [
//           question.option1,
//           question.option2,
//           question.option3,
//           question.option4
//         ].filter(option => option !== null),
//         points: question.points || 1
//       }));

//       setQuestions(formattedQuestions);
//       setSelectedQuiz(quizzes.find(q => q.id === quizId) || null);
//       setShowQuestionsModal(true); // Show modal after loading questions
//     } catch (err) {
//       console.error('Error fetching questions:', err);
//       setError(err.response?.data?.message || 'Failed to load questions. Please try again.');
//       toast.error('Failed to load questions');
//     } finally {
//       setQuestionsLoading(false);
//     }
//   };

//   // Timer effect
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft(prev => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           handleSubmit();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   // Fetch questions on mount
//   useEffect(() => {
//     fetchQuestions(id);
//   }, [id]);

//   const handleAnswerSelect = (questionId, optionIndex) => {
//     setSelectedAnswers(prev => ({
//       ...prev,
//       [questionId]: optionIndex
//     }));
//   };

//   const goToNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     }
//   };

//   const goToPreviousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(prev => prev - 1);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const token = getToken();
//       const response = await axios.post(
//         `http://localhost:8080/quiz/submit/${id}`,
//         {
//           answers: selectedAnswers,
//           timeSpent: 600 - timeLeft // Total time minus remaining time
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       toast.success('Quiz submitted successfully!');
//       navigate(`/quiz/results/${id}`, { 
//         state: { 
//           score: response.data.score,
//           totalQuestions: questions.length 
//         } 
//       });
//     } catch (err) {
//       console.error('Error submitting quiz:', err);
//       toast.error(err.response?.data?.message || 'Failed to submit quiz');
//     }
//   };

//   if (questionsLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
//           <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
//           <p className="mb-4">{error}</p>
//           <button
//             onClick={() => fetchQuestions(id)}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center p-6 bg-gray-50 rounded-lg max-w-md">
//           <h2 className="text-xl font-bold mb-2">No Questions Available</h2>
//           <p className="mb-4">This quiz doesn't contain any questions yet.</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Back to Quizzes
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const currentQuestion = questions[currentQuestionIndex];
//   const minutes = Math.floor(timeLeft / 60);
//   const seconds = timeLeft % 60;

//   return (
//     <>
//       <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">
//             {selectedQuiz?.title || 'Quiz Test'}
//           </h1>
//           <div className="text-lg font-semibold bg-gray-100 px-3 py-1 rounded">
//             Time: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
//           </div>
//         </div>

//         <div className="mb-6">
//           <div className="flex justify-between mb-4">
//             <span className="text-gray-600">
//               Question {currentQuestionIndex + 1} of {questions.length}
//             </span>
//             <span className="font-semibold">
//               {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
//             </span>
//           </div>
          
//           <h2 className="text-xl font-medium mb-4">{currentQuestion.questionText}</h2>
          
//           <div className="space-y-3">
//             {currentQuestion.options.map((option, index) => (
//               <div
//                 key={index}
//                 className={`p-3 border rounded-lg cursor-pointer transition-colors ${
//                   selectedAnswers[currentQuestion.id] === index
//                     ? 'bg-blue-100 border-blue-500'
//                     : 'hover:bg-gray-50 border-gray-200'
//                 }`}
//                 onClick={() => handleAnswerSelect(currentQuestion.id, index)}
//               >
//                 {option}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex justify-between mt-8">
//           <button
//             onClick={goToPreviousQuestion}
//             disabled={currentQuestionIndex === 0}
//             className={`px-4 py-2 rounded ${
//               currentQuestionIndex === 0
//                 ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                 : 'bg-gray-200 hover:bg-gray-300'
//             }`}
//           >
//             Previous
//           </button>

//           {currentQuestionIndex < questions.length - 1 ? (
//             <button
//               onClick={goToNextQuestion}
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Next Question
//             </button>
//           ) : (
//             <button
//               onClick={handleSubmit}
//               className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//             >
//               Submit Quiz
//             </button>
//           )}
//         </div>

//         <div className="mt-6 flex flex-wrap gap-2 justify-center">
//           {questions.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentQuestionIndex(index)}
//               className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                 currentQuestionIndex === index
//                   ? 'bg-blue-500 text-white'
//                   : selectedAnswers[questions[index].id] !== undefined
//                   ? 'bg-green-100 text-green-800 border border-green-300'
//                   : 'bg-gray-100 border border-gray-300'
//               }`}
//             >
//               {index + 1}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Questions Modal */}
//       {showQuestionsModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-2xl font-bold">
//                   <span className="text-blue-600">({questions.length})</span> Questions for: {selectedQuiz?.title || 'Unknown Quiz'}
//                 </h2>
//                 <button 
//                   onClick={() => setShowQuestionsModal(false)}
//                   className="text-gray-500 hover:text-gray-700 text-2xl"
//                 >
//                   &times;
//                 </button>
//               </div>
              
//               {questionsLoading ? (
//                 <div className="text-center py-8">
//                   <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//                   <p className="mt-2">Loading questions...</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {questions.map((question, index) => (
//                     <div key={index} className="border-b pb-4 last:border-b-0">
//                       <h3 className="font-medium text-lg mb-3">
//                         <span className="text-blue-600">{index + 1}.</span> {question.questionText}
//                       </h3>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                         {question.options.map((option, i) => (
//                           <div key={i} className="p-3 rounded bg-gray-50 hover:bg-gray-100 transition">
//                             {option}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default QuizTest;

// 1111

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const QuizTest = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

//   const getToken = () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     return user?.token || null;
//   };

//   const fetchQuestions = async () => {
//     try {
//       setLoading(true);
//       const token = getToken();
      
//       if (!token) {
//         toast.error('Please login to take the quiz');
//         navigate('/login');
//         return;
//       }

//       const response = await axios.get(
//         `http://localhost:8080/quiz/getQuestions/${id}`,
//         {
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       const formattedQuestions = response.data.map(question => ({
//         id: question.id || Math.random().toString(36).substr(2, 9),
//         questionText: question.questionTitle,
//         options: [
//           question.option1,
//           question.option2,
//           question.option3,
//           question.option4
//         ].filter(option => option !== null),
//         points: question.points || 1
//       }));

//       setQuestions(formattedQuestions);
//     } catch (err) {
//       console.error('Error fetching questions:', err);
//       setError(err.response?.data?.message || 'Failed to load questions. Please try again.');
//       toast.error('Failed to load questions');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Timer effect
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft(prev => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           handleSubmit();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   // Fetch questions on mount
//   useEffect(() => {
//     fetchQuestions();
//   }, [id]);

//   const handleAnswerSelect = (questionId, optionIndex) => {
//     setSelectedAnswers(prev => ({
//       ...prev,
//       [questionId]: optionIndex
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       const token = getToken();
//       const response = await axios.post(
//         `http://localhost:8080/quiz/submit/${id}`,
//         {
//           answers: selectedAnswers,
//           timeSpent: 600 - timeLeft
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       toast.success('Quiz submitted successfully!');
//       navigate(`/quiz/results/${id}`, { 
//         state: { 
//           score: response.data.score,
//           totalQuestions: questions.length 
//         } 
//       });
//     } catch (err) {
//       console.error('Error submitting quiz:', err);
//       toast.error(err.response?.data?.message || 'Failed to submit quiz');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
//           <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
//           <p className="mb-4">{error}</p>
//           <button
//             onClick={fetchQuestions}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center p-6 bg-gray-50 rounded-lg max-w-md">
//           <h2 className="text-xl font-bold mb-2">No Questions Available</h2>
//           <p className="mb-4">This quiz doesn't contain any questions yet.</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Back to Quizzes
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const minutes = Math.floor(timeLeft / 60);
//   const seconds = timeLeft % 60;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Quiz Questions</h1>
//         <div className="text-lg font-semibold bg-gray-100 px-3 py-1 rounded">
//           Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
//         </div>
//       </div>

//       <div className="space-y-8">
//         {questions.map((question, index) => (
//           <div key={question.id} className="bg-white p-6 rounded-lg shadow">
//             <div className="flex justify-between items-start mb-4">
//               <h2 className="text-xl font-medium">
//                 <span className="text-blue-600">Q{index + 1}:</span> {question.questionText}
//               </h2>
//               <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
//                 {question.points} point{question.points !== 1 ? 's' : ''}
//               </span>
//             </div>
            
//             <div className="space-y-3">
//               {question.options.map((option, i) => (
//                 <div
//                   key={i}
//                   className={`p-3 border rounded-lg cursor-pointer transition-colors ${
//                     selectedAnswers[question.id] === i
//                       ? 'bg-blue-100 border-blue-500'
//                       : 'hover:bg-gray-50 border-gray-200'
//                   }`}
//                   onClick={() => handleAnswerSelect(question.id, i)}
//                 >
//                   {option}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-8 text-center">
//         <button
//           onClick={handleSubmit}
//           className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-lg font-medium"
//         >
//           Submit Quiz
//         </button>
//       </div>
//     </div>
//   );
// };

// export default QuizTest;



// 2222




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const QuizTest = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

//   const getToken = () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     return user?.token || null;
//   };

//   const fetchQuestions = async () => {
//     try {
//       setLoading(true);
//       const token = getToken();
      
//       if (!token) {
//         toast.error('Please login to take the quiz');
//         navigate('/login');
//         return;
//       }

//       const response = await axios.get(
//         `http://localhost:8080/quiz/getQuestions/${id}`,
//         {
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       const formattedQuestions = response.data.map(question => ({
//         id: question.id,
//         questionText: question.questionTitle,
//         options: [
//           question.option1,
//           question.option2,
//           question.option3,
//           question.option4
//         ].filter(option => option !== null),
//         points: question.points || 1
//       }));

//       setQuestions(formattedQuestions);
//     } catch (err) {
//       console.error('Error fetching questions:', err);
//       setError(err.response?.data?.message || 'Failed to load questions. Please try again.');
//       toast.error('Failed to load questions');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Timer effect
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft(prev => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           handleSubmit();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   // Fetch questions on mount
//   useEffect(() => {
//     fetchQuestions();
//   }, [id]);

//   const handleAnswerSelect = (questionId, optionIndex) => {
//     setSelectedAnswers(prev => ({
//       ...prev,
//       [questionId]: optionIndex
//     }));
//   };


// const handleSubmit = async () => {
//     try {
//       const token = getToken();
      
//       // Convert selectedAnswers to the exact format backend expects
//       const formattedResponses = questions.map(question => ({
//         // questionId is implied by array order in backend, but we'll include it explicitly
//         questionId: question.id,
//         response: question.options[selectedAnswers[question.id]] || "" // Must match question.getRightAnswer() format
//       }));

//       console.log(formattedResponses)
  
//       // Send just the array of responses (no wrapping object)
//       const response = await axios.post(
//         `http://localhost:8080/quiz/submit/${id}`,
//         formattedResponses, // Direct array of response objects
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
  
//       toast.success('Quiz submitted successfully!');
//       navigate(`/quiz/results/${id}`, { 
//         state: { 
//           score: response.data.score,
//           totalQuestions: questions.length,
//           gainScore: response.data.gainScore
//         } 
//       });
//     } catch (err) {
//       console.error('Error submitting quiz:', err);
//       toast.error(err.response?.data?.message || 'Failed to submit quiz');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
//           <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
//           <p className="mb-4">{error}</p>
//           <button
//             onClick={fetchQuestions}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center p-6 bg-gray-50 rounded-lg max-w-md">
//           <h2 className="text-xl font-bold mb-2">No Questions Available</h2>
//           <p className="mb-4">This quiz doesn't contain any questions yet.</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Back to Quizzes
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const minutes = Math.floor(timeLeft / 60);
//   const seconds = timeLeft % 60;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Quiz Questions</h1>
//         <div className="text-lg font-semibold bg-gray-100 px-3 py-1 rounded">
//           Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
//         </div>
//       </div>

//       <div className="space-y-8">
//         {questions.map((question, index) => (
//           <div key={question.id} className="bg-white p-6 rounded-lg shadow">
//             <div className="flex justify-between items-start mb-4">
//               <h2 className="text-xl font-medium">
//                 <span className="text-blue-600">Q{index + 1}:</span> {question.questionText}
//               </h2>
//               <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
//                 {question.points} point{question.points !== 1 ? 's' : ''}
//               </span>
//             </div>
            
//             <div className="space-y-3">
//               {question.options.map((option, i) => (
//                 <div
//                   key={i}
//                   className={`p-3 border rounded-lg cursor-pointer transition-colors ${
//                     selectedAnswers[question.id] === i
//                       ? 'bg-blue-100 border-blue-500'
//                       : 'hover:bg-gray-50 border-gray-200'
//                   }`}
//                   onClick={() => handleAnswerSelect(question.id, i)}
//                 >
//                   {option}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-8 text-center">
//         <button
//           onClick={handleSubmit}
//           className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-lg font-medium"
//         >
//           Submit Quiz
//         </button>
//       </div>
//     </div>
//   );
// };

// export default QuizTest;




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
        `http://localhost:8080/quiz/getQuestions/${id}`,
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
        `http://localhost:8080/quiz/submit/${id}`,
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





