function getBookIdentifierFromUrl(url){
    const regex = /(dp\/(\w*\d*)*)/g;
    return url.match(regex)[0];
}

var asin = [];

function extractByTerm(searchTerm, rootElement = document) {
    searchTerm = searchTerm.toUpperCase();
    let aTags = rootElement.getElementsByTagName("li");
    let text;
    for (let i = 0; i < aTags.length; i++) {
        if (aTags[i].textContent.toUpperCase().replace(' ', '').replace(/(\r\n|\n|\r)/gm, '').indexOf(searchTerm) > -1) {
            text = aTags[i].textContent.toUpperCase().replace(/(\r\n|\n|\r)/gm, '').replace(searchTerm, '').trim();
            break;
        }
    }
    return text;
}

function findAsinOrIsbnText() {
    let found;
    let details = document.getElementById("detailBullets_feature_div");
    if (details) found = extractByTerm("asin&rlm;:&lrm;:", details);
    if (!found) {
        found = extractByTerm("isbn-10 : ");
        if (!found) found = extractByTerm("isbn-13 : ");
        if (!found) found = extractByTerm("asin : ");
    }
    return found;
}


function wrapperA(){
    let asinText = findAsinOrIsbnText();
    if (asin !== undefined) {
        asin.push(asinText);
    }
}


function decideBookIdentifierValue(asin, isbn10, isbn13){
    if(asin && !isbn13 && !isbn10){
        return asin;
    }
    else if(asin && isbn13 && !isbn10){
        return isbn13.replace(/-/g, '');
    }
    else if(!asin && isbn13 && isbn10){
        return isbn10;
    }
    else if(asin && isbn13 && isbn10){
        return asin;
    }
    return undefined;
}

function getAudibleBookIdentifierValue(){
    var elements = document.querySelectorAll('#audibleproductdetails_feature_div tr#detailsAsin > td > span');
    if(!elements || elements.length == 0) {
        elements = document.querySelectorAll('#audibleProductDetails #detailsAsin > td > span');
    }
    return elements[0]?.innerText;
}

function isAudiblePage() {
    var elements = document.querySelectorAll('#audibleProductDetails #detailsAsin');
    if (elements.length > 0) {
        return true;
    }
    return false;
}


function addButtonToDom(link) {
    let div = document.createElement("div");
    div.className = "amazon-goodreads-ext-container";
    
    let button = document.createElement("button");
    button.onclick = function() {
        window.open(link, "_blank");
    };
    button.innerText= "View on Goodreads";
    button.className = "amazon-goodreads-ext-button amazon-goodreads-ext-mobile";   
    div.appendChild(button);

    var elements = document.querySelectorAll('#rightCol')[0]
        || document.querySelectorAll('#CombinedBuybox')[0]
        || document.querySelectorAll('#imageBlock_feature_div')[0]
        || document.querySelectorAll('#audibleimageblock_feature_div')[0]
        || document.querySelectorAll('#imageBlockNew_feature_div')[0];

    //var giftButtonElement = document.querySelectorAll('div#giftButtonStack')[0];
    elements.prepend(div);
    //giftButtonElement.prepend(div);
}

function isDesktop() {
    var bookDetailsBox = document.getElementById("detailBullets_feature_div")
        || document.getElementById("audibleproductdetails_feature_div");
    return bookDetailsBox ? true: false;
}

/*

Desktop
--------                     
Paperback   Details: #detailBullets_feature_div .a-list-item .a-text-bold                          
            Destination:  #averageCustomerReviews_feature_div
            or #rightCol and leftCol

Audiobook   Details: #audibleproductdetails_feature_div #detailsAsin th.a-color-secondary span (number in adj td)
            Destination: #averageCustomerReviews_feature_div
            or #rightCol

Hardcover   Details: #detailBullets_feature_div a-list-item .a-text-bold   
            Destination: #averageCustomerReviews_feature_div
            or #rightCol and leftCol

Kindle      Details: #detailBullets_feature_div .a-list-item .a-text-bold
            Destination: #reviewFeatureGroup
            or #rightCol

Mobile
------
Paperback   Details: #featureBulletsAndDetailBullets_feature_div #productDetails_secondary_view_div th.a-span3.prodDetSectionEntry (number in td)
            Destination: #image-block or #imageBlock_feature_div

Audiobook   Details:#audibleProductDetails #detailsAsin td OR get from url since product details needs a click 
            Destination: #imageBlockCommonMobile_feature_div or #audibleimageblock_feature_div

Hardcover   Details: #featureBulletsAndDetailBullets_feature_div th.prodDetSectionEntry (number in td)
            Destination: #imageBlock_feature_div

Kindle      Details: #featureBulletsAndDetailBullets_feature_div .a-list-item .a-text-bold   
            Destination: #imageBlockNew_feature_div

*/


function isMobile() {
    var bookDetailsBox = document.getElementById("featureBulletsAndDetailBullets_feature_div")
        || document.getElementById("audibleProductDetails");
    return bookDetailsBox ? true: false;
}

function getDesktopBookIdentifierValue(key) {
    var domElements = document.querySelectorAll('#detailBullets_feature_div span.a-list-item > span.a-text-bold');
    if(!domElements || domElements.length == 0){
        domElements = document.querySelectorAll('#featureBulletsAndDetailBullets_feature_div th.prodDetSectionEntry');   
    }
    return getIdentifierValue(key, domElements);
}

function innerTextCheck (domElement, key) {
    return domElement?.innerText.indexOf(`${key}`) > -1;
}

function getIdentifierValue(key, domElements) {
    if(!domElements) return;

    var keyElement;   

    for(var i = 0; i < domElements.length; i++){
        if (innerTextCheck(domElements[i], key)) {
            keyElement = domElements[i];
            break;
        }
    }

    if(!keyElement) return;

    return keyElement?.nextElementSibling?.innerText;
}

function getMobileBookIdentifierValue(key) {
    var domElements = document.querySelectorAll('#featureBulletsAndDetailBullets_feature_div span.a-list-item > span.a-text-bold');
    if (!domElements || domElements.length == 0)   {
        domElements = document.querySelectorAll('#featureBulletsAndDetailBullets_feature_div th.prodDetSectionEntry');
    }

    return getIdentifierValue(key, domElements);
}

function cleanUpIdentifierValue(value) {
    return value.replace(/&lrm;|\u200E/gi, '');
}

function start() {
    // check if mobile or desktop

    var asinValue;
    var isbn10Value;
    var isbn13Value;
    var audibleAsin;

    if (isDesktop()) {
        asinValue = getDesktopBookIdentifierValue('ASIN');
        isbn10Value = getDesktopBookIdentifierValue('ISBN-10');
        isbn13Value = getDesktopBookIdentifierValue('ISBN-13');
        audibleAsin = getAudibleBookIdentifierValue();
    }
    else if (isMobile()) {
        asinValue = getMobileBookIdentifierValue('ASIN');
        isbn10Value = getMobileBookIdentifierValue('ISBN-10');
        isbn13Value = getMobileBookIdentifierValue('ISBN-13');
        audibleAsin = getAudibleBookIdentifierValue();
    }
    else {
        // Do nothing
    }

    console.log(
        "asinValue", asinValue, 
        "isbn10Value", isbn10Value, 
        "isbn13Value", isbn13Value,
        "audibleAsin", audibleAsin);
    var identifierValue = decideBookIdentifierValue(asinValue ? asinValue: audibleAsin, isbn10Value, isbn13Value);

    if(!identifierValue) return;

    identifierValue = cleanUpIdentifierValue(identifierValue);

    console.log("************", `https://www.goodreads.com/book/isbn/${identifierValue}`);
    addButtonToDom(`https://www.goodreads.com/book/isbn/${identifierValue}`);
}

setTimeout(start(), 500);