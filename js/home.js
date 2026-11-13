
const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
);

const header = document.getElementById('site-header');

/* -------------------------------- */
/* STABLE STICKY HEADER */
/* -------------------------------- */

function updateHeader() {
    if (!header) return;

    const position = window.scrollY;
    const isCompact = header.classList.contains('is-scrolled');

    if (!isCompact && position >= 110) {
        header.classList.add('is-scrolled');
    } else if (isCompact && position <= 20) {
        header.classList.remove('is-scrolled');
    }
}

window.addEventListener('scroll', updateHeader, {
    passive: true
});

updateHeader();

/* -------------------------------- */
/* ALWAYS-VISIBLE EDITING TIMELINE */
/* -------------------------------- */

(function createHeaderTimeline() {
    if (!header) return;

    const timeline = document.createElement('div');
    timeline.className = 'header-edit-timeline';
    timeline.setAttribute('aria-hidden', 'true');

    const movingTracks = document.createElement('div');
    movingTracks.className = 'header-edit-tracks';

    const trackPatterns = [
        {
            className: 'header-edit-video',
            clips: [
                86, 42, 132, 68, 105, 54,
                122, 79, 46, 112, 64, 97,
                75, 142, 56, 104, 68, 118,
                83, 49, 126, 75, 108, 61
            ]
        },
        {
            className: 'header-edit-audio',
            clips: [
                130, 74, 94, 152, 62, 113,
                80, 146, 65, 124, 91, 107,
                158, 75, 103, 68, 132, 96,
                141, 72, 119, 88
            ]
        },
        {
            className: 'header-edit-music',
            clips: [
                192, 88, 143, 115, 205, 74,
                160, 102, 180, 93, 142, 168,
                87, 202, 112, 155, 98, 187
            ]
        }
    ];

    trackPatterns.forEach(function(pattern, trackIndex) {
        const track = document.createElement('div');

        track.className =
            'header-edit-track ' + pattern.className;

        pattern.clips.forEach(function(width, index) {
            const clip = document.createElement('span');
            clip.className = 'header-edit-clip';
            clip.style.width = width + 'px';

            if (
                trackIndex === 1 ||
                (trackIndex === 2 && index % 3 !== 1)
            ) {
                const waveform = document.createElement('span');
                waveform.className = 'header-edit-waveform';
                clip.appendChild(waveform);
            }

            track.appendChild(clip);
        });

        movingTracks.appendChild(track);
    });

    timeline.appendChild(movingTracks);

    const playhead = document.createElement('div');
    playhead.className = 'header-edit-playhead';

    timeline.appendChild(playhead);
    header.insertBefore(timeline, header.firstChild);

    /*
       Unlike the previous version, the
       timeline is visible immediately.

       It no longer depends on the header
       having the is-scrolled class.
    */

    const timelineStyles = document.createElement('style');

    timelineStyles.textContent = `
        .site-header {
            isolation: isolate;
        }

        .site-header > .header-edit-timeline {
            position: absolute;
            inset: 0;
            z-index: 0;

            overflow: hidden;
            pointer-events: none;

            opacity: .28;
            visibility: visible;

            filter: saturate(.7);

            transition:
                opacity 700ms ease;
        }

        /*
           The header stays exactly the
           same size as before.
        */

        .site-header > .header-identity,
        .site-header > nav {
            position: relative;
            z-index: 2;
        }

        .header-edit-tracks {
            position: absolute;
            top: 50%;
            left: 0;

            width: max-content;

            display: flex;
            flex-direction: column;
            gap: 5px;

            transform:
                translate3d(
                    var(--timeline-x, 0px),
                    -50%,
                    0
                );

            will-change: transform;
        }

        .header-edit-track {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;

            gap: 5px;
            height: 12px;

            white-space: nowrap;
        }

        .header-edit-clip {
            display: block;
            position: relative;
            flex: 0 0 auto;

            height: 100%;

            border-radius: 2px;
            overflow: hidden;

            border: 1px solid rgba(255,255,255,.26);

            box-shadow:
                inset 0 1px 0 rgba(255,255,255,.12);
        }

        /* Muted blue video clips */

        .header-edit-video .header-edit-clip {
            background: #40596a;
            border-color: #70899a;
        }

        .header-edit-video .header-edit-clip:nth-child(3n) {
            background: #354957;
        }

        /* Muted green audio clips */

        .header-edit-audio .header-edit-clip {
            background: #355b54;
            border-color: #658b7e;
        }

        .header-edit-audio .header-edit-clip:nth-child(4n) {
            background: #2d4d47;
        }

        /* Muted amber music clips */

        .header-edit-music .header-edit-clip {
            background: #66513e;
            border-color: #93765a;
        }

        .header-edit-music .header-edit-clip:nth-child(4n) {
            background: #554636;
        }

        /* Subtle audio waveform markings */

        .header-edit-waveform {
            position: absolute;
            inset: 2px 3px;

            background:
                repeating-linear-gradient(
                    90deg,
                    transparent 0px,
                    transparent 4px,
                    rgba(225,240,234,.55) 4px,
                    rgba(225,240,234,.55) 5px,
                    transparent 5px,
                    transparent 8px
                );

            opacity: .62;

            mask-image:
                linear-gradient(
                    to bottom,
                    transparent,
                    #000 30%,
                    #000 70%,
                    transparent
                );
        }

        .header-edit-music .header-edit-waveform {
            opacity: .38;
        }

        /* Thin stationary playhead */

        .header-edit-playhead {
            position: absolute;
            left: 50%;
            top: 13%;
            bottom: 13%;

            width: 1px;

            background: rgba(240,244,245,.58);

            box-shadow:
                0 0 7px rgba(255,255,255,.16);
        }

        /*
           Darken the edges so the header
           text remains clearly readable.
        */

        .header-edit-timeline::after {
            content: "";
            position: absolute;
            inset: 0;

            background:
                linear-gradient(
                    90deg,
                    rgba(17,17,17,.82) 0%,
                    rgba(17,17,17,.30) 28%,
                    rgba(17,17,17,.25) 60%,
                    rgba(17,17,17,.78) 100%
                );

            pointer-events: none;
        }

        /*
           Retain the timeline when the
           header becomes compact.
        */

        .site-header.is-scrolled
        > .header-edit-timeline {
            opacity: .32;
        }

        @media (max-width: 800px) {
            .site-header > .header-edit-timeline {
                opacity: .18;
            }

            .site-header.is-scrolled
            > .header-edit-timeline {
                opacity: .18;
            }

            .header-edit-playhead {
                left: 58%;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .site-header > .header-edit-timeline {
                display: none;
            }
        }
    `;

    document.head.appendChild(timelineStyles);

    /* -------------------------------- */
    /* SCROLL-CONTROLLED MOVEMENT */
    /* -------------------------------- */

    let pendingFrame = false;

    function updateTimelinePosition() {
        pendingFrame = false;

        if (reducedMotion.matches) return;

        const trackWidth = movingTracks.scrollWidth;
        const viewportWidth = header.clientWidth;

        const maxTravel = Math.max(
            0,
            trackWidth - viewportWidth
        );

        // Distribute the timeline's entire horizontal travel over the full
        // scrollable height, rather than stopping when its x-offset hits a cap.
        const scrollRange = Math.max(1,
            document.documentElement.scrollHeight - window.innerHeight
        );
        const progress = Math.min(1, Math.max(0, window.scrollY / scrollRange));
        const movement = -maxTravel * progress;

        movingTracks.style.setProperty(
            '--timeline-x',
            movement + 'px'
        );
    }

    function requestTimelineUpdate() {
        if (pendingFrame) return;

        pendingFrame = true;

        requestAnimationFrame(updateTimelinePosition);
    }

    window.addEventListener(
        'scroll',
        requestTimelineUpdate,
        { passive: true }
    );

    window.addEventListener(
        'resize',
        requestTimelineUpdate
    );

    window.addEventListener(
        'load',
        requestTimelineUpdate
    );

    requestTimelineUpdate();
})();

/* Keep every mobile project title AND its type on one shared caption line.
   Long titles shrink only as much as their actual available width requires. */
(function fitMobileProjectCaptions() {
    const mobile = window.matchMedia('(max-width: 700px)');
    function fit() {
        document.querySelectorAll('#work .editorial-grid .project-heading').forEach(heading => {
            const title = heading.querySelector('h4');
            const type = heading.querySelector('.project-type');
            if (!title || !type) return;
            title.style.removeProperty('--mobile-title-size');
            if (!mobile.matches || heading.clientWidth === 0) return;

            let size = 25;
            const gap = parseFloat(getComputedStyle(heading).columnGap) || 6;
            const available = Math.max(1, heading.clientWidth - type.getBoundingClientRect().width - gap - 2);
            title.style.setProperty('--mobile-title-size', size + 'px');
            while (size > 10 && title.scrollWidth > available) {
                size -= 0.5;
                title.style.setProperty('--mobile-title-size', size + 'px');
            }
        });
        if (!mobile.matches) return;
        // Each category uses one consistent title size, based on its reference card.
        for (const [panelId, referenceName] of [
            ['narrative-work', 'Crazy F***ing Dancing Lady'],
            ['commercial-work', 'Live at the Bristol Fringe']
        ]) {
            const panel = document.getElementById(panelId);
            if (!panel) continue;
            const titles = [...panel.querySelectorAll('.project-heading h4')];
            const reference = titles.find(title => title.textContent.trim() === referenceName);
            const referenceSize = reference && parseFloat(reference.style.getPropertyValue('--mobile-title-size'));
            if (!Number.isFinite(referenceSize)) continue;
            titles.forEach(title => title.style.setProperty('--mobile-title-size', referenceSize + 'px'));
        }
    }
    let scheduled = false;
    function schedule() {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => { scheduled = false; fit(); });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, {once:true});
    else schedule();
    document.fonts?.ready.then(schedule).catch(() => {});
    window.addEventListener('resize', schedule, {passive:true});
    document.querySelectorAll('[data-show-work]').forEach(button => {
        button.addEventListener('click', () => requestAnimationFrame(schedule));
    });
})();

/* -------------------------------- */
/* FLOATING BACKGROUND SPECKS */
/* -------------------------------- */

const dustCanvas = document.getElementById('dust-canvas');
const dustContext = dustCanvas && dustCanvas.getContext('2d');

if (dustContext) {
    let particles = [];
    let width = 0;
    let height = 0;
    let lastFrame = 0;
    let animationId = null;

    const density = 33000;
    const maxCount = 45;

    function makeParticle() {
        const direction = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;

        return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: .45 + Math.random() * .85,
            vx: Math.cos(direction) * speed,
            vy: Math.sin(direction) * speed,
            opacity: .10 + Math.random() * .20,
            offset: Math.random() * Math.PI * 2,
            flicker: .35 + Math.random() * .65
        };
    }

    function draw(time) {
        dustContext.clearRect(0, 0, width, height);

        particles.forEach(p => {
            const opacity =
                p.opacity *
                (
                    .85 +
                    Math.sin(
                        time * .001 * p.flicker + p.offset
                    ) * .15
                );

            dustContext.beginPath();

            dustContext.arc(
                p.x,
                p.y,
                p.radius,
                0,
                Math.PI * 2
            );

            dustContext.fillStyle =
                'rgba(255,255,255,' + opacity + ')';

            dustContext.fill();
        });
    }

    function resize() {
        width = innerWidth;
        height = innerHeight;

        const ratio = Math.min(
            devicePixelRatio || 1,
            2
        );

        dustCanvas.width = Math.round(width * ratio);
        dustCanvas.height = Math.round(height * ratio);

        dustContext.setTransform(
            ratio, 0, 0, ratio, 0, 0
        );

        const count = Math.min(
            maxCount,
            Math.max(
                12,
                Math.round(width * height / density)
            )
        );

        particles = Array.from(
            { length: count },
            makeParticle
        );

        draw(performance.now());
    }

    function animate(time) {
        const elapsed = lastFrame
            ? Math.min((time - lastFrame) / 1000, .05)
            : 0;

        lastFrame = time;

        particles.forEach(p => {
            p.x += p.vx * elapsed;
            p.y += p.vy * elapsed;

            if (p.x < -5) p.x = width + 5;
            if (p.x > width + 5) p.x = -5;
            if (p.y < -5) p.y = height + 5;
            if (p.y > height + 5) p.y = -5;
        });

        draw(time);

        animationId = requestAnimationFrame(animate);
    }

    function stop() {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    function resume() {
        if (
            !reducedMotion.matches &&
            !document.hidden &&
            animationId === null
        ) {
            lastFrame = 0;
            animationId = requestAnimationFrame(animate);
        }
    }

    resize();

    window.addEventListener('resize', resize);

    resume();

    reducedMotion.addEventListener('change', () => {
        if (reducedMotion.matches) {
            stop();
            draw(performance.now());
        } else {
            resume();
        }
    });

    document.addEventListener(
        'visibilitychange',
        () => document.hidden ? stop() : resume()
    );
}

/* -------------------------------- */
/* ORIGINAL 3D CAROUSELS */
/* -------------------------------- */

document.querySelectorAll('.coverflow').forEach(function(carousel) {

    const stage = carousel.querySelector('.coverflow-stage');

    const cards = Array.from(
        carousel.querySelectorAll('.project-card')
    );

    const previous = carousel.querySelector('.coverflow-prev');
    const next = carousel.querySelector('.coverflow-next');
    const counter = carousel.querySelector('.coverflow-counter');

    let current = 0;
    let pointerStart = null;
    let preventNextClick = false;
    let lastScroll = 0;

    const total = cards.length;

    function updateCarousel() {
        const stageWidth = stage.clientWidth;
        const mobile = innerWidth <= 800;
        const spacing = stageWidth * (mobile ? .43 : .34);

        cards.forEach(function(card, index) {
            let distance = index - current;

            if (distance > total / 2) {
                distance -= total;
            }

            if (distance < -total / 2) {
                distance += total;
            }

            const depth = Math.abs(distance);

            card.classList.remove(
                'is-active',
                'is-side',
                'is-hidden'
            );

            if (distance === 0) {
                card.classList.add('is-active');
            } else if (depth === 1) {
                card.classList.add('is-side');
            } else {
                card.classList.add('is-hidden');
            }

            const x = distance * spacing;
            const z = -depth * (mobile ? 120 : 200);

            const angle = distance === 0
                ? 0
                : distance > 0 ? -38 : 38;

            const scale = depth === 0 ? 1 : .82;

            card.style.transform =
                'translate(-50%, -50%) ' +
                'translate3d(' + x + 'px, 0px, ' + z + 'px) ' +
                'rotateY(' + angle + 'deg) ' +
                'scale(' + scale + ')';

            card.style.opacity =
                depth === 0 ? '1' : depth === 1 ? '.65' : '0';

            card.style.zIndex = total - depth;
            card.style.pointerEvents = depth <= 1
                ? 'auto'
                : 'none';

            card.setAttribute(
                'aria-hidden',
                depth > 1 ? 'true' : 'false'
            );

            card.tabIndex = distance === 0 ? 0 : -1;

            if (depth > 1) {
                card.setAttribute('inert', '');
            } else {
                card.removeAttribute('inert');
            }
        });

        counter.textContent =
            String(current + 1).padStart(2, '0') +
            ' / ' +
            String(total).padStart(2, '0');
    }

    function moveCarousel(direction) {
        current = (current + direction + total) % total;
        updateCarousel();
    }

    previous.addEventListener(
        'click',
        () => moveCarousel(-1)
    );

    next.addEventListener(
        'click',
        () => moveCarousel(1)
    );

    // Handle side-card activation BEFORE the anchor's default navigation.
    // This also catches clicks on nested images, headings and text.
    stage.addEventListener('click', function(event) {
        const card = event.target.closest('.project-card');
        if (!card || !stage.contains(card)) return;
        const index = cards.indexOf(card);
        if (index < 0) return;
        if (preventNextClick) {
            event.preventDefault();
            event.stopImmediatePropagation();
            preventNextClick = false;
            return;
        }
        if (index !== current) {
            event.preventDefault();
            event.stopImmediatePropagation();
            current = index;
            updateCarousel();
        }
        // The currently centred card keeps its normal link behaviour.
    }, true);

    cards.forEach((card, index) => {
        card.addEventListener('click', function(event) {
            if (preventNextClick) {
                event.preventDefault();
                preventNextClick = false;
                return;
            }

            if (index !== current) {
                event.preventDefault();
                current = index;
                updateCarousel();
            }
        });
    });

    stage.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            moveCarousel(1);
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            moveCarousel(-1);
        }
    });

    stage.addEventListener('pointerdown', function(event) {
        if (
            event.pointerType === 'mouse' &&
            event.button !== 0
        ) {
            return;
        }

        pointerStart = event.clientX;
    });

    stage.addEventListener('pointerup', function(event) {
        if (pointerStart === null) return;

        const difference = event.clientX - pointerStart;
        pointerStart = null;

        if (Math.abs(difference) > 45) {
            preventNextClick = true;

            if (difference < 0) {
                moveCarousel(1);
            } else {
                moveCarousel(-1);
            }
        }
    });

    stage.addEventListener(
        'pointercancel',
        () => pointerStart = null
    );

    stage.addEventListener('wheel', function(event) {
        if (Math.abs(event.deltaX) < 12) return;

        event.preventDefault();

        const now = performance.now();

        if (now - lastScroll < 650) return;

        lastScroll = now;

        moveCarousel(event.deltaX > 0 ? 1 : -1);

    }, { passive: false });

    window.addEventListener('resize', updateCarousel);

    updateCarousel();
    stage.classList.add('portfolio-carousel-ready');
});

/* -------------------------------- */
/* ACTIVE NAVIGATION */
/* -------------------------------- */

const navigationLinks = Array.from(
    document.querySelectorAll('.site-header nav a')
);

function updateActiveNavigation() {
    const position =
        scrollY +
        header.getBoundingClientRect().height +
        90;

    let activeSection = 'top';

    const sections = ['about', 'work', 'contact']
        .map(id => ({
            id,
            element: document.getElementById(id)
        }))
        .sort(
            (a, b) =>
                a.element.offsetTop - b.element.offsetTop
        );

    sections.forEach(s => {
        if (
            position >=
            s.element.getBoundingClientRect().top + scrollY
        ) {
            activeSection = s.id;
        }
    });

    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 24) activeSection = 'contact';

    navigationLinks.forEach(a => {
        const isActive =
            a.getAttribute('href').replace('#', '') === activeSection;

        a.classList.toggle('is-active', isActive);

        if (isActive) {
            a.setAttribute('aria-current', 'location');
        } else {
            a.removeAttribute('aria-current');
        }
    });
}

window.addEventListener(
    'scroll',
    updateActiveNavigation,
    { passive: true }
);

window.addEventListener(
    'resize',
    updateActiveNavigation
);

updateActiveNavigation();

/* -------------------------------- */
/* HOME BUTTON: handled by consolidated header navigation below */



/* Return from project: initialise both carousels behind a hidden page,
   set the final scroll position once, then reveal without a transition. */
(function () {
  const root = document.documentElement;
  let started = false;
  let ready = false;
  const returning = () => root.classList.contains('returning-from-project');
  const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
  function target() {
    // Only project pages belonging to Commercial & Live Work set this flag.
    // Narrative returns and normal My Work navigation keep their existing target.
    const commercialReturn = sessionStorage.getItem('portfolioReturnCarousel') === 'commercial';
    const category = commercialReturn
      ? document.querySelectorAll('#work .work-category')[1]
      : document.querySelector('#work .work-category');
    const heading = category?.querySelector('h3');
    if (!heading) return null;
    const header = document.getElementById('site-header');
    const controls = category.querySelector('.coverflow-controls');
    const fixedBottom = header ? header.getBoundingClientRect().bottom : 0;
    if (!controls) return Math.max(0, scrollY + heading.getBoundingClientRect().top - fixedBottom - 26);
    // Match the gap beneath the fixed header to the gap beneath the
    // narrative carousel arrows. Measure both after both carousels are ready.
    const topGap = heading.getBoundingClientRect().top - fixedBottom;
    const bottomGap = window.innerHeight - controls.getBoundingClientRect().bottom;
    return Math.max(0, scrollY + (topGap - bottomGap) / 2);
  }
  // Reuse exactly this framing for the header's My Work link.
  window.portfolioWorkLandingTarget = target;
  async function imageReady(img) {
    img.loading = 'eager';
    if (!img.complete) await new Promise(resolve => {
      img.addEventListener('load', resolve, {once:true});
      img.addEventListener('error', resolve, {once:true});
    });
    if (img.naturalWidth && img.decode) {
      try { await img.decode(); } catch (_) {}
    }
  }
  async function prepare() {
    if (!returning() || started || ready) return;
    started = true;
    root.classList.remove('home-return-ready');
    try { history.scrollRestoration = 'manual'; } catch (_) {}
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    const imgs = [...document.querySelectorAll('#work .project-image img')];
    try {
      await Promise.all([document.fonts ? document.fonts.ready : Promise.resolve(), ...imgs.map(imageReady)]);
      // Allow both carousels' initial positioning and image dimensions to settle.
      for (let n = 0; n < 5; n++) await frame();
      const destination = target();
      if (destination !== null) window.scrollTo({top: destination, left: 0, behavior: 'instant'});
      for (let n = 0; n < 3; n++) await frame();
      const corrected = target();
      if (corrected !== null) window.scrollTo({top: corrected, left: 0, behavior: 'instant'});
      await frame();
      await frame();
    } finally {
      ready = true;
      // Restart the body fade on EVERY return, including browser history restores.
      // Frame and images have already settled before visibility is released.
      root.classList.remove('home-return-fading');
      void document.body.offsetWidth; // reset any previously completed animation
      root.classList.add('home-return-ready', 'home-return-fading');
      await frame();
      window.portfolioPlayPageFade?.();
      try { sessionStorage.removeItem('portfolioReturnCarousel'); } catch (_) {}
      // Do not perform further automatic scroll corrections: user has full control.
      started = false;
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', prepare, {once:true});
  } else prepare();
  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      root.classList.add('returning-from-project');
      root.classList.remove('home-return-ready');
      ready = false;
    }
    prepare();
  });
})();

/* -------------------------------- */
/* CINEMATIC SCROLL REVEALS */
/* -------------------------------- */

const revealElements = document.querySelectorAll('.reveal');

// Skip the homepage entrance animations only on a return from a project page.
const returningFromProject = sessionStorage.getItem('portfolioReturningFromProject') === '1';
if (returningFromProject) {
    revealElements.forEach(element => element.classList.add('is-visible'));
    document.documentElement.classList.add('motion-ready');
}

window.addEventListener('pageshow', function(event) {
    // BFCache restores the existing DOM. Don't replay reveals on back navigation.
    if (event.persisted) {
        revealElements.forEach(element => element.classList.add('is-visible'));
        document.documentElement.classList.add('motion-ready');
        document.documentElement.classList.add('returning-from-project');
    }
});

if (
    !returningFromProject &&
    !document.documentElement.classList.contains('returning-from-project') &&
    'IntersectionObserver' in window &&
    !reducedMotion.matches
) {
    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('is-visible');
                    obs.unobserve(e.target);
                }
            });
        },
        {
            threshold: .06,
            rootMargin: '0px 0px -35px 0px'
        }
    );

    revealElements.forEach(e => observer.observe(e));

    document.documentElement.classList.add('motion-ready');
}

// Keep the current return visit static; future direct homepage visits can animate normally.
try { sessionStorage.removeItem('portfolioReturningFromProject'); } catch (_) {}


/* Navigation links are handled by a single click listener, registered below.
   The duplicate home.js/inline controllers previously fought over scroll position. */
/* Clickable editorial category headings: match Back to My Work framing. */
(function(){
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const categories=[...document.querySelectorAll('#work .work-category')];
  function categoryTarget(index){
    if(index===0 && typeof window.portfolioWorkLandingTarget==='function')
      return window.portfolioWorkLandingTarget();
    const category=categories[index];
    const heading=category?.querySelector('h3');
    const controls=category?.querySelector('.coverflow-controls');
    if(!heading || !controls) return null;
    const header=document.querySelector('.site-header');
    const headerBottom=header?.getBoundingClientRect().bottom||0;
    // Prefer the same framed view as Narrative: one header above and
    // no previous carousel visible, with the controls near the bottom.
    const topPadding=25, bottomPadding=28;
    const headingTop=scrollY+heading.getBoundingClientRect().top;
    const controlsBottom=scrollY+controls.getBoundingClientRect().bottom;
    const topAligned=headingTop-headerBottom-topPadding;
    const available=innerHeight-headerBottom-topPadding-bottomPadding;
    const compositionHeight=controlsBottom-headingTop;
    // Keep the heading and arrows balanced if they do not fit top-aligned.
    const balanced=(headingTop+controlsBottom-headerBottom-innerHeight)/2;
    return Math.max(0, compositionHeight<=available ? topAligned : balanced);
  }
  document.querySelectorAll('.work-heading-link').forEach((link,index)=>{
    link.addEventListener('click',e=>{
      const dest=categoryTarget(index);
      if(dest===null) return;
      e.preventDefault();
      scrollTo({top:dest,behavior:reduced.matches?'auto':'smooth'});
      history.replaceState(history.state,'',index===0?'#work':'#commercial-work');
    });
  });
})();

/* One immediate, reliable header scroll handler. */
(()=>{
 const links=document.querySelectorAll('.site-header nav a[href^="#"]');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 links.forEach(link=>link.addEventListener('click',(event)=>{
   const id=link.getAttribute('href').slice(1);
   const target=id==='top'?null:document.getElementById(id);
   if(id!=='top'&&!target)return;
   event.preventDefault();
   const header=document.querySelector('.site-header');
   const offset=(header?.getBoundingClientRect().height||0)+16;
   const top=target?Math.max(0,window.scrollY+target.getBoundingClientRect().top-offset):0;
   window.scrollTo({top,behavior:reduced.matches?'instant':'smooth'});
   links.forEach(a=>{
     a.classList.toggle('is-active',a===link);
     if(a===link)a.setAttribute('aria-current','location');
     else a.removeAttribute('aria-current');
   });
   history.replaceState(history.state,'',id==='top'?location.pathname+location.search:'#'+id);
 },{capture:true}));
})();
