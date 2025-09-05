import React, { useEffect, useRef } from 'react';

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

const ParallaxSection: React.FC<ParallaxProps> = ({ 
  children, 
  speed = 0.2,
  className = ''
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const scrollY = window.scrollY;
      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      
      // Only apply parallax when the section is in view
      if (scrollY > sectionTop - window.innerHeight && scrollY < sectionTop + sectionHeight) {
        const yOffset = (scrollY - sectionTop) * speed;
        sectionRef.current.style.transform = `translateY(${yOffset}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);
  
  return (
    <div ref={sectionRef} className={`parallax ${className}`}>
      {children}
    </div>
  );
};

export default ParallaxSection;