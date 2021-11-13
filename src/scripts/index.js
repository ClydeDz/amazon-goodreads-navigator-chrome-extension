import * as documentModule from "./document";
import * as utilModule from "./util";
import * as processModule from "./process";

export var settings = {
    asinValue: undefined,
    isbn10Value: undefined,
    isbn13Value: undefined,
    audibleAsin: undefined,
    asin: "ASIN",
    isbn10: "ISBN-10",
    isbn13: "ISBN-13",
    waitTime: 500
};

export function start() {
    settings.asinValue = processModule.getBookIdentifierValue(settings.asin);
    settings.isbn10Value = processModule.getBookIdentifierValue(settings.isbn10);
    settings.isbn13Value = processModule.getBookIdentifierValue(settings.isbn13);
    settings.audibleAsin = processModule.getAudibleBookIdentifierValue();

    var identifierValue = utilModule.decideBookIdentifierValue(
        settings.asinValue,
        settings.audibleAsin,
        settings.isbn10Value, 
        settings.isbn13Value);
        
    if(!identifierValue) return;

    identifierValue = utilModule.cleanUpIdentifierValue(identifierValue);

    processModule.addRedirectButtonToDom(`https://www.goodreads.com/book/isbn/${identifierValue}`);
}

var execute = setTimeout(function() {
    try {
        documentModule.initializeDocument(document);
        start();
    } catch(e) {
        console.error(e);
        clearTimeout(execute);
    }
}, settings.waitTime);