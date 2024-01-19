
import './App.css';
import Login from './components/Login'
import Home from './components/Home';
import StudentEnroll from './components/StudentEnroll';

import ErrorBoundary from './components/ErrorBoundary';

import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';






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
