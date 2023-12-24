// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import React from 'react';
import './stylesheets/index.css';
import FakeStackOverflow from './components/fakestackoverflow.js'

function App(){


  return (
    <section className="fakeso">
      <FakeStackOverflow />
    </section>
  );
}


export default App;