import * as processModule from "../scripts/process";
import * as documentModule from "../scripts/document";
import * as utilModule from "../scripts/util";

var getElementsSpy = jest.spyOn(documentModule, "getElements")
    .mockImplementation(jest.fn());
var getElementSpy = jest.spyOn(documentModule, "getElement")
    .mockImplementation(jest.fn());

var innerTextCheckSpy = jest.spyOn(utilModule, "innerTextCheck")
    .mockImplementation(jest.fn());

var desktopSelectors = [
    "#detailBullets_feature_div span.a-list-item > span.a-text-bold",
    "#featureBulletsAndDetailBullets_feature_div th.prodDetSectionEntry"
];
var mobileSelectors = [
    "#featureBulletsAndDetailBullets_feature_div span.a-list-item > span.a-text-bold",
    "#featureBulletsAndDetailBullets_feature_div th.prodDetSectionEntry"
];
var desktopMockElement = [{
    example: "",
}];

describe("process → getBookIdentifierValue", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    
    test.each([
        [desktopMockElement, desktopSelectors[0], desktopSelectors[1]],
        [undefined, mobileSelectors[0], mobileSelectors[1]],
    ])("returns undefined in different scenarios %s", (mockElement, firstPathSelector, secondPathSelector) => {
        getElementSpy.mockReturnValueOnce(mockElement);

        var value = processModule.getBookIdentifierValue("key");
        
        expect(getElementsSpy).toHaveBeenCalledWith(firstPathSelector);
        expect(getElementsSpy).toHaveBeenCalledWith(secondPathSelector);
        expect(value).toBeUndefined();
    });

    test.each([
        [desktopMockElement, desktopSelectors[0]],
        [undefined, mobileSelectors[0]],
    ])("first path returns element and returns expected inner text %s", (mockElement, firstPathSelector) => {
        getElementSpy.mockReturnValueOnce(mockElement);

        var mockElements = [{
            innerText: "a test key",
            nextElementSibling: {
                innerText: "a test value"
            }
        }];
        getElementsSpy.mockReturnValueOnce(mockElements);
        getElementsSpy.mockReturnValueOnce(undefined);
        innerTextCheckSpy.mockReturnValue(true);

        var value = processModule.getBookIdentifierValue("key");

        expect(getElementsSpy).toHaveBeenCalledWith(firstPathSelector);
        expect(getElementsSpy).not.toHaveBeenCalledWith();
        expect(innerTextCheckSpy).toHaveBeenCalledWith(mockElements[0], "key");
        expect(value).toBe("a test value");
    });

    test.each([
        [desktopMockElement, desktopSelectors[0], desktopSelectors[1]],
        [undefined, mobileSelectors[0], mobileSelectors[1]],
    ])("second path returns element and returns expected inner text %s", (mockElement, firstPathSelector, secondPathSelector) => {
        getElementSpy.mockReturnValueOnce(mockElement);

        var mockElements = [{
            innerText: "a test key",
            nextElementSibling: {
                innerText: "b test value"
            }
        }];
        getElementsSpy.mockReturnValueOnce(undefined);
        getElementsSpy.mockReturnValueOnce(mockElements);
        innerTextCheckSpy.mockReturnValueOnce(true);

        var value = processModule.getBookIdentifierValue("key");

        expect(getElementsSpy).toHaveBeenCalledWith(firstPathSelector);
        expect(getElementsSpy).toHaveBeenCalledWith(secondPathSelector);        
        expect(innerTextCheckSpy).toHaveBeenCalledWith(mockElements[0], "key");
        expect(value).toBe("b test value");
    });

    test.each([
        [desktopMockElement, desktopSelectors[0]],
        [undefined, mobileSelectors[0]],
    ])("both path returns elements but returns expected inner text from first path %s", (mockElement, firstPathSelector) => {
        getElementSpy.mockReturnValueOnce(mockElement);

        var mockElements = [{
            innerText: "a test key",
            nextElementSibling: {
                innerText: "a test value"
            }
        }];
        var alternativeMockElements = [{
            innerText: "a test key",
            nextElementSibling: {
                innerText: "b test value"
            }
        }];
        getElementsSpy.mockReturnValueOnce(mockElements);
        getElementsSpy.mockReturnValueOnce(alternativeMockElements);
        innerTextCheckSpy.mockReturnValue(true);

        var value = processModule.getBookIdentifierValue("key");

        expect(getElementsSpy).toHaveBeenCalledWith(firstPathSelector);
        expect(getElementsSpy).not.toHaveBeenCalledWith();
        expect(innerTextCheckSpy).toHaveBeenCalledWith(mockElements[0], "key");
        expect(value).toBe("a test value");
    });

    test.each([
        [desktopMockElement],
        [undefined],
    ])("no element is passed to getIdentifierValue which then returns undefined %s", (mockElement) => {
        getElementSpy.mockReturnValueOnce(mockElement);
        getElementsSpy.mockReturnValue(undefined);

        var value = processModule.getBookIdentifierValue("key");
        expect(innerTextCheckSpy).not.toHaveBeenCalled();
        expect(value).toBeUndefined();
    });

    test.each([
        [desktopMockElement],
        [undefined],
    ])("key doesn't match any dom elements' inner text so returns undefined %s", (mockElement) => {
        getElementSpy.mockReturnValueOnce(mockElement);
        var mockElements = [{
            innerText: "a test key",
            nextElementSibling: {
                innerText: "a test value"
            }
        }];
        getElementsSpy.mockReturnValueOnce(mockElements);
        getElementsSpy.mockReturnValueOnce([]);
        innerTextCheckSpy.mockReturnValue(false);

        var value = processModule.getBookIdentifierValue("sun");

        expect(innerTextCheckSpy).toHaveBeenCalledWith(mockElements[0], "sun");
        expect(value).toBeUndefined();
    });

    test.each([
        [desktopMockElement, desktopSelectors[0]],
        [undefined, mobileSelectors[0]],
    ])("when no next sibling element exists, return undefined %s", (mockElement) => {
        getElementSpy.mockReturnValueOnce(mockElement);
        var mockElements = [{
            innerText: "a test key"
        }];
        getElementsSpy.mockReturnValueOnce(mockElements);
        getElementsSpy.mockReturnValueOnce([]);
        innerTextCheckSpy.mockReturnValue(true);

        var value = processModule.getBookIdentifierValue("key");

        expect(innerTextCheckSpy).toHaveBeenCalledWith(mockElements[0], "key");
        expect(value).toBeUndefined();
    });

    test.each([
        [desktopMockElement, desktopSelectors[0]],
        [undefined, mobileSelectors[0]],
    ])("first path returns multiple elements, search happens based on key and expected value is returned %s", (mockElement, firstPathSelector) => {
        getElementSpy.mockReturnValueOnce(mockElement);
        var mockElements = [{
            innerText: "some random text",
            nextElementSibling: {
                innerText: "random value"
            }
        }, {
            innerText: "a test key",
            nextElementSibling: {
                innerText: "a test value"
            }
        }];
        getElementsSpy.mockReturnValueOnce(mockElements);
        getElementsSpy.mockReturnValueOnce([]);
        innerTextCheckSpy.mockReturnValueOnce(false);
        innerTextCheckSpy.mockReturnValueOnce(true);

        var value = processModule.getBookIdentifierValue("key");

        expect(getElementsSpy).toHaveBeenCalledWith(firstPathSelector);
        expect(getElementsSpy).not.toHaveBeenCalledWith();
        expect(innerTextCheckSpy).toHaveBeenCalledWith(mockElements[0], "key");
        expect(innerTextCheckSpy).toHaveBeenCalledWith(mockElements[1], "key");
        expect(value).toBe("a test value");
    });
});
