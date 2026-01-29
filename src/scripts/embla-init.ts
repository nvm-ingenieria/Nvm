import EmblaCarousel, { type EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";

type Root = HTMLElement & { __embla_inited__?: boolean };

function initEmbla(root: Root) {
    if (!root || root.__embla_inited__) return;
    root.__embla_inited__ = true;

    const viewport = root.querySelector<HTMLElement>("[data-embla-viewport]");
    const slides = Array.from(root.querySelectorAll<HTMLElement>("[data-embla-slide]"));
    const btnPrev = root.querySelector<HTMLButtonElement>("[data-embla-prev]");
    const btnNext = root.querySelector<HTMLButtonElement>("[data-embla-next]");
    if (!viewport || slides.length === 0) return;

    const options: EmblaOptionsType = {
        align: "center",
        loop: true,
        containScroll: "trimSnaps",
        slidesToScroll: 1,
        dragFree: false,
        skipSnaps: false,
        duration: 28,
        inViewThreshold: 0.6,
    };

    const autoplay = Autoplay({
        delay: Number(root.dataset.delay || 3200),
        stopOnInteraction: false, //
        stopOnMouseEnter: false,  //
    });

    const embla = EmblaCarousel(viewport, options, [autoplay]);

    const updateSelected = () => {
        const selected = embla.selectedScrollSnap();
        slides.forEach((slide, i) => slide.toggleAttribute("data-selected", i === selected));
    };

    updateSelected();
    embla.on("select", updateSelected);
    embla.on("reInit", updateSelected);

    // Botones: mueve y reanuda
    btnPrev?.addEventListener("click", () => {
        embla.scrollPrev();
        autoplay.play();
    });
    btnNext?.addEventListener("click", () => {
        embla.scrollNext();
        autoplay.play();
    });

    // Desktop hover
    root.addEventListener("mouseenter", () => autoplay.stop(), { passive: true });
    root.addEventListener("mouseleave", () => autoplay.play(), { passive: true });

    // Mobile/touch/pointer
    root.addEventListener("pointerdown", () => autoplay.stop(), { passive: true });
    root.addEventListener("pointerup", () => autoplay.play(), { passive: true });
    root.addEventListener("pointercancel", () => autoplay.play(), { passive: true });

    // Reanuda seguro
    embla.on("settle", () => autoplay.play());

    // Cambio de pestaña
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) autoplay.stop();
        else autoplay.play();
    });
}

function initAll() {
    document.querySelectorAll<Root>("[data-embla]").forEach(initEmbla);
}

function boot() {
    initAll();
    requestAnimationFrame(initAll);
}

document.addEventListener("DOMContentLoaded", boot);
document.addEventListener("astro:page-load", boot);
boot();

document.addEventListener("astro:after-swap", boot);

const obs = new MutationObserver(() => initAll());
obs.observe(document.documentElement, { childList: true, subtree: true });