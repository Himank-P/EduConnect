import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component automatically scrolls the page to the top on any route change.
function ScrollToTop() {
  // Extracts the pathname from the current location.
  const { pathname } = useLocation();

  // useEffect hook runs every time the pathname changes.
  useEffect(() => {
    // Scrolls the window to the very top (0, 0).
    window.scrollTo(0, 0);
  }, [pathname]); // The effect depends on the pathname.

  // This component doesn't render anything, it's purely for functionality.
  return null;
}

export default ScrollToTop;
