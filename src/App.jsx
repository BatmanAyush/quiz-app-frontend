import Login from "./Login";
import { Routes, Route } from 'react-router-dom';
import TitleChoosing from "./quizCreation/titleChoosing";
import QuizQuestion from "./quizCreation/QuizCreator";
import Home from "./Home";
import TitleList from "./getQuiz/TitleList";
import HomePage from "./HomePage";
import OAuthLanding from "./OAuthLanding";
export default function App() {
  return (
    <div className="flex justify-center items-center h-full w-full">
     <Routes>
     <Route path="/home" element={<HomePage/>} />
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/list" element={<TitleList/>} />
        <Route path="/create" element={<TitleChoosing />} />
        <Route path="/oauth-success" element={<OAuthLanding/>} />
      </Routes>
      
    </div>
  )
}