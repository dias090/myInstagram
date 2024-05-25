import { Route, Routes } from 'react-router-dom'
import Sidebar from './components/sidebar/Sidebar'
import "./App.scss"
import Signin from './components/Signin/Signin'
import 'materialize-css/dist/css/materialize.min.css';
import Signup from './components/Signup/Signup';

function App() {

  return (
    <Routes>
      <Route path='/' element={ <Sidebar/> }/>
      <Route path='/login' element={ <Signin/> }/>
      <Route path='/signup' element={ <Signup/> }/>
    </Routes>
  )
}

export default App
