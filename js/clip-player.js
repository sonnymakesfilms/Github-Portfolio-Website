/* Project-specific scene listings. Video files stay in the visitor's videos folder. */
(() => {
  // Netlify's clean URLs omit ".html" (e.g. /projects/last-man-standing).
  // Treat those as the same project as local .html file URLs.
  const lastSegment = decodeURIComponent(location.pathname.replace(/\/$/, '').split('/').pop() || '').toLowerCase();
  const page = lastSegment && !lastSegment.includes('.') ? lastSegment + '.html' : lastSegment;
  const scenes = {
    'last-man-standing.html': [
      {youtube:'m72vFjBxZ8k', poster:'opening.png', title:'Opening'},
      {youtube:'sE2OQscArss', poster:'ending.png', title:'The last Man Standing'},
      {youtube:'e8CkSOMx-eY', poster:'you are so beautiful b.png', title:'You are so Beautiful'}
    ],
    'under-my-breath.html': [
      {youtube:'FOs6PamrqQ0', poster:'Under my Breath still.png', title:'Under my Breath'}
    ],
    'frank-wakes-up.html': [
      {youtube:'JWYol3gYnzg', poster:'FWU.png', title:'Frank Meets Himself'}
    ],
    'modern-love.html': [],
    'shouldve-said-something.html': [
      {youtube:'GL6n8Rs2bO4',poster:'Soss.png',title:"Should've Said Something"}
    ],
    'live-at-the-bristol-fringe.html': [
      {youtube:'q2VrjKDhO7c',poster:'Creator.png',title:'"Creator" - Live at the Bristol Fringe'}
    ],
    'live-at-the-exchange.html': [],
    'ave-maria.html': [
      {youtube:'-Sz3yCe8Iis',poster:'Woman in the Clergy.png',title:'A woman in the Clergy'}
    ],
    'down-to-the-felt.html': [
      {youtube:'8EIBcIrlqws',poster:'thumbnail trialer.png',title:'Down to the Felt trailer'}
    ]
  };
  if (!Object.prototype.hasOwnProperty.call(scenes,page)) return;
  const frame = document.querySelector('#watch-cinema .project-video-frame');
  if (!frame) return;
  // Ensure repeat visits also rebuild the correct poster and clip metadata.
  frame.replaceChildren();
  const holder = document.createElement('div');
  holder.className = 'portfolio-clip-player';
  holder.style.position = 'relative';
  frame.append(holder);
  if (page === 'modern-love.html' || page === 'live-at-the-exchange.html') {
    const still = document.createElement('img');
    still.className = 'portfolio-coming-image';
    still.src = page === 'modern-love.html' ? '../images/Coming soon.png' : '../images/Exchange thmbnail.png';
    still.alt = page === 'modern-love.html' ? 'Still from Modern Love — currently in post-production' : 'Still from Live at the Exchange — currently in post-production';
    const badge = document.createElement('span');
    badge.className = 'portfolio-coming-badge';
    badge.textContent = 'Coming Soon';
    holder.append(still,badge);
    return;
  }
  const playlist = scenes[page];
  let index = 0;
  // Use YouTube's own player and thumbnail from the first render.
  // No custom poster, play button or label overlays are placed over YouTube.
  const youtubeFrame = document.createElement('iframe');
  youtubeFrame.className = 'portfolio-youtube-embed';
  youtubeFrame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  youtubeFrame.allowFullscreen = true;
  youtubeFrame.referrerPolicy = 'strict-origin-when-cross-origin';
  youtubeFrame.style.cssText = 'display:block;width:100%;height:100%;border:0;position:absolute;inset:0;';
  const video = document.createElement('video');
  video.controls = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.style.cssText = 'display:none;width:100%;height:100%;position:absolute;inset:0;';
  holder.append(youtubeFrame, video);
  function select(next) {
    index = (next + playlist.length) % playlist.length;
    const clip = playlist[index];
    video.dataset.movFallback = '';
    video.pause();
    video.removeAttribute('src');
    video.load();
    youtubeFrame.removeAttribute('src'); // Stop any previous YouTube playback.
    if (clip.youtube) {
      video.style.display = 'none';
      youtubeFrame.style.display = 'block';
      youtubeFrame.title = clip.title + ' — YouTube player';
      // YouTube displays its standard thumbnail, title and playback UI.
      youtubeFrame.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(clip.youtube) + '?playsinline=1&rel=0';
    } else {
      youtubeFrame.style.display = 'none';
      video.style.display = 'block';
      video.setAttribute('aria-label', clip.title);
      video.poster = '../images/' + encodeURIComponent(clip.poster);
      video.src = '../videos/' + encodeURIComponent(clip.file);
      video.load();
    }
  }
  video.addEventListener('error', () => {
    const clip = playlist[index];
    if (clip?.file?.toLowerCase().endsWith('.mp4') && !video.dataset.movFallback) {
      video.dataset.movFallback = 'true';
      video.src = '../videos/' + encodeURIComponent(clip.file.replace(/\.mp4$/i, '.mov'));
      video.load();
    }
  });
  if (playlist.length > 1) {
    for (const [direction,step,symbol] of [['prev',-1,'‹'],['next',1,'›']]) {
      const arrow = document.createElement('button');
      arrow.type = 'button';
      arrow.className = 'portfolio-clip-arrow '+direction;
      arrow.textContent = symbol;
      arrow.setAttribute('aria-label',direction==='prev'?'Previous clip':'Next clip');
      // Keep navigation usable even when a page's older CSS overrides the shared styles.
      arrow.style.cssText = 'position:absolute;top:50%;'+(direction==='prev'?'left:0;':'right:0;')+'transform:translateY(-50%);z-index:100;display:flex;align-items:center;justify-content:center;width:40px;height:56px;padding:0;border:0;border-radius:0;background:rgba(0,0,0,.48);color:#fff;font:32px/1 Arial,sans-serif;cursor:pointer;pointer-events:auto;visibility:visible;opacity:1;';
      arrow.addEventListener('click',()=>select(index+step));
      holder.append(arrow);
    }
  }
  select(0);
})();
