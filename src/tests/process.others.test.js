import * as processModule from "../scripts/process";
import * as documentModule from "../scripts/document";

var getElementsSpy = jest.spyOn(documentModule, "getElements")
    .mockImplementation(jest.fn());
var createButtonSpy = jest.spyOn(documentModule, "createButton")
    .mockImplementation(jest.fn());
var prependSpy = jest.spyOn(documentModule, "prepend")
    .mockImplementation(jest.fn());

describe("process → getAudibleBookIdentifierValue", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    
    test.each([
        [[]],
        [undefined],
        [{
            random: "test"
        }]
    ])("returns undefined when no elements or property found %s", (value) => {
        getElementsSpy.mockReturnValue(value);        
        var value = processModule.getAudibleBookIdentifierValue("key");
        expect(value).toBeUndefined();
    });

    test("returns expected value from first path element", () => {
        var mockElement = [{
            innerText: "test"
        }];
        getElementsSpy.mockReturnValueOnce(mockElement);        
        var value = processModule.getAudibleBookIdentifierValue("key");
        expect(value).toBe("test");
    });

    test("returns expected value from second path element", () => {
        var mockElement = [{
            innerText: "test"
        }];
        getElementsSpy.mockReturnValueOnce(undefined);
        getElementsSpy.mockReturnValueOnce(mockElement);
        var value = processModule.getAudibleBookIdentifierValue("key");
        expect(getElementsSpy).toHaveBeenCalledTimes(2);
        expect(value).toBe("test");
    });
});

describe("process → addRedirectButtonToDom", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    
    test.each([
        [[{"foo":"div"}]],
        [[{"foo":"div"}, {"foo":"span"}]]
    ])("calls prepend with correct parameters %s", (mockDomElement) => {
        var mockButtonElement = [{"foo":"button"}];

        createButtonSpy.mockReturnValue(mockButtonElement);
        getElementsSpy.mockReturnValueOnce(mockDomElement);

        processModule.addRedirectButtonToDom("www.google.com");

        expect(getElementsSpy).toHaveBeenCalledWith("#rightCol");
        expect(prependSpy).toHaveBeenCalledWith(mockDomElement[0], mockButtonElement);
    });

    test("returns when dom elements doesn't exist", () => {
        var mockButtonElement = [{"foo":"button"}];

        createButtonSpy.mockReturnValue(mockButtonElement);
        getElementsSpy.mockReturnValueOnce(undefined);

        processModule.addRedirectButtonToDom("www.google.com");

        expect(getElementsSpy).toHaveBeenCalledTimes(5);
        expect(prependSpy).not.toHaveBeenCalled();
    });

    test("returns when button element doesn't exist", () => {
        var mockDomElement = [{"foo":"dom"}];

        createButtonSpy.mockReturnValue(undefined);
        getElementsSpy.mockReturnValueOnce(mockDomElement);

        processModule.addRedirectButtonToDom("www.google.com");

        expect(getElementsSpy).not.toHaveBeenCalled();
        expect(prependSpy).not.toHaveBeenCalled();
    });

    test("calls prepend when first two paths don't return an element but third does", () => {
        var mockButtonElement = [{"foo":"button"}];
        var mockDomElement = [{"foo":"dom"}];

        createButtonSpy.mockReturnValue(mockButtonElement);
        getElementsSpy.mockReturnValueOnce(undefined);
        getElementsSpy.mockReturnValueOnce(undefined);
        getElementsSpy.mockReturnValueOnce(mockDomElement);

        processModule.addRedirectButtonToDom("www.google.com");

        expect(getElementsSpy).toHaveBeenCalledTimes(3);
        expect(getElementsSpy).toHaveBeenCalledWith("#rightCol");
        expect(getElementsSpy).toHaveBeenCalledWith("#CombinedBuybox");
        expect(getElementsSpy).toHaveBeenCalledWith("#imageBlock_feature_div");
        expect(prependSpy).toHaveBeenCalledWith(mockDomElement[0], mockButtonElement);
    });

    test("calls prepend when only last path returns an element", () => {
        var mockButtonElement = [{"foo":"button"}];
        var mockDomElement = [{"foo":"dom"}];

        createButtonSpy.mockReturnValue(mockButtonElement);
        getElementsSpy.mockReturnValueOnce(undefined);
        getElementsSpy.mockReturnValueOnce(undefined);
        getElementsSpy.mockReturnValueOnce(undefined);
        getElementsSpy.mockReturnValueOnce(undefined);
        getElementsSpy.mockReturnValueOnce(mockDomElement);

        processModule.addRedirectButtonToDom("www.google.com");

        expect(getElementsSpy).toHaveBeenCalledTimes(5);
        expect(getElementsSpy).toHaveBeenCalledWith("#rightCol");
        expect(getElementsSpy).toHaveBeenCalledWith("#CombinedBuybox");
        expect(getElementsSpy).toHaveBeenCalledWith("#imageBlock_feature_div");
        expect(getElementsSpy).toHaveBeenCalledWith("#audibleimageblock_feature_div");
        expect(getElementsSpy).toHaveBeenCalledWith("#imageBlockNew_feature_div");
        expect(prependSpy).toHaveBeenCalledWith(mockDomElement[0], mockButtonElement);
    });
});
