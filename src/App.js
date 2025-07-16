import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:5000/api';

function App() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [pointsClaimed, setPointsClaimed] = useState(null);
    const [nameInput, setNameInput] = useState('');
    const [history, setHistory] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API}/users`);
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`${API}/history`);
            setHistory(res.data);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchHistory();
    }, []);

    const handleClaim = async () => {
        if (!selectedUser) return;
        try {
            const res = await axios.post(`${API}/claim/${selectedUser}`);
            setPointsClaimed(res.data.points);
            fetchUsers();
            fetchHistory();
        } catch (error) {
            console.error('Error claiming points:', error);
        }
    };

    const handleAddUser = async () => {
        if (!nameInput.trim()) return;
        try {
            await axios.post(`${API}/users`, { name: nameInput.trim() });
            setNameInput('');
            fetchUsers();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    return (
        <div className="container">
            <h1>🏆 Leaderboard</h1>
            <div className="controls">
                <select onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser}>
                    <option value="">Select User</option>
                    {users.map(user => (
                        <option key={user._id} value={user._id}>{user.name}</option>
                    ))}
                </select>
                <button onClick={handleClaim}>Claim Points</button>
                <input
                    placeholder="Add new user"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                />
                <button onClick={handleAddUser}>Add</button>
            </div>
            {pointsClaimed && <p className="success-message">🎉 Claimed {pointsClaimed} Points!</p>}
            
            <h2>Leaderboard</h2>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Total Points</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.rank}</td>
                            <td>{user.name}</td>
                            <td>{user.totalPoints}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <h2>Claim History</h2>
            <ul className="history">
                {history.map(h => (
                    <li key={h._id}>
                        {h.userId ? h.userId.name : 'Unknown User'} claimed {h.points} points at {new Date(h.timestamp).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
