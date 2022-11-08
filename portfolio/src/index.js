import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// import { helper } from './helper'

class Portfolio extends React.Component {
  constructor(props) {
    super(props);
    this.history = {}
  }
  shouldComponentUpdate() {
    console.log('3. shouldComponentUpdate - Before change Props/State')
    //! Must return true or false
    return true
    //* true: will re-render component
    //? return false
    //* false: not re-render component
  }
  componentDidUpdate() {
    console.log('4. componentDidUpdate - After Re-Render Done')
  }
  componentDidMount() {
    console.log('2. componentDidMount - Render Done')
  }
  render() {
    return (
      <div className="wrapper">
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Portfolio />);
