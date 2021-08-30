(function() {
    function openMenu(index, event) {
        console.log(index, event);
        document.getElementById('main-navigation').classList.toggle('navigation-open')
    }

    document.querySelector('.menu-toggle')
        .addEventListener('click', openMenu);

}());
