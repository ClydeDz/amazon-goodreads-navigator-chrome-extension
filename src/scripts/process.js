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

function getDesktopBookIdentifierValue(key) {
    var domElements = documentModule.getElements('#detailBullets_feature_div span.a-list-item > span.a-text-bold')
        || documentModule.getElements('#featureBulletsAndDetailBullets_feature_div th.prodDetSectionEntry');   
    return getIdentifierValue(key, domElements);
}

function getMobileBookIdentifierValue(key) {
    var domElements = documentModule.getElements('#featureBulletsAndDetailBullets_feature_div span.a-list-item > span.a-text-bold')
        || documentModule.getElements('#featureBulletsAndDetailBullets_feature_div th.prodDetSectionEntry');
    return getIdentifierValue(key, domElements);
}

function isDesktop() {
    var bookDetailsBox = documentModule.getElement("detailBullets_feature_div")
        || documentModule.getElement("audibleproductdetails_feature_div");
    return bookDetailsBox ? true: false;
}

export function getBookIdentifierValue(key) {
    return isDesktop() ? getDesktopBookIdentifierValue(key) : getMobileBookIdentifierValue(key);
}

export function getAudibleBookIdentifierValue(){
    var elements = documentModule.getElements('#audibleproductdetails_feature_div tr#detailsAsin > td > span')
        || documentModule.getElements('#audibleProductDetails #detailsAsin > td > span');
    if(!elements) return;
    return elements[0]?.innerText;
}

export function addRedirectButtonToDom(link) {
    var button = documentModule.createButton(link);

    if(!button) return;

    var domElement = documentModule.getElements('#rightCol')
        || documentModule.getElements('#CombinedBuybox')
        || documentModule.getElements('#imageBlock_feature_div')
        || documentModule.getElements('#audibleimageblock_feature_div')
        || documentModule.getElements('#imageBlockNew_feature_div');
    
    if(!domElement) return;

    documentModule.prepend(domElement[0], button);
}
