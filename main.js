const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("No Canvas");

const w = canvas.width;
const h = canvas.height;

const primaryColor = "rgb(200, 0, 0)";
const pointSize = 0;
const lineWidth = 1;
const angle = Math.PI / 10;
const runSpeed = 0.01;

const center = { x: 0, y: 0, z: 30 };

const points = [
  { x: -10, y: -10, z: 20 },
  { x: -10, y: -10, z: 40 },
  { x: 10, y: -10, z: 20 },
  { x: 10, y: -10, z: 40 },
  { x: -10, y: 10, z: 20 },
  { x: -10, y: 10, z: 40 },
  { x: 10, y: 10, z: 20 },
  { x: 10, y: 10, z: 40 },
];

const lines = [
  [0, 1],
  [1, 3],
  [3, 2],
  [2, 0],
  [1, 5],
  [2, 6],
  [3, 7],
  [0, 4],
  [4, 5],
  [5, 7],
  [7, 6],
  [6, 4],
];

const mutate3to2d = ({ x, y, z }) => {
  return {
    x: (x / z + 1) * (w * 0.5),
    y: (-y / z + 1) * (h * 0.5),
  };
};

const rotateY = ({ x, y, z }, angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return {
    x: x * cos + z * sin,
    y: y,
    z: -x * sin + z * cos,
  };
};

const rotateAroundCenter = (p, center, angle) => {
  const translated = {
    x: p.x - center.x,
    y: p.y - center.y,
    z: p.z - center.z,
  };

  const rotated = rotateY(translated, angle);

  return {
    x: rotated.x + center.x,
    y: rotated.y + center.y,
    z: rotated.z + center.z,
  };
};

const drawLine = (p1, p2) => {
  ctx.beginPath();
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = lineWidth;
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
};

const plotPoint = ({ x, y }) => {
  ctx.fillStyle = primaryColor;
  ctx.fillRect(x - 0.5 * pointSize, y - 0.5 * pointSize, pointSize, pointSize);
};

let i = 0;

const loop = (func) => {
  i++;
  func(i);
  setTimeout(() => loop(func), 1 / runSpeed);
};

const run = (i) => {
  ctx.clearRect(0, 0, w, h);

  const transformed = points.map((p) => {
    const rotated = rotateAroundCenter(p, center, angle * i);
    const translated = { ...rotated, z: rotated.z + i };
    return mutate3to2d(translated);
  });

  transformed.forEach(plotPoint);

  lines.forEach(([a, b]) => {
    drawLine(transformed[a], transformed[b]);
  });
};

loop(run);
