(function() {
    const menuOverlay = document.querySelector('.menu__overlay');
    const mainNav = document.getElementById('main-navigation');
    const menuToggle = document.querySelector('.menu__toggle');

    function openMenu() {
        mainNav.classList.toggle('navigation-open');
        menuOverlay.classList.toggle('u-hidden');
    }

    function closeMenu() {
        mainNav.classList.remove('navigation-open');
        menuOverlay.classList.add('u-hidden');
    }

    menuToggle.addEventListener('click', openMenu);
    menuOverlay.addEventListener('click', closeMenu);

    hljs.highlightAll();
}());
