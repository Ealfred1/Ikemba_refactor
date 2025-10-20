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

// Touch/Swipe functionality
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Touch start
document.querySelector('.product-slider').addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

// Touch end
document.querySelector('.product-slider').addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

// Handle swipe gestures
const handleSwipe = () => {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Check if it's a horizontal swipe (more horizontal than vertical movement)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Minimum swipe distance to trigger
        if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                // Swipe right - go to previous
                if (productActive > productFirstPosition) {
                    productActive--;
                    setProductSlider();
                }
            } else {
                // Swipe left - go to next
                if (productActive < productLastPosition) {
                    productActive++;
                    setProductSlider();
                }
            }
        }
    }
};

// Mouse wheel support for desktop - simple version
let wheelTimeout;
document.querySelector('.product-slider').addEventListener('wheel', (e) => {
    e.preventDefault();
    
    if (wheelTimeout) {
        clearTimeout(wheelTimeout);
    }
    
    wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
            // Scroll down - next product
            if (productActive < productLastPosition) {
                productActive++;
                setProductSlider();
            }
        } else if (e.deltaY < 0) {
            // Scroll up - previous product
            if (productActive > productFirstPosition) {
                productActive--;
                setProductSlider();
            }
        }
    }, 100);
}, { passive: false });