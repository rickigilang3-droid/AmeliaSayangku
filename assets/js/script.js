document.addEventListener('DOMContentLoaded',()=>{
  const messages = [
    "{name}, semoga sempro-mu lancar. Aku bangga padamu.",
    "Selamat sempro, {name}! Kamu sudah kerja keras — sukses selalu.",
    "Kamu hebat, {name}. Sempro ini hanya langkah kecil menuju mimpi kita.",
    "Tenang dan percaya diri ya, {name}. Aku selalu dukung kamu.",
    "Semoga semua pertanyaan mudah dijawab. Pulang nanti traktir ya, {name}!",
    "Tarik napas, tunjukkan yang terbaik. Aku bangga sama kamu, {name}.",
    "Semoga sempro ini jadi awal kebahagiaan baru untuk kita berdua, {name}.",
    "Doa terbaik untukmu hari ini, {name}. Fokus dan percaya diri.",
    "Semoga lancar ya, {name}. Nanti kita rayakan bareng!",
    "Ingat, kamu sudah siap. Aku cinta kamu, {name}."
  ];

  const nameInput = document.getElementById('nameInput');
  const titleInput = document.getElementById('titleInput');
  const generateBtn = document.getElementById('generateBtn');
  const randomizeBtn = document.getElementById('randomizeBtn');
  const saveFavBtn = document.getElementById('saveFavBtn');
  const messageText = document.getElementById('messageText');
  const copyBtn = document.getElementById('copyBtn');
  const shareBtn = document.getElementById('shareBtn');
  const examplesList = document.getElementById('examplesList');
  const favoritesList = document.getElementById('favoritesList');
  const messageCard = document.getElementById('messageCard');
  const canvas = document.getElementById('animCanvas');
  let confettiCtx = null;

  function fillExamples(){
    examplesList.innerHTML = '';
    messages.slice(0,6).forEach(m=>{
      const li = document.createElement('li');
      li.textContent = m.replace('{name}','Sayang');
      examplesList.appendChild(li);
    });
  }

  function renderFavorites(){
    const favs = JSON.parse(localStorage.getItem('ucapan_favs')||'[]');
    favoritesList.innerHTML = '';
    favs.forEach((f,idx)=>{
      const li = document.createElement('li');
      li.textContent = f;
      li.addEventListener('click',()=>{showMessage(f);});
      favoritesList.appendChild(li);
    });
  }

  function getRandomMessage(){
    const idx = Math.floor(Math.random()*messages.length);
    const name = nameInput.value.trim() || 'Sayang';
    return messages[idx].replace(/{name}/g,name);
  }

  function showMessage(text){
    // typing animation
    messageCard.classList.remove('pop');
    void messageCard.offsetWidth;
    messageCard.classList.add('pop');
    messageText.textContent = '';
    const span = document.createElement('span');
    span.className = 'typing';
    messageText.appendChild(span);
    let i=0;
    const speed = 18;
    function step(){
      if(i<=text.length){
        span.textContent = text.slice(0,i);
        i++;setTimeout(step,speed);
      }
    }
    step();
  }

  generateBtn.addEventListener('click',()=>{
    showMessage(getRandomMessage());
  });

  randomizeBtn.addEventListener('click',()=>{
    showMessage(getRandomMessage());
  });

  copyBtn.addEventListener('click',async()=>{
    try{
      await navigator.clipboard.writeText(messageText.textContent);
      copyBtn.textContent = 'Tersalin!';
      setTimeout(()=>copyBtn.textContent='Salin',1500);
    }catch(e){
      alert('Tidak dapat menyalin otomatis. Silakan seleksi dan salin manual.');
    }
  });

  shareBtn.addEventListener('click',async()=>{
    const text = messageText.textContent;
    if(navigator.share){
      try{await navigator.share({text});}
      catch(e){console.log('Share dibatalkan',e)}
    }else{
      try{await navigator.clipboard.writeText(text);alert('Teks disalin. Silakan tempel di aplikasi chat.');}
      catch(e){alert('Tidak ada fitur share. Salin manual.');}
    }
    launchConfetti();
  });

  saveFavBtn.addEventListener('click',()=>{
    const text = (messageText.textContent||'').trim();
    if(!text) return alert('Tidak ada ucapan untuk disimpan.');
    const favs = JSON.parse(localStorage.getItem('ucapan_favs')||'[]');
    favs.unshift(text);
    localStorage.setItem('ucapan_favs',JSON.stringify(favs.slice(0,12)));
    renderFavorites();
    saveFavBtn.textContent='Tersimpan!';
    setTimeout(()=>saveFavBtn.textContent='Simpan Favorit',1500);
  });

  fillExamples();
  renderFavorites();

  // setup canvas for confetti/particles
  function resizeCanvas(){
    if(!canvas) return;
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    confettiCtx = canvas.getContext('2d');
    if(confettiCtx) confettiCtx.scale(devicePixelRatio,devicePixelRatio);
  }
  if(canvas){
    window.addEventListener('resize',resizeCanvas);
    resizeCanvas();
  }

  function launchConfetti(){
    if(!confettiCtx) return;
    const ctx = confettiCtx;
    const w = canvas.clientWidth; const h = canvas.clientHeight;
    const parts = [];
    for(let i=0;i<50;i++){
      parts.push({x:w/2,y:h/2,vx:(Math.random()-0.5)*8,vy:(Math.random()-1.5)*8,rot:Math.random()*360,clr:['#ef4444','#f97316','#f59e0b','#34d399','#60a5fa'][Math.floor(Math.random()*5)],size:6+Math.random()*8});
    }
    let t=0;
    function frame(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      parts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.35; p.rot+=p.vx*0.2;
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle = p.clr; ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);
        ctx.restore();
      });
      t++; if(t<120) requestAnimationFrame(frame); else ctx.clearRect(0,0,canvas.width,canvas.height);
    }
    requestAnimationFrame(frame);
  }
});