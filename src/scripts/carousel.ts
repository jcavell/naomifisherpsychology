document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector<HTMLElement>('.carousel-track');
    if (!track) return;

    const slides = Array.from(track.children) as HTMLElement[];
    const nextButton = document.querySelector<HTMLButtonElement>('.carousel-btn.next');
    const prevButton = document.querySelector<HTMLButtonElement>('.carousel-btn.prev');
    const dotsNav = document.querySelector<HTMLElement>('.carousel-nav-dots');
    if (!nextButton || !prevButton || !dotsNav) return; // Ensure all necessary elements exist

    const dots = Array.from(dotsNav.children) as HTMLButtonElement[];


    if (slides.length === 0) return;
    const slideWidth: number = slides[0].getBoundingClientRect().width;


    const setSlidePosition = (slide: HTMLElement, index: number) => {
        slide.style.left = slideWidth * index + 'px';
    };
    slides.forEach(setSlidePosition);

    const moveToSlide = (trackEl: HTMLElement, currentSlide: HTMLElement, targetSlide: HTMLElement) => {

        trackEl.style.transform = `translateX(-${targetSlide.style.left})`;
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };

    const updateDots = (currentDot: HTMLElement, targetDot: HTMLElement) => {
        currentDot.classList.remove('active');
        targetDot.classList.add('active');
    };


    nextButton.addEventListener('click', () => {
        const currentSlide = track.querySelector<HTMLElement>('.current-slide') || slides[0];

        const nextSlide = (currentSlide.nextElementSibling as HTMLElement) || slides[0];
        const currentDot = dotsNav.querySelector<HTMLElement>('.active') || dots[0];
        const nextDot = (currentDot.nextElementSibling as HTMLElement) || dots[0];

        moveToSlide(track, currentSlide, nextSlide);
        updateDots(currentDot, nextDot);
    });


    prevButton.addEventListener('click', () => {
        const currentSlide = track.querySelector<HTMLElement>('.current-slide') || slides[0];

        const prevSlide = (currentSlide.previousElementSibling as HTMLElement) || slides[slides.length - 1];
        const currentDot = dotsNav.querySelector<HTMLElement>('.active') || dots[0];
        const prevDot = (currentDot.previousElementSibling as HTMLElement) || dots[dots.length - 1];

        moveToSlide(track, currentSlide, prevSlide);
        updateDots(currentDot, prevDot);
    });


    dotsNav.addEventListener('click', e => {
        const targetDot = (e.target as HTMLElement).closest<HTMLButtonElement>('button');

        if (!targetDot) return;

        const currentSlide = track.querySelector<HTMLElement>('.current-slide') || slides[0];
        const currentDot = dotsNav.querySelector<HTMLElement>('.active') || dots[0];
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        const targetSlide = slides[targetIndex];

        moveToSlide(track, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
    });


    slides[0].classList.add('current-slide');
});
