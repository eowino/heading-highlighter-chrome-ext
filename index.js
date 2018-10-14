// @ts-check
const namespace = '__chrome-highlight-heading-ext__';
let checkPageButton;
const state = {
  isActive: false,
};

function getTabs(tabs) {
  const currentTab = tabs[0].id;
  chrome.tabs.sendMessage(currentTab, { namespace, state }, undefined, handleResponse);
}

function getInitialState(tabs) {
  const currentTab = tabs[0].id;
  // not sending state - thus indicating initial handshake 
  chrome.tabs.sendMessage(currentTab, { namespace }, undefined, handleResponse); 
}

function triggerMessage(callback) {
  chrome.tabs.query({
    active: true,
    currentWindow: true,
  }, callback);
}

function setButtonText() {
  checkPageButton.innerText = state.isActive ? 'Un-highlight Headings' : 'Highlight Headings';
}

function handleResponse(response) {
  if (response) {
    state.isActive = true;
  } else {
    state.isActive = false;
  }
  setButtonText(); 
}

document.addEventListener('DOMContentLoaded', function() {
  triggerMessage(getInitialState);
  checkPageButton = document.querySelector('#hheInitHeadingBtn');

  checkPageButton.addEventListener('click', function() {
    triggerMessage(getTabs);
  }, false);
}, false);
