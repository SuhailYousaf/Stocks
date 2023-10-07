
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import Home from './Pages/Home';
import Navbar from './Components/Navbar/Navbar';
function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <div className="App">
    <ToastContainer/>
      <Routes>
      <Route path="/" element={<Home />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
