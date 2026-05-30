import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [welcome, setWelcome] = useState('');
  const [students, setStudents] = useState('');
  const [loadingWelcome, setLoadingWelcome] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const fetchWelcome = async () => {
    setLoadingWelcome(true);
    try {
      const res = await api.get('/');
      setWelcome(res.data);
    } catch {
      setWelcome('Error fetching welcome message');
    } finally {
      setLoadingWelcome(false);
    }
  };

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const res = await api.get('/student');
      setStudents(res.data);
    } catch {
      setStudents('Error fetching students');
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </header>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Welcome Endpoint <code>GET /</code></h3>
          <button onClick={fetchWelcome} disabled={loadingWelcome}>
            {loadingWelcome ? 'Loading...' : 'Call Endpoint'}
          </button>
          {welcome && <p className={styles.result}>{welcome}</p>}
        </div>

        <div className={styles.card}>
          <h3>Students Endpoint <code>GET /student</code></h3>
          <button onClick={fetchStudents} disabled={loadingStudents}>
            {loadingStudents ? 'Loading...' : 'Call Endpoint'}
          </button>
          {students && <p className={styles.result}>{students}</p>}
        </div>
      </div>
    </div>
  );
}
