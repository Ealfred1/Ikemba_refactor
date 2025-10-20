let starbucksNext = document.getElementById('starbucks-next');
let starbucksPrev = document.getElementById('starbucks-prev');
let starbucksCarousel = document.querySelector('.starbucks-carousel');
let starbucksItems = document.querySelectorAll('.starbucks-carousel .item');
let starbucksCountItem = starbucksItems.length;
let starbucksActive = 1;
let starbucksOther_1 = null;
let starbucksOther_2 = null;

starbucksNext.onclick = () => {
    starbucksCarousel.classList.remove('prev');
    starbucksCarousel.classList.add('next');
    starbucksActive = starbucksActive + 1 >= starbucksCountItem ? 0 : starbucksActive + 1;
    starbucksOther_1 = starbucksActive - 1 < 0 ? starbucksCountItem - 1 : starbucksActive - 1;
    starbucksOther_2 = starbucksActive + 1 >= starbucksCountItem ? 0 : starbucksActive + 1;
    changeStarbucksSlider();
}

starbucksPrev.onclick = () => {
    starbucksCarousel.classList.remove('next');
    starbucksCarousel.classList.add('prev');
    starbucksActive = starbucksActive - 1 < 0 ? starbucksCountItem - 1 : starbucksActive - 1;
    starbucksOther_1 = starbucksActive + 1 >= starbucksCountItem ? 0 : starbucksActive + 1;
    starbucksOther_2 = starbucksOther_1 + 1 >= starbucksCountItem ? 0 : starbucksOther_1 + 1;
    changeStarbucksSlider();
}

const changeStarbucksSlider = () => {
    let itemOldActive = document.querySelector('.starbucks-carousel .item.active');
    if(itemOldActive) itemOldActive.classList.remove('active');

    let itemOldOther_1 = document.querySelector('.starbucks-carousel .item.other_1');
    if(itemOldOther_1) itemOldOther_1.classList.remove('other_1');

    let itemOldOther_2 = document.querySelector('.starbucks-carousel .item.other_2');
    if(itemOldOther_2) itemOldOther_2.classList.remove('other_2');

    starbucksItems.forEach(e => {
        e.querySelector('.image img').style.animation = 'none';
        e.querySelector('.image figcaption').style.animation = 'none';
        void e.offsetWidth;
        e.querySelector('.image img').style.animation = '';
        e.querySelector('.image figcaption').style.animation = '';
    })

    starbucksItems[starbucksActive].classList.add('active');
    starbucksItems[starbucksOther_1].classList.add('other_1');
    starbucksItems[starbucksOther_2].classList.add('other_2');

    clearInterval(starbucksAutoPlay);
    starbucksAutoPlay = setInterval(() => {
        starbucksNext.click();
    }, 5000);
}

let starbucksAutoPlay = setInterval(() => {
    starbucksNext.click();
}, 5000);
