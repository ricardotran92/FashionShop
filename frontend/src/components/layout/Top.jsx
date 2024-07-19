import React, { useEffect, useState } from "react"

const Top = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 20) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
  
    window.addEventListener('scroll', toggleVisibility);
  
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };

  return (
    <>
      {isVisible && (
      
      <button onClick={scrollToTop} className="top-btn" title="Go to top">Quay lại đầu trang</button>
      )}

    </>
  )
}

export default Top