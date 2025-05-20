import { useState } from 'react'
import './App.css'
import HomePage from './components/HomePage'
import { Navbar } from './components/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import AllQuestions from './components/AllQuestions';
import Createquiz from './components/Createquiz';
import GetQuiz from './components/GetQuiz';
import AddQuestion from './components/AddQuestion';
import StartQuiz from './components/StartQuiz';
import QuizTest from './components/QuizTest';
import Result from './components/Result'

function App() {


  return (
    <>
      {/* {showNavbar && <Navbar />} */}
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/questions" element={<AllQuestions />} />
        <Route path="/createquiz" element={<Createquiz />} />
        <Route path="/quizzes" element={<GetQuiz />} />
        <Route path="/add-question" element={<AddQuestion/>} />
        <Route path="/quiz/:id" element={<StartQuiz />} />
        <Route path="/quiz/:id/start" element={<QuizTest />} />
        <Route path="/quiz/result/:id" element={<Result />} />



      </Routes>
    </>
  )
}

export default App