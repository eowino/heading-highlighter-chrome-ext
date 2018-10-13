var namespace = '__chrome-heading-ext__';
var badgesContainer = '';
var badges = '';
var headings = {
  h1: {
    elements: [],
    bg: 'yellow',
    color: '#000'
  },
  h2: {
    elements: [],
    bg: 'orange',
    color: '#000'
  },
  h3: {
    elements: [],
    bg: 'blue',
    color: '#fff'
  },
  h4: {
    elements: [],
    bg: 'purple',
    color: '#fff'
  },
  h5: {
    elements: [],
    bg: 'cyan',
    color: '#000'
  },
  h6: {
    elements: [],
    bg: 'black',
    color: '#fff'
  }
};

function initialiseHeadings() {
  // initialise all headings in the DOM
  for (let h in headings) {
    headings[h].elements = [...document.body.querySelectorAll(h)];
  }
}

function getBadgeStyles() {
  var styleEl = document.createElement('style');
  styleEl.id = 'hheStyle';
  styleEl.innerHTML = `
    #hheKey {
      background: #fff;
      border-radius: 4px;
      border: 1px solid #ccc;
      min-height: 16px;
      padding: 6px;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999999;
    }

    #hheKey p {
        font-size: 20px;
        margin: 0;
        padding: 6px;
    }

    #hheKey:hover {
      /** If you want to see something behind it **/
      opacity: 0.1;
    }
  `;
  return styleEl;
}

function insertBadgeStyles() {
  document.head.appendChild(getBadgeStyles());
}

function highlightHeadings() {
  for (let h in headings) {
    var heading = headings[h];
    badges =
      badges +
      `<p style="background-color: ${heading.bg}; color: ${
        heading.color
      }">Heading : ${h}</p>`;
    heading.elements.forEach(function(h) {
      h.style.outline = `2px solid ${heading.bg}`;
    });
  }

  badgesContainer = `<div id="hheKey">${badges}</div>`;
}

function appendKeyToDOM() {
  var container = document.createElement('div');
  container.id = 'hheContainer';
  container.innerHTML = badgesContainer;
  document.body.appendChild(container);
}

function hasExecuted() {
  var styles = document.querySelector('#hheStyle');
  var key = document.querySelector('#hheKey');
  return Boolean(styles || key);
}

function resetDOM() {
    
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.namespace === namespace) {
    if (!hasExecuted()) {
        initialiseHeadings();
        highlightHeadings();
        appendKeyToDOM();
        insertBadgeStyles();
    }
    sendResponse(hasExecuted());
  }
  return true;
});
