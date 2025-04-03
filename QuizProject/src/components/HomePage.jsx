import React from 'react';
import { PlusSquare, Search, List, Play, ArrowRight } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const HomePage = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();

  const handleProtectedAction = (path) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      toast.error('Please log in or register your account', {
        position: 'top-center',
        duration: 4000,
      });
      return false;
    }
    return true;
  };

  const features = [
    {
      icon: <Search className="h-8 w-8 text-blue-500" />,
      title: "Browse Questions",
      description: "Explore our collection of questions across various categories and difficulty levels.",
      action: "View Questions",
      link: "/questions",
      protected: false
    },
    {
      icon: <PlusSquare className="h-8 w-8 text-blue-500" />,
      title: "Add Questions",
      description: "Contribute to our question bank by adding your own challenging questions.",
      action: "Add Question",
      link: "/add-question",
      protected: true
    },
    {
      icon: <List className="h-8 w-8 text-blue-500" />,
      title: "Create Quizzes",
      description: "Design custom quizzes by selecting categories and number of questions.",
      action: "Create Quiz",
      link: "/createquiz",
      protected: true
    },
    {
      icon: <Play className="h-8 w-8 text-blue-500" />,
      title: "Take Quizzes",
      description: "Test your knowledge by taking quizzes and tracking your performance.",
      action: "Start Quiz",
      link: "/quizzes",
      protected: false
    }
    
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            Create and Take Beautiful Quizzes
          </h1>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button
              onClick={() => handleProtectedAction('/createquiz') && navigate('/createquiz')}
              className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <PlusSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Create a Quiz
            </button>
            <button
              onClick={() => handleProtectedAction('/questions') && navigate('/questions')}
              className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm sm:text-base"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Browse Questions
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
              Everything You Need
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
              >
                <div className="mb-3 sm:mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base flex-grow">{feature.description}</p>
                <button
                  onClick={() => handleProtectedAction(feature.link) && navigate(feature.link)}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
                >
                  {feature.action}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile-Specific Enhancements */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-10">
          <button
            onClick={() => handleProtectedAction('/createquiz') && navigate('/createquiz')}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
          >
            <PlusSquare className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;