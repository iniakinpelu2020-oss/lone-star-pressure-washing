/* Lone Star Pressure Washing — engine */
const CFG = { name:"Lone Star Pressure Washing", town:"San Antonio, TX", phone:"+12107493810", mode:"us" };

const SERVICES = [
  { name:"Driveway, Walkway & Sidewalk Wash", cat:"Concrete", price:149, time:"≈ 1.5–2 hrs on site",
    desc:"Surface cleaner pass over the driveway, walks and curbs, edges and oil spots pre-treated, then a full rinse. The fastest way to make a whole front of house look newer.",
    img:"1600047509807-ba8f99d2cdde" },
  { name:"House Soft Wash — Siding & Eaves", cat:"House", price:279, time:"≈ 2–3 hrs on site",
    desc:"Low-pressure soft wash with a cleaning mix that kills algae and mildew at the root instead of blasting it off. Safe on vinyl, stucco, brick, hardie and painted trim.",
    img:"1552519507-da3b142c6e3d" },
  { name:"Roof Soft Wash — Shingle & Tile", cat:"Roof", price:349, time:"≈ 2–3 hrs on site",
    desc:"The black streaking on San Antonio roofs is algae. We treat it at low pressure so shingles keep their granules and the roof stops looking twenty years older than it is.",
    img:"1607860108855-64acf2078ed9" },
  { name:"Patio, Deck & Fence Cleaning", cat:"Outdoor", price:189, time:"≈ 2 hrs on site",
    desc:"Pavers, flagstone, wood decks and fences cleaned and rinsed, with the right pressure for the material. Optionally sealed after a dry day so it holds the look longer.",
    img:"1605515298946-d062f2e9da53" },
  { name:"Gutter Brightening & Fascia Detail", cat:"Detail", price:99, time:"≈ 60–90 min on site",
    desc:"The tiger stripes on gutter faces come off with a gel treatment and hand detail, not just a rinse. Fascia, soffit and downspouts cleaned at the same visit.",
    img:"1621939514649-280e2ee25f60" },
  { name:"Commercial Storefront & Lot Wash", cat:"Commercial", price:249, time:"≈ 2–3 hrs on site",
    desc:"Storefronts, drive-thrus, dumpster pads and entry walks washed before opening hours so the lot is dry and safe by the time customers arrive.",
    img:"1550355291-bbee04a92027" }
];

const SIZE = [
  { label:"Up to 1,500 sqft", note:"standard lot", add:0 },
  { label:"1,500–2,500 sqft", note:"+$45", add:45 },
  { label:"2,500 sqft +", note:"+$85", add:85 }
];
const COND = [
  { label:"Routine dirt", note:"regular clean", add:0 },
  { label:"Stained", note:"+$35", add:35 },
  { label:"Heavy algae / mildew", note:"+$70", add:70 }
];
const SCHED = [
  { label:"Standard week", note:"this week", add:0 },
  { label:"Next-day", note:"priority", add:25 },
  { label:"Saturday", note:"weekend slot", add:30 }
];

const $ = (s) => document.querySelector(s);
const money = (n) => "$" + n;
const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* strip */
(function strip(){
  const bits = ["Soft wash safe","Flat quotes","78 five-star reviews","San Antonio & surrounds","Residential + commercial"];
  const one = bits.map(b => "<span>" + b + " <b>✦</b></span>").join("");
  $("#strip").innerHTML = one + one;
})();

/* rates */
(function sheet(){
  $("#pricelist").innerHTML = SERVICES.map(s =>
    '<li><div><span class="nm">' + s.name + '</span><span class="sub-l">' + s.cat + ' · ' + s.time + '</span></div>' +
    '<span class="grow"></span><span class="pr">From $' + s.price + '</span></li>'
  ).join("");
})();

/* hours */
(function hours(){
  const today = new Date().toLocaleDateString("en-US",{weekday:"short",timeZone:"America/Chicago"});
  document.querySelectorAll("#hoursList li").forEach(li => { if(li.dataset.day === today) li.classList.add("today"); });
  $("#yr").textContent = new Date().getFullYear();
})();

/* deck */
const stage = $("#deckStage"), deck = $("#deck"), dotsEl = $("#dots"), catsEl = $("#cats");
const cats = ["All", ...Array.from(new Set(SERVICES.map(s => s.cat)))];
let filter = "All";
let list = SERVICES.slice();
let idx = 0;
let cards = [];

function buildCats(){
  catsEl.innerHTML = cats.map(c => '<button class="pill" type="button" data-cat="' + c + '">' + c + '</button>').join("");
  catsEl.querySelectorAll(".pill").forEach(p => {
    p.setAttribute("aria-pressed", String(p.dataset.cat === filter));
    p.addEventListener("click", () => {
      filter = p.dataset.cat;
      list = filter === "All" ? SERVICES.slice() : SERVICES.filter(s => s.cat === filter);
      idx = 0;
      buildCards(); buildCats(); paint(); buildDots();
    });
  });
}

function buildCards(){
  deck.innerHTML = "";
  cards = list.map((s, i) => {
    const el = document.createElement("article");
    el.className = "dcard";
    el.tabIndex = 0;
    el.setAttribute("role","button");
    el.setAttribute("aria-label", s.name);
    el.innerHTML = '<img src="https://images.unsplash.com/photo-' + s.img + '?auto=format&fit=crop&w=800&q=74" alt="' + s.name + '" loading="lazy" onerror="this.style.opacity=.25">' +
      '<div class="cap"><span class="no">' + String(i+1).padStart(2,"0") + " / " + s.cat + '</span>' +
      '<h3>' + s.name + '</h3><span class="pr">From $' + s.price + '</span></div>';
    el.addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); openService(i); } });
    deck.appendChild(el);
    return el;
  });
}

function paint(){
  cards.forEach((el, i) => {
    const off = i - idx;
    const abs = Math.abs(off);
    el.style.transform = "translateY(" + (off * 14) + "px) translateZ(" + (-abs * 90) + "px) scale(" + (1 - abs * 0.035) + ")";
    el.style.zIndex = String(30 - abs);
    el.style.opacity = abs > 3 ? "0" : "1";
    el.style.pointerEvents = abs === 0 ? "auto" : (abs === 1 ? "auto" : "none");
    el.classList.toggle("on", i === idx);
    el.setAttribute("aria-current", String(i === idx));
  });
  dotsEl.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("on", i === idx));
}

function buildDots(){
  dotsEl.innerHTML = list.map((_, i) => '<button class="dot" type="button" aria-label="Service ' + (i+1) + '"></button>').join("");
  dotsEl.querySelectorAll(".dot").forEach((d, i) => d.addEventListener("click", () => jump(i)));
}

function jump(n){
  idx = Math.max(0, Math.min(list.length - 1, n));
  paint();
}

$("#prev").addEventListener("click", () => jump(idx - 1));
$("#next").addEventListener("click", () => jump(idx + 1));

/* swipe the front card */
let down = false, startX = 0, dx = 0;
deck.addEventListener("pointerdown", e => {
  if(!cards[idx]) return;
  down = true; startX = e.clientX; dx = 0;
  cards[idx].style.transition = "none";
});
window.addEventListener("pointermove", e => {
  if(!down) return;
  dx = e.clientX - startX;
  const c = cards[idx];
  if(c) c.style.transform = "translateX(" + dx + "px) rotate(" + (dx * 0.035) + "deg)";
});
window.addEventListener("pointerup", e => {
  if(!down) return;
  down = false;
  const c = cards[idx];
  if(c) c.style.transition = "";
  if(Math.abs(dx) > 90){
    if(c){
      c.style.transform = "translateX(" + (dx > 0 ? 900 : -900) + "px) rotate(" + (dx > 0 ? 22 : -22) + "deg)";
      c.style.opacity = "0";
    }
    const step = dx > 0 ? -1 : 1;
    setTimeout(() => {
      if(c){ c.style.opacity = "1"; }
      if(idx + step < 0 || idx + step > list.length - 1){
        if(c) c.style.transform = "";
        paint();
        return;
      }
      jump(idx + step);
    }, 240);
  } else {
    paint();
    if(Math.abs(dx) < 6 && e.target.closest(".dcard") === (c || null)) openService(idx);
  }
  dx = 0;
});
window.addEventListener("resize", paint);

/* hero image tilt */
(function tilt(){
  const wrap = document.querySelector(".shot-wrap"), shot = document.querySelector(".shot");
  if(!wrap || !shot || reduce()) return;
  wrap.addEventListener("pointermove", e => {
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    shot.style.transform = "rotateY(" + (x * 9) + "deg) rotateX(" + (-y * 7) + "deg)";
  });
  wrap.addEventListener("pointerleave", () => { shot.style.transform = ""; });
})();

/* configurator */
let current = 0;
let opts = { size:0, cond:0, sched:0 };

function optRow(el, data, key){
  el.innerHTML = data.map((o,i) => '<button class="opt" type="button" data-i="' + i + '">' + o.label + '<small>' + o.note + '</small></button>').join("");
  el.querySelectorAll(".opt").forEach(b => {
    b.classList.toggle("on", Number(b.dataset.i) === opts[key]);
    b.addEventListener("click", () => {
      opts[key] = Number(b.dataset.i);
      el.querySelectorAll(".opt").forEach(x => x.classList.toggle("on", x === b));
      price();
    });
  });
}

function price(){
  const s = list[current];
  if(!s) return 0;
  const total = s.price + SIZE[opts.size].add + COND[opts.cond].add + SCHED[opts.sched].add;
  $("#livePrice").textContent = money(total);
  return total;
}

function openService(i){
  if(i < 0 || !list[i]) return;
  current = i;
  const s = list[i];
  opts = { size:0, cond:0, sched:0 };
  $("#cfgImg").src = "https://images.unsplash.com/photo-" + s.img + "?auto=format&fit=crop&w=1000&q=78";
  $("#cfgImg").alt = s.name;
  $("#cfgCat").textContent = s.cat;
  $("#cfgIndex").textContent = "02 / " + s.cat;
  $("#cfgName").textContent = s.name;
  $("#cfgDesc").textContent = s.desc;
  $("#cfgTime").textContent = s.time;
  $("#cfgTown").textContent = CFG.town;
  optRow($("#optSize"), SIZE, "size");
  optRow($("#optCond"), COND, "cond");
  optRow($("#optSched"), SCHED, "sched");
  price();
  document.body.classList.add("detail-view");
  $("#detail").classList.add("on");
  buildMore(i);
  window.scrollTo({ top:0, behavior:"auto" });
}

function buildMore(i){
  const others = list.filter((_, n) => n !== i).slice(0,3);
  $("#moreGrid").innerHTML = "";
  others.forEach(s => {
    const b = document.createElement("button");
    b.className = "mcard"; b.type = "button";
    b.innerHTML = '<img src="https://images.unsplash.com/photo-' + s.img + '?auto=format&fit=crop&w=200&q=65" alt="">' +
      "<div><b>" + s.name + "</b><i>From $" + s.price + "</i></div>";
    b.addEventListener("click", () => openService(list.findIndex(x => x.name === s.name)));
    $("#moreGrid").appendChild(b);
  });
}

$("#backBtn").addEventListener("click", () => {
  document.body.classList.remove("detail-view");
  $("#detail").classList.remove("on");
  window.scrollTo({ top:0, behavior:"auto" });
});

/* estimate drawer */
let cart = [];
function openDrawer(){ $("#drawer").classList.add("on"); $("#drawer").setAttribute("aria-hidden","false"); $("#scrim").classList.add("on"); }
function closeDrawer(){ $("#drawer").classList.remove("on"); $("#drawer").setAttribute("aria-hidden","true"); $("#scrim").classList.remove("on"); }

function paintCart(){
  const body = $("#drawerBody");
  if(!cart.length){
    body.innerHTML = '<p class="empty">Nothing added yet. Swipe the deck, open a wash and build your estimate.</p>';
  } else {
    body.innerHTML = cart.map((c,i) =>
      '<div class="line"><div><b>' + c.name + '</b><span>' + c.detail + '</span>' +
      '<button class="rm" type="button" data-i="' + i + '">remove</button></div>' +
      '<div class="amt">' + money(c.price) + '</div></div>'
    ).join("");
    body.querySelectorAll(".rm").forEach(b => b.addEventListener("click", () => { cart.splice(Number(b.dataset.i),1); paintCart(); count(); }));
  }
  const total = cart.reduce((a,c) => a + c.price, 0);
  $("#total").textContent = money(total);
  const msg = "Hi " + CFG.name + ", I'd like to book: " +
    (cart.length ? cart.map(c => c.name + " (" + c.detail + ")").join("; ") + ". Estimate " + money(total) + "." : "a wash.");
  $("#textBtn").href = CFG.mode === "ng"
    ? "https://wa.me/" + CFG.phone.replace("+","") + "?text=" + encodeURIComponent(msg)
    : "sms:" + CFG.phone + "?&body=" + encodeURIComponent(msg);
}

function count(){
  const n = cart.length;
  ["#cartCount","#cartCount2"].forEach(sel => {
    const el = $(sel); if(!el) return;
    el.textContent = n; el.classList.toggle("on", n > 0);
  });
}

$("#addBtn").addEventListener("click", () => {
  const s = list[current];
  if(!s) return;
  const total = price();
  cart.push({ name:s.name, price:total, detail:SIZE[opts.size].label + " · " + COND[opts.cond].label + " · " + SCHED[opts.sched].label });
  paintCart(); count();
  const t = $("#toast"); t.classList.add("on"); setTimeout(() => t.classList.remove("on"), 1900);
  openDrawer();
});

["#openEstimate","#openEstimate2","#openEstimate3"].forEach(sel => {
  const el = $(sel); if(el) el.addEventListener("click", openDrawer);
});
$("#closeDrawer").addEventListener("click", closeDrawer);
$("#scrim").addEventListener("click", closeDrawer);
document.addEventListener("keydown", e => { if(e.key === "Escape") closeDrawer(); });

setTimeout(() => { const b = document.getElementById("boot"); if(b) b.remove(); }, 2500);

buildCats(); buildCards(); paint(); buildDots(); paintCart(); count();
