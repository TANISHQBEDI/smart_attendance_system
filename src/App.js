
import './App.css';
import Login from './components/Login'
import Home from './components/Home';
import StudentEnroll from './components/StudentEnroll';

import ErrorBoundary from './components/ErrorBoundary';

import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';





function App() {
  return (
    <ErrorBoundary>
        <div className="App">
          <div className="pageContainer">
            <Router>
              <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/newstudentenroll' element={<StudentEnroll/>}/>

              </Routes>
            </Router>
            {/* <Home></Home> */}
            {/* <Login></Login> */}
        
        </div>
    </div>
    </ErrorBoundary>
    
  );
}

export default App;
