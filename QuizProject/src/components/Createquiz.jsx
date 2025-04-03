// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Createquiz = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     category: '',
//     numQuestions: 5
//   });
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [totalQuestions, setTotalQuestions] = useState(0);
//   const navigate = useNavigate();


 



//   // Get token from localStorage
//   const getToken = () => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     return user?.token || null;
//   };


//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user?.token) {
//       navigate("/"); // Redirect to home if not logged in
//     }
//   }, [navigate]);

//   // Fetch available categories and question count
//   useEffect(() => {
//     const token = getToken();
    
//     const fetchData = async () => {
//       try {
//         // Fetch categories
//         const categoriesResponse = await axios.get('http://localhost:8080/question/category', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (categoriesResponse.data?.length > 0) {
//           setCategories(categoriesResponse.data);
//         }

//         // Fetch question count from localStorage
//         const storedCount = localStorage.getItem('totalQuestions');
//         if (storedCount) {
//           setTotalQuestions(parseInt(storedCount));
//         }

//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError('Failed to load initial data. Please refresh the page.');
//       }
//     };

//     if (token) {
//       fetchData();
//     } else {
//       navigate('/');
//     }
//   }, [navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'numQuestions' 
//         ? Math.max(1, Math.min(totalQuestions || 50, parseInt(value) || 1)) 
//         : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (totalQuestions === 0) {
//       setError('Cannot create quiz - no questions available');
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       const token = getToken();
//       if (!token) throw new Error('Authentication required');

//       const params = new URLSearchParams();
//       params.append('title', formData.title);
//       params.append('numQ', Math.min(formData.numQuestions, totalQuestions));
//       if (formData.category) params.append('category', formData.category);

//       await axios.post(`http://localhost:8080/quiz/create?${params.toString()}`, null, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       navigate('/quiz/created');
//     } catch (error) {
//       console.error('Error creating quiz:', error);
//       setError(error.response?.data?.message || 'Failed to create quiz. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8">
//       {/* Left Column - Form Section */}
//       <div className="md:w-2/3 bg-white p-8 rounded-lg shadow-md">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Create a New Quiz</h1>
        
//         {/* Question Availability Status */}
//         <div className={`mb-6 p-4 rounded-lg ${
//           totalQuestions === 0 
//             ? 'bg-red-100 text-red-800' 
//             : 'bg-green-100 text-green-800'
//         }`}>
//           <div className="flex justify-between items-center">
//             <span>
//               {totalQuestions === 0
//                 ? '⚠️ No questions available'
//                 : `✅ ${totalQuestions} questions available`}
//             </span>
//             <button 
//               onClick={() => navigate('/add-question')}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               {totalQuestions === 0 ? 'Add Questions' : 'Manage Questions'}
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           {/* Quiz Title */}
//           <div className="mb-6">
//             <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
//               Quiz Title *
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter a title for your quiz"
//               value={formData.title}
//               onChange={handleChange}
//               required
//               disabled={totalQuestions === 0}
//             />
//           </div>

//           {/* Category */}
//           <div className="mb-6">
//             <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
//               Category
//             </label>
//             {categories.length > 0 && (
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {categories.map((cat) => (
//                   <button
//                     key={cat}
//                     type="button"
//                     className={`px-4 py-2 rounded-md ${
//                       formData.category === cat 
//                         ? 'bg-blue-600 text-white' 
//                         : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                     }`}
//                     onClick={() => setFormData({...formData, category: cat})}
//                     disabled={totalQuestions === 0}
//                   >
//                     {cat}
//                   </button>
//                 ))}
//               </div>
//             )}
//             <input
//               type="text"
//               id="category"
//               name="category"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//               placeholder="Enter a category (optional)"
//               value={formData.category}
//               onChange={handleChange}
//               disabled={totalQuestions === 0}
//             />
//           </div>

//           {/* Number of Questions */}
//           <div className="mb-6">
//             <label className="block text-gray-700 font-medium mb-2" htmlFor="numQuestions">
//               Number of Questions *
//             </label>
//             <input
//               type="number"
//               id="numQuestions"
//               name="numQuestions"
//               min="1"
//               max={totalQuestions || 50}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//               value={formData.numQuestions}
//               onChange={handleChange}
//               required
//               disabled={totalQuestions === 0}
//             />
//             <p className="text-sm text-gray-500 mt-1">
//               {totalQuestions > 0
//                 ? `Maximum available: ${totalQuestions} questions`
//                 : 'Add questions to enable this field'}
//             </p>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className={`w-full py-3 px-4 rounded-md transition duration-200 font-medium ${
//               totalQuestions === 0 || loading
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-blue-600 text-white hover:bg-blue-700'
//             }`}
//             disabled={loading || totalQuestions === 0}
//           >
//             {loading ? 'Creating Quiz...' : 'Create Quiz'}
//           </button>
//         </form>
//       </div>

//       {/* Right Column - Tips Section */}
//       <div className="md:w-1/3 bg-blue-50 p-6 rounded-lg shadow-sm">
//         <h2 className="text-xl font-bold text-gray-800 mb-4">Quiz Creation Guide</h2>
        
//         <div className="mb-6 p-4 bg-white rounded-lg shadow-xs">
//           <h3 className="font-medium text-gray-700 mb-2">Current Status</h3>
//           <p className="text-lg font-bold text-blue-600">
//             {totalQuestions} {totalQuestions === 1 ? 'Question' : 'Questions'} Available
//           </p>
//           {totalQuestions === 0 && (
//             <button
//               onClick={() => navigate('/add-question')}
//               className="w-full mt-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//             >
//               Go Add Questions Now
//             </button>
//           )}
//         </div>

//         <ul className="space-y-3 text-gray-700">
//           <li className="flex items-start">
//             <span className="mr-2 text-blue-500">•</span>
//             Minimum 1 question required to create a quiz
//           </li>
//           <li className="flex items-start">
//             <span className="mr-2 text-blue-500">•</span>
//             Categorize questions for better organization
//           </li>
//           <li className="flex items-start">
//             <span className="mr-2 text-blue-500">•</span>
//             Use descriptive titles (e.g., "Advanced React Patterns")
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Createquiz;





// 222222

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Createquiz = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     category: '',
//     numQuestions: 5
//   });
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [totalQuestions, setTotalQuestions] = useState(0);
//   const [creationMode, setCreationMode] = useState('full'); // 'full' or 'minimal'
//   const navigate = useNavigate();

//   // Get token from localStorage
//   const getToken = () => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     return user?.token || null;
//   };

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user?.token) {
//       navigate("/"); // Redirect to home if not logged in
//     }
//   }, [navigate]);

//   // Fetch available categories and question count
//   useEffect(() => {
//     const token = getToken();
    
//     const fetchData = async () => {
//       try {
//         // Fetch categories
//         const categoriesResponse = await axios.get('http://localhost:8080/question/category', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (categoriesResponse.data?.length > 0) {
//           setCategories(categoriesResponse.data);
//         }

//         // Fetch question count from localStorage
//         const storedCount = localStorage.getItem('totalQuestions');
//         if (storedCount) {
//           setTotalQuestions(parseInt(storedCount));
//         }

//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError('Failed to load initial data. Please refresh the page.');
//       }
//     };

//     if (token) {
//       fetchData();
//     } else {
//       navigate('/');
//     }
//   }, [navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'numQuestions' 
//         ? Math.max(1, Math.min(totalQuestions || 50, parseInt(value) || 1)) 
//         : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     setLoading(true);
//     setError(null);
    
//     try {
//       const token = getToken();
//       if (!token) throw new Error('Authentication required');

//       if (creationMode === 'full' && totalQuestions === 0) {
//         throw new Error('Cannot create full quiz - no questions available');
//       }

//       const params = new URLSearchParams();
//       params.append('title', formData.title);
      
//       if (creationMode === 'full') {
//         params.append('numQ', Math.min(formData.numQuestions, totalQuestions));
//         if (formData.category) params.append('category', formData.category);
//       }

//       await axios.post(`http://localhost:8080/quiz/create?${params.toString()}`, null, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       navigate('/quiz/created');
//     } catch (error) {
//       console.error('Error creating quiz:', error);
//       setError(error.response?.data?.message || error.message || 'Failed to create quiz. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8">
//       {/* Left Column - Form Section */}
//       <div className="md:w-2/3 bg-white p-8 rounded-lg shadow-md">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Create a New Quiz</h1>
        
//         {/* Creation Mode Toggle */}
//         <div className="mb-6 flex border-b">
//           <button
//             type="button"
//             className={`px-4 py-2 font-medium ${creationMode === 'full' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
//             onClick={() => setCreationMode('full')}
//           >
//             Full Quiz
//           </button>
//           <button
//             type="button"
//             className={`px-4 py-2 font-medium ${creationMode === 'minimal' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
//             onClick={() => setCreationMode('minimal')}
//           >
//             Empty Quiz
//           </button>
//         </div>

//         {/* Question Availability Status */}
//         {creationMode === 'full' && (
//           <div className={`mb-6 p-4 rounded-lg ${
//             totalQuestions === 0 
//               ? 'bg-red-100 text-red-800' 
//               : 'bg-green-100 text-green-800'
//           }`}>
//             <div className="flex justify-between items-center">
//               <span>
//                 {totalQuestions === 0
//                   ? '⚠️ No questions available'
//                   : `✅ ${totalQuestions} questions available`}
//               </span>
//               <button 
//                 onClick={() => navigate('/add-question')}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 {totalQuestions === 0 ? 'Add Questions' : 'Manage Questions'}
//               </button>
//             </div>
//           </div>
//         )}

//         {error && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           {/* Quiz Title */}
//           <div className="mb-6">
//             <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
//               Quiz Title *
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter a title for your quiz"
//               value={formData.title}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Full Quiz Options */}
//           {creationMode === 'full' && (
//             <>
//               {/* Category */}
//               <div className="mb-6">
//                 <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
//                   Category
//                 </label>
//                 {categories.length > 0 && (
//                   <div className="flex flex-wrap gap-2 mb-2">
//                     {categories.map((cat) => (
//                       <button
//                         key={cat}
//                         type="button"
//                         className={`px-4 py-2 rounded-md ${
//                           formData.category === cat 
//                             ? 'bg-blue-600 text-white' 
//                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                         }`}
//                         onClick={() => setFormData({...formData, category: cat})}
//                         disabled={totalQuestions === 0}
//                       >
//                         {cat}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//                 <input
//                   type="text"
//                   id="category"
//                   name="category"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//                   placeholder="Enter a category (optional)"
//                   value={formData.category}
//                   onChange={handleChange}
//                   disabled={totalQuestions === 0}
//                 />
//               </div>

//               {/* Number of Questions */}
//               <div className="mb-6">
//                 <label className="block text-gray-700 font-medium mb-2" htmlFor="numQuestions">
//                   Number of Questions *
//                 </label>
//                 <input
//                   type="number"
//                   id="numQuestions"
//                   name="numQuestions"
//                   min="1"
//                   max={totalQuestions || 50}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//                   value={formData.numQuestions}
//                   onChange={handleChange}
//                   required
//                   disabled={totalQuestions === 0}
//                 />
//                 <p className="text-sm text-gray-500 mt-1">
//                   {totalQuestions > 0
//                     ? `Maximum available: ${totalQuestions} questions`
//                     : 'Add questions to enable this field'}
//                 </p>
//               </div>
//             </>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className={`w-full py-3 px-4 rounded-md transition duration-200 font-medium ${
//               (creationMode === 'full' && totalQuestions === 0) || loading
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-blue-600 text-white hover:bg-blue-700'
//             }`}
//             disabled={(creationMode === 'full' && totalQuestions === 0) || loading}
//           >
//             {loading ? 'Creating Quiz...' : 'Create Quiz'}
//           </button>
//         </form>
//       </div>

//       {/* Right Column - Tips Section */}
//       <div className="md:w-1/3 bg-blue-50 p-6 rounded-lg shadow-sm">
//         <h2 className="text-xl font-bold text-gray-800 mb-4">Quiz Creation Guide</h2>
        
//         {creationMode === 'full' ? (
//           <>
//             <div className="mb-6 p-4 bg-white rounded-lg shadow-xs">
//               <h3 className="font-medium text-gray-700 mb-2">Current Status</h3>
//               <p className="text-lg font-bold text-blue-600">
//                 {totalQuestions} {totalQuestions === 1 ? 'Question' : 'Questions'} Available
//               </p>
//               {totalQuestions === 0 && (
//                 <button
//                   onClick={() => navigate('/add-question')}
//                   className="w-full mt-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//                 >
//                   Go Add Questions Now
//                 </button>
//               )}
//             </div>

//             <ul className="space-y-3 text-gray-700">
//               <li className="flex items-start">
//                 <span className="mr-2 text-blue-500">•</span>
//                 Minimum 1 question required to create a full quiz
//               </li>
//               <li className="flex items-start">
//                 <span className="mr-2 text-blue-500">•</span>
//                 Categorize questions for better organization
//               </li>
//               <li className="flex items-start">
//                 <span className="mr-2 text-blue-500">•</span>
//                 Use descriptive titles (e.g., "Advanced React Patterns")
//               </li>
//             </ul>
//           </>
//         ) : (
//           <>
//             <div className="mb-6 p-4 bg-white rounded-lg shadow-xs">
//               <h3 className="font-medium text-gray-700 mb-2">Empty Quiz</h3>
//               <p className="text-lg font-bold text-blue-600">
//                 Create a quiz shell to add questions later
//               </p>
//             </div>

//             <ul className="space-y-3 text-gray-700">
//               <li className="flex items-start">
//                 <span className="mr-2 text-blue-500">•</span>
//                 Start with just a title
//               </li>
//               <li className="flex items-start">
//                 <span className="mr-2 text-blue-500">•</span>
//                 Add questions manually later
//               </li>
//               <li className="flex items-start">
//                 <span className="mr-2 text-blue-500">•</span>
//                 Useful for planning quizzes in advance
//               </li>
//             </ul>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Createquiz;

// 33333



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const totalQuestions=0;

// const Createquiz = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     category: '',
//     numQuestions: 5
//   });
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [totalQuestions, setTotalQuestions] = useState(0);
//   const [creationMode, setCreationMode] = useState('full'); // 'full' or 'titleOnly'
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);

//   // Get token from localStorage
//   const getToken = () => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     return user?.token || null;
//   };



//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user?.token) {
//       navigate("/"); // Redirect to home if not logged in
//     }
//   }, [navigate]);

//   // Fetch available categories and question count
//   useEffect(() => {
//     const token = getToken();

    
//     const fetchData = async () => {
//       try {
//         // Fetch categories
//         const categoriesResponse = await axios.get('http://localhost:8080/question/category', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (categoriesResponse.data?.length > 0) {
//           setCategories(categoriesResponse.data);
//         }

//         // Fetch question count from localStorage
//         // const storedCount = localStorage.getItem('totalQuestions');
//         if (storedCount) {
//           setTotalQuestions(parseInt(storedCount));
//         }

//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError('Failed to load initial data. Please refresh the page.');
//       }
//     };

//     if (token) {
//       fetchData();
//     } else {
//       navigate('/');
//     }
//   }, [navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'numQuestions' 
//         ? Math.max(1, Math.min(totalQuestions || 50, parseInt(value) || 1)) 
//         : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     setLoading(true);
//     setError(null);
    
//     try {
//       const token = getToken();
//       if (!token) throw new Error('Authentication required');

//       if (creationMode === 'full') {
//         if (totalQuestions === 0) {
//           throw new Error('Cannot create full quiz - no questions available');
//         }

//         // Full quiz creation endpoint
//         const params = new URLSearchParams();
//         params.append('title', formData.title);
//         params.append('numQ', Math.min(formData.numQuestions, totalQuestions));
//         if (formData.category) params.append('category', formData.category);

//         await axios.post(`http://localhost:8080/quiz/create?${params.toString()}`, null, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
//       } else {
//         // Title-only quiz creation endpoint
//         await axios.post(
//           `http://localhost:8080/quiz/createUseTitle?title=${encodeURIComponent(formData.title)}`,
//           null,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
//       }

//       navigate('/quizzes');
//     } catch (error) {
//       console.error('Error creating quiz:', error);
//       setError(error.response?.data?.message || error.message || 'Failed to create quiz. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8">
//       {/* Left Column - Form Section */}
//       <div className="md:w-2/3 bg-white p-8 rounded-lg shadow-md">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Create a New Quiz</h1>
        
//         {/* Creation Mode Toggle */}
//         <div className="mb-6 flex border-b">
//           <button
//             type="button"
//             className={`px-4 py-2 font-medium ${creationMode === 'full' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
//             onClick={() => setCreationMode('full')}
//           >
//             Full Quiz
//           </button>
//           <button
//             type="button"
//             className={`px-4 py-2 font-medium ${creationMode === 'titleOnly' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
//             onClick={() => setCreationMode('titleOnly')}
//           >
//             Title Only
//           </button>
//         </div>

//         {/* Question Availability Status - Only for full quiz mode */}
//         {creationMode === 'full' && (
//           <div className={`mb-6 p-4 rounded-lg ${
//             totalQuestions === 0 
//               ? 'bg-red-100 text-red-800' 
//               : 'bg-green-100 text-green-800'
//           }`}>
//             <div className="flex justify-between items-center">
//               <span>
//                 {totalQuestions === 0
//                   ? '⚠️ No questions available'
//                   : `✅ ${totalQuestions} questions available`}
//               </span>
//               <button 
//                 onClick={() => navigate('/add-question')}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 {totalQuestions === 0 ? 'Add Questions' : 'Manage Questions'}
//               </button>
//             </div>
//           </div>
//         )}

//         {error && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           {/* Quiz Title - Always required */}
//           <div className="mb-6">
//             <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
//               Quiz Title *
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter a title for your quiz"
//               value={formData.title}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Full Quiz Options - Only shown in full mode */}
//           {creationMode === 'full' && (
//             <>
//               {/* Category */}
//               <div className="mb-6">
//                 <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
//                   Category
//                 </label>
//                 {categories.length > 0 && (
//                   <div className="flex flex-wrap gap-2 mb-2">
//                     {categories.map((cat) => (
//                       <button
//                         key={cat}
//                         type="button"
//                         className={`px-4 py-2 rounded-md ${
//                           formData.category === cat 
//                             ? 'bg-blue-600 text-white' 
//                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                         }`}
//                         onClick={() => setFormData({...formData, category: cat})}
//                         disabled={totalQuestions === 0}
//                       >
//                         {cat}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//                 <input
//                   type="text"
//                   id="category"
//                   name="category"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//                   placeholder="Enter a category (optional)"
//                   value={formData.category}
//                   onChange={handleChange}
//                   disabled={totalQuestions === 0}
//                 />
//               </div>

//               {/* Number of Questions */}
//               <div className="mb-6">
//                 <label className="block text-gray-700 font-medium mb-2" htmlFor="numQuestions">
//                   Number of Questions *
//                 </label>
//                 <input
//                   type="number"
//                   id="numQuestions"
//                   name="numQuestions"
//                   min="1"
//                   max={totalQuestions || 50}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//                   value={formData.numQuestions}
//                   onChange={handleChange}
//                   required
//                   disabled={totalQuestions === 0}
//                 />
//                 <p className="text-sm text-gray-500 mt-1">
//                   {totalQuestions > 0
//                     ? `Maximum available: ${totalQuestions} questions`
//                     : 'Add questions to enable this field'}
//                 </p>
//               </div>
//             </>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className={`w-full py-3 px-4 rounded-md transition duration-200 font-medium ${
//               (creationMode === 'full' && totalQuestions === 0) || loading
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-blue-600 text-white hover:bg-blue-700'
//             }`}
//             disabled={(creationMode === 'full' && totalQuestions === 0) || loading}
//           >
//             {loading 
//               ? 'Creating Quiz...' 
//               : creationMode === 'full' 
//                 ? 'Create Full Quiz' 
//                 : 'Create Empty Quiz'}
//           </button>
//         </form>
//       </div>

//       {/* Right Column - Tips Section */}
//       <div className="md:w-1/3 bg-blue-50 p-6 rounded-lg shadow-sm">
//         <h2 className="text-xl font-bold text-gray-800 mb-4">Quiz Creation Guide</h2>
        
//         {creationMode === 'full' ? (
//           <>
//             <div className="mb-6 p-4 bg-white rounded-lg shadow-xs">
//               <h3 className="font-medium text-gray-700 mb-2">Full Quiz Creation</h3>
//               <p className="text-blue-600">
//                 Creates a quiz with randomly selected questions based on your criteria
//               </p>
//             </div>

//             <ul className="space-y-3 text-gray-700">
//               <li className="flex items-start">
//                 <span className="mr-2 text-blue-500">•</span>
//                 Requires available questions in the system
//               </li>
//               <li className="flex items-start">
//                 <span className="mr-2 text-blue-500">•</span>
//                 Questions are automatically selected based on category
//               </li>
//               <li className="flex items-start">
//                 <span className="mr-2 text-blue-500">•</span>
//                 Best for quick quiz generation
//               </li>
//             </ul>
//           </>
//         ) : (
//           <>
//             <div className="mb-6 p-4 bg-white rounded-lg shadow-xs">
//               <h3 className="font-medium text-gray-700 mb-2">Empty Quiz Creation</h3>
//               <p className="text-blue-600">
//                 Creates a quiz shell that you can manually add questions to later
//               </p>
//             </div>

//             <ul className="space-y-3 text-gray-700">
//               <li className="flex items-start">
//                 <span className="mr-2 text-blue-500">•</span>
//                 Doesn't require any existing questions
//               </li>
//               <li className="flex items-start">
//                 <span className="mr-2 text-blue-500">•</span>
//                 You can add questions manually after creation
//               </li>
//               <li className="flex items-start">
//                 <span className="mr-2 text-blue-500">•</span>
//                 Best for building custom quizzes
//               </li>
//             </ul>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Createquiz;



// 43444444

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Createquiz = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     category: '',
//     numQuestions: 5
//   });
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [totalQuestions, setTotalQuestions] = useState(0);
//   const [creationMode, setCreationMode] = useState('full'); // 'full' or 'titleOnly'
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);

//   // Get token from localStorage
//   const getToken = () => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     return user?.token || null;
//   };

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user?.token) {
//       navigate("/"); // Redirect to home if not logged in
//     }
//   }, [navigate]);

//   // Fetch available categories and question count
//   useEffect(() => {
//     const token = getToken();
    
//     const fetchData = async () => {
//       try {
//         // Fetch categories
//         const categoriesResponse = await axios.get('http://localhost:8080/question/category', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (categoriesResponse.data?.length > 0) {
//           setCategories(categoriesResponse.data);
//         }

//         // Fetch all questions
//         const questionsResponse = await axios.get('http://localhost:8080/question/allQuestion', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         setQuestions(questionsResponse.data);
//         setTotalQuestions(questionsResponse.data.length);
        
//         // Store question count in localStorage for future use
//         localStorage.setItem('totalQuestions', questionsResponse.data.length);

//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError('Failed to load initial data. Please refresh the page.');
//       }
//     };

//     if (token) {
//       fetchData();
//     } else {
//       navigate('/');
//     }
//   }, [navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'numQuestions' 
//         ? Math.max(1, Math.min(totalQuestions || 50, parseInt(value) || 1)) 
//         : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     setLoading(true);
//     setError(null);
    
//     try {
//       const token = getToken();
//       if (!token) throw new Error('Authentication required');

//       if (creationMode === 'full') {
//         if (totalQuestions === 0) {
//           throw new Error('Cannot create full quiz - no questions available');
//         }

//         // Full quiz creation endpoint
//         const params = new URLSearchParams();
//         params.append('title', formData.title);
//         params.append('numQ', Math.min(formData.numQuestions, totalQuestions));
//         if (formData.category) params.append('category', formData.category);

//         await axios.post(`http://localhost:8080/quiz/create?${params.toString()}`, null, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
//       } else {
//         // Title-only quiz creation endpoint
//         await axios.post(
//           `http://localhost:8080/quiz/createUseTitle?title=${encodeURIComponent(formData.title)}`,
//           null,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
//       }

//       navigate('/quizzes');
//     } catch (error) {
//       console.error('Error creating quiz:', error);
//       setError(error.response?.data?.message || error.message || 'Failed to create quiz. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8">
//       {/* Left Column - Form Section */}
//       <div className="md:w-2/3 bg-white p-8 rounded-lg shadow-md">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Create a New Quiz</h1>
        
//         {/* Creation Mode Toggle */}
//         <div className="mb-6 flex border-b">
//           <button
//             type="button"
//             className={`px-4 py-2 font-medium ${creationMode === 'full' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
//             onClick={() => setCreationMode('full')}
//           >
//             Full Quiz
//           </button>
//           <button
//             type="button"
//             className={`px-4 py-2 font-medium ${creationMode === 'titleOnly' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
//             onClick={() => setCreationMode('titleOnly')}
//           >
//             Title Only
//           </button>
//         </div>

//         {/* Question Availability Status - Only for full quiz mode */}
//         {creationMode === 'full' && (
//           <div className={`mb-6 p-4 rounded-lg ${
//             totalQuestions === 0 
//               ? 'bg-red-100 text-red-800' 
//               : 'bg-green-100 text-green-800'
//           }`}>
//             <div className="flex justify-between items-center">
//               <span>
//                 {totalQuestions === 0
//                   ? '⚠️ No questions available'
//                   : `✅ ${totalQuestions} questions available`}
//               </span>
//               <button 
//                 onClick={() => navigate('/add-question')}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 {totalQuestions === 0 ? 'Add Questions' : 'Manage Questions'}
//               </button>
//             </div>
//           </div>
//         )}

//         {error && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           {/* Quiz Title - Always required */}
//           <div className="mb-6">
//             <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
//               Quiz Title *
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter a title for your quiz"
//               value={formData.title}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Full Quiz Options - Only shown in full mode */}
//           {creationMode === 'full' && (
//             <>
//               {/* Category */}
//               <div className="mb-6">
//                 <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
//                   Category
//                 </label>
//                 {categories.length > 0 && (
//                   <div className="flex flex-wrap gap-2 mb-2">
//                     {categories.map((cat) => (
//                       <button
//                         key={cat}
//                         type="button"
//                         className={`px-4 py-2 rounded-md ${
//                           formData.category === cat 
//                             ? 'bg-blue-600 text-white' 
//                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                         }`}
//                         onClick={() => setFormData({...formData, category: cat})}
//                         disabled={totalQuestions === 0}
//                       >
//                         {cat}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//                 <input
//                   type="text"
//                   id="category"
//                   name="category"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//                   placeholder="Enter a category (optional)"
//                   value={formData.category}
//                   onChange={handleChange}
//                   disabled={totalQuestions === 0}
//                 />
//               </div>

//               {/* Number of Questions */}
//               <div className="mb-6">
//                 <label className="block text-gray-700 font-medium mb-2" htmlFor="numQuestions">
//                   Number of Questions *
//                 </label>
//                 <input
//                   type="number"
//                   id="numQuestions"
//                   name="numQuestions"
//                   min="1"
//                   max={totalQuestions || 50}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//                   value={formData.numQuestions}
//                   onChange={handleChange}
//                   required
//                   disabled={totalQuestions === 0}
//                 />
//                 <p className="text-sm text-gray-500 mt-1">
//                   {totalQuestions > 0
//                     ? `Maximum available: ${totalQuestions} questions`
//                     : 'Add questions to enable this field'}
//                 </p>
//               </div>
//             </>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className={`w-full py-3 px-4 rounded-md transition duration-200 font-medium ${
//               (creationMode === 'full' && totalQuestions === 0) || loading
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-blue-600 text-white hover:bg-blue-700'
//             }`}
//             disabled={(creationMode === 'full' && totalQuestions === 0) || loading}
//           >
//             {loading 
//               ? 'Creating Quiz...' 
//               : creationMode === 'full' 
//                 ? 'Create Full Quiz' 
//                 : 'Create Empty Quiz'}
//           </button>
//         </form>
//       </div>

//       {/* Right Column - Tips Section */}
//       <div className="md:w-1/3 bg-blue-50 p-6 rounded-lg shadow-sm">
//         <h2 className="text-xl font-bold text-gray-800 mb-4">Quiz Creation Guide</h2>
        
//         {creationMode === 'full' ? (
//           <>
//             <div className="mb-6 p-4 bg-white rounded-lg shadow-xs">
//               <h3 className="font-medium text-gray-700 mb-2">Full Quiz Creation</h3>
//               <p className="text-blue-600">
//                 Creates a quiz with randomly selected questions based on your criteria
//               </p>
//             </div>

//             <ul className="space-y-3 text-gray-700">
//               <li className="flex items-start">
//                 <span className="mr-2 text-blue-500">•</span>
//                 Requires available questions in the system
//               </li>
//               <li className="flex items-start">
//                 <span className="mr-2 text-blue-500">•</span>
//                 Questions are automatically selected based on category
//               </li>
//               <li className="flex items-start">
//                 <span className="mr-2 text-blue-500">•</span>
//                 Best for quick quiz generation
//               </li>
//             </ul>
//           </>
//         ) : (
//           <>
//             <div className="mb-6 p-4 bg-white rounded-lg shadow-xs">
//               <h3 className="font-medium text-gray-700 mb-2">Empty Quiz Creation</h3>
//               <p className="text-blue-600">
//                 Creates a quiz shell that you can manually add questions to later
//               </p>
//             </div>

//             <ul className="space-y-3 text-gray-700">
//               <li className="flex items-start">
//                 <span className="mr-2 text-blue-500">•</span>
//                 Doesn't require any existing questions
//               </li>
//               <li className="flex items-start">
//                 <span className="mr-2 text-blue-500">•</span>
//                 You can add questions manually after creation
//               </li>
//               <li className="flex items-start">
//                 <span className="mr-2 text-blue-500">•</span>
//                 Best for building custom quizzes
//               </li>
//             </ul>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Createquiz;


// 5555


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const CreateQuiz = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     category: '',
//     numQuestions: 5,
//     quizStartTime: '',
//     quizEndTime: '',
//     isActive: false,
//     defaultPointsPerQuestion: 1
//   });
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [totalQuestions, setTotalQuestions] = useState(0);
//   const [creationMode, setCreationMode] = useState('full'); // 'full' or 'titleOnly'
//   const navigate = useNavigate();

//   // Get token from localStorage
//   const getToken = () => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     return user?.token || null;
//   };

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user?.token) {
//       navigate("/");
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const token = getToken();
    
//     const fetchData = async () => {
//       try {
//         const [categoriesRes, questionsRes] = await Promise.all([
//           axios.get('http://localhost:8080/question/category', {
//             headers: { 'Authorization': `Bearer ${token}` }
//           }),
//           axios.get('http://localhost:8080/question/allQuestion', {
//             headers: { 'Authorization': `Bearer ${token}` }
//           })
//         ]);
        
//         setCategories(categoriesRes.data);
//         setQuestions(questionsRes.data);
//         setTotalQuestions(questionsRes.data.length);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError('Failed to load initial data');
//       }
//     };

//     if (token) fetchData();
//   }, [navigate]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleDateTimeChange = (name, value) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
    
//     try {
//       const token = getToken();
//       if (!token) throw new Error('Authentication required');

//       const params = new URLSearchParams();
//       params.append('title', formData.title);

//       if (creationMode === 'full') {
//         if (totalQuestions === 0) throw new Error('No questions available');
        
//         params.append('category', formData.category);
//         params.append('numQ', Math.min(formData.numQuestions, totalQuestions));
//       }

//       // Add optional parameters if they exist
//       if (formData.quizStartTime) params.append('quizStartTime', formData.quizStartTime);
//       if (formData.quizEndTime) params.append('quizEndTime', formData.quizEndTime);
//       if (formData.isActive) params.append('isActive', formData.isActive);
//       if (formData.defaultPointsPerQuestion > 1) {
//         params.append('defaultPointsPerQuestion', formData.defaultPointsPerQuestion);
//       }

//       const endpoint = creationMode === 'full' 
//         ? 'http://localhost:8080/quiz/create' 
//         : 'http://localhost:8080/quiz/createUseTitle';

//       await axios.post(`${endpoint}?${params.toString()}`, null, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       navigate('/quizzes');
//     } catch (error) {
//       console.error('Error creating quiz:', error);
//       setError(error.response?.data?.message || error.message || 'Failed to create quiz');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8">
//       {/* Form Section */}
//       <div className="md:w-2/3 bg-white p-8 rounded-lg shadow-md">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Quiz</h1>
        
//         {/* Creation Mode Toggle */}
//         <div className="mb-6 flex border-b">
//           <button
//             type="button"
//             className={`px-4 py-2 font-medium ${
//               creationMode === 'full' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
//             }`}
//             onClick={() => setCreationMode('full')}
//           >
//             Full Quiz
//           </button>
//           <button
//             type="button"
//             className={`px-4 py-2 font-medium ${
//               creationMode === 'titleOnly' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
//             }`}
//             onClick={() => setCreationMode('titleOnly')}
//           >
//             Title Only
//           </button>
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           {/* Quiz Title */}
//           <div className="mb-6">
//             <label className="block text-gray-700 font-medium mb-2">
//               Quiz Title *
//             </label>
//             <input
//               type="text"
//               name="title"
//               className="w-full px-4 py-2 border rounded-md"
//               value={formData.title}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Full Quiz Options */}
//           {creationMode === 'full' && (
//             <>
//               <div className="mb-6">
//                 <label className="block text-gray-700 font-medium mb-2">
//                   Category
//                 </label>
//                 <select
//                   name="category"
//                   className="w-full px-4 py-2 border rounded-md"
//                   value={formData.category}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select a category</option>
//                   {categories.map(cat => (
//                     <option key={cat} value={cat}>{cat}</option>
//                   ))}
//                 </select>
//               </div>

//               <div className="mb-6">
//                 <label className="block text-gray-700 font-medium mb-2">
//                   Number of Questions *
//                 </label>
//                 <input
//                   type="number"
//                   name="numQuestions"
//                   min="1"
//                   max={totalQuestions}
//                   className="w-full px-4 py-2 border rounded-md"
//                   value={formData.numQuestions}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </>
//           )}

//           {/* Additional Options */}
//           <div className="mb-6">
//             <label className="block text-gray-700 font-medium mb-2">
//               Start Time
//             </label>
//             <input
//               type="datetime-local"
//               name="quizStartTime"
//               className="w-full px-4 py-2 border rounded-md"
//               value={formData.quizStartTime}
//               onChange={(e) => handleDateTimeChange('quizStartTime', e.target.value)}
//             />
//           </div>

//           <div className="mb-6">
//             <label className="block text-gray-700 font-medium mb-2">
//               End Time
//             </label>
//             <input
//               type="datetime-local"
//               name="quizEndTime"
//               className="w-full px-4 py-2 border rounded-md"
//               value={formData.quizEndTime}
//               onChange={(e) => handleDateTimeChange('quizEndTime', e.target.value)}
//             />
//           </div>

//           <div className="mb-6 flex items-center">
//             <input
//               type="checkbox"
//               id="isActive"
//               name="isActive"
//               className="mr-2"
//               checked={formData.isActive}
//               onChange={handleChange}
//             />
//             <label htmlFor="isActive">Active Immediately</label>
//           </div>

//           <div className="mb-6">
//             <label className="block text-gray-700 font-medium mb-2">
//               Points Per Question
//             </label>
//             <input
//               type="number"
//               name="defaultPointsPerQuestion"
//               min="1"
//               max="10"
//               className="w-full px-4 py-2 border rounded-md"
//               value={formData.defaultPointsPerQuestion}
//               onChange={handleChange}
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             disabled={loading}
//           >
//             {loading ? 'Creating...' : 'Create Quiz'}
//           </button>
//         </form>
//       </div>

//       {/* Instructions Section */}
//       <div className="md:w-1/3 bg-blue-50 p-6 rounded-lg">
//         <h2 className="text-xl font-bold mb-4">Instructions</h2>
//         <ul className="space-y-3">
//           <li>• Title is required for all quizzes</li>
//           <li>• Dates should be in local time format</li>
//           <li>• Default points per question is 1</li>
//           {creationMode === 'full' && (
//             <>
//               <li>• Select a category for filtered questions</li>
//               <li>• Number cannot exceed available questions</li>
//             </>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default CreateQuiz;


// 66666



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const CreateQuiz = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     category: '',
//     numQuestions: 5,
//     quizStartTime: '',
//     quizEndTime: '',
//     isActive: false,
//     defaultPointsPerQuestion: 1
//   });
  
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [totalQuestions, setTotalQuestions] = useState(0);
//   const [creationMode, setCreationMode] = useState('full');
//   const navigate = useNavigate();

//   const getToken = () => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     return user?.token || null;
//   };

//   useEffect(() => {
//     const token = getToken();
//     if (!token) navigate("/");
    
//     const fetchData = async () => {
//       try {
//         const [categoriesRes, questionsRes] = await Promise.all([
//           axios.get('http://localhost:8080/question/category', {
//             headers: { 'Authorization': `Bearer ${token}` }
//           }),
//           axios.get('http://localhost:8080/question/allQuestion', {
//             headers: { 'Authorization': `Bearer ${token}` }
//           })
//         ]);
        
//         setCategories(categoriesRes.data);
//         setTotalQuestions(questionsRes.data.length);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError('Failed to load initial data');
//       }
//     };

//     fetchData();
//   }, [navigate]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleDateTimeChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
    
//     try {
//       const token = getToken();
//       if (!token) throw new Error('Authentication required');

//       const params = new URLSearchParams();
//       params.append('title', formData.title);

//       if (creationMode === 'full') {
//         if (totalQuestions === 0) throw new Error('No questions available');
//         params.append('category', formData.category);
//         params.append('numQ', Math.min(formData.numQuestions, totalQuestions));
//       }

//       // Add optional parameters
//       if (formData.quizStartTime) params.append('quizStartTime', formData.quizStartTime);
//       if (formData.quizEndTime) params.append('quizEndTime', formData.quizEndTime);
//       params.append('isActive', formData.isActive);
//       params.append('defaultPointsPerQuestion', formData.defaultPointsPerQuestion);

//       const endpoint = creationMode === 'full' 
//         ? 'http://localhost:8080/quiz/create' 
//         : 'http://localhost:8080/quiz/createUseTitle';

//       await axios.post(`${endpoint}?${params.toString()}`, null, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       navigate('/quizzes');
//     } catch (error) {
//       console.error('Error creating quiz:', error);
//       setError(error.response?.data?.message || error.message || 'Failed to create quiz');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8">
//       {/* Form Section */}
//       <div className="md:w-2/3 bg-white p-8 rounded-lg shadow-md">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Quiz</h1>
        
//         <div className="mb-6 flex border-b">
//           <button
//             type="button"
//             className={`px-4 py-2 font-medium ${
//               creationMode === 'full' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
//             }`}
//             onClick={() => setCreationMode('full')}
//           >
//             Full Quiz
//           </button>
//           <button
//             type="button"
//             className={`px-4 py-2 font-medium ${
//               creationMode === 'titleOnly' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
//             }`}
//             onClick={() => setCreationMode('titleOnly')}
//           >
//             Title Only
//           </button>
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-6">
//             <label className="block text-gray-700 font-medium mb-2">
//               Quiz Title *
//             </label>
//             <input
//               type="text"
//               name="title"
//               className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               value={formData.title}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {creationMode === 'full' && (
//             <>
//               <div className="mb-6">
//                 <label className="block text-gray-700 font-medium mb-2">
//                   Category
//                 </label>
//                 <select
//                   name="category"
//                   className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//                   value={formData.category}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select a category</option>
//                   {categories.map(cat => (
//                     <option key={cat} value={cat}>{cat}</option>
//                   ))}
//                 </select>
//               </div>

//               <div className="mb-6">
//                 <label className="block text-gray-700 font-medium mb-2">
//                   Number of Questions *
//                 </label>
//                 <input
//                   type="number"
//                   name="numQuestions"
//                   min="1"
//                   max={totalQuestions}
//                   className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//                   value={formData.numQuestions}
//                   onChange={handleChange}
//                   required
//                   disabled={totalQuestions === 0}
//                 />
//                 <p className="text-sm text-gray-500 mt-1">
//                   {totalQuestions > 0 ? `Max available: ${totalQuestions}` : 'No questions available'}
//                 </p>
//               </div>
//             </>
//           )}

//           <div className="mb-6">
//             <label className="block text-gray-700 font-medium mb-2">
//               Start Time
//             </label>
//             <input
//               type="datetime-local"
//               name="quizStartTime"
//               className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//               value={formData.quizStartTime}
//               onChange={handleDateTimeChange}
//             />
//           </div>

//           <div className="mb-6">
//             <label className="block text-gray-700 font-medium mb-2">
//               End Time
//             </label>
//             <input
//               type="datetime-local"
//               name="quizEndTime"
//               className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//               value={formData.quizEndTime}
//               onChange={handleDateTimeChange}
//             />
//           </div>

//           <div className="mb-6 flex items-center">
//             <input
//               type="checkbox"
//               id="isActive"
//               name="isActive"
//               className="mr-2 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
//               checked={formData.isActive}
//               onChange={handleChange}
//             />
//             <label htmlFor="isActive" className="text-gray-700">
//               Active Immediately
//             </label>
//           </div>

//           <div className="mb-6">
//             <label className="block text-gray-700 font-medium mb-2">
//               Points Per Question
//             </label>
//             <input
//               type="number"
//               name="defaultPointsPerQuestion"
//               min="1"
//               max="10"
//               className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//               value={formData.defaultPointsPerQuestion}
//               onChange={handleChange}
//             />
//           </div>

//           <button
//             type="submit"
//             className={`w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
//               loading ? 'opacity-70 cursor-not-allowed' : ''
//             }`}
//             disabled={loading || (creationMode === 'full' && totalQuestions === 0)}
//           >
//             {loading ? 'Creating...' : 'Create Quiz'}
//           </button>
//         </form>
//       </div>

//       {/* Instructions Section */}
//       <div className="md:w-1/3 bg-blue-50 p-6 rounded-lg">
//         <h2 className="text-xl font-bold mb-4 text-gray-800">Instructions</h2>
//         <ul className="space-y-3 text-gray-700">
//           <li className="flex items-start">
//             <span className="mr-2 text-blue-500">•</span>
//             <span>Title is required for all quizzes</span>
//           </li>
//           <li className="flex items-start">
//             <span className="mr-2 text-blue-500">•</span>
//             <span>Use the datetime picker for start/end times</span>
//           </li>
//           <li className="flex items-start">
//             <span className="mr-2 text-blue-500">•</span>
//             <span>Default points per question is 1</span>
//           </li>
//           {creationMode === 'full' && (
//             <>
//               <li className="flex items-start">
//                 <span className="mr-2 text-blue-500">•</span>
//                 <span>Select a category to filter questions</span>
//               </li>
//               <li className="flex items-start">
//                 <span className="mr-2 text-blue-500">•</span>
//                 <span>Number of questions cannot exceed available questions</span>
//               </li>
//             </>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default CreateQuiz;



// 77777



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
          axios.get('http://localhost:8080/question/category', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get('http://localhost:8080/question/allQuestion', {
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
        ? 'http://localhost:8080/quiz/create' 
        : 'http://localhost:8080/quiz/createUseTitle';

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








