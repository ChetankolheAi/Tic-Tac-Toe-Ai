import React from 'react'
import MainPage from './Components/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Pages/navbar'
import Footer from './Pages/footer'
import MultiplayerOnline from './MultiPlayerOnline/MultiPlayerOnline'
import HomeScreen from './HomeScreen/HomeScreen'
import { useSearchParams } from "react-router-dom";

// ✅ Wrapper Component
function FriendsWrapper() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");

  return <MainPage isVsComputer={mode === "computer"} />;
}

function App() {
  return (
    <Router>
      <div>
        <Navbar/>

        <Routes>
          <Route path="/" element={<HomeScreen />} />

          
          <Route path="/Friends" element={<FriendsWrapper />} />

          <Route path="/OnlineMultiPlayer" element={<MultiplayerOnline />}/>
        </Routes>

        <Footer/>
      </div>
    </Router>
  )
}

export default App;