// frontend/src/pages/SignupPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Use the VITE_ prefix for environment variables in Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'; // Your backend URL

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    branch: '',
    address: '',
    email: '',
    mobile: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { name, username, branch, address, email, mobile, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear messages on new input
    setMessage('');
    setError('');
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setMessage(''); // Clear previous messages

    // Basic validation (add more robust validation later)
    if (!name || !username || !branch || !address || !email || !mobile || !password) {
        setError("Please fill in all fields.");
        return;
    }
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }

    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const body = JSON.stringify(formData);
      const res = await axios.post(`${API_URL}/auth/signup`, body, config);

      setMessage(res.data.message || 'Signup successful! Account pending approval.'); // Show success message
      // Optionally clear form or redirect after a delay
       setTimeout(() => {
           navigate('/login'); // Redirect to login page after signup
       }, 3000); // Wait 3 seconds


    } catch (err) {
       console.error("Signup Error:", err.response || err.message);
       // Set error message from backend response if available, otherwise generic message
       setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  // Basic form styling (replace with CSS classes later)
  const inputStyle = { display: 'block', margin: '10px 0', padding: '8px', width: '300px' };
  const labelStyle = { fontWeight: 'bold' };

  return (
    <div style={{ maxWidth: '400px', margin: '30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Sign Up</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label style={labelStyle}>Name:</label>
          <input type="text" name="name" value={name} onChange={onChange} required style={inputStyle} />
        </div>
         <div>
          <label style={labelStyle}>Username:</label>
          <input type="text" name="username" value={username} onChange={onChange} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Branch:</label>
          <input type="text" name="branch" value={branch} onChange={onChange} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Address:</label>
          <input type="text" name="address" value={address} onChange={onChange} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Email:</label>
          <input type="email" name="email" value={email} onChange={onChange} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Mobile No:</label>
          <input type="tel" name="mobile" value={mobile} onChange={onChange} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Password:</label>
          <input type="password" name="password" value={password} onChange={onChange} required minLength="6" style={inputStyle}/>
        </div>
        <button type="submit" style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;