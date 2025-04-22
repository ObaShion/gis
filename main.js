document.addEventListener("DOMContentLoaded", () => {

    gsap.registerPlugin(ScrollTrigger);

    gsap.from("img", {
        opacity: 0,
        duration: 3.0,
        ease: "power3.out"
    });

    gsap.from(".content", {
        opacity: 0,
        y: 50,
        duration: 1
    });
});