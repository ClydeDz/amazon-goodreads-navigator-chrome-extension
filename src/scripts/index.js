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


// mobile has a different selectors
function queryAll(key){
    var keyElement;
    var elements = document.querySelectorAll('#detailBullets_feature_div span.a-list-item > span.a-text-bold');
    for(var i = 0; i < elements.length; i++){
        if(elements[i].innerText.indexOf(`${key}`) > -1){
            keyElement = elements[i];
            break;
        }
    }

    if(!keyElement) return;

    return keyElement.nextElementSibling.innerText;
}

function getBookIdentifier(asin, isbn10, isbn13){
    if(asin && !isbn13 && !isbn10){
        return asin;
    }
    if(asin && isbn13 && !isbn10){
        return isbn13.replace(/-/g, '');
    }
    if(!asin && isbn13 && isbn10){
        return isbn10;
    }
    return undefined;
}

function getAudibleBookIdentifier(){
    return document.querySelectorAll('#audibleProductDetails #detailsAsin td span')[0].innerText;
}

function isAudiblePage() {
    var elements = document.querySelectorAll('#audibleProductDetails #detailsAsin');
    if (elements.length > 0) {
        return true;
    }
    return false;
}

/*
width: 100%;
padding: 6px 2px;
*/

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

    var elements = document.querySelectorAll('div#CombinedBuybox')[0];
    var giftButtonElement = document.querySelectorAll('div#giftButtonStack')[0];
    //elements.prepend(div);
    giftButtonElement.prepend(div);
}

console.log("Content js");
console.log(document.URL);
//console.log(getBookIdentifierFromUrl(document.URL));

var asinValue = queryAll('ASIN');
var isbn10Value = queryAll('ISBN-10');
var isbn13Value = queryAll('ISBN-13');
//var audibleAsin = getAudibleBookIdentifier();

console.log("ASIN", asinValue);
console.log("ISBN-10", isbn10Value);
console.log("ISBN-13", isbn13Value);

//console.log("Is audible page", isAudiblePage());

var finalIdentifier = getBookIdentifier(asinValue ? asinValue: audibleAsin, isbn10Value, isbn13Value);

console.log("We are going with", finalIdentifier);
console.log(`https://www.goodreads.com/book/isbn/${finalIdentifier}`);

setTimeout(function(){
    addLink(`https://www.goodreads.com/book/isbn/${finalIdentifier}`);
}, 500);