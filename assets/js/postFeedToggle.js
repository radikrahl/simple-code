let registerFeedToogle = () => {
    var buttons = document.querySelectorAll('.js-post-feed__toggle');

    buttons.forEach((element) => {

        element.addEventListener('click', (event) => {
            var direction = event.target.dataset.direction;
            var postFeed = document.querySelector('.post-feed');

            buttons.forEach((e) => e.classList.remove('active'));

            event.target.classList.add('active');
            postFeed.className = ('post-feed');
            if(direction === 'horizontal') {
                postFeed.classList.add('post-feed--horizontal', 'l-grid--wide');
            }
            else if (direction.startsWith('grid')) {
                postFeed.classList.add('l-grid--wide', 'u-grid', 'gap-x-10', 'gap-y-6');

                if (direction === 'grid-1') {
                    postFeed.classList.remove('l-grid--wide');
                }
                else if (direction === 'grid-3') {
                    postFeed.classList.add('sm:grid-cols-3');
                }

                else if (direction === 'grid-2') {
                    postFeed.classList.add('sm:grid-cols-2');
                }
            }
        });
    });
}

export {registerFeedToogle};
