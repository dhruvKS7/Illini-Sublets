import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './js/Login.tsx';
import Register from './js/Register.tsx';
import Search from './js/Search.tsx';
import Landing from './js/Landing.tsx';
import EditListing from './js/EditListing.tsx';
import Contacted from './js/Contacted.tsx';
import Profile from './js/Profile.tsx';

function App() {
  return (
    <div className="App">
       <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/search" element={<Search/>}/>
          <Route path="/editListing" element={<EditListing/>}/>
          <Route path="/contacted" element={<Contacted/>}/>
          <Route path="/profile" element={<Profile/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;