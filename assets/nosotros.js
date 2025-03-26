const menuToggle = document.querySelector('.menu-toggle');
const menuList = document.querySelector('.menu-list');



if (menuToggle && menuList) {
    menuToggle.addEventListener('click', () => {
        menuList.classList.toggle('show');
    });
}
