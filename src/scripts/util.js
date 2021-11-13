export function decideBookIdentifierValue(asin, audibleAsin, isbn10, isbn13){
    var calculatedAsin = asin ? asin: audibleAsin;

    if(calculatedAsin && !isbn13 && !isbn10){
        return calculatedAsin;
    }
    else if(calculatedAsin && isbn13 && !isbn10){
        return isbn13.replace(/-/g, '');
    }
    else if(!calculatedAsin && isbn13 && isbn10){
        return isbn10;
    }
    else if(calculatedAsin && isbn13 && isbn10){
        return calculatedAsin;
    }
    return undefined;
}

export function cleanUpIdentifierValue(value) {
    return value.replace(/&lrm;|\u200E/gi, '');
}

export function innerTextCheck (domElement, key) {
    return domElement?.innerText?.indexOf(`${key}`) > -1;
}

