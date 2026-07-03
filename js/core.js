document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      
      // Update toggle icon (hamburger vs close)
      const isOpen = navMenu.classList.contains('open');
      menuToggle.innerHTML = isOpen 
        ? `<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
        : `<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
    });
  }

  // 2. Active Link Highlighter
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Match index.html or empty path for home
    if (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('/') || currentPath.endsWith('index.html'))) {
      link.classList.add('active');
    } else if (href && currentPath.endsWith(href)) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 3. Floating WhatsApp link functionality is now handled natively via HTML href.

  const canvas_element = document.createElement('canvas');
  canvas_element.id = 'background-circuit-canvas';
  document.body.insertBefore(canvas_element, document.body.firstChild);
  const canvas_context = canvas_element.getContext('2d');

  function resize_canvas() {
    canvas_element.width = window.innerWidth;
    canvas_element.height = window.innerHeight;
  }
  window.addEventListener('resize', resize_canvas);
  resize_canvas();

  function create_circuit_drop() {
    const start_x = Math.random() * window.innerWidth;
    const start_y = -100 - Math.random() * 200;
    const fall_speed = 1.5 + Math.random() * 2.5;
    const target_trail_length = 200 + Math.random() * 250;
    const generated_segments = [];
    let current_y = start_y;
    let current_x = start_x;
    generated_segments.push({ x: current_x, y: current_y, dist: 0 });
    let accumulated_dist = 0;
    while (current_y < window.innerHeight + 300) {
      const vert_len = 80 + Math.random() * 150;
      current_y += vert_len;
      accumulated_dist += vert_len;
      generated_segments.push({ x: current_x, y: current_y, dist: accumulated_dist });
      if (Math.random() < 0.65 && current_y < window.innerHeight + 100) {
        const diag_dir = Math.random() < 0.5 ? -1 : 1;
        const diag_len = 30 + Math.random() * 50;
        current_x += diag_dir * diag_len;
        current_y += diag_len;
        accumulated_dist += Math.sqrt(2) * diag_len;
        generated_segments.push({ x: current_x, y: current_y, dist: accumulated_dist });
      }
    }
    return {
      segments: generated_segments,
      total_dist: accumulated_dist,
      speed: fall_speed,
      trail_length: target_trail_length,
      progress: 0,
      active: true
    };
  }

  function get_point_at_distance(segments, dist) {
    if (dist <= 0) {
      return { x: segments[0].x, y: segments[0].y };
    }
    if (dist >= segments[segments.length - 1].dist) {
      const last = segments[segments.length - 1];
      return { x: last.x, y: last.y };
    }
    for (let index = 0; index < segments.length - 1; index++) {
      const current_pt = segments[index];
      const next_pt = segments[index + 1];
      if (dist >= current_pt.dist && dist <= next_pt.dist) {
        const pct = (dist - current_pt.dist) / (next_pt.dist - current_pt.dist);
        return {
          x: current_pt.x + pct * (next_pt.x - current_pt.x),
          y: current_pt.y + pct * (next_pt.y - current_pt.y)
        };
      }
    }
    return { x: segments[0].x, y: segments[0].y };
  }

  function draw_trail_path(ctx, segments, start_dist, end_dist) {
    if (start_dist >= end_dist) {
      return;
    }
    ctx.beginPath();
    const start_pt = get_point_at_distance(segments, start_dist);
    ctx.moveTo(start_pt.x, start_pt.y);
    for (let index = 0; index < segments.length; index++) {
      const pt = segments[index];
      if (pt.dist > start_dist && pt.dist < end_dist) {
        ctx.lineTo(pt.x, pt.y);
      }
    }
    const end_pt = get_point_at_distance(segments, end_dist);
    ctx.lineTo(end_pt.x, end_pt.y);
    ctx.stroke();
  }

  function draw_circuit(ctx, circ, start_d, end_d) {
    const start_pt = get_point_at_distance(circ.segments, start_d);
    const end_pt = get_point_at_distance(circ.segments, end_d);
    const gradient_element = ctx.createLinearGradient(start_pt.x, start_pt.y, end_pt.x, end_pt.y);
    gradient_element.addColorStop(0, 'rgba(200, 202, 51, 0)');
    gradient_element.addColorStop(1, 'rgba(200, 202, 51, 0.4)');
    ctx.strokeStyle = gradient_element;
    ctx.lineWidth = 1.5;
    draw_trail_path(ctx, circ.segments, start_d, end_d);
    for (let index = 1; index < circ.segments.length - 1; index++) {
      const vertex = circ.segments[index];
      if (vertex.dist > start_d && vertex.dist < end_d) {
        ctx.fillStyle = 'rgba(200, 202, 51, 0.7)';
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.fillStyle = 'rgba(200, 202, 51, 0.15)';
    ctx.beginPath();
    ctx.arc(end_pt.x, end_pt.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(200, 202, 51, 0.9)';
    ctx.beginPath();
    ctx.arc(end_pt.x, end_pt.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const active_circuits = [];
  const max_circuits = 6;

  function animate_circuits() {
    canvas_context.clearRect(0, 0, canvas_element.width, canvas_element.height);
    for (let index = active_circuits.length - 1; index >= 0; index--) {
      const circ = active_circuits[index];
      circ.progress += circ.speed;
      const start_d = Math.max(0, circ.progress - circ.trail_length);
      const end_d = Math.min(circ.total_dist, circ.progress);
      if (start_d >= circ.total_dist) {
        circ.active = false;
      }
      if (circ.active) {
        draw_circuit(canvas_context, circ, start_d, end_d);
      } else {
        active_circuits.splice(index, 1);
      }
    }
    if (active_circuits.length < max_circuits) {
      if (active_circuits.length === 0 || Math.random() < 0.015) {
        active_circuits.push(create_circuit_drop());
      }
    }
    requestAnimationFrame(animate_circuits);
  }

  animate_circuits();
});
