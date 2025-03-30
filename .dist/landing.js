const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
let slideIndex = 0;

function nextSlide() {
  slideIndex = (slideIndex + 1) % slides.length;
  slider.style.transform = `translateX(-${slideIndex * 900}px)`;
}

setInterval(nextSlide, 3000); // Cambia de slide cada 3 segundos