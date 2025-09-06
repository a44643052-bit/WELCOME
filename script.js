// script.js - controls envelope interaction, audio, hearts
const envelope = document.getElementById('envelope');
const envelopeWrap = document.getElementById('envelopeWrap');
const flap = document.getElementById('flap');
const letter = document.getElementById('letter');
const bgAudio = document.getElementById('bgAudio');
const muteBtn = document.getElementById('muteBtn');
const hearts = document.getElementById('hearts');

let opened = false;
let playing = false;

// Try to autoplay (may be blocked); we still provide control
function tryAutoplay(){
  bgAudio.volume = 0.02;
  const p = bgAudio.play();
  if(p !== undefined){
    p.then(()=>{ playing = true; muteBtn.textContent='Pause'; rampVolume(0.35); }).catch(()=>{ playing=false; muteBtn.textContent='Play'; });
  }
}
function rampVolume(target){
  let v = bgAudio.volume;
  const id = setInterval(()=>{ v = Math.min(target, v + 0.02); bgAudio.volume = v; if(v>=target) clearInterval(id); }, 300);
}

// Toggle envelope open/close
function toggleEnvelope(){
  opened = !opened;
  envelope.classList.toggle('open', opened);
  if(opened){
    // slide letter out a bit more and ensure audio plays
    letter.setAttribute('aria-hidden','false');
    if(!playing) {
      bgAudio.play().then(()=>{ playing=true; muteBtn.textContent='Pause'; rampVolume(0.35); }).catch(()=>{ /* blocked */ });
    }
    // burst hearts
    burstHearts(10);
  } else {
    letter.setAttribute('aria-hidden','true');
  }
}

envelopeWrap.addEventListener('click', toggleEnvelope);
envelopeWrap.addEventListener('keypress', (e)=>{ if(e.key==='Enter' || e.key===' ') toggleEnvelope(); });

// Mute / unmute control (acts as play/pause)
muteBtn.addEventListener('click', ()=>{
  if(playing){ bgAudio.pause(); playing=false; muteBtn.textContent='Play'; }
  else{ bgAudio.play().then(()=>{ playing=true; muteBtn.textContent='Pause'; rampVolume(0.35); }).catch(()=>{ alert('Tap the envelope to start audio if your browser blocks autoplay.'); }); }
});

// Hearts spawning
const HEART_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 10-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" fill="#ff6fa8"/></svg>`;

function burstHearts(n=6){
  for(let i=0;i<n;i++){
    const el = document.createElement('div');
    el.className='heart';
    el.innerHTML = HEART_SVG;
    const left = Math.random()*60 + 20; // percent
    const size = 16 + Math.random()*26;
    el.style.left = left + '%';
    el.style.bottom = (20 + Math.random()*10) + 'px';
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    const delay = Math.random()*0.6;
    const duration = 3 + Math.random()*2.6;
    el.style.animation = `floatUp2 ${duration}s ${delay}s linear forwards`;
    hearts.appendChild(el);
    setTimeout(()=> el.remove(), (delay+duration)*1000 + 200);
  }
}

// gentle recurring hearts
setInterval(()=>{ if(Math.random()>0.45) burstHearts(2); }, 1600);

// initial attempt to autoplay
tryAutoplay();

// accessibility: focus ring on keyboard nav
envelopeWrap.addEventListener('focus', ()=> envelopeWrap.style.outline='4px solid rgba(255,150,200,0.12)');
envelopeWrap.addEventListener('blur', ()=> envelopeWrap.style.outline='none');
