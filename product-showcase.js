// Product Showcase Slider JavaScript
let productItems = document.querySelectorAll('.product-slider .product-list .product-item');
let productPrevBtn = document.getElementById('product-prev');
let productNextBtn = document.getElementById('product-next');
let productLastPosition = productItems.length - 1;
let productFirstPosition = 0;
let productActive = 0;

productNextBtn.onclick = () => {
    productActive = productActive + 1;
    setProductSlider();
}

productPrevBtn.onclick = () => {
    productActive = productActive - 1;
    setProductSlider();
}

const setProductSlider = () => {
    let oldActive = document.querySelector('.product-slider .product-list .product-item.active');
    if(oldActive) oldActive.classList.remove('active');
    productItems[productActive].classList.add('active');
    
    // Show/hide navigation buttons
    productNextBtn.classList.remove('d-none');
    productPrevBtn.classList.remove('d-none');
    if(productActive == productLastPosition) productNextBtn.classList.add('d-none');
    if(productActive == productFirstPosition) productPrevBtn.classList.add('d-none');
}

// Initialize slider
setProductSlider();

// Set diameter for circular images
const setProductDiameter = () => {
    let productSlider = document.querySelector('.product-slider');
    let widthSlider = productSlider.offsetWidth;
    let heightSlider = productSlider.offsetHeight;
    let diameter = Math.sqrt(Math.pow(widthSlider, 2) + Math.pow(heightSlider, 2));
    document.documentElement.style.setProperty('--diameter', diameter+'px');
}

setProductDiameter();
window.addEventListener('resize', () => {
    setProductDiameter();
});

// Auto-play functionality
let productAutoPlay = setInterval(() => {
    if(productActive < productLastPosition) {
        productActive++;
    } else {
        productActive = 0;
    }
    setProductSlider();
}, 4000);

// Pause auto-play on hover
document.querySelector('.product-slider').addEventListener('mouseenter', () => {
    clearInterval(productAutoPlay);
});

// Resume auto-play on mouse leave
document.querySelector('.product-slider').addEventListener('mouseleave', () => {
    productAutoPlay = setInterval(() => {
        if(productActive < productLastPosition) {
            productActive++;
        } else {
            productActive = 0;
        }
        setProductSlider();
    }, 4000);
});
