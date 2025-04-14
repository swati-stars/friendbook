// frontend/src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to FriendBook!</h1>
      <p>Your personal college friend directory.</p>
      <p>Connect with your friends easily.</p>
      <div style={{ marginTop: '30px' }}>
        <Link to="/signup" style={{ marginRight: '10px', padding: '10px 20px', background: 'blue', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Sign Up Now</Link>
        <Link to="/login" style={{ padding: '10px 20px', background: 'grey', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Login</Link>
      </div>
      {/* Add some attractive images or graphics here later */}
       <img src="/path-to-your-attractive-image.jpg" alt="Friendship" style={{maxWidth: '80%', marginTop: '40px', borderRadius: '10px'}} />
    </div>
  );
};

export default HomePage;