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

  // 3. Floating WhatsApp Popup Notification (Temporary non-functional WhatsApp handling)
  const whatsappFloats = document.querySelectorAll('.whatsapp-float');
  
  whatsappFloats.forEach(waButton => {
    waButton.addEventListener('click', (e) => {
      e.preventDefault();
      showToastNotification();
    });
  });

  function showToastNotification() {
    // Check if notification already exists
    let toast = document.getElementById('etk-toast');
    if (toast) return;

    // Create toast container
    toast = document.createElement('div');
    toast.id = 'etk-toast';
    
    // Style toast dynamically
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '100px',
      right: '32px',
      backgroundColor: '#0a0f0d',
      color: '#e0e6e3',
      padding: '16px 20px',
      borderRadius: '8px',
      border: '1.5px solid #c8ca33',
      boxShadow: '0 0 15px rgba(200, 202, 51, 0.3)',
      fontFamily: "'Outfit', sans-serif",
      fontSize: '14px',
      zIndex: '1000',
      opacity: '0',
      transform: 'translateY(20px)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      maxWidth: '320px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    });

    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; color: #c8ca33;">
        <svg style="width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 2;" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        WhatsApp em Breve!
      </div>
      <div style="font-size: 13px; line-height: 1.4; color: #8fa399;">
        O WhatsApp da Это-Тек está sendo configurado... Fale conosco no Instagram <a href="https://instagram.com/eto_tek" target="_blank" style="color: #c8ca33; font-weight: 600; text-decoration: underline;">@eto_tek</a>!
      </div>
    `;

    document.body.appendChild(toast);

    // Trigger animate in
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 10);

    // Automatically remove after 5 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 5000);
  }
});
