import { useState, useEffect, useRef } from 'react'
import styles from './App.module.css'

const NAV_LINKS = ['Features', 'About', 'Pricing', 'Contact']

const FEATURES = [
  {
    number: '01',
    title: 'Thoughtfully Designed',
    desc: 'Every pixel crafted with intention. We obsess over the details so you never have to.',
  },
  {
    number: '02',
    title: 'Blazing Fast',
    desc: 'Built on cutting-edge infrastructure. Your experience is instant, reliable, and smooth.',
  },
  {
    number: '03',
    title: 'Endlessly Flexible',
    desc: 'Adapt to any workflow, any team, any vision. The platform bends to your will.',
  },
]

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className={styles.root}>
      {/* Nav */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navLogo}>LUMINA</div>
        <ul className={styles.navLinks}>
          {NAV_LINKS.map(l => (
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
        </ul>
        <button className={styles.navCta}>Get Started</button>
      </nav>

      {/* Hero */}
      <section className={`${styles.hero} ${visible ? styles.heroVisible : ''}`} ref={heroRef}>
        <div className={styles.heroOrb} />
        <div className={styles.heroOrb2} />
        <span className={styles.heroEyebrow}>Welcome to the future</span>
        <h1 className={styles.heroTitle}>
          <span>Where ideas</span>
          <em> come alive.</em>
        </h1>
        <p className={styles.heroSub}>
          A platform built for creators, dreamers, and builders.<br />
          Start your journey today — no credit card required.
        </p>
        <div className={styles.heroCtas}>
          <button className={styles.btnPrimary}>Begin Your Story</button>
          <button className={styles.btnGhost}>Watch Demo ↗</button>
        </div>
        <div className={styles.heroScroll}>
          <span />
        </div>
      </section>

      {/* Marquee */}
      <div className={styles.marqueeWrap}>
        <div className={styles.marquee}>
          {['Design', 'Build', 'Create', 'Launch', 'Inspire', 'Grow', 'Dream', 'Ship'].map((w, i) => (
            <span key={i}>{w} <em>·</em> </span>
          ))}
          {['Design', 'Build', 'Create', 'Launch', 'Inspire', 'Grow', 'Dream', 'Ship'].map((w, i) => (
            <span key={`b${i}`}>{w} <em>·</em> </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className={styles.features} id="features">
        <div className={styles.featuresHeader}>
          <p className={styles.sectionLabel}>What we offer</p>
          <h2 className={styles.sectionTitle}>Built different,<br />by design.</h2>
        </div>
        <div className={styles.featureGrid}>
          {FEATURES.map(f => (
            <div className={styles.featureCard} key={f.number}>
              <span className={styles.featureNum}>{f.number}</span>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Band */}
      <section className={styles.ctaBand}>
        <div className={styles.ctaBandInner}>
          <h2>Ready to begin?</h2>
          <p>Join thousands of teams already building with Lumina.</p>
          <button className={styles.btnPrimaryDark}>Get Started Free</button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <span className={styles.footerLogo}>LUMINA</span>
        <p>© {new Date().getFullYear()} Lumina Inc. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  )
}
