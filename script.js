const botonVerMas = document.querySelector('.boton-ver-mas');
const corazones = document.querySelectorAll('.corazon');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');



corazones.forEach(corazon => {
    corazon.addEventListener('click', () => {
        corazon.classList.toggle('active');
    });
});



hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

