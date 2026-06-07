import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthHeader from '../../components/AuthHeader';
import styles from '../Auth.module.css';

function AuthHero() {
  const navigate = useNavigate();
  return (
    <aside className={styles.hero}>
      <div className={styles.heroBrand}>
        <span className={styles.heroBrandMark}>F</span>
        <button type="button" className={styles.heroBrandName} onClick={() => navigate('/finbric')}>
          Finbric
        </button>
      </div>

      <div className={styles.heroCopy}>
        <p className={styles.heroEyebrow}>Community finance platform</p>
        <h1 className={styles.heroTitle}>Welcome back</h1>
        <p className={styles.heroText}>
          Sign in to continue managing groups, loans, and investments.
        </p>
      </div>

      {/* heroVisual removed to align with Finbric page (no image/illustration) */}
    </aside>
  );
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const successMessage = location.state?.message || '';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/finbric');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <AuthHeader styles={styles} />
      <div className={styles.backgroundOrbOne} />
      <div className={styles.backgroundOrbTwo} />

      <main className={styles.content}>
        <div className={styles.shell}>
          <AuthHero />

          <section className={styles.card}>
            <h2 className={styles.title}>Login</h2>
            <p className={styles.subtitle}>Access your Finbric account.</p>

            {successMessage && <p className={styles.success}>{successMessage}</p>}
            {error && <p className={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>
              <button type="submit" className={styles.primaryButton} disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className={styles.link}>
              <Link to="/forgot-password">Forgot password?</Link>
            </p>
            <p className={styles.link}>
              New to Finbric? <Link to="/register">Create account</Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
