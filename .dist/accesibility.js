document.addEventListener('DOMContentLoaded', () => {
    const increaseFont = document.getElementById('increase-font');
    const decreaseFont = document.getElementById('decrease-font');
    const toggleContrast = document.getElementById('toggle-contrast');
    const body = document.body;

    let currentFontSize = 16; // Tamaño de fuente base

    increaseFont.addEventListener('click', () => {
        currentFontSize += 2;
        body.style.fontSize = `${currentFontSize}px`;
    });

    decreaseFont.addEventListener('click', () => {
        currentFontSize -= 2;
        body.style.fontSize = `${currentFontSize}px`;
    });

    toggleContrast.addEventListener('click', () => {
        body.classList.toggle('high-contrast');
    });
});

console.log("es un ensayo estoy agregando un texto");