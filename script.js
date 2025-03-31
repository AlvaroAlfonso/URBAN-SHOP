const botonVerMas = document.querySelector('.boton-ver-mas');
const corazones = document.querySelectorAll('.corazon');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');



botonVerMas.addEventListener('mouseout', () => {
    botonVerMas.style.transform = 'scale(1)';
});

corazones.forEach(corazon => {
    corazon.addEventListener('click', () => {
        corazon.classList.toggle('active');
    });
});

botonVerMas.addEventListener('mouseout', () => {
    botonVerMas.style.transform = 'scale(1)';
});

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});