import * as documentModule from "./document";
import * as utilModule from "./util";

function getBookIdentifierFromUrl(url){
    const regex = /(dp\/(\w*\d*)*)/g;
    return url.match(regex)[0];
}

function getIdentifierValue(key, domElements) {
    if(!domElements) return;

    var keyElement;   

    for(var i = 0; i < domElements.length; i++){
        if (utilModule.innerTextCheck(domElements[i], key)) {
            keyElement = domElements[i];
            break;
        }
    }

    if(!keyElement) return;

    return keyElement?.nextElementSibling?.innerText;
}

export function getDesktopBookIdentifierValue(key) {
    var domElements = documentModule.getElements('#detailBullets_feature_div span.a-list-item > span.a-text-bold')
        || documentModule.getElements('#featureBulletsAndDetailBullets_feature_div th.prodDetSectionEntry');   
    return getIdentifierValue(key, domElements);
}

export function getMobileBookIdentifierValue(key) {
    var domElements = documentModule.getElements('#featureBulletsAndDetailBullets_feature_div span.a-list-item > span.a-text-bold')
        || documentModule.getElements('#featureBulletsAndDetailBullets_feature_div th.prodDetSectionEntry');

    return getIdentifierValue(key, domElements);
}

export function getAudibleBookIdentifierValue(){
    var elements = documentModule.getElements('#audibleproductdetails_feature_div tr#detailsAsin > td > span')
        || documentModule.getElements('#audibleProductDetails #detailsAsin > td > span');
    if(!elements) return;
    return elements[0]?.innerText;
}

export function isDesktop() {
    var bookDetailsBox = documentModule.getElement("detailBullets_feature_div")
        || documentModule.getElement("audibleproductdetails_feature_div");
    return bookDetailsBox ? true: false;
}

export function isMobile() {
    var bookDetailsBox = documentModule.getElement("featureBulletsAndDetailBullets_feature_div")
        || documentModule.getElement("audibleProductDetails");
    return bookDetailsBox ? true: false;
}

export function addButtonToDom(link) {
    var button = documentModule.createButton(link);

    var domElement = document.querySelectorAll('#rightCol')[0]
        || document.querySelectorAll('#CombinedBuybox')[0]
        || document.querySelectorAll('#imageBlock_feature_div')[0]
        || document.querySelectorAll('#audibleimageblock_feature_div')[0]
        || document.querySelectorAll('#imageBlockNew_feature_div')[0];
    
    documentModule.prepend(domElement, button);
}

