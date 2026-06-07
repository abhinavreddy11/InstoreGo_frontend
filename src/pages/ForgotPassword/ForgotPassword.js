import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import AuthHeader from '../../components/AuthHeader';
import styles from './ForgotPassword.module.css';

const initialFormState = {
  username: '',
  otpCode: '',
  newPassword: '',
  confirmPassword: '',
};

function getErrorMessage(error, fallbackMessage) {
  if (typeof error.response?.data === 'string') {
    return error.response.data;
  }

  return error.response?.data?.message || fallbackMessage;
}

function maskUsername(username) {
  const value = username.trim();
  if (value.length <= 4) {
    return value;
  }

  return `${value.slice(0, 2)}${'*'.repeat(Math.max(2, value.length - 4))}${value.slice(-2)}`;
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState('request');
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  const username = form.username.trim();

  const updateField = (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  };

  const requestOtp = async () => {
    if (!username) {
      setError('Username is required to request an OTP.');
      setSuccess('');
      return false;
    }

    setError('');
    setSuccess('');
    setRequestingOtp(true);

    try {
      const response = await api.post('/forgot-password', {
        username,
      });

      setStep('reset');
      setSuccess(response.data || 'OTP has been successfully sent.');
      setForm((currentForm) => ({
        ...currentForm,
        otpCode: '',
        newPassword: '',
        confirmPassword: '',
      }));
      return true;
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to send OTP. Please try again.'));
      return false;
    } finally {
      setRequestingOtp(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (step === 'request') {
      await requestOtp();
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.');
      setSuccess('');
      return;
    }

    setError('');
    setSuccess('');
    setResettingPassword(true);

    try {
      const payload = {
        username,
        otpCode: form.otpCode.trim(),
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      };

      const response = await api.post('/reset-password', payload);
      navigate('/login', {
        replace: true,
        state: {
          message: response.data || 'Password reset successfully.',
        },
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Password reset failed. Please try again.'));
    } finally {
      setResettingPassword(false);
    }
  };

  const handleBackToUsername = () => {
    setStep('request');
    setError('');
    setSuccess('');
    setForm((currentForm) => ({
      ...currentForm,
      otpCode: '',
      newPassword: '',
      confirmPassword: '',
    }));
  };

  const handleResendOtp = async () => {
    await requestOtp();
  };

  const isRequestStep = step === 'request';
  const isBusy = requestingOtp || resettingPassword;

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
              <p className={styles.heroEyebrow}>Account recovery</p>
              <h1 className={styles.heroTitle}>Reset password</h1>
              <p className={styles.heroText}>
                Recover access to your Finbric account securely.
              </p>
            </div>

            {/* heroVisual removed to align with Finbric page (no image/illustration) */}
          </aside>

          <section className={styles.card}>
            <div className={styles.stepper} aria-label="Forgot password steps">
              <span className={`${styles.stepDot} ${isRequestStep ? styles.stepDotActive : styles.stepDotComplete}`}>1</span>
              <span className={styles.stepLine} />
              <span className={`${styles.stepDot} ${!isRequestStep ? styles.stepDotActive : ''}`}>2</span>
            </div>

            <div className={styles.headerBlock}>
              <h2 className={styles.title}>{isRequestStep ? 'Forgot password' : 'Reset password'}</h2>
              {isRequestStep && (
                <p className={styles.helper}>Enter your username to receive a one-time password.</p>
              )}
            </div>

            {error && (
              <div className={styles.messageError} role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className={styles.messageSuccess} role="status">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              {isRequestStep ? (
                <div className={styles.field}>
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={updateField}
                    placeholder="Enter your username"
                    autoComplete="username"
                    required
                  />
                </div>
              ) : (
                <>
                  <div className={styles.field}>
                    <label htmlFor="usernameLocked">Username</label>
                    <input id="usernameLocked" type="text" value={username} disabled />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="otpCode">OTP Code</label>
                    <input
                      id="otpCode"
                      name="otpCode"
                      type="text"
                      value={form.otpCode}
                      onChange={updateField}
                      placeholder="Enter 6-digit OTP"
                      inputMode="numeric"
                      maxLength={6}
                      autoComplete="one-time-code"
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={form.newPassword}
                      onChange={updateField}
                      placeholder="Enter a new password"
                      autoComplete="new-password"
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={updateField}
                      placeholder="Confirm the new password"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </>
              )}

              <div className={styles.actions}>
                {isRequestStep ? (
                  <button type="submit" className={styles.primaryButton} disabled={isBusy}>
                    {requestingOtp ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                ) : (
                  <>
                    {/* Change username button removed per request */}
                    <button type="submit" className={styles.primaryButton} disabled={isBusy}>
                      {resettingPassword ? 'Resetting password...' : 'Reset password'}
                    </button>
                  </>
                )}
              </div>

              {!isRequestStep && (
                <button
                  type="button"
                  className={styles.textButton}
                  onClick={handleResendOtp}
                  disabled={isBusy}
                >
                  Resend OTP
                </button>
              )}
            </form>

            <p className={styles.footerLink}>
              Remembered your password? <Link to="/login">Login</Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
