let estMasculin = null  ; // ♂️ pour garçon, ♀️ pour fille

let symbolGarcon = "♂️";
let symbolFille = "♀️";

let title = t("title");//"The reveal 🎰";
let congrats = "";
let fail = t("failInit");

const slots = [document.getElementById("slot1"), document.getElementById("slot2"), document.getElementById("slot3")];
const lever = document.getElementById("lever");
const resultText = document.getElementById("result");

let compteur = 0;

function translateWS(){
  document.title = t("title");
  document.getElementById("theReveal").innerText = t("title");
  document.getElementById("form_openPopupBtn").innerText = t("formNewRouletteTitle");
  document.getElementById("formNewRouletteTitle").innerText = t("formNewRouletteTitle");
  document.getElementById("formTitle").innerText = t("formTitle");
  document.getElementById("form_title").setAttribute("placeholder", t("formTitlePH"));
  document.getElementById("formGender").innerText = t("formGender");
  document.getElementById("formGenderBoy").innerText = t("formGenderBoy");
  document.getElementById("formGenderGirl").innerText = t("formGenderGirl");
  document.getElementById("formSymbols").innerText = t("formSymbols");
  document.getElementById("formOnSuccess").innerText = t("formOnSuccess");
  document.getElementById("form_success").setAttribute("placeholder", t("formOnSuccessPH"));
  document.getElementById("formOnFail").innerText = t("formOnFail");
  document.getElementById("form_fail").setAttribute("placeholder", t("formOnFailPH"));
  document.getElementById("formCreate").innerText = t("formCreate");
  document.getElementById("formCancel").innerText = t("formCancel");
  document.getElementById("formShareLink").innerText = t("formShareLink");
  document.getElementById("form_copyBtn").innerText = t("formShareCopy");
  fail = estMasculin == null ? t("failInit") : t("failRoulette");

  document.getElementById("github").innerText = t("github");
  document.getElementById("paypal").innerText = t("paypal");
}

function init() {
  var param = new URLSearchParams(document.location.search).get("q");
  document.getElementById('year').textContent = new Date().getFullYear()

  if(currentLang != "en"){
    translateWS();
  }

  if(param === null){
    document.getElementById("form_openPopupBtn").setAttribute("style", "");
    document.getElementById("langSwitcher").setAttribute("style", "");
  }else{
    var config = "";
    try{
      config = decodeBase64(param);
    }catch(error) {
      config = "";
    }

    var c = config.split(";");

    if(c.length == 6 && (c[0] == "1" || c[0] == "2") && c[1].length >= 1 && c[2].length >= 1) {
      estMasculin = (c[0] == "1");
      symbolGarcon = c[1];
      symbolFille = c[2];
      title = c[3];
      congrats = c[4];
      fail = c[5];

      document.title = title;
      document.getElementById("theReveal").innerText = title;
    }else{
      document.location.search = "";
    }
  }
}

function decodeBase64(base64) {
  var base64Decoded = atob(base64);
  return decodeURIComponent(base64Decoded);
}

function getSymbol() {
  return Math.random() > 0.5 ? symbolGarcon : symbolFille;
}

function createReelElement(symbol) {
  const el = document.createElement("div");
  el.textContent = symbol;
  return el;
}

async function spinReel(slot, finalSymbol, delay) {
  return new Promise((resolve) => {
    let spins = 10 + Math.floor(Math.random() * 10);
    let count = 0;
    const interval = setInterval(() => {
      const symbol = getSymbol();
      slot.innerHTML = "";
      slot.appendChild(createReelElement(symbol));
      count++;
      if (count >= spins) {
        clearInterval(interval);
        setTimeout(() => {
          slot.innerHTML = "";
          slot.appendChild(createReelElement(finalSymbol));
          resolve();
        }, delay);
      }
    }, 100);
  });
}

function fireworks() {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      alpha: 1,
      radius: Math.random() * 3 + 2,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.01;
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    particles = particles.filter((p) => p.alpha > 0);
    if (particles.length > 0) {
      requestAnimationFrame(draw);
    }
  }
  draw();
}

lever.addEventListener("click", async () => {
  if (lever.classList.contains("pulled")) return;
  lever.classList.add("pulled");
  resultText.textContent = "";
  let answerSymbol = " ";

  if(estMasculin != null){
    answerSymbol = estMasculin ? symbolGarcon : symbolFille;
  }

  let result;
  do {
    let resultSymbols = [getSymbol(), getSymbol(), getSymbol()];

  if((estMasculin == null && areSymbolsEquals(resultSymbols)) || (areSymbolsEquals(resultSymbols) && compteur == 0)) {
    const idx = Math.floor(Math.random() * 3);
    resultSymbols[idx] = resultSymbols[idx] == symbolGarcon ? symbolFille : symbolGarcon;
  }
    result = resultSymbols;
  } while (result.filter((s) => s === answerSymbol).length !== 3 && Math.random() > 0.3);

  await Promise.all([
    spinReel(slots[0], result[0], 0),
    spinReel(slots[1], result[1], 100),
    spinReel(slots[2], result[2], 200)
  ]);

  if (result.every((s) => s === answerSymbol) && estMasculin != null) {
    resultText.textContent = congrats;
    fireworks();
    compteur = 0;
  } else {
    resultText.textContent = fail;
  }

  setTimeout(() => lever.classList.remove("pulled"), 500);
  compteur ++;
});

function areSymbolsEquals(symbols) {
  return symbols[0] === symbols[1] && symbols[1] === symbols[2];
}

function appendApiCounter(){
  let script = document.createElement('script');
  script.src = '"https://counterapi.com/c.js?ns=" + document.location';
  script.async = true;

  let div = document.createElement('div');
  div.setAttribute("style", /*"display: none"*/"min-height:44px");
  div.setAttribute("class", "counterapi");

  document.getElementsByTagName("body")[0].appendChild(script);
  document.getElementsByTagName("body")[0].appendChild(div);
}