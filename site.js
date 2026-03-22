
let players=[]; let currentTrack=1; let isPlaying=false;
function setupAudio(){const a1=document.getElementById('music1'); const a2=document.getElementById('music2'); players=[a1,a2].filter(Boolean); players.forEach(a=>{a.volume=.18;a.loop=true}); updateMusicState()}
function updateMusicState(){const s=document.querySelector('[data-music-state]'); if(s) s.textContent=isPlaying?`On ${currentTrack}`:'Off'}
function chooseTrack(n){currentTrack=n; players.forEach((a,i)=>{if(i!==n-1){a.pause();a.currentTime=0}}); if(isPlaying&&players[n-1]) players[n-1].play().catch(()=>{}); updateMusicState()}
function toggleMusic(){if(!players.length) return; const a=players[currentTrack-1]; if(isPlaying){players.forEach(x=>x.pause()); isPlaying=false}else{a.play().catch(()=>{}); isPlaying=true} updateMusicState()}
window.chooseTrack=chooseTrack; window.toggleMusic=toggleMusic;
document.addEventListener('DOMContentLoaded', ()=>{const y=document.querySelector('[data-year]'); if(y) y.textContent=new Date().getFullYear(); setupAudio();});
