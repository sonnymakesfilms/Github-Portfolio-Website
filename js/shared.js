
const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
);

const header = document.getElementById('site-header');

/* -------------------------------- */
/* STABLE STICKY HEADER */
/* -------------------------------- */

/*
   Separate thresholds prevent the header
   from flickering when its height changes.

   Shrink when scrolling beyond 110px.
   Expand again when returning within 20px.

   Between those points, retain the
   current state.
*/

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

        const scrollableHeight = Math.max(
            1,
            document.documentElement.scrollHeight -
            window.innerHeight
        );

        const progress = Math.min(
            1,
            Math.max(
                0,
                window.scrollY / scrollableHeight
            )
        );

        const trackWidth = movingTracks.scrollWidth;
        const viewportWidth = header.clientWidth;

        const maxTravel = Math.max(
            0,
            trackWidth - viewportWidth
        );

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

/* -------------------------------- */
/* FLOATING WHITE BACKGROUND SPECKS */
/* -------------------------------- */

// Subtle drifting specks remain UNDER every opaque image frame.

const dustCanvas = document.getElementById('dust-canvas');
const dustContext = dustCanvas && dustCanvas.getContext('2d');

// The homepage may retain its subtle particles; project pages are intentionally still.
if (dustContext && !document.body.classList.contains('project-page')) {

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
            radius: 0.45 + Math.random() * 0.85,
            vx: Math.cos(direction) * speed,
            vy: Math.sin(direction) * speed,
            opacity: 0.10 + Math.random() * 0.20,
            offset: Math.random() * Math.PI * 2,
            flicker: 0.35 + Math.random() * 0.65
        };
    }

    function draw(time) {
        dustContext.clearRect(0, 0, width, height);

        particles.forEach(p => {
            const opacity =
                p.opacity *
                (
                    0.85 +
                    Math.sin(
                        time * 0.001 * p.flicker + p.offset
                    ) * 0.15
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
            ? Math.min((time - lastFrame) / 1000, 0.05)
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
