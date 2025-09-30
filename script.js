const questions = {
  general: [
    { question: "Capital of France?", options: ["Berlin","Madrid","Paris","Rome"], answer: "Paris" },
    { question: "Largest ocean?", options: ["Atlantic","Indian","Pacific","Arctic"], answer: "Pacific" },
    { question: "Sun rises from?", options: ["North","East","South","West"], answer: "East" },
    { question: "Which planet is known as Red Planet?", options:["Earth","Mars","Venus","Jupiter"], answer:"Mars" },
    { question: "Which gas do humans breathe in?", options:["Oxygen","Carbon Dioxide","Nitrogen","Hydrogen"], answer:"Oxygen" }
  ],
  science: [
    { question: "H2O is?", options:["Oxygen","Hydrogen","Water","Helium"], answer:"Water" },
    { question: "Speed of light?", options:["3x10^8 m/s","5x10^8 m/s","1x10^6 m/s","3x10^5 m/s"], answer:"3x10^8 m/s" },
    { question: "Sun is a?", options:["Planet","Star","Moon","Asteroid"], answer:"Star" },
    { question: "Atomic number of Hydrogen?", options:["1","2","3","4"], answer:"1" },
    { question: "Gas essential for photosynthesis?", options:["Oxygen","Carbon Dioxide","Nitrogen","Helium"], answer:"Carbon Dioxide" }
  ],
  math: [
    { question: "5 + 7?", options:["10","12","14","11"], answer:"12" },
    { question: "Square root of 64?", options:["6","8","7","9"], answer:"8" },
    { question: "10 x 5?", options:["50","55","45","60"], answer:"50" },
    { question: "12 / 4?", options:["2","3","4","6"], answer:"3" },
    { question: "7 - 3?", options:["3","4","5","2"], answer:"4" }
  ]
};

let selectedCategory="general",currentQuestion=0,score=0,timer,timeLeft=15,quizQuestions=[];
const categoryEl=document.getElementById("category"),
      startBtn=document.getElementById("start-btn"),
      toggleBtn=document.getElementById("toggle-mode"),
      questionEl=document.getElementById("question"),
      optionsEl=document.getElementById("options"),
      prevBtn=document.getElementById("prev-btn"),
      nextBtn=document.getElementById("next-btn"),
      quizContainer=document.getElementById("quiz-container"),
      resultContainer=document.getElementById("result-container"),
      scoreEl=document.getElementById("score"),
      totalEl=document.getElementById("total"),
      restartBtn=document.getElementById("restart-btn"),
      timeEl=document.getElementById("timer-text"),
      progressBar=document.getElementById("progress-bar"),
      timerCircle=document.getElementById("timer-circle"),
      leaderboardEl=document.getElementById("leaderboard");

function shuffle(arr){return arr.sort(()=>Math.random()-0.5);}
function startQuiz(){
  selectedCategory=categoryEl.value;
  quizQuestions=shuffle([...questions[selectedCategory]]);
  currentQuestion=0; score=0;
  document.getElementById("settings-container").style.display="none";
  document.getElementById("welcome-container").style.display="none";
  quizContainer.style.display="block"; resultContainer.style.display="none";
  loadQuestion();
}
function loadQuestion(){
  clearInterval(timer); timeLeft=15; updateTimerCircle(); timeEl.textContent=timeLeft+"s"; startTimer();
  const q=quizQuestions[currentQuestion];
  questionEl.textContent=q.question; optionsEl.innerHTML="";
  q.options.forEach(option=>{
    const btn=document.createElement("button"); btn.textContent=option;
    btn.onclick=()=>selectAnswer(option,btn); optionsEl.appendChild(btn);
  });
  updateProgressBar();
}
function selectAnswer(selected, button){
  const q=quizQuestions[currentQuestion]; const buttons=optionsEl.querySelectorAll("button");
  buttons.forEach(btn=>btn.disabled=true);
  if(selected===q.answer){score++; button.classList.add("correct");} 
  else {button.classList.add("wrong"); buttons.forEach(btn=>{if(btn.textContent===q.answer) btn.classList.add("correct");});}
  clearInterval(timer);
  setTimeout(()=>{if(currentQuestion<quizQuestions.length-1){currentQuestion++; loadQuestion();}else{showResult();}},1000);
}
function startTimer(){
  timer=setInterval(()=>{
    timeLeft--; timeEl.textContent=timeLeft+"s"; updateTimerCircle();
    if(timeLeft<=0){
      clearInterval(timer);
      const buttons=optionsEl.querySelectorAll("button");
      buttons.forEach(btn=>{if(btn.textContent===quizQuestions[currentQuestion].answer) btn.classList.add("correct"); btn.disabled=true;});
      setTimeout(()=>{if(currentQuestion<quizQuestions.length-1){currentQuestion++; loadQuestion();} else {showResult();}},1000);
    }
  },1000);
}
function updateProgressBar(){progressBar.style.width=((currentQuestion)/quizQuestions.length)*100+"%";}
function updateTimerCircle(){
  const circumference=2*Math.PI*28;
  const offset=circumference*(1-timeLeft/15);
  timerCircle.style.strokeDashoffset=offset;
}
function showResult(){
  quizContainer.style.display="none"; resultContainer.style.display="block";

  // Animated Score
  const finalScore=score; scoreEl.textContent="0"; let current=0;
  const countInterval=setInterval(()=>{if(current<finalScore){current++; scoreEl.textContent=current;} else{clearInterval(countInterval);}},100);

  // Emoji
  const emojiEl=document.getElementById("emoji");
  const percent=(score/quizQuestions.length)*100;
  emojiEl.textContent=percent>=80?"🎉":percent>=50?"👍":"😢";

  // Leaderboard
  const leaderboard=JSON.parse(localStorage.getItem("leaderboard")||"[]");
  leaderboard.push(finalScore); leaderboard.sort((a,b)=>b-a); if(leaderboard.length>5) leaderboard.pop();
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  leaderboardEl.innerHTML="";
  leaderboard.forEach((s,i)=>{const li=document.createElement("li"); li.textContent=s; li.style.setProperty("--i",i); leaderboardEl.appendChild(li);});

  launchConfetti();
}

function restartQuiz(){
  document.getElementById("settings-container").style.display="block";
  document.getElementById("welcome-container").style.display="block";
  quizContainer.style.display="none"; resultContainer.style.display="none";
}

function toggleMode(){document.body.classList.toggle("dark-mode");}

startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", restartQuiz);
toggleBtn.addEventListener("click", toggleMode);
prevBtn.addEventListener("click", ()=>{if(currentQuestion>0){currentQuestion--; loadQuestion();}});
nextBtn.addEventListener("click", ()=>{if(currentQuestion<quizQuestions.length-1){currentQuestion++; loadQuestion();}});

// Confetti
function launchConfetti(){
  const confettiContainer=document.getElementById("confetti");
  confettiContainer.innerHTML="";
  for(let i=0;i<100;i++){
    const conf=document.createElement("div");
    conf.classList.add("confetti-piece");
    conf.style.left=Math.random()*100+"%";
    conf.style.animationDuration=(Math.random()*3+2)+"s";
    conf.style.background=`hsl(${Math.random()*360},70%,60%)`;
    conf.style.width=conf.style.height=Math.random()*8+4+"px";
    confettiContainer.appendChild(conf);
  }
}
// Confetti CSS injection
const confettiStyle=document.createElement('style');
confettiStyle.innerHTML=`
.confetti-piece {position:absolute;top:0;opacity:0.7;animation-name:fall;animation-timing-function:linear;}
@keyframes fall{to{transform:translateY(500px) rotate(360deg);opacity:0;}}`;
document.head.appendChild(confettiStyle);
