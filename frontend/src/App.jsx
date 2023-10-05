import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './router/Routing';

function App() {
  

  return (
    <Router>
    <div>
     
      <Routes/>

    </div>
    </Router>
    
    
      
  )
}

export default App
