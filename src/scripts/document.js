let doc; 

export function initializeDocument(injectedDocument) {
  doc = injectedDocument;
}
export function getElement() {
    var element = doc.querySelectorAll('div#CombinedBuybox')[0];
    return element;
}