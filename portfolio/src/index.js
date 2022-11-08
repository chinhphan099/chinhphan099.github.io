import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import myData from './data.json'

export default function Portfolio() {
  return (
    <div className="wrapper">
      <header>
        <h1>Hi, My name is {myData.name}</h1>
        <p>{myData.position}</p>
        <img src={myData.avt} />
      </header>
    </div>
  );
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Portfolio />);
