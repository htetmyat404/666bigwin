// ===== User Data =====
let userId = 'U'+Math.floor(Math.random()*1000000);
let coins = 10000;
let freeSpins = 0;
let autoSpinActive = false;

document.addEventListener('DOMContentLoaded',()=>{
  if(document.getElementById('user-id')) document.getElementById('user-id').textContent = userId;
  if(document.getElementById('coins')) document.getElementById('coins').textContent = coins;
});

// ===== Daily Gift =====
const dailyRewards=[5000,10000,6000,7000,8000,9000,10000];
function claimDaily(){
  const today=new Date().getDay();
  if(localStorage.getItem('dailyClaimed')==today){document.getElementById('daily-msg').textContent='Already claimed today!';return;}
  const reward=dailyRewards[today%7];
  coins+=reward;
  if(document.getElementById('coins')) document.getElementById('coins').textContent = coins;
  localStorage.setItem('dailyClaimed',today);
  document.getElementById('daily-msg').textContent=`You got ${reward} coins!`;
}

// ===== Start Slot Game =====
function startSlotGame(){
  localStorage.setItem('currentUserId',userId);
  localStorage.setItem('currentCoins',coins);
  localStorage.setItem('currentFreeSpins',freeSpins);
  window.location='slot.html';
}

// ===== Slot Machine Arcade =====
const symbols=['👌','👉','👶','🤳','💧','💃','🕺','👩‍❤️‍👨','🧘','🙍','🛌','🤵','👰','🍆','🥨','😍','🥰','🤩','🤏','🪡','🗿','🚨','🍿','🍑','🥕','🍒','🦆','🍌','🍎'];
const rows=6,cols=5;
const soundSpin=new Audio('sounds/spin.mp3');
const soundWin=new Audio('sounds/win.mp3');
const soundLose=new Audio('sounds/lose.mp3');
const soundScatter=new Audio('sounds/scatter.mp3');

let currentUserId;
let currentCoins;
let currentFreeSpins;

document.addEventListener('DOMContentLoaded',()=>{
  if(window.location.pathname.endsWith('slot.html')){
    currentUserId=localStorage.getItem('currentUserId');
    currentCoins=Number(localStorage.getItem('currentCoins'));
    currentFreeSpins=Number(localStorage.getItem('currentFreeSpins'));
    document.getElementById('coins').textContent=currentCoins;
    document.getElementById('free-spins').textContent=currentFreeSpins;

    const container=document.getElementById('slot-container');
    for(let r=0;r<rows;r++){
      const rowDiv=document.createElement('div'); rowDiv.classList.add('slot-row');
      for(let c=0;c<cols;c++){
        const cell=document.createElement('div'); cell.classList.add('slot-cell');
        cell.textContent=symbols[Math.floor(Math.random()*symbols.length)];
        rowDiv.appendChild(cell);
      }
      container.appendChild(rowDiv);
    }
  }
});

function updateDisplay(){
  document.getElementById('coins').textContent=currentCoins;
  document.getElementById('free-spins').textContent=currentFreeSpins;
}

// ===== Spin Logic =====
function spin(){
  if(currentFreeSpins>0){ currentFreeSpins--; }
  soundSpin.play();
  const container=document.getElementById('slot-container');
  container.querySelectorAll('.slot-cell').forEach(cell=>{
    cell.classList.add('animate');
    cell.textContent=symbols[Math.floor(Math.random()*symbols.length)];
    setTimeout(()=>{cell.classList.remove('animate');},500);
  });

  // 🗿 scatter logic (trigger only once per spin)
  let scatterCells = Array.from(container.querySelectorAll('.slot-cell')).filter(cell => cell.textContent === '🗿');
  let scatterCount = scatterCells.length;
  if(scatterCount >= 3 && scatterCount <= 5){
    if(scatterCount === 3){ currentFreeSpins += 5; soundScatter.play(); }
    else if(scatterCount === 4){ currentFreeSpins += 15; soundScatter.play(); }
    else if(scatterCount === 5){ currentFreeSpins += 20; soundScatter.play(); }
  }

  // Coins win/loss random
  const coinGain=Math.floor(Math.random()*1000 - 300); // +/- for thrill
  currentCoins+=coinGain;
  if(coinGain>0) soundWin.play();
  else soundLose.play();

  updateDisplay();
  localStorage.setItem('currentCoins',currentCoins);
  localStorage.setItem('currentFreeSpins',currentFreeSpins);
}

// ===== Auto Spin =====
function toggleAutoSpin(){
  const btn=document.getElementById('auto-spin-btn');
  if(autoSpinActive){
    autoSpinActive=false;
    btn.textContent='🤖 Auto Spin';
  } else {
    autoSpinActive=true;
    btn.textContent='🛑 Stop Auto Spin';
    const autoSpinInterval=setInterval(()=>{
      if(!autoSpinActive || currentFreeSpins<=0){ autoSpinActive=false; btn.textContent='🤖 Auto Spin'; clearInterval(autoSpinInterval); return;}
      spin();
    },3500);
  }
}
