import { useEffect, useState } from 'react';

const DESKTOP = 768;
const getCurrentWidth = () =>
  document.documentElement.clientWidth ||
  window.innerWidth ||
  document.body.clientWidth;

const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(getCurrentWidth());

  useEffect(() => {
    const handleResize = () => setCurrentWidth(getCurrentWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (currentWidth < DESKTOP) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [currentWidth]);

  return isMobile;
};

export default useMobile;
