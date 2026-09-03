const episodes = [
  {title:"How I Found You", desc:"The beginning. The first conversations, first impressions, and the moment it became more.", audio:"assets/audio/episode-01.mp3"},
  {title:"Things I Love About You", desc:"The tiny details you probably don't realize I notice.", audio:"assets/audio/episode-02.mp3"},
  {title:"The Distance Between Us", desc:"What missing someone actually feels like—and why I keep choosing you.", audio:"assets/audio/episode-03.mp3"},
  {title:"Your Kids & Our Future", desc:"The ordinary, funny, imperfect future I imagine.", audio:"assets/audio/episode-04.mp3"},
  {title:"The Things You Don't Know About Me", desc:"The thoughts, fears, dreams, and truths I don't always know how to say.", audio:"assets/audio/episode-05.mp3"},
  {title:"Questions I'd Ask You If You Were Here", desc:"Pause, answer out loud, and imagine I'm sitting right beside you.", audio:"assets/audio/episode-06.mp3"},
  {title:"Our Future", desc:"Not a perfect fantasy. Just the life I hope we get to build.", audio:"assets/audio/episode-07.mp3"},
  {title:"If You Ever Doubt Us", desc:"A little episode for the difficult days. Come here when you need it.", audio:"assets/audio/episode-08.mp3"}
];

const letters = {
  miss:{title:"When you miss me", text:"If you're here because you miss me, then for a minute, stop thinking about the distance. Imagine I'm right there. No phone, no countdown, no waiting for the next call. Just us. I miss you too. And this little website is one of the ways I can leave a piece of me with you."},
  smile:{title:"When you need to smile", text:"Okay. Serious podcast voice off. You are officially required to smile for at least five seconds. Think about one of our stupidest moments. If that doesn't work, imagine me trying to act cool and immediately ruining it. There. You're smiling now."},
  sleep:{title:"When you can't sleep", text:"It's late. You should probably be sleeping. But if you're awake, stay here for a minute. Breathe. Put the phone down after this. Tomorrow is allowed to be tomorrow. Tonight, you don't have to solve everything."},
  doubt:{title:"When you doubt yourself", text:"Please don't let one bad day convince you that you're not enough. I see things in you that you sometimes can't see in yourself. You don't have to earn your worth. You don't have to be perfect. You are already someone worth loving."}
};

const grid=document.getElementById("episodeGrid");
episodes.forEach((ep,i)=>{
  const card=document.createElement("button");
  card.className="episode";
  card.innerHTML=`<span class="episode-num">EPISODE ${String(i+1).padStart(2,"0")}</span><span class="status">AVAILABLE</span><h3>${ep.title}</h3><p>${ep.desc}</p><span class="play-mini">▶</span>`;
  card.addEventListener("click",()=>loadEpisode(i,true));
  grid.appendChild(card);
});

const audio=document.getElementById("audio"), playBtn=document.getElementById("playBtn");
let current=-1;
function loadEpisode(i,autoplay=false){
  current=i; const ep=episodes[i];
  document.getElementById("playerEpisode").textContent=`EPISODE ${String(i+1).padStart(2,"0")}`;
  document.getElementById("playerTitle").textContent=ep.title;
  audio.src=ep.audio; audio.load();
  document.getElementById("player").scrollIntoView({behavior:"smooth",block:"center"});
  if(autoplay) audio.play().catch(()=>{});
}
playBtn.onclick=()=>{ if(current<0) loadEpisode(0,false); else audio.paused?audio.play():audio.pause(); };
document.getElementById("backBtn").onclick=()=>loadEpisode(Math.max(0,current-1),true);
document.getElementById("forwardBtn").onclick=()=>loadEpisode(Math.min(episodes.length-1,Math.max(0,current+1)),true);
audio.addEventListener("play",()=>playBtn.textContent="Ⅱ");
audio.addEventListener("pause",()=>playBtn.textContent="▶");
audio.addEventListener("timeupdate",()=>{
  const pct=audio.duration?(audio.currentTime/audio.duration)*100:0;
  document.getElementById("progressBar").style.width=pct+"%";
  const m=Math.floor(audio.currentTime/60),s=Math.floor(audio.currentTime%60);
  document.getElementById("playerTime").textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
});
audio.addEventListener("ended",()=>{ if(current<episodes.length-1) loadEpisode(current+1,true); });

document.querySelectorAll(".letter").forEach(btn=>btn.onclick=()=>{
  const data=letters[btn.dataset.letter];
  document.getElementById("modalTitle").textContent=data.title;
  document.getElementById("modalText").textContent=data.text;
  document.getElementById("letterModal").classList.add("open");
});
document.querySelector(".close").onclick=()=>document.getElementById("letterModal").classList.remove("open");
document.getElementById("letterModal").onclick=e=>{if(e.target.id==="letterModal")e.currentTarget.classList.remove("open")};
