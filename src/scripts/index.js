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
            console.log("Found text: " + aTags[i].textContent);
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

    console.log("found: " + found);
    return found;
}


function wrapperA(){
    let asinText = findAsinOrIsbnText();
    if (asin !== undefined) {
        asin.push(asinText);
        console.log("Method 1 asin found: " + asin);
    }
}


function getBookIdentifier(asin, isbn10, isbn13){
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

function getAudibleBookIdentifier(){
    console.log("getAudibleBookIdentifier");
    var elements = document.querySelectorAll('#audibleproductdetails_feature_div tr#detailsAsin > td > span');
    return elements[0]?.innerText;
}

function getMobileAudibleBookIdentifier(){
    console.log("getMobileAudibleBookIdentifier");
    var elements = document.querySelectorAll('#audibleProductDetails #detailsAsin > td > span');
    return elements[0]?.innerText;
}

function isAudiblePage() {
    var elements = document.querySelectorAll('#audibleProductDetails #detailsAsin');
    if (elements.length > 0) {
        return true;
    }
    return false;
}


function addLink(link) {
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
    let bookDetailsBox = document.getElementById("detailBullets_feature_div");
    if (bookDetailsBox) {
        return true;
    }    
    
    let audibleBookDetailsBox = document.getElementById("audibleproductdetails_feature_div");
    if (audibleBookDetailsBox) {
        return true;
    }

    return false;
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
    let bookDetailsBox = document.getElementById("featureBulletsAndDetailBullets_feature_div");
    if (bookDetailsBox) {
        return true;
    }    
    
    let audibleBookDetailsBox = document.getElementById("audibleProductDetails");
    if (audibleBookDetailsBox) {
        return true;
    }
    
    return false;
}


// mobile has a different selectors
function queryAllDesktop(key){
    console.log("queryAllDesktop", key);
    var keyElement;
    //#audibleproductdetails_feature_div #detailsAsin th.a-color-secondary span
    var elements = document.querySelectorAll('#detailBullets_feature_div span.a-list-item > span.a-text-bold');

    for(var i = 0; i < elements.length; i++){
        if(elements[i]?.innerText.indexOf(`${key}`) > -1){
            keyElement = elements[i];
            break;
        }
    }

    if(!keyElement) return;

    return keyElement?.nextElementSibling?.innerText;
}

function queryAllMobile(key){
    console.log("queryAllMobile", key);
    var keyElement;
    
    // #featureBulletsAndDetailBullets_feature_div #productDetails_secondary_view_div th.a-span3.prodDetSectionEntry (number in td)
    // #audibleProductDetails #detailsAsin td OR get from url since product details needs a click 
    // #featureBulletsAndDetailBullets_feature_div th.prodDetSectionEntry (number in td)
    // #featureBulletsAndDetailBullets_feature_div .a-list-item .a-text-bold 
    
    var elements = document.querySelectorAll('#featureBulletsAndDetailBullets_feature_div span.a-list-item > span.a-text-bold');
    for(var i = 0; i < elements.length; i++){
        if(elements[i]?.innerText.indexOf(`${key}`) > -1){
            keyElement = elements[i];
            break;
        }
    }

    var value = keyElement?.nextElementSibling?.innerText;

    if(!value) {
        ///value = document.querySelectorAll('#featureBulletsAndDetailBullets_feature_div th.prodDetSectionEntry')[0]?.nextElementSibling?.innerText;

        elements = document.querySelectorAll('#featureBulletsAndDetailBullets_feature_div th.prodDetSectionEntry');
        for(var i = 0; i < elements.length; i++){
            if(elements[i]?.innerText.indexOf(`${key}`) > -1) {
                keyElement = elements[i];
                break;
            }
        }   

        value = keyElement?.nextElementSibling?.innerText;
    }

    if(!value) return;

    return value;
}


function start() {
    // check if mobile or desktop

    var asinValue;
    var isbn10Value;
    var isbn13Value;
    var audibleAsin;

    if (isDesktop()) {
        asinValue = queryAllDesktop('ASIN');
        isbn10Value = queryAllDesktop('ISBN-10');
        isbn13Value = queryAllDesktop('ISBN-13');
        audibleAsin = getAudibleBookIdentifier();
    }
    else if (isMobile()) {
        asinValue = queryAllMobile('ASIN');
        isbn10Value = queryAllMobile('ISBN-10');
        isbn13Value = queryAllMobile('ISBN-13');
        audibleAsin = getMobileAudibleBookIdentifier();

    }
    else {
        // Do nothing
    }

    console.log(
        "asinValue", asinValue, 
        "isbn10Value", isbn10Value, 
        "isbn13Value", isbn13Value,
        "audibleAsin", audibleAsin);
    var finalIdentifier = getBookIdentifier(asinValue ? asinValue: audibleAsin, isbn10Value, isbn13Value);

    if(!finalIdentifier) return;

    console.log("************", `https://www.goodreads.com/book/isbn/${(finalIdentifier).replace(/&lrm;|\u200E/gi, '')}`);
    addLink(`https://www.goodreads.com/book/isbn/${(finalIdentifier).replace(/&lrm;|\u200E/gi, '')}`);
}

setTimeout(start(), 500);