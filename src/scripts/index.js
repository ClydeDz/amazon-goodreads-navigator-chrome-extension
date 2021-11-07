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
    if (processModule.isDesktop()) {
        settings.asinValue = processModule.getDesktopBookIdentifierValue('ASIN');
        settings.isbn10Value = processModule.getDesktopBookIdentifierValue('ISBN-10');
        settings.isbn13Value = processModule.getDesktopBookIdentifierValue('ISBN-13');
        settings.audibleAsin = processModule.getAudibleBookIdentifierValue();
    }
    else if (processModule.isMobile()) {
        settings.asinValue = processModule.getMobileBookIdentifierValue('ASIN');
        settings.isbn10Value = processModule.getMobileBookIdentifierValue('ISBN-10');
        settings.isbn13Value = processModule.getMobileBookIdentifierValue('ISBN-13');
        settings.audibleAsin = processModule.getAudibleBookIdentifierValue();
    }
    else {
        // Do nothing
    }

    console.log(
        "asinValue", settings.asinValue, 
        "isbn10Value", settings.isbn10Value, 
        "isbn13Value", settings.isbn13Value,
        "audibleAsin", settings.audibleAsin
    );

    var identifierValue = utilModule.decideBookIdentifierValue(
        settings.asinValue,
        settings.audibleAsin,
        settings.isbn10Value, 
        settings.isbn13Value);

    if(!identifierValue) return;

    identifierValue = utilModule.cleanUpIdentifierValue(identifierValue);

    console.log("************", `https://www.goodreads.com/book/isbn/${identifierValue}`);
    processModule.addButtonToDom(`https://www.goodreads.com/book/isbn/${identifierValue}`);
}

setTimeout(function() {
    documentModule.initializeDocument(document);
    start();
}, settings.waitTime);