import { Route, Navigate, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepage/Homepage';
import ClientPage from './pages/ClientPage/ClientPage';
import NotFound from './components/NotFound/NotFound';

const App = () => {
  return(
    <div className="App">
      <h1>Commercials</h1>
      <Routes>
        <Route path='/' element={<Navigate to='/clients'/>}/>
        <Route path='/clients' element={<Homepage />}/>
        <Route path='/clients/:id' element={<ClientPage />}/>
        <Route path='*' element={<NotFound />}/>
      </Routes>
    </div>
  )
}

export default App;
