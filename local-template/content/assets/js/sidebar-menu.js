document.addEventListener('DOMContentLoaded', function() {
  const menuToggles = document.querySelectorAll('[data-bs-toggle="collapse"]');
  
  menuToggles.forEach(toggle => {
    const submenuSelector = toggle.getAttribute('href');
    if (!submenuSelector || !submenuSelector.startsWith('#')) return;
    
    const submenuId = submenuSelector.substring(1);
    const submenu = document.getElementById(submenuId);
    const chevron = toggle.querySelector('svg');
    
    if (!submenu || !chevron) return;
    
    const storageKey = `menu-${submenuId}-state`;
    
    const isExpanded = localStorage.getItem(storageKey) === 'open' || 
                       submenu.classList.contains('show');
    
    if (isExpanded) {
      submenu.classList.add('show');
      chevron.style.transform = 'rotate(90deg)';
    } else {
      submenu.classList.remove('show');
      chevron.style.transform = 'rotate(0deg)';
    }
    
    toggle.addEventListener('mousedown', function(e) {
      const willBeExpanded = !submenu.classList.contains('show');
      
      chevron.style.transform = willBeExpanded ? 'rotate(90deg)' : 'rotate(0deg)';
      
      localStorage.setItem(storageKey, willBeExpanded ? 'open' : 'closed');
    });
  });
  
  function applySelectedStyling(selectedHref) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('menu-item-selected');
      link.style.backgroundColor = 'transparent';
      link.style.borderRadius = '0';
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === selectedHref) {
        link.classList.add('menu-item-selected');
        link.style.backgroundColor = '#2A3C5E';
        link.style.borderRadius = '4px';
        
        const parentSubmenu = link.closest('.collapse');
        if (parentSubmenu) {
          parentSubmenu.classList.add('show');
          
          const parentId = parentSubmenu.id;
          const parentToggle = document.querySelector(`[href="#${parentId}"]`);
          const parentChevron = parentToggle?.querySelector('svg');
          
          if (parentChevron) {
            parentChevron.style.transform = 'rotate(90deg)';
            localStorage.setItem(`menu-${parentId}-state`, 'open');
          }
        }
        
        localStorage.setItem('selectedMenuItem', href);
      }
    });
  }
  
  document.querySelectorAll('.nav-link:not([data-bs-toggle])').forEach(link => {
    link.addEventListener('click', function() {
      const href = this.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        applySelectedStyling(href);
      }
    });
  });
  
  const currentPath = window.location.pathname;
  const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
  const savedMenuItem = localStorage.getItem('selectedMenuItem');
  
  if (filename) {
    applySelectedStyling(filename);
  } else if (savedMenuItem) {
    applySelectedStyling(savedMenuItem);
  }
});