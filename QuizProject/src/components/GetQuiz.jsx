
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FiEye, FiPlus, FiRefreshCw } from 'react-icons/fi';
// import { useNavigate } from 'react-router-dom';

// function GetQuiz() {
//   const [quizzes, setQuizzes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedQuiz, setSelectedQuiz] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [showQuestionsModal, setShowQuestionsModal] = useState(false);
//   const [questionsLoading, setQuestionsLoading] = useState(false);
//   const navigate = useNavigate();



//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user?.token) {
//       navigate("/"); // Redirect to home if not logged in
//     }
//   }, [navigate]);



//   // Move ShareButton component definition up here
//   const ShareButton = ({ quizId }) => {
//     const [copied, setCopied] = useState(false);

//     const copyLink = async () => {
//       try {
//         await navigator.clipboard.writeText(`${window.location.origin}/quiz/${quizId}`);
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//       } catch (err) {
//         const textArea = document.createElement('textarea');
//         textArea.value = `${window.location.origin}/quiz/${quizId}`;
//         document.body.appendChild(textArea);
//         textArea.select();
//         document.execCommand('copy');
//         document.body.removeChild(textArea);
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//       }
//     };

//     return (
//       <button
//         onClick={copyLink}
//         className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
//       >
//         {copied ? 'Copied!' : 'Share'}
//       </button>
//     );
//   };

//   // Rest of your component code...
//   const getToken = () => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     return user?.token || null;
//   };

//   useEffect(() => {
//     const fetchQuizzes = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         const token = getToken();
//         const response = await axios.get(`${import.meta.env.VITE_API_URL}/quiz/get`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         });
//         setQuizzes(response.data || []);
//       } catch (err) {
//         setError(err.response?.data?.message || err.message || 'Failed to load quizzes');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchQuizzes();
//   }, []);

//   const fetchQuestions = async (quizId) => {
//     try {
//       setQuestionsLoading(true);
//       setQuestions([]);
//       const token = getToken();
//       const response = await axios.get(`${import.meta.env.VITE_API_URL}/quiz/getQuestions/${quizId}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       const formattedQuestions = response.data.map(question => ({
//         questionText: question.questionTitle,
//         options: [
//           question.option1,
//           question.option2,
//           question.option3,
//           question.option4
//         ].filter(option => option !== null)
//       }));

//       setQuestions(formattedQuestions);
//       setSelectedQuiz(quizzes.find(q => q.id === quizId) || null);
//       setShowQuestionsModal(true);
//     } catch (err) {
//       setError('Failed to load questions. Please try again.');
//     } finally {
//       setQuestionsLoading(false);
//     }
//   };

//   const startQuiz = (quizId) => {
//     window.open(`/quiz/${quizId}`, '_blank', 'noopener,noreferrer');
//   };

//   // ... rest of your component code remains the same ...

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold">Your Quizzes</h1>
          
//           <button 
//             onClick={() => navigate('/createquiz')}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
//           >
//             <FiPlus /> New Quiz
//           </button>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {quizzes.map((quiz) => (
//             <div key={quiz.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
//               <button 
//                 onClick={() => fetchQuestions(quiz.id)}
//                 className="absolute top-2 left-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
//                 title="View Questions"
//               >
//                 <FiEye className="text-gray-700" />
//               </button>
              
//               <div className="p-6 pt-12">
//                 <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
//                 <p className="text-gray-600 mb-4 line-clamp-2">
//                   {quiz.description || 'No description available'}
//                 </p>
//                 <div className="flex justify-between items-center mt-4">
//                   <span className="text-sm text-gray-500">
//                     {new Date(quiz.createdDate).toLocaleDateString()}
//                   </span>
//                   <div className="flex space-x-2">
//                     <button 
//                       onClick={() => startQuiz(quiz.id)}
//                       className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//                     >
//                       Start
//                     </button>
//                     <ShareButton quizId={quiz.id} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

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
//     </div>
//   );
// }

// export default GetQuiz;




// // 2222

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FiEye, FiPlus } from 'react-icons/fi';
// import { useNavigate } from 'react-router-dom';

// function GetQuiz() {
//   const [quizzes, setQuizzes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedQuiz, setSelectedQuiz] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [showQuestionsModal, setShowQuestionsModal] = useState(false);
//   const [questionsLoading, setQuestionsLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user?.token) {
//       navigate("/"); // Redirect to home if not logged in
//     }
//   }, [navigate]);

//   // ShareButton component
//   const ShareButton = ({ quizId }) => {
//     const [copied, setCopied] = useState(false);

//     const copyLink = async () => {
//       try {
//         await navigator.clipboard.writeText(`${window.location.origin}/quiz/${quizId}`);
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//       } catch {
//         const textArea = document.createElement('textarea');
//         textArea.value = `${window.location.origin}/quiz/${quizId}`;
//         document.body.appendChild(textArea);
//         textArea.select();
//         document.execCommand('copy');
//         document.body.removeChild(textArea);
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//       }
//     };

//     return (
//       <button
//         onClick={copyLink}
//         className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
//       >
//         {copied ? 'Copied!' : 'Share'}
//       </button>
//     );
//   };

//   const getToken = () => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     return user?.token || null;
//   };

//   useEffect(() => {
//     const fetchQuizzes = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const token = getToken();
//         const response = await axios.get(`${import.meta.env.VITE_API_URL}/quiz/get`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         });
//         setQuizzes(response.data || []);
//       } catch (err) {
//         setError(err.response?.data?.message || err.message || 'Failed to load quizzes');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchQuizzes();
//   }, []);

//   const fetchQuestions = async (quizId) => {
//     try {
//       setQuestionsLoading(true);
//       setQuestions([]);
//       const token = getToken();
//       const response = await axios.get(`${import.meta.env.VITE_API_URL}/quiz/getQuestions/${quizId}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       const formattedQuestions = response.data.map(question => ({
//         questionText: question.questionTitle,
//         options: [
//           question.option1,
//           question.option2,
//           question.option3,
//           question.option4
//         ].filter(option => option !== null)
//       }));

//       setQuestions(formattedQuestions);
//       setSelectedQuiz(quizzes.find(q => q.id === quizId) || null);
//       setShowQuestionsModal(true);
//     } catch (err) {
//       setError('Failed to load questions. Please try again.');
//     } finally {
//       setQuestionsLoading(false);
//     }
//   };

//   const startQuiz = (quizId) => {
//     window.open(`/quiz/${quizId}`, '_blank', 'noopener,noreferrer');
//   };

//   // Function to check if quiz is currently available
//   const isQuizAvailable = (startTime, endTime) => {
//     const nowUTC = new Date(new Date().toISOString()); // current UTC time
//     const start = new Date(startTime);
//     const end = new Date(endTime);
//     return nowUTC >= start && nowUTC <= end;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold">Your Quizzes</h1>
//           <button
//             onClick={() => navigate('/createquiz')}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
//           >
//             <FiPlus /> New Quiz
//           </button>
//         </div>

//         {error && (
//           <div className="mb-4 text-red-600 font-semibold">{error}</div>
//         )}

//         {loading ? (
//           <div className="text-center text-gray-700">Loading quizzes...</div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {quizzes.map((quiz) => {
//               const available = isQuizAvailable(quiz.startTime, quiz.endTime);
//               return (
//                 <div
//                   key={quiz.id}
//                   className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative"
//                 >
//                   <button
//                     onClick={() => fetchQuestions(quiz.id)}
//                     className="absolute top-2 left-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
//                     title="View Questions"
//                   >
//                     <FiEye className="text-gray-700" />
//                   </button>

//                   <div className="p-6 pt-12">
//                     <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
//                     <p className="text-gray-600 mb-4 line-clamp-2">
//                       {quiz.description || 'No description available'}
//                     </p>

//                     <div className="text-sm text-gray-600 mb-2">
//                       <p><strong>Start:</strong> {new Date(quiz.startTime).toLocaleString()}</p>
//                       <p><strong>End:</strong> {new Date(quiz.endTime).toLocaleString()}</p>
//                     </div>

//                     <div className="flex justify-between items-center mt-4">
//                       <span className={`text-sm font-semibold ${available ? 'text-green-600' : 'text-red-600'}`}>
//                         {available ? 'Available' : 'Unavailable'}
//                       </span>

//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => startQuiz(quiz.id)}
//                           disabled={!available}
//                           className={`px-4 py-2 rounded transition ${
//                             available
//                               ? 'bg-blue-600 text-white hover:bg-blue-700'
//                               : 'bg-gray-300 text-gray-600 cursor-not-allowed'
//                           }`}
//                         >
//                           Start
//                         </button>
//                         <ShareButton quizId={quiz.id} />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

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
//     </div>
//   );
// }

// export default GetQuiz;


// 3333



import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEye, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon'; // Luxon for timezone handling

function GetQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) {
      navigate("/");
    }
  }, [navigate]);

  const ShareButton = ({ quizId }) => {
    const [copied, setCopied] = useState(false);
    const copyLink = async () => {
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/quiz/${quizId}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        const textArea = document.createElement('textarea');
        textArea.value = `${window.location.origin}/quiz/${quizId}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

    return (
      <button
        onClick={copyLink}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        {copied ? 'Copied!' : 'Share'}
      </button>
    );
  };

  const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token || null;
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getToken();
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/quiz/get`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setQuizzes(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load quizzes');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const fetchQuestions = async (quizId) => {
    try {
      setQuestionsLoading(true);
      setQuestions([]);
      const token = getToken();
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/quiz/getQuestions/${quizId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const formattedQuestions = response.data.map(question => ({
        questionText: question.questionTitle,
        options: [
          question.option1,
          question.option2,
          question.option3,
          question.option4
        ].filter(option => option !== null)
      }));

      setQuestions(formattedQuestions);
      setSelectedQuiz(quizzes.find(q => q.id === quizId) || null);
      setShowQuestionsModal(true);
    } catch (err) {
      setError('Failed to load questions. Please try again.');
    } finally {
      setQuestionsLoading(false);
    }
  };

  const startQuiz = (quizId) => {
    window.open(`/quiz/${quizId}`, '_blank', 'noopener,noreferrer');
  };

  // ✅ Fixed timezone-aware availability check
  const isQuizAvailable = (startTime, endTime) => {
    const nowIST = DateTime.now().setZone('Asia/Kolkata');
    const start = DateTime.fromISO(startTime, { zone: 'Asia/Kolkata' });
    const end = DateTime.fromISO(endTime, { zone: 'Asia/Kolkata' });
    return nowIST >= start && nowIST <= end;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Quizzes</h1>
          <button
            onClick={() => navigate('/createquiz')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <FiPlus /> New Quiz
          </button>
        </div>

        {error && (
          <div className="mb-4 text-red-600 font-semibold">{error}</div>
        )}

        {loading ? (
          <div className="text-center text-gray-700">Loading quizzes...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => {
              const available = isQuizAvailable(quiz.startTime, quiz.endTime);
              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative"
                >
                  <button
                    onClick={() => fetchQuestions(quiz.id)}
                    className="absolute top-2 left-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                    title="View Questions"
                  >
                    <FiEye className="text-gray-700" />
                  </button>

                  <div className="p-6 pt-12">
                    <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {quiz.description || 'No description available'}
                    </p>

                    <div className="text-sm text-gray-600 mb-2">
                      <p><strong>Start:</strong> {DateTime.fromISO(quiz.startTime).setZone('Asia/Kolkata').toFormat('ff')}</p>
                      <p><strong>End:</strong> {DateTime.fromISO(quiz.endTime).setZone('Asia/Kolkata').toFormat('ff')}</p>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <span className={`text-sm font-semibold ${available ? 'text-green-600' : 'text-red-600'}`}>
                        {available ? 'Available' : 'Unavailable'}
                      </span>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => startQuiz(quiz.id)}
                          disabled={!available}
                          className={`px-4 py-2 rounded transition ${
                            available
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          Start
                        </button>
                        <ShareButton quizId={quiz.id} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showQuestionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  <span className="text-blue-600">({questions.length})</span> Questions for: {selectedQuiz?.title || 'Unknown Quiz'}
                </h2>
                <button
                  onClick={() => setShowQuestionsModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              {questionsLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="mt-2">Loading questions...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <h3 className="font-medium text-lg mb-3">
                        <span className="text-blue-600">{index + 1}.</span> {question.questionText}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {question.options.map((option, i) => (
                          <div key={i} className="p-3 rounded bg-gray-50 hover:bg-gray-100 transition">
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GetQuiz;
