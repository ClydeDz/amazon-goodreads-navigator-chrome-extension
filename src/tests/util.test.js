import * as utilModule from "../scripts/util";

describe("util → cleanUpIdentifierValue", () => {
    beforeEach(() => {
    }); 

    test.each([
        ["TEST123", "TEST123"],
        ["&lrm;A784521", "A784521"],
        ["9785-4873-4813", "9785-4873-4813"],
    ])("should transform %s to %s", (input, expected) => {
        var identifierValue = utilModule.cleanUpIdentifierValue(input);
        expect(identifierValue).toBe(expected);
    });
});

describe("util → innerTextCheck", () => {
    beforeEach(() => {
    }); 

    test.each([
        ["TEST123", "T12", true],
        [" ASIN:", "ASIN", true],
        [" &lrm; ISBN-10 : ", "ISBN-10", true],
        ["TEST123", "Z78", false],
        [null, "Z78", false],
        [undefined, "Z78", false],
    ])("returns true/false as expected for various scenarios", (contents, key, expected) => {
        var domElement = {
            innerText: contents
        };
        var checkResult = utilModule.innerTextCheck(domElement, key);
        expect(checkResult).toBe(expected);
    });

    test("returns false when inner text doesn't exist on the element", () => {
        var domElement = {
            randomProperty: "contents"
        };
        var checkResult = utilModule.innerTextCheck(domElement, "key");
        expect(checkResult).toBe(false);
    });

    test("returns false when dom element doesn't exist", () => {
        var domElement = undefined;
        var checkResult = utilModule.innerTextCheck(domElement, "key");
        expect(checkResult).toBe(false);
    });
});

describe("util → decideBookIdentifierValue", () => {
    beforeEach(() => {
    }); 

    test.each([        
        ["", "audibleAsin", "", "", "audibleAsin"],
        [undefined, "audibleAsin", undefined, undefined, "audibleAsin"],
        ["asin", undefined, undefined, undefined, "asin"],

        ["", "audibleAsin", "", "is-bn-13", "isbn13"],        
        ["asin", "", "", "is-bn-13", "isbn13"],        
        ["asin", "", undefined, "is-bn-13", "isbn13"],        

        ["", "", "isbn10", "isbn13", "isbn10"],
        [undefined, undefined, "isbn10", "isbn13", "isbn10"],

        ["asin", "audibleAsin", "isbn10", "isbn13", "asin"],        
        ["", "audibleAsin", "isbn10", "isbn13", "audibleAsin"],
        [undefined, "audibleAsin", "isbn10", "isbn13", "audibleAsin"],
        
        [undefined, undefined, undefined, undefined, undefined],
    ])("should decide correct book identifier value to use when multiple passed", (
        asin, audibleAsin, isbn10, isbn13, expected) => {
        var identifierValue = utilModule.decideBookIdentifierValue(asin, audibleAsin, isbn10, isbn13);
        expect(identifierValue).toBe(expected);
    });
});
