

// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const QuizResults = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [results, setResults] = useState({
//     score: 0,
//     gainScore: 0,
//     submittedAt: new Date().toISOString(),
//     totalQuestions: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Secure token retrieval with error handling
//   const getToken = () => {
//     try {
//       const userData = localStorage.getItem("user");
//       if (!userData) return null;
//       const user = JSON.parse(userData);
//       return user?.token || null;
//     } catch (err) {
//       console.error("Failed to parse user data", err);
//       return null;
//     }
//   };

//   useEffect(() => {
//     // Validate quizId before making API call
//     if (!id || id === 'undefined') {
//       setError('Invalid quiz reference');
//       setLoading(false);
//       toast.error('Cannot load quiz results - invalid quiz ID');
//       navigate('/quizzes', { replace: true });
//       return;
//     }

//     const fetchResults = async () => {
//       try {
//         const token = getToken();
        
//         if (!token) {
//           throw new Error('Please login to view results');
//         }

//         const response = await fetch(`http://localhost:8080/quiz/getresult/${id}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         if (!response.ok) {
//           if (response.status === 401) {
//             throw new Error('Session expired - Please login again');
//           }
//           if (response.status === 404) {
//             throw new Error('Quiz results not found');
//           }
//           throw new Error('Failed to load results');
//         }

//         const data = await response.json();
        
//         // Validate API response structure
//         if (!data || typeof data.score === 'undefined') {
//           throw new Error('Invalid results data');
//         }

//         setResults({
//           score: data.score || 0,
//           gainScore: data.gainScore || 0,
//           submittedAt: data.submittedAt || new Date().toISOString(),
//           totalQuestions: data.totalQuestions || 10
//         });
//       } catch (err) {
//         console.error("Results fetch error:", err);
//         setError(err.message);
//         toast.error(err.message);
        
//         // Redirect appropriately based on error
//         if (err.message.includes('login')) {
//           navigate('/login', { state: { from: `/quiz/results/${id}` } });
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResults();
//   }, [id, navigate]);

//   // Calculate percentage safely
//   const percentage = results.totalQuestions > 0 
//     ? Math.min(100, Math.round((results.score / results.totalQuestions) * 100))
//     : 0;
    
//   // Format date with fallback
//   const formattedDate = results.submittedAt 
//     ? new Date(results.submittedAt).toLocaleString() 
//     : 'Unknown date';

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-xl font-medium text-gray-700 mb-4">Loading your results...</div>
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
//           <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Results</h2>
//           <p className="text-gray-700 mb-4">{error}</p>
//           <button
//             onClick={() => navigate('/quizzes')}
//             className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//           >
//             Browse Available Quizzes
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
//         <div className="p-8">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h1>
//             <p className="text-gray-600">Submitted on {formattedDate}</p>
//           </div>

//           <div className="space-y-6">
//             <div className="bg-blue-50 p-6 rounded-lg">
//               <h2 className="text-xl font-semibold text-center mb-4">Your Performance</h2>
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div className="bg-white p-3 rounded-md shadow-sm">
//                   <p className="text-sm text-gray-500">Correct Answers</p>
//                   <p className="text-2xl font-bold">
//                     {results.score}<span className="text-lg text-gray-500">/{results.totalQuestions}</span>
//                   </p>
//                 </div>
//                 <div className="bg-white p-3 rounded-md shadow-sm">
//                   <p className="text-sm text-gray-500">Percentage</p>
//                   <p className="text-2xl font-bold">{percentage}%</p>
//                 </div>
//               </div>
//               <div className="bg-white p-3 rounded-md shadow-sm">
//                 <p className="text-sm text-gray-500">Points Earned</p>
//                 <p className="text-2xl font-bold text-green-600">{results.gainScore}</p>
//               </div>
//             </div>

//             <div className="mb-6">
//               <div className="flex justify-between mb-1">
//                 <span className="text-sm font-medium text-gray-700">Your Score</span>
//                 <span className="text-sm font-medium text-gray-700">{percentage}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div 
//                   className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
//                   style={{ width: `${percentage}%` }}
//                 ></div>
//               </div>
//             </div>

//             <div className="flex flex-col space-y-4">
//               <button
//                 onClick={() => navigate('/quizzes')}
//                 className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//               >
//                 Browse More Quizzes
//               </button>
//               <button
//                 onClick={() => navigate(-1)}
//                 className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
//               >
//                 Back to Previous Page
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuizResults;



import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuizResults = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [results, setResults] = useState({
    obtainedScore: 0,       // gainScore (marks obtained)
    totalScore: 0,          // score (total possible marks)
    submittedAt: new Date().toISOString(),
    totalQuestions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return null;
      const user = JSON.parse(userData);
      return user?.token || null;
    } catch (err) {
      console.error("Failed to parse user data", err);
      return null;
    }
  };

  useEffect(() => {
    if (!id || id === 'undefined') {
      setError('Invalid quiz reference');
      setLoading(false);
      toast.error('Cannot load quiz results - invalid quiz ID');
      navigate('/quizzes', { replace: true });
      return;
    }

    const fetchResults = async () => {
      try {
        const token = getToken();
        
        if (!token) {
          throw new Error('Please login to view results');
        }

        const response = await fetch(`http://localhost:8080/quiz/getresult/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Session expired - Please login again');
          }
          if (response.status === 404) {
            throw new Error('Quiz results not found');
          }
          throw new Error('Failed to load results');
        }

        const data = await response.json();
        
        if (!data || typeof data.gainScore === 'undefined' || typeof data.score === 'undefined') {
          throw new Error('Invalid results data');
        }

        setResults({
          obtainedScore: data.gainScore || 0,
          totalScore: data.score || 0,
          submittedAt: data.submittedAt || new Date().toISOString(),
          totalQuestions: data.totalQuestions || 0
        });
      } catch (err) {
        console.error("Results fetch error:", err);
        setError(err.message);
        toast.error(err.message);
        
        if (err.message.includes('login')) {
          navigate('/login', { state: { from: `/quiz/results/${id}` } });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id, navigate]);

  // Calculate percentage safely (obtainedScore / totalScore)
  const percentage = results.totalScore > 0 
    ? Math.min(100, Math.round((results.obtainedScore / results.totalScore) * 100))
    : 0;
    
  const formattedDate = results.submittedAt 
    ? new Date(results.submittedAt).toLocaleString() 
    : 'Unknown date';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-medium text-gray-700 mb-4">Loading your results...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Results</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => navigate('/quizzes')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Available Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h1>
            <p className="text-gray-600">Submitted on {formattedDate}</p>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-center mb-4">Your Performance</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-sm text-gray-500">Marks Obtained</p>
                  <p className="text-2xl font-bold">
                    {results.obtainedScore}<span className="text-lg text-gray-500">/{results.totalScore}</span>
                  </p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-sm text-gray-500">Percentage</p>
                  <p className="text-2xl font-bold">{percentage}%</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-sm text-gray-500">Questions Attempted</p>
                  <p className="text-xl font-bold">{results.totalQuestions}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-sm text-gray-500">Average per Question</p>
                  <p className="text-xl font-bold">
                    {results.totalQuestions > 0 
                      ? (results.obtainedScore / results.totalQuestions).toFixed(1)
                      : 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Your Score</span>
                <span className="text-sm font-medium text-gray-700">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                onClick={() => navigate('/quizzes')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Browse More Quizzes
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Back to Previous Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;



