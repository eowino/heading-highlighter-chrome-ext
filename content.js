// @ts-check
const namespace = '__chrome-highlight-heading-ext__';
const className = 'highlight-heading-ext';
const keyContainerId = 'hheContainer';
const keyId = 'hheKey';
const styleTagId = 'hheStyleTag';
const headings = {
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

function getHeadingClassNames() {
  return Object.getOwnPropertyNames(headings).reduce((prev, curr) => {
    return (
      prev +
      `.${className} ${curr} { 
          outline: 3px solid ${headings[curr].bg} !important; 
       }`
    );
  }, '');
}

function getStyles() {
  const styleEl = document.createElement('style');
  styleEl.id = styleTagId;
  styleEl.innerHTML = `
    #${keyId} {
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

    #${keyId} p {
        font-size: 20px;
        margin: 0;
        padding: 6px;
    }

    #${keyId}:hover {
      /** If you want to see something behind it **/
      opacity: 0.1;
    }

    ${getHeadingClassNames()}
  `;
  return styleEl;
}

function insertBadgeStyles() {
  document.head.appendChild(getStyles());
}

function createKey() {
  return Object.getOwnPropertyNames(headings)
    .map(
      h =>
        `<p style="background-color: ${headings[h].bg}; color: ${
          headings[h].color
        }">Heading : ${h}</p>`
    )
    .join('');
}

function appendKeyToDOM() {
  const container = document.createElement('div');
  container.id = keyContainerId;
  container.innerHTML = `<div id="${keyId}">${createKey()}</div>`;
  document.body.appendChild(container);
}

function hasExecuted() {
  const styles = document.querySelector(`#${styleTagId}`);
  const key = document.querySelector(`#${keyId}`);
  return Boolean(styles || key);
}

const r = node => node && node.remove();

function resetDOM() {
  r(document.querySelector(`#${keyContainerId}`));
  r(document.querySelector(`#${styleTagId}`));
  document.body.classList.remove(className);
}

function init() {
  document.body.classList.add(className);
  initialiseHeadings();
  appendKeyToDOM();
  insertBadgeStyles();
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.namespace === namespace) {
    // false when an initial handshake is sent
    if (request.state) {
        if (request.state.isActive) {
          resetDOM();
        } else {
          init();
        }
    }
    sendResponse(hasExecuted());
  }
});
