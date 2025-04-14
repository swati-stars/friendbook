// frontend/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  let userInfo = null; // Default to null (logged out)

  try {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      userInfo = JSON.parse(storedUserInfo); // Attempt to parse only if data exists
    }
  } catch (error) {
    // If parsing fails, log the error and remove the invalid item
    console.error("Failed to parse userInfo from localStorage:", error);
    localStorage.removeItem('userInfo');
    // userInfo remains null, so user appears logged out
  }

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
    window.location.reload();
  };

  return (
    // The rest of your return statement with inline styles remains the same...
    <nav style={{ background: '#333', padding: '10px 20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5em' }}>FriendBook</Link>
      <div>
        {userInfo ? ( // Check the potentially updated userInfo variable
          <>
            {userInfo.role === 'admin' && (
              <Link to="/admin" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Admin Dashboard</Link>
            )}
            <Link to="/profile" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>My Profile</Link>
            {/* Added a check for userInfo.username before displaying it */}
            <button onClick={logoutHandler} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
              Logout {userInfo.username ? `(${userInfo.username})` : ''}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Login</Link>
            <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
