import {registerToggleButton} from './toggleDarkTheme';
import {registerFeedToogle} from './postFeedToggle';
import mobileNav from './mobileNav';

(function () {
    mobileNav();
    registerToggleButton();
    registerFeedToogle();

    document.querySelectorAll('.js-initial-hidden').forEach(x => x.classList.remove('js-initial-hidden'));
})();
