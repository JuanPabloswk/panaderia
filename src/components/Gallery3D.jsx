import React, { useEffect } from "react";
import UIkit from "uikit";
import "uikit/dist/css/uikit.min.css";

const Gallery3D = () => {
  useEffect(() => {
    UIkit.slider(".uk-slider");

    const carousel = document.querySelector(".carousel");
    const imgs = carousel.querySelectorAll("img");
    let index = 0;
    const total = imgs.length;
    let interval;

    function updateCarousel() {
      const angle = (index * -60) % 360; // 360/6 imágenes = 60°
      carousel.style.transform = `rotateY(${angle}deg)`;

      imgs.forEach((img, i) => {
        img.style.filter = i === index ? "brightness(1)" : "brightness(0.4)";
        img.style.transition = "filter 0.8s ease";
      });

      index = (index + 1) % total;
    }

    function startRotation() {
      interval = setInterval(updateCarousel, 3000);
    }

    function stopRotation() {
      clearInterval(interval);
    }

    updateCarousel();
    startRotation();

    // detener y reanudar al pasar el cursor
    carousel.addEventListener("mouseenter", stopRotation);
    carousel.addEventListener("mouseleave", startRotation);

    return () => {
      stopRotation();
      carousel.removeEventListener("mouseenter", stopRotation);
      carousel.removeEventListener("mouseleave", startRotation);
    };
  }, []);

  return (
    <section className="uk-section uk-section-default uk-text-center">
      <div className="uk-container">
        <h2
          className="uk-heading-medium uk-text-bold"
          style={{ color: "#6b3e26" }}
        >
          OUR GALLERY
        </h2>
        <p className="uk-text-lead" style={{ color: "#7a6a5c" }}>
          Discover our best creations and baked delights
        </p>

        <div className="carousel-container">
          <div className="carousel">
            <img
              src="https://preview.milingona.co/themes/bakery/shop/wp-content/uploads/2017/12/img-15.jpg"
              alt="Pan artesanal"
              className="uk-border-rounded uk-box-shadow-hover-large"
            />
            <img
              src="https://preview.milingona.co/themes/bakery/shop/wp-content/uploads/2017/12/img-13.jpg"
              alt="Pan rústico"
              className="uk-border-rounded uk-box-shadow-hover-large"
            />
            <img
              src="https://preview.milingona.co/themes/bakery/shop/wp-content/uploads/2017/12/img-5.jpg"
              alt="Croissants"
              className="uk-border-rounded uk-box-shadow-hover-large"
            />
            <img
              src="https://preview.milingona.co/themes/bakery/shop/wp-content/uploads/2017/12/img-20.jpg"
              alt="Pasteles"
              className="uk-border-rounded uk-box-shadow-hover-large"
            />
            <img
              src="https://preview.milingona.co/themes/bakery/shop/wp-content/uploads/2017/12/img-12.jpg"
              alt="Muffins"
              className="uk-border-rounded uk-box-shadow-hover-large"
            />
            <img
              src="https://preview.milingona.co/themes/bakery/shop/wp-content/uploads/2017/12/img-1.jpg"
              alt="Pan fresco"
              className="uk-border-rounded uk-box-shadow-hover-large"
            />
          </div>
        </div>
      </div>

      <style>{`
        .carousel-container {
          perspective: 1000px;
          margin-top: 50px;
        }

        .carousel {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          transform-style: preserve-3d;
          transition: transform 1s ease-in-out;
          height: 250px;
        }

        .carousel img {
          position: absolute;
          width: 250px;
          height: 180px;
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transition: transform 0.8s, filter 0.8s ease;
        }

        .carousel img:nth-child(1) { transform: rotateY(0deg) translateZ(400px); }
        .carousel img:nth-child(2) { transform: rotateY(60deg) translateZ(400px); }
        .carousel img:nth-child(3) { transform: rotateY(120deg) translateZ(400px); }
        .carousel img:nth-child(4) { transform: rotateY(180deg) translateZ(400px); }
        .carousel img:nth-child(5) { transform: rotateY(240deg) translateZ(400px); }
        .carousel img:nth-child(6) { transform: rotateY(300deg) translateZ(400px); }

      `}</style>
    </section>
  );
};

export default Gallery3D;