'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Common Components
import Header from '@/components/common/Header';
import MenuOverlay from '@/components/common/MenuOverlay';
import Footer from '@/components/common/Footer';

// Page Components
import Hero from '@/components/Hero';
import SequenceSection from '@/components/SequenceSection';
import MissionSection from '@/components/MissionSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import ProcessSection from '@/components/ProcessSection';
import MediaShowcase from '@/components/MediaShowcase';
import HorizontalShowcase from '@/components/HorizontalShowcase';

import styles from './page.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollIndRef = useRef(null);

  const heroCenterImgRef = useRef(null);
  const parallaxLayersRef = useRef([]);

  const sequenceSectionRef = useRef(null);
  const canvasRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [headerActive, setHeaderActive] = useState(false);

  // ── Image Sequence Logic ──────────────────────────────────────────────
  const frameCount = 4;
  const currentFrame = (index) => `/sequence/packet_${index.toString().padStart(2, '0')}.png`;

  useEffect(() => {
    // Scroll progress / Smooth scroll
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Header reveal on scroll
    ScrollTrigger.create({
      start: 'top -50',
      onUpdate: (self) => {
        setHeaderActive(self.direction === 1);
      }
    });

    // ── Hero Interactive Parallax ───────────────────────────────────────────
    const handleHeroParallax = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 40;
      const yPos = (clientY / window.innerHeight - 0.5) * 40;

      const validLayers = parallaxLayersRef.current.filter(el => el !== null);
      if (validLayers.length > 0) {
        gsap.to(validLayers, {
          x: (i) => xPos * (i + 1) * 0.2,
          y: (i) => yPos * (i + 1) * 0.2,
          duration: 1,
          ease: 'power2.out',
        });
      }

      if (heroCenterImgRef.current) {
        gsap.to(heroCenterImgRef.current, {
          x: -xPos * 0.3,
          y: -yPos * 0.3,
          duration: 1.2,
          ease: 'power3.out',
        });
      }
    };

    window.addEventListener('mousemove', handleHeroParallax);

    // ── Initial Load Animations ─────────────────────────────────────────────────
    const tlLoad = gsap.timeline({ defaults: { ease: 'power3.out' } });

    gsap.set([titleRef.current, subtitleRef.current, ctaRef.current, scrollIndRef.current], { opacity: 0, y: 30 });
    const validLayers = parallaxLayersRef.current.filter(el => el !== null);
    if (validLayers.length > 0) {
      gsap.set(validLayers, { opacity: 0, scale: 1.1 });
    }

    tlLoad
      .to(heroCenterImgRef.current, { opacity: 1, scale: 1, duration: 2, ease: 'expo.out' })
      .to(validLayers, { opacity: 1, scale: 1, duration: 1.5, stagger: 0.1 }, '-=1.5')
      .to(titleRef.current, { opacity: 1, y: 0, duration: 1.2 }, '-=1')
      .to(subtitleRef.current, { opacity: 1, y: 0, duration: 1 }, '-=0.8')
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 1 }, '-=0.8')
      .to(scrollIndRef.current, { opacity: 1, y: 0, duration: 1 }, '-=0.5');

    // ── Cinematic Floating Animation ──────────────────────────────────────────
    parallaxLayersRef.current.forEach((layer, i) => {
      if (layer) {
        gsap.to(layer, {
          y: '+=20',
          x: i % 2 === 0 ? '+=10' : '-=10',
          rotation: i % 2 === 0 ? '+=2' : '-=2',
          duration: 3 + i,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }
    });

    // ── Hero Scroll Gathering Animation ─────────────────────────────────────────
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      }
    });

    if (parallaxLayersRef.current[0]) heroTl.to(parallaxLayersRef.current[0], { x: '80%', y: '80%', rotate: 15, scale: 0.5, opacity: 0, ease: 'power2.in' }, 0);
    if (parallaxLayersRef.current[1]) heroTl.to(parallaxLayersRef.current[1], { x: '-80%', y: '80%', rotate: -15, scale: 0.5, opacity: 0, ease: 'power2.in' }, 0);
    if (parallaxLayersRef.current[2]) heroTl.to(parallaxLayersRef.current[2], { x: '80%', y: '-80%', rotate: -10, scale: 0.5, opacity: 0, ease: 'power2.in' }, 0);
    if (parallaxLayersRef.current[3]) heroTl.to(parallaxLayersRef.current[3], { x: '-80%', y: '-80%', rotate: 10, scale: 0.5, opacity: 0, ease: 'power2.in' }, 0);
    
    heroTl.to(heroCenterImgRef.current, { scale: 1.5, opacity: 0, filter: 'blur(20px)', ease: 'power2.in' }, 0)
      .to(titleRef.current, { y: -50, opacity: 0, ease: 'power2.in' }, 0);

    let resizeHandler = null;

    // ── Sequence Canvas Implementation ──────────────────────────────────────────
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      const images = [];
      const airplay = { frame: 0, scale: 1 };

      const render = () => {
        const frameIndex = airplay.frame;
        const floorFrame = Math.floor(frameIndex);
        const ceilFrame = Math.min(Math.ceil(frameIndex), frameCount - 1);
        const progress = frameIndex - floorFrame;

        context.clearRect(0, 0, canvas.width, canvas.height);

        const drawFrame = (index, alpha) => {
          const img = images[index];
          if (img && img.complete) {
            context.globalAlpha = alpha;
            const isMobile = window.innerWidth <= 1024;
            const baseScale = isMobile 
              ? Math.max(canvas.width / img.width, canvas.height / img.height) 
              : Math.min(canvas.width / img.width, canvas.height / img.height) * 0.9;
            
            // Apply a very aggressive overscale (40%) to completely hide the "CapCut" watermark
            const overscale = 1.4;
            const currentScale = baseScale * airplay.scale * overscale;
            
            const w = img.width * currentScale;
            const h = img.height * currentScale;
            const x = (canvas.width - w) / 2;
            const y = (canvas.height - h) / 2;
            context.drawImage(img, x, y, w, h);
          }
        };

        if (floorFrame === ceilFrame) {
          drawFrame(floorFrame, 1);
        } else {
          drawFrame(floorFrame, 1 - progress);
          drawFrame(ceilFrame, progress);
        }
      };

      const updateCanvasSize = () => {
        const wrapper = canvas.parentElement;
        if (wrapper) {
          canvas.width = wrapper.offsetWidth;
          canvas.height = wrapper.offsetHeight;
          if (images[airplay.frame]) render();
        }
      };

      resizeHandler = updateCanvasSize;

      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
      }

      images[0].onload = () => {
        updateCanvasSize();
        render();
      };

      window.addEventListener('resize', resizeHandler);

      const tlSequence = gsap.timeline({
        scrollTrigger: {
          trigger: sequenceSectionRef.current,
          start: 'top top',
          end: '+=500%',
          scrub: 2,
          pin: true,
          anticipatePin: 1,
        }
      });

      tlSequence.to(airplay, {
        frame: frameCount - 1,
        ease: 'none',
        onUpdate: render,
        duration: 1
      })
        .to(airplay, {
          scale: 1.1,
          ease: 'power1.inOut',
          onUpdate: render,
          duration: 1
        }, 0);

      const sequenceTexts = gsap.utils.toArray(`.${styles.sequenceTextItem}`);
      sequenceTexts.forEach((text, i) => {
        // Calculate relative position in the timeline
        const step = 1 / sequenceTexts.length;
        const startPos = i * step;

        tlSequence.fromTo(text,
          { opacity: 0, y: 50, filter: 'blur(10px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' },
          startPos
        )
          .to(text,
            { opacity: 0, y: -50, filter: 'blur(10px)', duration: 0.5, ease: 'power2.in' },
            startPos + step - 0.2
          );
      });
    }

    return () => {
      lenis.destroy();
      window.removeEventListener('mousemove', handleHeroParallax);
      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
      }
    };
  }, []);

  return (
    <main className={styles.main}>
      <MenuOverlay menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <Header
        headerActive={headerActive}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <Hero
        heroRef={heroRef}
        heroContentRef={heroContentRef}
        titleRef={titleRef}
        subtitleRef={subtitleRef}
        ctaRef={ctaRef}
        scrollIndRef={scrollIndRef}
        heroCenterImgRef={heroCenterImgRef}
        parallaxLayersRef={parallaxLayersRef}
      />

      <SequenceSection
        sequenceSectionRef={sequenceSectionRef}
        canvasRef={canvasRef}
      />

      <MissionSection />

      <FeaturedProducts />

      <ProcessSection />

      <MediaShowcase />

      <HorizontalShowcase />

      <Footer />
    </main>
  );
}
