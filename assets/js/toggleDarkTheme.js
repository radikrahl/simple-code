function registerToggleButton() {
    document.querySelector('.js-dark-mode__toggle').addEventListener('click', () => {
        var element = document.documentElement;
        if (element.dataset.theme === 'dark') {
            element.dataset.theme = 'light';
        }
        else if (element.dataset.theme === 'light') {
            element.dataset.theme = 'dark';
        }

        window.localStorage.setItem('theme', element.dataset.theme);
    });
}

export {registerToggleButton};
