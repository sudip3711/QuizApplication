
import React, { useState } from 'react';
import { 
  BookOpen, Home, PlusSquare, List, 
  LogIn, LogOut, UserPlus, Menu, X 
} from 'lucide-react';
import { authService } from '../services/authService';
import { AuthModal } from './AuthModal';
import { NavLink, useLocation } from 'react-router-dom';

export function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState(authService.getCurrentUser());
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsMobileMenuOpen(false);
  };

  const handleAuthSuccess = () => {
    setUser(authService.getCurrentUser());
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-800 hidden sm:block">Quiz App</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-1">
              <NavLink 
                to="/" 
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                }`}
              >
                <Home className={`h-5 w-5 mr-2 ${isActive('/') ? 'text-blue-600' : 'text-gray-500'}`} />
                Home
              </NavLink>
              
              {user && (
                <>
                  <NavLink 
                    to="/createquiz" 
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/createquiz') 
                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                    }`}
                  >
                    <PlusSquare className={`h-5 w-5 mr-2 ${isActive('/createquiz') ? 'text-blue-600' : 'text-gray-500'}`} />
                    Create Quiz
                  </NavLink>
                  
                  <NavLink 
                    to="/quizzes" 
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/quizzes') 
                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                    }`}
                  >
                    <List className={`h-5 w-5 mr-2 ${isActive('/quizzes') ? 'text-blue-600' : 'text-gray-500'}`} />
                    Get Quiz
                  </NavLink>

                  <NavLink 
                    to="/questions" 
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/questions') 
                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                    }`}
                  >
                    <List className={`h-5 w-5 mr-2 ${isActive('/questions') ? 'text-blue-600' : 'text-gray-500'}`} />
                    Questions
                  </NavLink>
                  
                </>
              )}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {user ? (
              <>
                <span className="hidden md:block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setModalMode('login');
                    setIsModalOpen(true);
                  }}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    modalMode === 'login' && isModalOpen
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                  }`}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Login
                </button>
                <button
                  onClick={() => {
                    setModalMode('register');
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
          <NavLink
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/')
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100 hover:text-blue-500'
            }`}
          >
            <div className="flex items-center">
              <Home className={`h-5 w-5 mr-3 ${isActive('/') ? 'text-blue-600' : 'text-gray-500'}`} />
              Home
            </div>
          </NavLink>

          {user && (
            <>
              <NavLink
                to="/createquiz"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/create-quiz')
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-blue-500'
                }`}
              >
                <div className="flex items-center">
                  <PlusSquare className={`h-5 w-5 mr-3 ${isActive('/createquiz') ? 'text-blue-600' : 'text-gray-500'}`} />
                  Create Quiz
                </div>
              </NavLink>

              <NavLink
                to="/quizzes"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/quizzes')
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-blue-500'
                }`}
              >
                <div className="flex items-center">
                  <List className={`h-5 w-5 mr-3 ${isActive('/quizzes') ? 'text-blue-600' : 'text-gray-500'}`} />
                  Get Quiz
                </div>
              </NavLink>

              <NavLink
                to="/questions"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/questions')
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-blue-500'
                }`}
              >
                <div className="flex items-center">
                  <List className={`h-5 w-5 mr-3 ${isActive('/questions') ? 'text-blue-600' : 'text-gray-500'}`} />
                  Questions
                </div>
              </NavLink>
            </>
          )}

          {user ? (
            <>
              <div className="block px-3 py-2 text-gray-600 text-base font-medium">
                <div className="flex items-center">
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">
                    {user.username}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-red-500"
              >
                <div className="flex items-center">
                  <LogOut className="h-5 w-5 mr-3 text-gray-500" />
                  Logout
                </div>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setModalMode('login');
                  setIsModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  modalMode === 'login' && isModalOpen
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-blue-500'
                }`}
              >
                <div className="flex items-center">
                  <LogIn className="h-5 w-5 mr-3 text-gray-500" />
                  Login
                </div>
              </button>
              <button
                onClick={() => {
                  setModalMode('register');
                  setIsModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-blue-500 text-white hover:bg-blue-600"
              >
                <div className="flex items-center">
                  <UserPlus className="h-5 w-5 mr-3" />
                  Register
                </div>
              </button>
            </>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAuthSuccess}
        mode={modalMode}
      />
    </nav>
  );
}