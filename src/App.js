import React, { useEffect, useState } from 'react';
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://6874ce63dd06792b9c954fc7.mockapi.io/api/v1/users');
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const getTotalUsers = () => users.length;

  const getUsersWithAvatar = () => users.filter(user => user.avatar).length;

  const getUsersWithoutAvatar = () => users.filter(user => !user.avatar).length;

  const getUsersPerDay = () => {
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const usersOnDate = users.filter(user => {
        const userDate = new Date(user.createdAt).toISOString().split('T')[0];
        return userDate === dateStr;
      }).length;
      
      last30Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        users: usersOnDate
      });
    }
    
    return last30Days;
  };

  const getRecentUsers = () => {
    return users
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  };

  const getFilteredAndSortedUsers = () => {
    let filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortField === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else {
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const getPaginatedUsers = () => {
    const filtered = getFilteredAndSortedUsers();
    const startIndex = (currentPage - 1) * usersPerPage;
    return filtered.slice(startIndex, startIndex + usersPerPage);
  };

  const getTotalPages = () => {
    const filtered = getFilteredAndSortedUsers();
    return Math.ceil(filtered.length / usersPerPage);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const avatarData = [
    { name: 'With Avatar', value: getUsersWithAvatar() },
    { name: 'Without Avatar', value: getUsersWithoutAvatar() }
  ];

  const COLORS = ['#0088FE', '#FF8042'];

  return (
    <div className="app">
      <header className="header">
        <h1>User Dashboard</h1>
      </header>

      <nav className="tabs">
        <button
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </nav>

      {activeTab === 'dashboard' && (
        <div className="dashboard">
          <div className="kpi-card">
            <h2>Total Users</h2>
            <div className="kpi-number">{getTotalUsers()}</div>
          </div>

          <div className="charts-container">
            <div className="chart-card">
              <h3>Users Created Per Day (Last 30 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getUsersPerDay()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Avatar Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={avatarData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {avatarData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="recent-users">
            <h3>Recently Joined Users</h3>
            <div className="users-list">
              {getRecentUsers().map(user => (
                <div key={user.id} className="user-card">
                  <img
                    src={user.avatar || 'https://via.placeholder.com/50'}
                    alt={user.name}
                    className="user-avatar"
                  />
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-date">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-section">
          <div className="controls">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <table className="users-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th onClick={() => handleSort('name')} className="sortable">
                  Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Email</th>
                <th onClick={() => handleSort('createdAt')} className="sortable">
                  Created Date {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {getPaginatedUsers().map(user => (
                <tr key={user.id} onClick={() => handleUserClick(user)} className="user-row">
                  <td>
                    <img
                      src={user.avatar || 'https://via.placeholder.com/40'}
                      alt={user.name}
                      className="table-avatar"
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-btn"
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {getTotalPages()}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === getTotalPages()}
              className="page-btn"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button onClick={closeModal} className="close-btn">×</button>
            </div>
            <div className="modal-content">
              <img
                src={selectedUser.avatar || 'https://via.placeholder.com/100'}
                alt={selectedUser.name}
                className="modal-avatar"
              />
              <div className="user-details">
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Created:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
                {selectedUser.avatar && <p><strong>Has Avatar:</strong> Yes</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
