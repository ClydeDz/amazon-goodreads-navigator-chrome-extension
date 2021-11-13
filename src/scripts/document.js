let doc; 

export function initializeDocument(injectedDocument) {
  doc = injectedDocument;
}

export function getElement(selector) {
  return doc.getElementById(selector)
}

export function getElements(selector) {
  var domElements = doc.querySelectorAll(selector);
  return !domElements || domElements.length == 0 ? undefined: domElements;
}

export function createButton(redirectLink) {
  if(!redirectLink) return;

  var div = doc.createElement("div");
  div.className = "amazon-goodreads-ext-container";
  
  var button = doc.createElement("button");
  button.onclick = function() {
      window.open(redirectLink, "_blank");
  };
  button.innerText= "View on Goodreads";
  button.className = "amazon-goodreads-ext-button amazon-goodreads-ext-mobile";   
  
  div.appendChild(button);
  return div;
}

export function prepend(parent, child) {
  parent.prepend(child);
}
