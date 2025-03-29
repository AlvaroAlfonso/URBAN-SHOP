const pistaDeslizamiento = document.querySelector('.pista-deslizamiento-3d');
const gruposDeslizamiento = document.querySelectorAll('.grupo-deslizamiento-3d');
const numGrupos = gruposDeslizamiento.length;
let indiceActual = 0;
const intervalo = 3000; // Cambia cada 3 segundos
const blogPosts = document.querySelectorAll('.blog-post'); // Selecciona todos los artículos

blogPosts.forEach(post => {
  const likeButton = post.querySelector('.like-button');
  const likeCount = post.querySelector('.like-count');
  const commentButton = post.querySelector('.comment-button');
  const commentsSection = post.querySelector('.comments-section');
  const commentList = post.querySelector('.comment-list');
  const commentInput = post.querySelector('.comment-input');
  const submitComment = post.querySelector('.submit-comment');

  let likes = parseInt(likeCount.textContent);

  likeButton.addEventListener('click', () => {
    likes++;
    likeCount.textContent = likes;
  });

  commentButton.addEventListener('click', () => {
    commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
  });

  submitComment.addEventListener('click', () => {
    const commentText = commentInput.value.trim();
    if (commentText) {
      const newComment = document.createElement('li');
      newComment.textContent = commentText;
      commentList.appendChild(newComment);
      commentInput.value = '';
    }
  });
});

function desplazarCarrusel(reset = false) {
  if (reset) {
    // Reinicia instantáneamente al inicio
    pistaDeslizamiento.style.transition = 'none';
    pistaDeslizamiento.style.transform = 'translateX(0%)';
    indiceActual = 0;
    // Fuerza un reflow para aplicar cambios inmediatos
    pistaDeslizamiento.offsetHeight;
    pistaDeslizamiento.style.transition = 'transform 0.8s linear';
  } else {
    indiceActual++;
    if (indiceActual < numGrupos) {
      const desplazamiento = -indiceActual * 100 + '%';
      pistaDeslizamiento.style.transform = `translateX(${desplazamiento})`;
    } else {
      // Reinicia al inicio después de la transición
      setTimeout(() => {
        desplazarCarrusel(true);
      }, 800); // Espera la transición antes de reiniciar
    }
  }
}

function iniciarCarrusel() {
  setTimeout(desplazarCarrusel, 0); // Inicia inmediatamente
  setInterval(() => {
    desplazarCarrusel();
  }, intervalo + 800);
}

iniciarCarrusel();
