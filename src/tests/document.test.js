import * as documentModule from "../scripts/document"
import {
    document,
    getElementById,
    querySelectorAll,
    createElement,
    appendChild,
    prepend
} from "./mocks/documentMock";

describe("document → getElement", () => {
    beforeEach(() => {
        documentModule.initializeDocument(document);
        jest.resetAllMocks();
    }); 

    test("getElement method called", () => {
        documentModule.getElement("#test");
        expect(getElementById).toHaveBeenCalledWith("#test");
    });
});

describe("document → getElements", () => {
    beforeEach(() => {
        documentModule.initializeDocument(document);
        jest.resetAllMocks();
    }); 

    test("getElements method called", () => {
        documentModule.getElements("#test");
        expect(querySelectorAll).toHaveBeenCalledWith("#test");
    });

    test("getElements method returns elements", () => {
        var mockElements = [
            {
                id: "test"
            }, 
            {
                id: "test2"
            }
        ];
        querySelectorAll.mockReturnValue(mockElements);
        var elements = documentModule.getElements("#test");
        expect(querySelectorAll).toHaveBeenCalledWith("#test");
        expect(elements).toEqual(mockElements);
    });

    test("getElements method returns undefined if no elements found", () => {
        var mockElements = [];
        querySelectorAll.mockReturnValue(mockElements);
        var elements = documentModule.getElements("#test");
        expect(querySelectorAll).toHaveBeenCalledWith("#test");
        expect(elements).toBeUndefined();
    });

    test("getElements method returns undefined if nothing is found", () => {
        var mockElements = undefined;
        querySelectorAll.mockReturnValue(mockElements);
        var elements = documentModule.getElements("#test");
        expect(querySelectorAll).toHaveBeenCalledWith("#test");
        expect(elements).toBeUndefined();
    });
});

describe("document → createButton", () => {
    beforeEach(() => {
        documentModule.initializeDocument(document);
        jest.resetAllMocks();
    }); 

    test("createButton method called", () => {
        var mockDivElement = {
            className: "",
            appendChild
        };
        var mockButtonElement = {
            onclick: jest.fn(),
            innerText: "",
            className: ""
        };
        createElement.mockReturnValueOnce(mockDivElement);
        createElement.mockReturnValueOnce(mockButtonElement);

        documentModule.createButton("google.com");
        expect(createElement).toHaveBeenCalled();
        expect(appendChild).toHaveBeenCalled();
    });

    test.each([
        [undefined],
        [""]
    ])("returns when no links is supplied %s", (link) => {
        documentModule.createButton(link);
        expect(createElement).not.toHaveBeenCalled();
        expect(appendChild).not.toHaveBeenCalled();
    });
});

describe("document → prepend", () => {
    beforeEach(() => {
        documentModule.initializeDocument(document);
        jest.resetAllMocks();
    }); 

    test("prepend method called", () => {
        var abc = {
            prepend
        };
        var xyz;
        documentModule.prepend(abc, xyz);
        expect(prepend).toHaveBeenCalled();
    });
});