function registerToggleButton() {
    document.querySelector('#darkModeToggle').checked = window.localStorage.getItem('theme') === 'dark';
    document.querySelector('#darkModeToggle').addEventListener('change', (e) => {
        var element = document.documentElement;
        element.dataset.theme = e.target.checked ? 'dark' : 'light';

        window.localStorage.setItem('theme', element.dataset.theme);
    });
}

export { registerToggleButton };
