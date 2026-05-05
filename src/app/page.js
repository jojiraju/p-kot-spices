'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ChevronRight } from 'lucide-react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, ContactShadows } from '@react-three/drei';
import Link from 'next/link';
import styles from './page.module.css';

// ------------------------------------------------
// The Cinematic Spice Collection
// ------------------------------------------------
const SpiceCollection = ({ spiceRef, onReady }) => {
  useEffect(() => {
    if (onReady) onReady();
  }, [onReady]);

  // Procedurally perfect Star Anise shape
  const aniseShape = useMemo(() => {
    const s = new THREE.Shape();
    const points = 8;
    for (let i = 0; i < points * 2; i++) {
      const angle = (i / (points * 2)) * Math.PI * 2;
      const r = i % 2 === 0 ? 1.4 : 0.35; // Outer and inner points
      if (i === 0) s.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
      else s.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    return s;
  }, []);

  return (
    <group ref={spiceRef}>
      
      {/* 1. Centerpiece: Star Anise */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5} position={[0, 0, 0]}>
        <mesh rotation={[0.4, 0, 0]}>
          <extrudeGeometry args={[aniseShape, { depth: 0.3, bevelEnabled: true, bevelSegments: 32, steps: 1, bevelSize: 0.15, bevelThickness: 0.15 }]} />
          <meshPhysicalMaterial 
            color="#4a2110" 
            roughness={0.7} 
            metalness={0.1} 
            clearcoat={0.3} 
            clearcoatRoughness={0.2} 
            envMapIntensity={1.5} 
          />
        </mesh>
      </Float>

      {/* 2. Left Foreground: Cinnamon Stick */}
      <Float speed={2.5} rotationIntensity={1} floatIntensity={0.6} position={[-2.2, -1, 1]}>
        <mesh rotation={[0.8, 0.5, -0.5]}>
          <cylinderGeometry args={[0.25, 0.25, 2.5, 32]} />
          <meshPhysicalMaterial color="#8b5a2b" roughness={0.8} metalness={0.05} envMapIntensity={1} />
        </mesh>
      </Float>

      {/* 3. Right Background: Cinnamon Stick */}
      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={0.4} position={[1.8, 1.2, -1]}>
        <mesh rotation={[-0.5, 0.2, 0.8]}>
          <cylinderGeometry args={[0.18, 0.18, 2, 32]} />
          <meshPhysicalMaterial color="#7a4b22" roughness={0.85} metalness={0.05} envMapIntensity={1} />
        </mesh>
      </Float>

      {/* 4. Right Foreground: Cardamom Pod (Green, glossy, football shape) */}
      <Float speed={3} rotationIntensity={1.5} floatIntensity={0.8} position={[1.8, -1.5, 1.5]}>
        <mesh rotation={[0.4, 0, 0.5]} scale={[0.4, 0.7, 0.4]}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshPhysicalMaterial 
            color="#556b2f" 
            roughness={0.3} 
            clearcoat={0.8} 
            clearcoatRoughness={0.2} 
            envMapIntensity={2} 
          />
        </mesh>
      </Float>

      {/* 5. Left Background: Small Black Peppercorn */}
      <Float speed={2.2} rotationIntensity={2} floatIntensity={1} position={[-1.5, 1.5, -0.5]}>
        <mesh scale={[0.3, 0.3, 0.3]}>
          <icosahedronGeometry args={[1, 3]} /> {/* slightly bumpy sphere */}
          <meshPhysicalMaterial color="#1a110e" roughness={0.5} clearcoat={0.5} envMapIntensity={1.5} />
        </mesh>
      </Float>

    </group>
  );
};


if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const AnimatedTitle = ({ text }) => {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, i) => (
        <span key={i} className={styles.splitWord}>
          <span className={`${styles.splitChar} ${word.toLowerCase() === 'tradition' ? styles.highlightWord : ''}`}>
            {word}
          </span>
        </span>
      ))}
    </>
  );
};

export default function Home() {
  const heroRef = useRef(null);
  const heroBgRef = useRef(null);
  const heroContentRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const logoRef = useRef(null);
  const scrollIndRef = useRef(null);
  const particlesRef = useRef(null);
  const revealSectionRef = useRef(null);
  const productsRef = useRef([]);

  // New cinematic refs
  const spiceRef = useRef();
  const narrativeRef = useRef(null);
  const [isModelReady, setIsModelReady] = useState(false);

  const headerRef = useRef(null);
  const missionRef = useRef(null);
  const missionTitleRef = useRef(null);
  const missionParaRef = useRef(null);
  const missionLineRef = useRef(null);
  const missionQuoteRef = useRef(null);

  const processSectionRef = useRef(null);
  const processTitleRef = useRef(null);
  const processCardRef = useRef(null);
  const processFeaturesRef = useRef([]);
  const processImageWrapperRef = useRef(null);
  const processImageRef = useRef(null);

  const [particles, setParticles] = useState([]);
  const [headerActive, setHeaderActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Generate very subtle background dust particles
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animDuration: Math.random() * 15 + 15,
      delay: Math.random() * 5,
      isLeaf: false // Removed leaves for clean look
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Initial Load Animations
    const tlLoad = gsap.timeline({ defaults: { ease: 'power3.out' } });

    gsap.to(heroBgRef.current, {
      scale: 1.08,
      duration: 10,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1
    });

    tlLoad.to(logoRef.current, { scale: 1, opacity: 1, duration: 1.5, delay: 0.2 })
      .to(titleRef.current.querySelectorAll(`.${styles.splitChar}`), {
        y: 0,
        duration: 1.2,
        stagger: 0.1,
      }, "-=1")
      .to([subtitleRef.current, ctaRef.current], {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
      }, "-=0.8")
      .to(scrollIndRef.current, { opacity: 1, duration: 1 }, "-=0.5");

    // ==========================================
    // CINEMATIC HERO SCROLL ANIMATION (CLEAN)
    // ==========================================

    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: '+=400%', // Increased to match new extended scroll timeline
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          if (self.progress > 0.05 && !headerActive) {
            setHeaderActive(true);
          } else if (self.progress <= 0.05 && headerActive) {
            setHeaderActive(false);
          }
        }
      }
    });

    // 1. Initial Hero text fades out & Background zoom (Progress 0 to 0.15)
    heroTl.to(heroContentRef.current, { y: -100, opacity: 0, duration: 0.15 }, 0)
          .to(heroBgRef.current, { scale: 1, duration: 1 }, 0);


    // ==========================================
    // SECTIONS ANIMATIONS
    // ==========================================

    const missionTl = gsap.timeline({
      scrollTrigger: {
        trigger: missionRef.current,
        start: 'top 70%',
      }
    });

    missionTl.fromTo(missionRef.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out' })
      .fromTo(missionTitleRef.current.querySelectorAll(`.${styles.splitChar}`),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }, "-=0.8")
      .fromTo(missionParaRef.current, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }, "-=0.5")
      .fromTo(missionQuoteRef.current, { opacity: 0, x: 50, scale: 0.95 }, { opacity: 1, x: 0, scale: 1, duration: 1.5, ease: 'power2.out' }, "-=0.8");

    const processTl = gsap.timeline({
      scrollTrigger: {
        trigger: processSectionRef.current,
        start: 'top 70%',
      }
    });

    processTl.fromTo(processSectionRef.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' })
      .fromTo(processTitleRef.current.querySelectorAll(`.${styles.splitChar}`),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, "-=0.8")
      .fromTo(processCardRef.current, { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }, "-=0.5")
      .fromTo(processFeaturesRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out' }, "-=0.6")
      .fromTo(processImageWrapperRef.current, { x: 80, opacity: 0, scale: 0.95 }, { x: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }, "-=1.5");

    gsap.to(processImageRef.current, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: processSectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });

    productsRef.current.forEach((product, i) => {
      if (product) {
        gsap.fromTo(
          product,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: product,
              start: 'top 85%',
            },
          }
        );
      }
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
      gsap.ticker.remove(lenis.raf);
    };
  }, [headerActive]);

  const handleMouseMove = (e) => {
    if (!heroBgRef.current || !particlesRef.current) return;
    const { clientX, clientY } = e;
    const xPos = (clientX / window.innerWidth - 0.5) * 20;
    const yPos = (clientY / window.innerHeight - 0.5) * 20;

    gsap.to(heroBgRef.current, { x: xPos, y: yPos, duration: 1, ease: 'power2.out' });
    gsap.to(particlesRef.current, { x: -xPos * 2, y: -yPos * 2, duration: 1, ease: 'power2.out' });
  };

  // Three.js GSAP Timeline Setup
  useEffect(() => {
    if (!isModelReady || !spiceRef.current || !heroRef.current || !narrativeRef.current) return;

    // Initial state setup for R3F object
    spiceRef.current.position.set(0, -0.5, 0);
    spiceRef.current.rotation.set(0, Math.PI / 4, 0.4);
    spiceRef.current.scale.set(1.5, 1.5, 1.5); 

    const tl3d = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: '+=400%', 
        scrub: 1,
      }
    });

    // 1. Initial Scroll: Slight scale/rotation while center text fades out
    tl3d.to(spiceRef.current.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.2 }, 0)
        .to(spiceRef.current.rotation, { y: Math.PI, duration: 0.2, ease: 'power1.inOut' }, 0);

    // 2. Shift Right & Narrative Fades In
    tl3d.to(spiceRef.current.position, { x: 3.5, y: 0, duration: 0.3, ease: 'power2.inOut' }, 0.2)
        .to(spiceRef.current.rotation, { y: Math.PI * 2, x: 0.5, duration: 0.3 }, 0.2)
        .to(narrativeRef.current, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }, 0.25);

    // 3. Float Phase
    tl3d.to(spiceRef.current.position, { y: 0.5, duration: 0.3, ease: 'sine.inOut' }, 0.4)
        .to(spiceRef.current.rotation, { y: Math.PI * 2.3, duration: 0.3 }, 0.4);

    // 4. Exit: Scales massively towards camera
    tl3d.to(narrativeRef.current, { opacity: 0, y: -50, duration: 0.2 }, 0.7)
        .to(spiceRef.current.position, { x: 0, y: -2, z: 8, duration: 0.3, ease: 'power3.in' }, 0.7)
        .to(spiceRef.current.rotation, { y: Math.PI * 3, x: -1, duration: 0.3 }, 0.7);

    return () => {
      tl3d.kill();
    };
  }, [isModelReady]);

  return (
    <main className={styles.main}>
      {/* Fullscreen Menu Overlay */}
      <div className={`${styles.menuOverlay} ${menuOpen ? styles.isOpen : ''}`}>
        <button 
          className={styles.closeMenuBtn} 
          onClick={() => setMenuOpen(false)}
          aria-label="Close Menu"
        >
          <span className={styles.closeLine1}></span>
          <span className={styles.closeLine2}></span>
        </button>

        <nav className={styles.menuLinks}>
          <a href="#" className={styles.menuLink} onClick={(e) => { e.preventDefault(); setMenuOpen(false); }}>Home</a>
          <a href="#" className={styles.menuLink} onClick={(e) => { e.preventDefault(); setMenuOpen(false); missionRef.current?.scrollIntoView({ behavior: 'smooth' }); }}>Our Story</a>
          <a href="#" className={styles.menuLink} onClick={(e) => { e.preventDefault(); setMenuOpen(false); processSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); }}>The Craft</a>
          <a href="#" className={styles.menuLink} onClick={(e) => { e.preventDefault(); setMenuOpen(false); }}>Shop Spices</a>
        </nav>
      </div>

      {/* Sticky Header */}
      <header ref={headerRef} className={`${styles.header} ${headerActive || menuOpen ? styles.active : ''}`}>
        <div className={styles.headerLogo}>
          <img src="/logo.png" alt="P-KOT SPICES" style={{ height: '45px', width: 'auto', borderRadius: '4px' }} />
        </div>
        <button 
          className={`${styles.menuBtn} ${menuOpen ? styles.isOpen : ''}`} 
          aria-label="Menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={styles.menuLine}></span>
          <span className={styles.menuLine}></span>
          <span className={styles.menuLine}></span>
        </button>
      </header>

      {/* Hero Section */}
      <section className={styles.hero} ref={heroRef} onMouseMove={handleMouseMove}>
        <div className={styles.heroBackground} ref={heroBgRef}></div>
        <div className={styles.heroOverlay}></div>

        <div className={styles.particles} ref={particlesRef}>
          {particles.map(p => (
            <div
              key={p.id}
              className={p.isLeaf ? styles.leaf : styles.particle}
              style={{
                width: p.isLeaf ? p.size * 5 : p.size,
                height: p.isLeaf ? p.size * 5 : p.size,
                left: `${p.left}%`,
                top: `${p.top}%`,
                animationDuration: `${p.animDuration}s`,
                animationDelay: `${p.delay}s`,
                opacity: p.isLeaf ? 0.3 : 0.6
              }}
            />
          ))}
        </div>

        {/* WebGL Canvas (React Three Fiber) */}
        <div className={styles.canvasContainer}>
          <Canvas 
            camera={{ position: [0, 0, 10], fov: 45 }}
            gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
          >
            {/* Cinematic Studio Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={2.0} color="#fff5e6" />
            <directionalLight position={[-5, 5, -5]} intensity={1.5} color="#aaccff" />
            <Environment preset="studio" />
            
            <SpiceCollection spiceRef={spiceRef} onReady={() => setIsModelReady(true)} />
            
            {/* Soft floor shadow */}
            <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
          </Canvas>
        </div>

        {/* Qashew-Style Narrative (Fades in on scroll) */}
        <div className={styles.heroNarrative} ref={narrativeRef} style={{ opacity: 0, transform: 'translateX(-50px)' }}>
          <div className={styles.missionLabel} style={{ marginBottom: '10px' }}>OUR MISSION</div>
          <h2 className={styles.narrativeTitle}>A heritage of<br/>excellence.</h2>
          <p className={styles.narrativePara}>To redefine the standard of luxury spices through uncompromising quality, sustainable harvesting, and artisanal precision.</p>
        </div>

        <div className={styles.heroContent} ref={heroContentRef}>
          <div className={styles.heroTitleContainer}>
            <h1 className={styles.heroTitle} ref={titleRef}>
              <AnimatedTitle text="Tradition in Every Grain" />
            </h1>
          </div>

          <h3 className={styles.heroSubtitle} ref={subtitleRef}>
            Premium Quality &bull; Authentic Flavors
          </h3>

          <button className={styles.ctaBtn} ref={ctaRef} onClick={() => {
            missionRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}>
            Explore Spices <ChevronRight size={20} />
          </button>
        </div>

        <div className={styles.scrollIndicator} ref={scrollIndRef}>
          <span>Discover</span>
          <div className={styles.scrollLine}>
            <div className={styles.scrollDot}></div>
          </div>
        </div>
      </section>

      {/* Layered Reveal Area starting with Mission */}
      <div className={styles.revealSection} ref={revealSectionRef}>

        {/* Mission Section */}
        <section className={styles.missionSection} ref={missionRef}>
          <div className={styles.noiseOverlay} style={{ opacity: 0.05 }}></div>
          <div className={styles.particles} style={{ opacity: 0.2 }}>
            {particles.slice(0, 15).map(p => (
              <div
                key={`m-${p.id}`}
                className={styles.particle}
                style={{
                  width: p.size,
                  height: p.size,
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  animationDuration: `${p.animDuration * 1.5}s`,
                  animationDelay: `${p.delay}s`
                }}
              />
            ))}
          </div>

          <div className="container">
            <div className={styles.missionGrid}>
              
              {/* Left Column: Text */}
              <div className={styles.missionTextCol}>
                <div className={styles.missionLabel}>Our Essence</div>

                <h2 className={styles.missionTitle} ref={missionTitleRef}>
                  <span className={styles.splitWord}><span className={styles.splitChar} style={{ color: 'var(--color-text)' }}>Tradition</span></span><br/>
                  <span className={styles.splitWord}><span className={styles.splitChar} style={{ color: 'var(--color-text)' }}>in</span></span>{' '}
                  <span className={styles.splitWord}><span className={`${styles.splitChar} ${styles.missionTitleHighlight}`}>every</span></span>{' '}
                  <span className={styles.splitWord}><span className={`${styles.splitChar} ${styles.missionTitleHighlight}`}>grain.</span></span>
                </h2>

                <div className={styles.missionParaWrapper} ref={missionParaRef}>
                  <div className={styles.verticalLine}></div>
                  <p className={styles.missionPara}>
                    Hand-harvested from heritage plantations, our spices are a testament to generations of dedication. We believe that true luxury lies in authenticity. Every batch is meticulously sorted and stone-ground to preserve the natural oils, ensuring a warm, aromatic journey from our farms to your table.
                  </p>
                </div>
              </div>

              {/* Right Column: Image */}
              <div className={styles.missionImageCol}>
                <div className={styles.comingSoonWrapper} ref={missionQuoteRef}>
                  <img src="/coming-soon.jpg" alt="P-KOT Spices - Coming Soon" className={styles.comingSoonImage} />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className={styles.processSection} ref={processSectionRef}>
          <div className={styles.noiseOverlay} style={{ opacity: 0.05 }}></div>
          <div className={styles.particles} style={{ opacity: 0.2 }}>
            {particles.slice(15, 25).map(p => (
              <div
                key={`p-${p.id}`}
                className={styles.particle}
                style={{
                  width: p.size,
                  height: p.size,
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  animationDuration: `${p.animDuration * 1.5}s`,
                  animationDelay: `${p.delay}s`
                }}
              />
            ))}
          </div>

          <div className={styles.processHeader}>
            <div className={styles.missionLabel}>The Process</div>
            <h2 className={styles.missionTitle} ref={processTitleRef} style={{ marginBottom: '20px' }}>
              <span className={styles.splitWord}><span className={styles.splitChar} style={{ color: 'var(--color-text)' }}>Artisanal</span></span>{' '}
              <span className={styles.splitWord}><span className={`${styles.splitChar} ${styles.missionTitleHighlight}`}>Craftsmanship.</span></span>
            </h2>
            <p className={styles.missionPara} style={{ marginBottom: 0 }}>
              Our spices are handpicked, sun-dried, and stone-ground using traditional methods to preserve their pure aroma and vital oils. We ensure 100% natural processing with no additives.
            </p>
          </div>

          <div className={styles.processGrid}>
            {/* Left Card */}
            <div className={styles.processCard} ref={processCardRef}>
              <div className={styles.processFeature} ref={(el) => (processFeaturesRef.current[0] = el)}>
                <h3>Precision Grinding</h3>
                <p>Using slow, cool stone-grinding techniques to maintain the essential oils and volatile aromas that define premium quality.</p>
              </div>
              <div className={styles.processFeature} ref={(el) => (processFeaturesRef.current[1] = el)}>
                <h3>Pure Ingredients</h3>
                <p>We believe in absolute purity. Zero preservatives, zero artificial colors—just 100% authentic spice direct from nature.</p>
              </div>
              <div className={styles.processFeature} ref={(el) => (processFeaturesRef.current[2] = el)}>
                <h3>Traditional Methods</h3>
                <p>Rooted in heritage, our curing and drying processes respect centuries-old traditions that lock in vibrant flavors.</p>
              </div>
            </div>

            {/* Right Image */}
            <div className={styles.processImageWrapper} ref={processImageWrapperRef}>
              <div className={styles.processImageGlow}></div>
              <img
                src="/process.jpeg"
                alt="Artisanal Spices"
                className={styles.processImage}
                ref={processImageRef}
              />
            </div>
          </div>
        </section>

        {/* Products Section (Trending Asymmetric Layout) */}
        <section className={styles.productsSection}>
          <div className="container">
            <div className={styles.productsHeader}>
              <h2>Our Collection</h2>
            </div>

            <div className={styles.productsGrid}>
              {/* Product 1 */}
              <div className={styles.productCard} ref={(el) => (productsRef.current[0] = el)}>
                <div className={styles.productImageWrapper}>
                  <img
                    src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200&auto=format&fit=crop"
                    alt="Premium Blend"
                    className={styles.productImage}
                  />
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.productNumber}>01</div>
                  <h3>Premium Spice Blend</h3>
                  <p>Hand-pounded and perfectly balanced for an authentic, rich taste. Perfect for curries and traditional marinades.</p>
                  <Link href="/product/premium-blend" className={styles.exploreBtn}>View Details</Link>
                </div>
              </div>

              {/* Product 2 */}
              <div className={styles.productCard} ref={(el) => (productsRef.current[1] = el)}>
                <div className={styles.productImageWrapper}>
                  <img
                    src="https://images.unsplash.com/photo-1564149504298-00c351fd7f16?q=80&w=1200&auto=format&fit=crop"
                    alt="Whole Spices"
                    className={styles.productImage}
                  />
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.productNumber}>02</div>
                  <h3>Whole Heritage Spices</h3>
                  <p>Sourced directly from our finest partner plantations, ensuring every pod and seed holds its maximum natural aroma.</p>
                  <Link href="/product/whole-heritage" className={styles.exploreBtn}>View Details</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className="container">
            <div className={styles.footerLogo}>P-KOT SPICES</div>
            <p style={{ color: '#bbb', fontFamily: 'var(--font-sans)', letterSpacing: '1px' }}>
              &copy; {new Date().getFullYear()} Tradition in Every Grain.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
