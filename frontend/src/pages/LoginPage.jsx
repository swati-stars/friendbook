// frontend/src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://friendbook-dx9o.onrender.com';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const { username, password } = formData;

   // Redirect if already logged in
   useEffect(() => {
    if (localStorage.getItem('userInfo')) {
      navigate('/profile'); // Or based on role
    }
  }, [navigate]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  }


  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    if (!username || !password) {
        setError("Please enter username and password.");
        return;
    }

    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const body = JSON.stringify({ username, password });
      const res = await axios.post(`${API_URL}/auth/login`, body, config);

      // Login successful, save user info (including token) to local storage
      localStorage.setItem('userInfo', JSON.stringify(res.data));

      // Redirect based on role
      if (res.data.role === 'admin') {
        navigate('/admin'); // Redirect admin to admin dashboard
      } else {
         // Redirect user to profile page or intended page
         const from = location.state?.from?.pathname || "/profile"; // Redirect to previous page or profile
         navigate(from);
      }
       window.location.reload(); // Force reload to update Navbar etc.


    } catch (err) {
      console.error("Login Error:", err.response || err.message);
      setError(err.response?.data?.message || 'Login failed. Check credentials or account status.');
    }
  };

  // Basic form styling
  const inputStyle = { display: 'block', margin: '10px 0', padding: '8px', width: '300px' };
  const labelStyle = { fontWeight: 'bold' };

  return (
    <div style={{ maxWidth: '400px', margin: '30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label style={labelStyle}>Username:</label>
          <input type="text" name="username" value={username} onChange={onChange} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Password:</label>
          <input type="password" name="password" value={password} onChange={onChange} required style={inputStyle} />
        </div>
        <button type="submit" style={{ padding: '10px 20px', background: 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Login</button>
      </form>
       <p style={{marginTop: '15px'}}>Don't have an account? <a href="/signup">Sign Up</a></p>
    </div>
  );
};

export default LoginPage;
