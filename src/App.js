
import './App.css';
import Login from './components/Login'
import Home from './components/Home';
import StudentEnroll from './components/StudentEnroll';
import Attendance from "./components/Attendance"

import ErrorBoundary from './components/ErrorBoundary';

import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import StudentDropdown from './components/SubjectDropdown';
import AdminPortal from './components/AdminPortal';


function App() {
  return (
    <ErrorBoundary>
        <div className="App">
          <div className="pageContainer">
            <Header/>
            <div className='bodyContainer'>
              <Router>
                <Routes>
                  <Route path='/' element={<Home/>}/>
                  <Route path='/login' element={<Login/>}/>
                  <Route path='/newstudentenroll' element={<StudentEnroll/>}/>
                  <Route path='/adminportal' element={<AdminPortal/>}/>
                  <Route path='/attendance' element={<StudentDropdown />}/>

                </Routes>
              </Router>
            </div>
            
            <Footer></Footer>
            {/* <Home></Home> */}
            {/* <Login></Login> */}
        
        </div>
    </div>
    </ErrorBoundary>
    
  );
}

export default App;
