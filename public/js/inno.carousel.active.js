class ModernCarousel {
    constructor() {
        this.carousel = document.querySelector('.modern-carousel');
        this.viewport = this.carousel.querySelector('.carousel-viewport');
        this.items = Array.from(this.carousel.querySelectorAll('.carousel-item'));
        this.nav = this.carousel.querySelector('.carousel-nav');
        this.progressBar = this.carousel.querySelector('.progress-bar');
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.isDragging = false;
        this.startX = 0;
        this.initialScroll = 0;

        this.init();
    }

    init() {
        this.createIndicators();
        this.addEventListeners();
        this.startAutoPlay();
        this.updateProgressBar();
    }

    createIndicators() {
        this.items.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = `nav-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(i));
            this.nav.appendChild(dot);
        });
    }

    addEventListeners() {
        this.carousel.querySelector('.prev').addEventListener('click', () => this.prevSlide());
        this.carousel.querySelector('.next').addEventListener('click', () => this.nextSlide());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Touch events
        this.viewport.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.viewport.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.viewport.addEventListener('touchend', this.handleTouchEnd.bind(this));

        // Mouse drag events
        this.viewport.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.viewport.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.viewport.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.viewport.addEventListener('mouseleave', this.handleMouseUp.bind(this));
    }

    handleTouchStart(e) {
        this.isDragging = true;
        this.startX = e.touches[0].clientX;
        this.initialScroll = this.viewport.scrollLeft;
        this.stopAutoPlay();
    }

    handleTouchMove(e) {
        if (!this.isDragging) return;
        const x = e.touches[0].clientX;
        const walk = (x - this.startX) * 2;
        this.viewport.scrollLeft = this.initialScroll - walk;
    }

    handleTouchEnd() {
        this.isDragging = false;
        const threshold = 100;
        const diff = this.initialScroll - this.viewport.scrollLeft;

        if (Math.abs(diff) > threshold) {
            diff > 0 ? this.nextSlide() : this.prevSlide();
        }
        this.startAutoPlay();
    }

    handleMouseDown(e) {
        this.isDragging = true;
        this.startX = e.clientX;
        this.initialScroll = this.viewport.scrollLeft;
        this.stopAutoPlay();
        e.preventDefault();
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        const x = e.clientX;
        const walk = (x - this.startX) * 2;
        this.viewport.scrollLeft = this.initialScroll - walk;
    }

    handleMouseUp() {
        this.isDragging = false;
        const threshold = 100;
        const diff = this.initialScroll - this.viewport.scrollLeft;

        if (Math.abs(diff) > threshold) {
            diff > 0 ? this.nextSlide() : this.prevSlide();
        }
        this.startAutoPlay();
    }

    updateCarousel() {
        this.viewport.style.transform = `translateX(-${this.currentIndex * 100}%)`;

        this.nav.querySelectorAll('.nav-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentIndex);
        });

        this.items.forEach(item => item.classList.remove('active'));
        this.items[this.currentIndex].classList.add('active');
    }

    goToSlide(index) {
        this.currentIndex = (index + this.items.length) % this.items.length;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    nextSlide() {
        this.goToSlide(this.currentIndex + 1);
    }

    prevSlide() {
        this.goToSlide(this.currentIndex - 1);
    }

    startAutoPlay() {
        if (!this.autoPlayInterval) {
            this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
        }
    }

    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
        this.updateProgressBar();
    }

    updateProgressBar() {
        if (this.autoPlayInterval) {
            this.progressBar.style.width = '0%';
            this.progressBar.style.transition = 'width 5s linear';
            setTimeout(() => this.progressBar.style.width = '100%', 10);
        }
    }
}

// Initialize carousel
const carousel = new ModernCarousel();