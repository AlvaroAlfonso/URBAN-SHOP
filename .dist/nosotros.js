document.addEventListener('DOMContentLoaded', function() {
    const menuHamburguesa = document.getElementById('menuHamburguesa');
    const navLinks = document.getElementById('navLinks');

    if (menuHamburguesa && navLinks) {
        menuHamburguesa.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    } else {
        console.error("menuHamburguesa or navLinks not found");
    }
});