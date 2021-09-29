import {registerToggleButton} from './toggleDarkTheme';
import {registerFeedToogle} from './postFeedToggle';
import mobileNav from './mobileNav';

(function () {
    mobileNav();
    registerToggleButton();
    registerFeedToogle();
})();
