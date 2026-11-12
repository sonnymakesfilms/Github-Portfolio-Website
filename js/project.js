// Slideshow: arrows, keyboard and swipe all use the same transitions.
document.querySelectorAll('.film-gallery').forEach(function(gallery){
const viewport=gallery.querySelector('.gallery-viewport'),track=gallery.querySelector('.gallery-track'),slides=[...gallery.querySelectorAll('.gallery-slide')],counter=gallery.querySelector('.gallery-counter');let current=0,startX=null;
function show(index){current=(index+slides.length)%slides.length;track.style.transform='translateX(-'+(current*100)+'%)';counter.textContent=String(current+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');slides.forEach((s,i)=>s.setAttribute('aria-hidden',i===current?'false':'true'))}
gallery.querySelector('.gallery-prev').addEventListener('click',()=>show(current-1));gallery.querySelector('.gallery-next').addEventListener('click',()=>show(current+1));
viewport.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){e.preventDefault();show(current-1)}if(e.key==='ArrowRight'){e.preventDefault();show(current+1)}});
viewport.addEventListener('pointerdown',e=>{startX=e.clientX});viewport.addEventListener('pointerup',e=>{if(startX===null)return;const dx=e.clientX-startX;startX=null;if(Math.abs(dx)>40)show(current+(dx<0?1:-1))});viewport.addEventListener('pointercancel',()=>startX=null);show(0);
});
