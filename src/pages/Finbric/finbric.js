import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './finbric.module.css';

const navItems = ['NEWS', 'ABOUT US', 'LECTURES', 'CONTACTS'];

function FinbricHeader({ isLoggedIn, onLogin, onLogout }) {
  return (
    <header className={styles.header}>
      <Link to="/finbric" className={styles.brand}>
        <span className={styles.brandMark}>F</span>
        <span className={styles.brandCopy}>
          <span className={styles.brandName}>Finbric</span>
          <span className={styles.brandTagline}>Community finance platform</span>
        </span>
      </Link>

      <nav className={styles.nav} aria-label="Primary">
        {navItems.map((item, index) => (
          <button
            key={item}
            type="button"
            className={`${styles.navItem} ${index === 0 ? styles.navItemActive : ''}`}
          >
            {item}
          </button>
        ))}
      </nav>

      {isLoggedIn ? (
        <button type="button" className={styles.loginButton} onClick={onLogout}>
          LOG OUT
        </button>
      ) : (
        <div className={styles.headerActions}>
          <Link to="/register" className={styles.createAccountButton}>
            CREATE ACCOUNT
          </Link>
          <button type="button" className={styles.loginButton} onClick={() => onLogin('/login')}>
            LOG IN
          </button>
        </div>
      )}
    </header>
  );
}

function HeroArtwork() {
  return (
    <div className={styles.heroArt} aria-hidden="true">
      <div className={styles.heroOrbLarge} />
      <div className={styles.heroOrbSmall} />
      <div className={styles.heroRibbon} />
      <div className={styles.heroCore} />
    </div>
  );
}

function GuestLanding() {
  return (
    <main className={styles.guestMain}>
      <section className={styles.heroFrame}>
        <div className={styles.heroCopy}>
          <p className={styles.heroEyebrow}>Community finance platform</p>
          <h1 className={styles.heroTitle}>
            The
            {' '}
            <br />
            Finance
            {' '}
            <br />
            Platform
            {' '}
            <br />
            for
            {' '}
            <br />
            Community
          </h1>
          <p className={styles.heroText}>
            Keep group savings, loans, and investments in one clean Finbric workspace.
          </p>
        </div>

        <HeroArtwork />

        <div className={styles.heroNote}>
          <p className={styles.heroNoteLabel}>How it works</p>
          <p className={styles.heroNoteText}>
            Create a group, invite members, and manage shared balances from one place.
          </p>
        </div>
      </section>

      <section className={styles.featureRow} aria-label="Platform highlights">
        <article className={styles.featureCard}>
          <span className={styles.featureIcon}>01</span>
          <div>
            <h2 className={styles.featureTitle}>Groups</h2>
            <p className={styles.featureText}>Set up a community and track every member together.</p>
          </div>
        </article>
        <article className={styles.featureCard}>
          <span className={styles.featureIcon}>02</span>
          <div>
            <h2 className={styles.featureTitle}>Loans</h2>
            <p className={styles.featureText}>Issue and monitor repayments without clutter.</p>
          </div>
        </article>
        <article className={styles.featureCard}>
          <span className={styles.featureIcon}>03</span>
          <div>
            <h2 className={styles.featureTitle}>Investments</h2>
            <p className={styles.featureText}>Pool community funds and watch returns grow.</p>
          </div>
        </article>
      </section>

      <section className={styles.createAccountBanner} aria-label="Create account prompt">
        <div>
          <p className={styles.createAccountEyebrow}>Create account</p>
          <h2 className={styles.createAccountTitle}>Start a community finance workspace.</h2>
          <p className={styles.createAccountText}>
            Create your Finbric account to build groups, manage loans, and keep everything in one place.
          </p>
        </div>
        <Link to="/register" className={styles.createAccountCta}>
          CREATE ACCOUNT
        </Link>
      </section>
    </main>
  );
}

function SkeletonBlock({ className }) {
  return <div className={`${styles.skeleton} ${className || ''}`} aria-hidden="true" />;
}

function LoggedInShell() {
  return (
    <main className={styles.loggedMain}>
      {/* Plain white screen - no content */}
    </main>
  );
}

export default function Finbric() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(token);

  return (
    <div className={`${styles.page} ${isLoggedIn ? styles.pageLoggedIn : styles.pageGuest}`}>
      <FinbricHeader isLoggedIn={isLoggedIn} onLogin={navigate} onLogout={logout} />
      {isLoggedIn ? <LoggedInShell /> : <GuestLanding />}
    </div>
  );
}
