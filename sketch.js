// --- WIRING -------------------------------------------------
// TODO: get a reference to the canvas element by its id
// TODO: get the 2d drawing context from it
// TODO: draw one hard-coded line to prove the connection works, then delete it
const canvas = document.getElementById('board');
const ctx = canvas.getContext("2d");
const ratioSpan = document.getElementById('ratioValue');

ctx.strokeStyle = "black";
ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(800, 800);
ctx.stroke();

// --- PARAMETERS ---------------------------------------------
// TODO: declare R — radius of the fixed outer circle
// TODO: declare r — radius of the circle rolling inside it
// TODO: declare d — distance of the pen from the rolling circle's center
let R = 100;
let r = 40;
let d = 20;

// --- HELPERS ------------------------------------------------
// TODO: write gcd(a, b) using Euclid's algorithm
// TODO: write a function returning how many full rotations the pen makes
//       before the curve closes on itself
function gcd(a, b) {
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function rotations(R, r) {
  return r/gcd(R, r);
}

// --- DRAWING ------------------------------------------------
// TODO: write drawCurve()
//   TODO: clear the canvas
//   TODO: save the context state before you transform it
//   TODO: move the origin from the top-left corner to the center
//   TODO: flip the vertical axis so positive y points up
//   TODO: begin a new path
//   TODO: work out where the loop ends and how large each step should be
//   TODO: loop the angle t from 0 to that endpoint
//     TODO: compute the pen's x at angle t
//     TODO: compute the pen's y at angle t
//     TODO: moveTo on the first point, lineTo on every one after
//   TODO: set stroke color and line width
//   TODO: stroke the path
//   TODO: restore the context state
function drawCurve() {
  ctx.reset();
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(1, -1);
  ctx.beginPath()

  let t=0;
  let x=0;
  let y=0;
  let prevX=0;
  let prevY=0;
  let firstPoint = true;
  ctx.lineWidth = 1;
  while (t < 2 * Math.PI * rotations(R, r)) {
 
    x=(R-r)*Math.cos(t) + d*Math.cos(((R-r)/r) * t);
    y=(R-r)*Math.sin(t) - d*Math.sin(((R-r)/r) * t); 

    if (firstPoint) {
      ctx.moveTo(x,y);
      firstPoint = false;
    } else {
      ctx.strokeStyle = "hsl(" + (360 * (t / (2 * Math.PI * rotations(R, r)))) + ", 100%, 50%)";
      ctx.beginPath();
      ctx.moveTo(prevX, prevY)
      ctx.lineTo(x, y)
      ctx.stroke() 
    }

    prevX = x
    prevY = y
    t += 0.01;
  }

  ctx.restore();
  
}



// --- RUN ----------------------------------------------------
// TODO: call drawCurve() once on load
drawCurve()


// --- CONTROLS -----------------------------------------------
// TODO: get references to the three sliders
// TODO: get references to the three value readouts
// TODO: write one function that reads all three sliders into R, r, d,
//       updates the readouts, and redraws
// TODO: attach that function to each slider's input event
const Rslider = document.getElementById('RRange');
const rslider = document.getElementById('rRange');
const dslider = document.getElementById('dRange');

function update() {

  rslider.max = Rslider.value - 1;

  // Update the values from the sliders
  R = Number(Rslider.value);
  r = Number(rslider.value);
  d = Number(dslider.value);

  // Update the readouts
  document.getElementById('RValue').textContent = Rslider.value;
  document.getElementById('rValue').textContent = rslider.value;
  document.getElementById('dValue').textContent = dslider.value;

  const g = gcd(R, r);
  ratioSpan.textContent = (R / g) + " : " + (r / g);


  // Redraw the curve
  drawCurve();

}

Rslider.addEventListener('input', update);
rslider.addEventListener('input', update);
dslider.addEventListener('input', update);

// --- POLISH -------------------------------------------------
// TODO: shift the stroke color as t advances through the loop
// TODO: wire the Save button to export the canvas as a PNG
document.getElementById('savePNGbutton').addEventListener('click', function() {
  const a = document.createElement('a');
  a.href = canvas.toDataURL("image/png");
  a.download = "spirograph.png";
  a.click();
});



// --- THE INTERESTING PART -----------------------------------
// TODO: reduce R:r to lowest terms and display it as a fraction
// TODO: work out what the reduced denominator predicts about the shape,
//       then check your prediction against what actually draws
// TODO: add a mode where r is irrational so the ratio never reduces
// TODO: decide what the loop should do when the curve never closes
// TODO: animate — draw a few points per frame instead of all at once