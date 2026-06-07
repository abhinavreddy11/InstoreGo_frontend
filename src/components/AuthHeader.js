import { Link, useNavigate } from 'react-router-dom';

export default function AuthHeader({
  styles,
  primaryTo = '/register',
  primaryLabel = 'CREATE ACCOUNT',
  secondaryTo = '/login',
  secondaryLabel = 'LOG IN',
}) {
  const navigate = useNavigate();
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>F</span>
          <div>
            {/* Use a button for the brand name so it appears and behaves as a clickable control */}
            <button
              type="button"
              className={styles.brandName}
              onClick={() => navigate('/finbric')}
            >
              Finbric
            </button>
          </div>
        </div>
      </div>

      <div className={styles.headerActions}>
        <Link to={primaryTo} className={styles.createAccountButton || styles.signUpBtn}>
          {primaryLabel}
        </Link>
        <Link to={secondaryTo} className={styles.loginBtn}>
          {secondaryLabel}
        </Link>
      </div>
    </header>
  );
}
