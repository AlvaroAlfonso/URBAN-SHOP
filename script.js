const botonVerMas = document.querySelector('.boton-ver-mas');
const corazones = document.querySelectorAll('.corazon');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});



// Cerrar el menú al hacer clic fuera de él
document.addEventListener('click', (event) => {
    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
        navLinks.classList.remove('active');
    }
});


botonVerMas.addEventListener('mouseout', () => {
    botonVerMas.style.transform = 'scale(1)';
});

corazones.forEach(corazon => {
    corazon.addEventListener('click', () => {
        corazon.classList.toggle('active');
    });
});