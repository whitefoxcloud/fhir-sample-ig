/**
 * Searchable Headings - Makes document heading numbers searchable in browsers
 * 
 * Replaces CSS Pseudo counter-based heading numbers with actual DOM elements,
 * maintaining the same visual appearance but making them searchable.
 */
document.addEventListener('DOMContentLoaded', () => {
  const config = {
    headingSelectors: ['h2', 'h3', 'h4', 'h5', 'h6'],
    numberColor: 'silver',
    numberClass: 'heading-number',
    processedClass: 'js-numbered'
  };
  
  const headingProcessor = (() => {
    let counters = {
      section: 0,
      subSection: 0,
      composite: 0,
      detail: 0,
      moreDetail: 0
    };
    
    const resetChildCounters = level => {
      if (level <= 1) counters.subSection = 0;
      if (level <= 2) counters.composite = 0;
      if (level <= 3) counters.detail = 0;
      if (level <= 4) counters.moreDetail = 0;
    };
    
    return {
      processHeading: (heading, basePrefix) => {
        const level = parseInt(heading.tagName.charAt(1));
        
        let number = '';
        switch (level) {
          case 2:
            counters.section++;
            resetChildCounters(1);
            number = basePrefix;
            break;
          case 3:
            counters.subSection++;
            resetChildCounters(2);
            number = `${basePrefix}.${counters.subSection}`;
            break;
          case 4:
            counters.composite++;
            resetChildCounters(3);
            number = `${basePrefix}.${counters.subSection}.${counters.composite}`;
            break;
          case 5:
            counters.detail++;
            resetChildCounters(4);
            number = `${basePrefix}.${counters.subSection}.${counters.composite}.${counters.detail}`;
            break;
          case 6:
            counters.moreDetail++;
            number = `${basePrefix}.${counters.subSection}.${counters.composite}.${counters.detail}.${counters.moreDetail}`;
            break;
        }
        
        return number;
      }
    };
  })();

  const getBasePrefix = () => {
    try {
      const h2El = document.querySelector('h2') || document.createElement('h2');
      const style = window.getComputedStyle(h2El);
      const cssPrefix = style.getPropertyValue('--heading-prefix');
      
      if (cssPrefix && cssPrefix.trim()) {
        return cssPrefix.replace(/['"[\]]/g, '').trim();
      }
      
      const headingOffset = document.querySelector('meta[name="heading-offset"]')?.content || '';
      const label = document.querySelector('meta[name="label"]')?.content || '';
      
      return (headingOffset + label).replace(/['"[\]]/g, '').trim() || '1';
    } catch (e) {
      console.warn('Error getting heading prefix:', e);
      return '1';
    }
  };
  
  const processHeadings = () => {
    const basePrefix = getBasePrefix();
    
    const style = document.createElement('style');
    style.textContent = config.headingSelectors
      .map(selector => `${selector}.${config.processedClass}:before { content: none !important; }`)
      .join('\n');
    document.head.appendChild(style);
    
    const headings = document.querySelectorAll(config.headingSelectors.join(','));
    
    headings.forEach(heading => {
      if (heading.classList.contains(config.processedClass)) return;
      
      const prefix = headingProcessor.processHeading(heading, basePrefix);
      
      const span = document.createElement('span');
      span.className = config.numberClass;
      span.style.color = config.numberColor;
      span.textContent = prefix + ' ';
      
      heading.insertBefore(span, heading.firstChild);
      heading.classList.add(config.processedClass);
    });
  };
  
  processHeadings();
});