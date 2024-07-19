import React, { useEffect, useState } from "react"

const Slider = () => {
  const [slideIndex, setSlideIndex] = useState(1);

  const plusDivs = (n) => {
    const slides = document.getElementsByClassName("mySlides");
    let newSlideIndex = slideIndex + n;
    // Nếu đang ở phần tử cuối cùng và bấm tới
    if (newSlideIndex > slides.length) {
      newSlideIndex = 1;
    }
    // Nếu đang ở phần tử đầu tiên và bấm lùi
    else if (newSlideIndex < 1) {
      newSlideIndex = slides.length;
    }

    setSlideIndex(newSlideIndex);
  };
  
  const currentDiv = (n) => {
    const slides = document.getElementsByClassName("mySlides");
    let newSlideIndex = n;

    // Nếu đang ở phần tử cuối cùng và bấm tới
    if (newSlideIndex > slides.length) {
      newSlideIndex = 1;
    }
    // Nếu đang ở phần tử đầu tiên và bấm lùi
    else if (newSlideIndex < 1) {
      newSlideIndex = slides.length;
    }

    setSlideIndex(newSlideIndex);
  };

  useEffect(() => {
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("w3-badge");
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
    }
    for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    // Kiểm tra phần tử cuối cùng của mảng có tồn tại không trước khi thực hiện thay đổi
    if (slides[slideIndex-1]) {
      slides[slideIndex-1].style.display = "block";  
    } 
    if (dots[slideIndex-1]) {
      dots[slideIndex-1].className += " active";
    }
  }, [slideIndex]);

  // Tự động chuyển hình sau mỗi 3s
  useEffect(() => {
    const interval = setInterval(() => {
      plusDivs(1);
    }, 3000);
    return () => clearInterval(interval); // Hủy bỏ interval khi component unmount
  }, [slideIndex]); // Chạy lại useEffect khi slideIndex thay đổi


  return (
    <div className="w3-content w3-display-container banner-slider-container" style={{maxWidth: '90%'}}>
      {/* <img className="mySlides" src="../images/Slider/saleOff.jpg" />
      <img className="mySlides" src="../images/Slider/freeship-t04.jpg" />
      <img className="mySlides" src="../images/Slider/storeSystem.jpg" /> */}
      <img 
        className="mySlides" 
        srcset="../images/Slider/saleOff.jpg 1360w, ../images/Slider/saleOff.svg 1520w"
        sizes="(max-width: 1366px) 100vw, 100vw"
        src="../images/Slider/saleOff.jpg" 
        layout="responsive"
      />
      <img 
        className="mySlides" 
        srcset="../images/Slider/freeship-t04.jpg 1360w, ../images/Slider/freeship-t04.svg 1520w"
        sizes="(max-width: 1366px) 100vw, 100vw"
        src="../images/Slider/freeship-t04.jpg" 
        layout="responsive"
      />
      <img 
        className="mySlides" 
        srcset="../images/Slider/storeSystem.jpg 1360w, ../images/Slider/storeSystem.svg 1520w"
        sizes="(max-width: 1366px) 100vw, 100vw"
        src="../images/Slider/storeSystem.jpg" 
        layout="responsive"
      />

      <div className="w3-center w3-container w3-section w3-large w3-text-white w3-display-bottommiddle" style={{width: '100%'}}>
        <div className="w3-left w3-hover-text-khaki" onClick={() => plusDivs(-1)}>&#10094;</div>
        <div className="w3-right w3-hover-text-khaki" onClick={() => plusDivs(1)}>&#10095;</div>

        <span className={`w3-badge demo ${slideIndex === 1 ? 'active' : ''}`} onClick={() => currentDiv(1)}></span>
        <span className={`w3-badge demo ${slideIndex === 2 ? 'active' : ''}`} onClick={() => currentDiv(2)}></span>
        <span className={`w3-badge demo ${slideIndex === 3 ? 'active' : ''}`} onClick={() => currentDiv(3)}></span>
      </div>
    </div>
  )
}

export default Slider;