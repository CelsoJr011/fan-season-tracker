// Small hand-made SVG line chart for the points race.
// A chart library would be overkill for two lines, and doing it by hand was a
// good way to learn how scales and axes actually work.

const SVG_NS = 'http://www.w3.org/2000/svg';

function el(name, attrs = {}, text) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  if (text !== undefined) node.textContent = text;
  return node;
}

// Round the top of the axis up to a "nice" number (10, 20, 30...), so the
// grid lines land on values people actually read.
function niceMax(value) {
  const step = value > 60 ? 20 : 10;
  return Math.max(step, Math.ceil(value / step) * step);
}

export function drawPointsChart(container, series, labels) {
  container.innerHTML = '';

  const longest = Math.max(0, ...series.map((s) => s.points.length));
  if (longest === 0) {
    container.innerHTML = `<p class="hint">${labels.emptyText}</p>`;
    return;
  }

  // Drawn at the real container width (instead of a scaled viewBox), so the
  // text keeps the same size on a phone and on a big screen.
  const width = Math.max(280, container.clientWidth);
  const height = width < 500 ? 220 : 280;
  const pad = { top: 16, right: width < 500 ? 16 : 24, bottom: 36, left: 40 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const maxPoints = niceMax(Math.max(...series.flatMap((s) => s.points.map((p) => p.points))));
  // Match 0 = start of the season with 0 points, so every line starts at the origin.
  const x = (match) => pad.left + (match / longest) * plotW;
  const y = (points) => pad.top + plotH - (points / maxPoints) * plotH;

  const svg = el('svg', { width, height, role: 'img', 'aria-label': labels.ariaLabel, class: 'chart' });

  // Grid + y labels. Kept light so the lines are what you see first.
  const step = maxPoints > 60 ? 20 : 10;
  for (let v = 0; v <= maxPoints; v += step) {
    svg.append(el('line', { x1: pad.left, x2: width - pad.right, y1: y(v), y2: y(v), class: v === 0 ? 'axis' : 'grid' }));
    svg.append(el('text', { x: pad.left - 8, y: y(v) + 4, 'text-anchor': 'end', class: 'tick' }, String(v)));
  }

  // x labels: not every match, or they overlap on small screens.
  const every = longest > 20 ? 5 : longest > 10 ? 2 : 1;
  for (let m = 1; m <= longest; m += 1) {
    if (m % every !== 0 && m !== 1) continue;
    svg.append(el('text', { x: x(m), y: height - pad.bottom + 16, 'text-anchor': 'middle', class: 'tick' }, String(m)));
  }
  svg.append(el('text', { x: pad.left + plotW / 2, y: height - 4, 'text-anchor': 'middle', class: 'axis-title' }, labels.matchLabel));

  for (const s of series) {
    if (!s.points.length) continue;
    const coords = [[x(0), y(0)], ...s.points.map((p) => [x(p.match), y(p.points)])];
    svg.append(el('polyline', {
      points: coords.map((c) => c.join(',')).join(' '),
      fill: 'none', stroke: s.color, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round',
    }));
    // Small dot at the end of each line, so you can see where each club is now.
    const last = coords.at(-1);
    svg.append(el('circle', { cx: last[0], cy: last[1], r: 4, fill: s.color, stroke: 'var(--surface)', 'stroke-width': 2 }));
  }

  // Hover layer: vertical guide + one marker per club, plus an HTML tooltip.
  const guide = el('line', { y1: pad.top, y2: pad.top + plotH, class: 'guide', visibility: 'hidden' });
  const markers = series.map((s) => el('circle', { r: 5, fill: s.color, stroke: 'var(--surface)', 'stroke-width': 2, visibility: 'hidden' }));
  svg.append(guide, ...markers);

  const hitArea = el('rect', { x: pad.left, y: pad.top, width: plotW, height: plotH, fill: 'transparent' });
  svg.append(hitArea);

  const tooltip = document.createElement('div');
  tooltip.className = 'chart-tooltip';
  tooltip.hidden = true;

  container.append(svg, tooltip);

  function show(event) {
    const box = svg.getBoundingClientRect();
    const match = Math.min(longest, Math.max(1, Math.round(((event.clientX - box.left - pad.left) / plotW) * longest)));
    const gx = x(match);

    guide.setAttribute('x1', gx);
    guide.setAttribute('x2', gx);
    guide.setAttribute('visibility', 'visible');

    const lines = [];
    series.forEach((s, i) => {
      const point = s.points[match - 1];
      if (!point) {
        markers[i].setAttribute('visibility', 'hidden');
        return;
      }
      markers[i].setAttribute('cx', gx);
      markers[i].setAttribute('cy', y(point.points));
      markers[i].setAttribute('visibility', 'visible');
      lines.push(`<div><span class="swatch" style="background:${s.color}"></span>${s.name}: <strong>${point.points}</strong></div>`);
    });

    tooltip.innerHTML = `<div class="tooltip-title">${labels.tooltipTitle(match)}</div>${lines.join('')}`;
    tooltip.hidden = false;

    // Keep the tooltip inside the chart: flip to the left side near the edge.
    const left = gx + 12 + tooltip.offsetWidth > width ? gx - 12 - tooltip.offsetWidth : gx + 12;
    tooltip.style.left = `${Math.max(0, left)}px`;
    tooltip.style.top = `${pad.top}px`;
  }

  function hide() {
    guide.setAttribute('visibility', 'hidden');
    markers.forEach((m) => m.setAttribute('visibility', 'hidden'));
    tooltip.hidden = true;
  }

  hitArea.addEventListener('pointermove', show);
  hitArea.addEventListener('pointerdown', show);
  hitArea.addEventListener('pointerleave', hide);
}
