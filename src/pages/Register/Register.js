import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthHeader from '../../components/AuthHeader';
import styles from '../Auth.module.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.email, form.username, form.password);
      navigate('/login', {
        state: { message: 'Account created. Sign in to create or join a community group.' },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. User may already exist.');
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
          <aside className={styles.hero}>
            <div className={styles.heroBrand}>
              <span className={styles.heroBrandMark}>F</span>
              <button type="button" className={styles.heroBrandName} onClick={() => navigate('/finbric')}>
                Finbric
              </button>
            </div>

            <div className={styles.heroCopy}>
              <p className={styles.heroEyebrow}>Get started</p>
              <h1 className={styles.heroTitle}>Create account</h1>
              <p className={styles.heroText}>
                Build your community finance workspace in a few steps.
              </p>
            </div>

            {/* heroVisual removed to align with Finbric page (no image/illustration) */}
          </aside>

          <section className={styles.card}>
            <h2 className={styles.title}>Create account</h2>
            <p className={styles.subtitle}>Start your Finbric account.</p>

            {error && <p className={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
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
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  required
                />
              </div>
              <button type="submit" className={styles.primaryButton} disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p className={styles.link}>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
