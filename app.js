// =================== Login / Signup ===================
function showSignup(){document.getElementById('login-box').style.display='none';document.getElementById('signup-box').style.display='block';}
function showLogin(){document.getElementById('login-box').style.display='block';document.getElementById('signup-box').style.display='none';}

function signup(){
  const name=document.getElementById('signup-name').value;
  const phone=document.getElementById('signup-phone').value;
  const pass=document.getElementById('signup-pass').value;
  if(!name!phone!pass){alert('Fill all fields');return;}
  const uuid='U'+Math.floor(Math.random()*1000000);
  const userData={uuid,name,phone,pass,coins:0,freeSpins:0};
  localStorage.setItem(phone, JSON.stringify(userData));
  alert('Account created!'); showLogin();
}

function login(){
  const phone=document.getElementById('login-phone').value;
  const pass=document.getElementById('login-pass').value;
  const user=JSON.parse(localStorage.getItem(phone));
  if(user && user.pass===pass){
    localStorage.setItem('currentUser',phone);
    window.location='slot.html';
  }else{alert('Invalid credentials');}
}

// =================== Slot Machine ===================
const symbols=['👌','👉','👶','🤳','💧','💃','🕺','👩‍❤️‍👨','🧘','🙍','🛌','🤵','👰','🍆','🥨','😍','🥰','🤩','🤏','🪡','🗿','🚨','🍿','🍑','🥕','🍒','🦆','🍌','🍎'];
const rows=6, cols=5;

// Sounds
const soundSpin = new Audio('sounds/spin.mp3');
const soundWin = new Audio('sounds/win.mp3');
const soundLose = new Audio('sounds/lose.mp3');
const soundScatter = new Audio('sounds/scatter.mp3');

let currentUser;
document.addEventListener('DOMContentLoaded',()=>{
  const userKey = localStorage.getItem('currentUser');
  if(!userKey){ window.location='index.html'; return; }
  currentUser = JSON.parse(localStorage.getItem(userKey));

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
  updateDisplay();
});

function updateDisplay(){
  document.getElementById('coins').textContent = currentUser.coins;
  document.getElementById('free-spins').textContent = currentUser.freeSpins;
  localStorage.setItem(currentUser.phone, JSON.stringify(currentUser));
}

function spin(){
  soundSpin.play();
  const container=document.getElementById('slot-container');
  container.querySelectorAll('.slot-cell').forEach(cell=>{
    cell.classList.add('animate');
    cell.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    setTimeout(()=>{cell.classList.remove('animate');},500);
  });

  // 🗿 symbol for free spins
  let count=0;
  container.querySelectorAll('.slot-cell').forEach(cell=>{ if(cell.textContent==='🗿') count++; });
  if(count===3){ currentUser.freeSpins +=5; soundScatter.play(); }
  else if(count===4){ currentUser.freeSpins +=15; soundScatter.play(); }
  else if(count>=5){ currentUser.freeSpins +=20; soundScatter.play(); }

  // Coins win random
  const coinGain = Math.floor(Math.random()*1000);
  currentUser.coins += coinGain;
  if(coinGain>0) soundWin.play();
  else soundLose.play();

  updateDisplay();
}

// Daily rewards
const dailyRewards=[5000,10000,6000,7000,8000,9000,10000];
function claimDaily(){
  const today=new Date().getDay();
  if(localStorage.getItem('dailyClaimed')==today){ alert('Already claimed today'); return;}
  const reward = dailyRewards[today%7];
  currentUser.coins += reward;
  updateDisplay();
  localStorage.setItem('dailyClaimed',today);
  alert(You got ${reward} coins!);
}
