import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton,useUser } from '@clerk/clerk-react'
import { Navigate, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import ProblemsPage from './pages/ProblemsPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProblemPage from './pages/ProblemPage.jsx';
import { Toaster } from 'react-hot-toast';

function App() {

  const {isSignedIn,isLoaded} = useUser();
   // this will get rid of the flickering effect
  if (!isLoaded) return null;
  return (
    <>
    <Routes>
   <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
    <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />

        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
         <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />

    </Routes>
    <Toaster toastOptions={{duration:3000}}/>
    </>
  )
}

export default App
