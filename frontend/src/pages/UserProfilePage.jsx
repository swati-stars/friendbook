// frontend/src/pages/UserProfilePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://friendbook-dx9o.onrender.com';

const UserProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setError(''); // Clear previous errors
      const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

      if (!userInfo || !userInfo.token) {
        navigate('/login'); // Redirect to login if no token
        return;
      }

       // Check if user role is actually 'user' (optional, depends on if admin can see this)
      // if (userInfo.role !== 'user') {
      //    navigate('/'); // Redirect non-users away?
      //    return;
      // }


      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`, // Send token in header
          },
        };

        const res = await axios.get(`${API_URL}/users/profile`, config);
        setUserData(res.data);

      } catch (err) {
        console.error("Profile Fetch Error:", err.response || err.message);
        // Handle specific errors like token expiry or user status change
        if (err.response?.status === 401 || err.response?.status === 403) {
             setError("Session expired or access denied. Please log in again.");
             localStorage.removeItem('userInfo'); // Clear invalid token
             // Redirect after a delay
             setTimeout(() => navigate('/login'), 2000);
        } else {
            setError(err.response?.data?.message || 'Failed to fetch profile data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]); // Rerun effect if navigate changes

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!userData) return <p>No profile data found.</p>; // Should ideally be handled by error state

  // Basic display styling
  const detailStyle = { marginBottom: '10px' };
  const labelStyle = { fontWeight: 'bold', marginRight: '10px'};

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: '#f9f9f9' }}>
      <h2>My Profile</h2>
       <p style={{color: 'green', fontStyle: 'italic'}}>Status: {userData.status}</p>
      <div style={detailStyle}>
        <span style={labelStyle}>Name:</span> {userData.name}
      </div>
      <div style={detailStyle}>
        <span style={labelStyle}>Username:</span> {userData.username}
      </div>
      <div style={detailStyle}>
        <span style={labelStyle}>Branch:</span> {userData.branch}
      </div>
      <div style={detailStyle}>
        <span style={labelStyle}>Address:</span> {userData.address}
      </div>
      <div style={detailStyle}>
        <span style={labelStyle}>Email:</span> {userData.email}
      </div>
      <div style={detailStyle}>
        <span style={labelStyle}>Mobile:</span> {userData.mobile}
      </div>
       <div style={detailStyle}>
        <span style={labelStyle}>Joined:</span> {new Date(userData.createdAt).toLocaleDateString()}
      </div>
      {/* Add edit profile button later maybe */}
    </div>
  );
};

export default UserProfilePage;
