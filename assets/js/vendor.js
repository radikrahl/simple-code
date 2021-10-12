import jQuery from 'jquery';
import hljs from '../../node_modules/highlight.js/lib/common';
import hljsHandleBars from '../../node_modules/highlight.js/lib/languages/handlebars';
import hljsDocker from '../../node_modules/highlight.js/lib/languages/dockerfile';

(function() {
    window.jQuery = window.$ = jQuery;
    hljs.registerLanguage('handlebars', hljsHandleBars);
    hljs.registerLanguage('docker', hljsDocker);
    hljs.highlightAll();
})();
