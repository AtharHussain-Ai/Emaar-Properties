/* ================================================= */
/* GSAP + LENIS PREMIUM PRODUCTION SETUP */
/* ================================================= */

gsap.registerPlugin(ScrollTrigger);


/* ================================================= */
/* LENIS – ULTRA SMOOTH SETTINGS */
/* ================================================= */

const lenis = new Lenis({
  duration: 1.4,        // smoother inertia
  lerp: 0.06,           // ultra smooth
  smooth: true,
  smoothTouch: false,
  wheelMultiplier: 0.9
});

/* Sync Lenis with GSAP (BEST METHOD) */
lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);



/* ================================================= */
/* MENU */
/* ================================================= */

function menu(){

  const btn = document.getElementById("menuBtn");
  const overlay = document.getElementById("menuOverlay");

  btn.addEventListener("click", () => {

    btn.classList.toggle("active");
    overlay.classList.toggle("active");

    /* Pause scroll when menu open */
    if(overlay.classList.contains("active")){
      lenis.stop();
    } else {
      lenis.start();
    }

    /* Premium stagger animation */
    gsap.fromTo(".nav-links li",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.06,
        duration: 1,
        ease: "power4.out"
      }
    );

  });

}
menu();



/* ================================================= */
/* LOADER */
/* ================================================= */

/* ======================================================
   GSAP + SCROLLTRIGGER
====================================================== */

gsap.registerPlugin(ScrollTrigger);


/* ======================================================
   HIDE HERO INITIALLY (prevents flash 100%)
====================================================== */

gsap.set(".hero", { autoAlpha: 0 });



/* ======================================================
   LENIS + SCROLLTRIGGER SYNC
====================================================== */

function setupLenisScroll(){

  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value){
      return arguments.length
        ? lenis.scrollTo(value)
        : lenis.scroll.instance.scroll.y;
    },
    getBoundingClientRect(){
      return {
        top:0,
        left:0,
        width:window.innerWidth,
        height:window.innerHeight
      };
    }
  });

  lenis.on("scroll", ScrollTrigger.update);
}



/* ======================================================
   TEXT SPLIT HELPERS (PURE JS ONLY)
====================================================== */

function splitLines(el){
  const text = el.innerHTML.split("<br>");
  el.innerHTML = "";

  text.forEach(line=>{
    const mask = document.createElement("div");
    mask.style.overflow = "hidden";

    const inner = document.createElement("div");
    inner.innerHTML = line;

    mask.appendChild(inner);
    el.appendChild(mask);
  });

  return el.querySelectorAll("div > div");
}

function splitWords(el){
  const words = el.textContent.split(" ");
  el.innerHTML = "";

  words.forEach(word=>{
    const span = document.createElement("span");
    span.textContent = word + " ";
    span.style.display = "inline-block";
    el.appendChild(span);
  });

  return el.querySelectorAll("span");
}



/* ======================================================
   ⭐ PROFESSIONAL HERO REVEAL (NO FLASH)
====================================================== */

function heroReveal(){

  const leftLines  = splitLines(document.querySelector(".side.left"));
  const rightLines = splitLines(document.querySelector(".side.right"));
  const residence  = splitWords(document.querySelector(".residence"));
  const mairen     = splitWords(document.querySelector(".mairen"));

  /* -------- SET INITIAL STATE FIRST (CRITICAL) -------- */

  gsap.set([leftLines, rightLines], {
    y: 120,
    opacity: 0
  });

  gsap.set([residence, mairen], {
    y: 100,
    opacity: 0,
    scale: 0.97
  });

  gsap.set([".logo",".topbar span",".menu-btn"], {
    y: 20,
    opacity: 0
  });


  /* -------- CINEMATIC TIMELINE -------- */

  const tl = gsap.timeline({
    defaults:{ ease:"expo.out" }
  });


  /* header */
  tl.to(".logo", { y:0, opacity:1, duration:1 }, 0.1);

  tl.to(".topbar span", {
    y:0,
    opacity:1,
    stagger:0.08,
    duration:0.9
  }, 0.2);

  tl.to(".menu-btn", {
    y:0,
    opacity:1,
    duration:0.9
  }, 0.25);


  /* side text */
  tl.to(leftLines, {
    y:0,
    opacity:1,
    stagger:0.12,
    duration:1.3
  }, 0.45);

  tl.to(rightLines, {
    y:0,
    opacity:1,
    stagger:0.1,
    duration:1.3
  }, 0.6);


  /* titles (hero focus) */
  tl.to(residence, {
    y:0,
    opacity:1,
    scale:1,
    stagger:0.04,
    duration:1.5
  }, 0.9);

  tl.to(mairen, {
    y:0,
    opacity:1,
    scale:1,
    stagger:0.04,
    duration:1.5
  }, 1.05);


  /* grid draw */
  tl.from(".grid span", {
    scaleY:0,
    transformOrigin:"top",
    stagger:0.06,
    duration:1
  }, 1.3);
}



/* ======================================================
   PROFESSIONAL VISIBLE PARALLAX
   (background only — menu/text never move)
====================================================== */

function heroImageParallax(){

  const hero = document.querySelector(".hero");

  // set initial background position (NO force3D)
  gsap.set(hero, {
    backgroundPosition: "50% 60%"
  });

  gsap.to(hero, {
    backgroundPosition: "50% 40%", // bigger movement = visible parallax
    ease: "none",
    scrollTrigger:{
      trigger: hero,

      // proper full scroll range
      start: "top bottom",
      end: "bottom top",

      scrub: 2,              // smooth
      invalidateOnRefresh: true
    }
  });

}


/* ======================================================
   LOADER  (🔥 CORRECT ORDER — NO FLASH)
====================================================== */

function loader(){

  const reveal   = document.querySelector(".logo-reveal");
  const loaderEl = document.querySelector(".loader");
  const hero     = document.querySelector(".hero");

  lenis.stop();


  gsap.to(reveal,{
    clipPath:"inset(0 0% 0 0)",
    duration:2.8,
    ease:"power2.inOut",

    onComplete:()=>{

      /* ---- PREPARE STATES FIRST ---- */
      setupLenisScroll();
      heroReveal();
      heroImageParallax();

      /* ---- FADE LOADER ---- */
      gsap.to(loaderEl,{
        opacity:0,
        duration:0.8,
        onComplete:()=>{
          loaderEl.style.display="none";
          lenis.start();
        }
      });

      /* ---- SHOW HERO LAST ---- */
      gsap.to(hero,{
        autoAlpha:1,
        duration:1.2,
        ease:"power2.out"
      });
    }
  });
}



/* ======================================================
   START
====================================================== */

loader();



/* ================================================= */
/* PAGE 1 – SMOOTH SCROLL REVEAL */
/* ================================================= */

gsap.timeline({
  scrollTrigger:{
    trigger:".page1",
    start:"top 70%",
    toggleActions:"play none none reverse"
  }
})

.from(".about_us_sec",{
  y:50,
  opacity:0,
  duration:1,
  ease:"power3.out"
})

.from(".para1",{
  y:80,
  opacity:0,
  duration:1.4,
  ease:"power4.out"
}, "-=0.6")

.from(".muted",{
  opacity:0,
  stagger:0.05,
  duration:0.6
}, "-=0.8")

.from(".bottom p",{
  y:30,
  opacity:0,
  stagger:0.2,
  duration:1
}, "-=0.6");



const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});



gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {

ScrollTrigger.config({ limitCallbacks: true });

/* HERO VIDEO SCALE */

gsap.from(".section3_img video", {
scale: 1.3,
duration: 2,
ease: "power4.out",
scrollTrigger: {
trigger: ".section3",
start: "top 75%",
once: true
}
});

/* LINE ANIMATION */

gsap.to(".section3_line", {
scaleX: 1,
duration: 1.4,
ease: "expo.out",
scrollTrigger: {
trigger: ".section3",
start: "top 75%",
once: true
}
});

/* SPLIT TEXT */

const splitHeading = new SplitType(".heading_section3", { types: "lines" });
const splitPara = new SplitType(".para", { types: "lines" });

/* HEADING ANIMATION */

gsap.from(splitHeading.lines, {
yPercent: 120,
opacity: 0,
stagger: 0.08,
duration: 1.2,
ease: "power4.out",
scrollTrigger: {
trigger: ".heading_section3",
start: "top 85%",
once: true
}
});

/* BUTTON ANIMATION */

gsap.from(".section3_buttons button", {
y: 40,
opacity: 0,
stagger: 0.12,
duration: 0.8,
ease: "power3.out",
scrollTrigger: {
trigger: ".section3_buttons",
start: "top 90%",
once: true
}
});

/* PARAGRAPH ANIMATION */

gsap.from(splitPara.lines, {
yPercent: 120,
opacity: 0,
stagger: 0.06,
duration: 1.2,
ease: "power4.out",
scrollTrigger: {
trigger: ".para",
start: "top 90%",
once: true
}
});

});

gsap.registerPlugin(ScrollTrigger);

gsap.from(".proj_left",{
y:-120,
opacity:0,
duration:1.3,
ease:"power3.out",
scrollTrigger:{
trigger:".proj_srt",
start:"top 80%",
toggleActions:"play none none none"
}
});

gsap.from(".proj_right",{
y:-120,
opacity:0,
duration:1.3,
delay:.2,
ease:"power3.out",
scrollTrigger:{
trigger:".proj_srt",
start:"top 80%",
toggleActions:"play none none none"
}
});

gsap.from(".proj_para",{
y:100,
opacity:0,
duration:1.2,
delay:.6,
ease:"power3.out",
scrollTrigger:{
trigger:".proj_srt",
start:"top 80%",
toggleActions:"play none none none"
}
});



function projectCardAnimation() {


  const cards = document.querySelectorAll(".card-container");

  cards.forEach((card) => {

    const paths = card.querySelectorAll(".svg-stroke path");
    const title = card.querySelector(".card-title h3");

    const split = new SplitText(title, { type: "words" });

    gsap.set(split.words, { yPercent: 100 });


    // CACHE PATH LENGTHS (ONLY ONCE)
    const pathData = [];

    paths.forEach((path) => {

      const length = path.getTotalLength();

      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;

      pathData.push({
        el: path,
        length: length
      });

    });


    // HOVER ENTER TIMELINE
    const enterTL = gsap.timeline({ paused: true });

    pathData.forEach((p) => {

      enterTL.to(
        p.el,
        {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power2.out"
        },
        0
      );

      enterTL.to(
        p.el,
        {
          strokeWidth: 700,
          duration: 1.2,
          ease: "power2.out"
        },
        0
      );

    });

    enterTL.to(
      split.words,
      {
        yPercent: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.075
      },
      0.35
    );


    // HOVER LEAVE TIMELINE
    const leaveTL = gsap.timeline({ paused: true });

    pathData.forEach((p) => {

      leaveTL.to(
        p.el,
        {
          strokeDashoffset: p.length,
          strokeWidth: 200,
          duration: 0.9,
          ease: "power2.out"
        },
        0
      );

    });

    leaveTL.to(
      split.words,
      {
        yPercent: 100,
        duration: 0.5,
        ease: "power3.out",
        stagger: {
          each: 0.05,
          from: "end"
        }
      },
      0
    );


    // EVENTS (NO timeline recreation)
    card.addEventListener("mouseenter", () => {
      leaveTL.pause(0);
      enterTL.restart();
    });

    card.addEventListener("mouseleave", () => {
      enterTL.pause(0);
      leaveTL.restart();
    });

  });

}

projectCardAnimation();





function footer(){
  gsap.from(".gokuRow",{
opacity:0,
y:60,
stagger:0.2,
duration:1
})

gsap.from(".doraemonLogo",{
y:120,
opacity:0,
duration:1.2,
delay:0.5
})
}

footer()