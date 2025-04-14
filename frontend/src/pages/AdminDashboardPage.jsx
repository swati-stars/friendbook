// frontend/src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://friendbook-dx9o.onrender.com';

const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState(''); // For success/error messages on actions
  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  // --- Fetch Users Effect ---
  useEffect(() => {
    const fetchUsers = async () => {
      setActionMessage(''); // Clear action message on reload
      setError(''); // Clear errors

      if (!userInfo || !userInfo.token || userInfo.role !== 'admin') {
        setError("Access Denied. Admins only.");
        setTimeout(() => navigate('/login'), 2000); // Redirect non-admins
        setLoading(false);
        return;
      }

      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const res = await axios.get(`${API_URL}/admin/users`, config);
        setUsers(res.data);

      } catch (err) {
        console.error("Fetch Users Error:", err.response || err.message);
         if (err.response?.status === 401 || err.response?.status === 403) {
             setError("Session expired or access denied. Please log in again.");
             localStorage.removeItem('userInfo');
             setTimeout(() => navigate('/login'), 2000);
        } else {
            setError(err.response?.data?.message || 'Failed to fetch users.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate, userInfo?.token]); // Re-run if navigate or token changes

  // --- Action Handlers ---
  const handleUpdateStatus = async (userId, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus} user ID: ${userId}?`)) return;
    setActionMessage('');
    setError('');
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                 Authorization: `Bearer ${userInfo.token}`
            },
        };
        const body = JSON.stringify({ status: newStatus });
        const res = await axios.put(`${API_URL}/admin/users/${userId}/status`, body, config);

        setActionMessage(res.data.message || `User status updated to ${newStatus}`);
        // Update the user list state locally
        setUsers(users.map(user => user._id === userId ? { ...user, status: newStatus } : user));

    } catch (err) {
        console.error("Update Status Error:", err.response || err.message);
        setActionMessage(`Error updating status: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
     if (!window.confirm(`Are you sure you want to DELETE user ID: ${userId}? This cannot be undone.`)) return;
     setActionMessage('');
     setError('');
     try {
         const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        };
         const res = await axios.delete(`${API_URL}/admin/users/${userId}`, config);
         setActionMessage(res.data.message || 'User deleted successfully.');
         // Remove the user from the list state
         setUsers(users.filter(user => user._id !== userId));

     } catch (err) {
         console.error("Delete User Error:", err.response || err.message);
        setActionMessage(`Error deleting user: ${err.response?.data?.message || err.message}`);
     }
  };

  // --- Render Logic ---
  if (loading) return <p>Loading admin dashboard...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>Error: {error}</p>;

  // Basic table styling
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
  const thStyle = { background: '#eee', border: '1px solid #ccc', padding: '8px', textAlign: 'left' };
  const tdStyle = { border: '1px solid #ccc', padding: '8px' };
  const buttonStyle = { margin: '0 5px', padding: '3px 8px', cursor: 'pointer', border: 'none', borderRadius: '4px', color: 'white' };


  return (
    <div>
      <h2>Admin Dashboard - Manage Users</h2>
      {actionMessage && <p style={{ color: actionMessage.startsWith('Error') ? 'red' : 'green', fontWeight: 'bold' }}>{actionMessage}</p>}

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Username</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Branch</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td style={tdStyle}>{user.name}</td>
                <td style={tdStyle}>{user.username}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>{user.branch}</td>
                <td style={{...tdStyle, color: user.status === 'accepted' ? 'green' : (user.status === 'rejected' ? 'red' : 'orange'), fontWeight: 'bold' }}>
                    {user.status}
                </td>
                <td style={tdStyle}>
                  {/* View: Could link to a detailed view page or open a modal */}
                   {/* <button style={{...buttonStyle, background: 'blue'}}>View</button> */}

                  {/* Accept/Reject only if Pending */}
                  {user.status === 'pending' && (
                      <>
                      <button onClick={() => handleUpdateStatus(user._id, 'accepted')} style={{...buttonStyle, background: 'green'}}>Accept</button>
                      <button onClick={() => handleUpdateStatus(user._id, 'rejected')} style={{...buttonStyle, background: 'orange'}}>Reject</button>
                      </>
                  )}
                   {/* Allow Rejecting an Accepted user? Or only Pending? Adjust logic if needed */}
                   {user.status === 'accepted' && (
                       <button onClick={() => handleUpdateStatus(user._id, 'rejected')} style={{...buttonStyle, background: 'orange'}}>Reject</button>
                   )}
                    {/* Allow re-Accepting a Rejected user? */}
                    {user.status === 'rejected' && (
                       <button onClick={() => handleUpdateStatus(user._id, 'accepted')} style={{...buttonStyle, background: 'green'}}>Accept</button>
                   )}

                  <button onClick={() => handleDeleteUser(user._id)} style={{...buttonStyle, background: 'red'}}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboardPage;
