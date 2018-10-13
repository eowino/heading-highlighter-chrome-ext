// @ts-check
const namespace = '__chrome-heading-ext__';
let checkPageButton;

function getTabs(tabs) {
  const currentTab = tabs[0].id;
  chrome.tabs.sendMessage(currentTab, { namespace }, undefined, handleResponse);
}

function triggerMessage() {
  chrome.tabs.query({
    active: true,
    currentWindow: true,
  }, getTabs);
}

function handleResponse(response) {
  if (response) {
   checkPageButton.text = 'Highlight Headings'
  } else {
    checkPageButton.text = 'Un-highlight Headings'
  }
}

document.addEventListener('DOMContentLoaded', function() {
  checkPageButton = document.querySelector('#hheInitHeadingPlugin');
  
  checkPageButton.addEventListener('click', function() {
    triggerMessage();
  }, false);
}, false);
