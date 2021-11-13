import * as processModule from "../scripts/process";
import * as utilModule from "../scripts/util";
import * as startModule from "../scripts/start";

var getBookIdentifierValueSpy = jest.spyOn(processModule, "getBookIdentifierValue")
    .mockImplementation(jest.fn());
var getAudibleBookIdentifierValueSpy = jest.spyOn(processModule, "getAudibleBookIdentifierValue")
    .mockImplementation(jest.fn());
var addRedirectButtonToDomSpy = jest.spyOn(processModule, "addRedirectButtonToDom")
    .mockImplementation(jest.fn());

var decideBookIdentifierValueSpy = jest.spyOn(utilModule, "decideBookIdentifierValue")
    .mockImplementation(jest.fn());
var cleanUpIdentifierValueSpy = jest.spyOn(utilModule, "cleanUpIdentifierValue")
    .mockImplementation(jest.fn());

describe("start → start", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        startModule.settings.waitTime = 0;
    });

    test("returns when identifier values are all undefined", () => {
        getBookIdentifierValueSpy.mockReturnValue(undefined);
        getAudibleBookIdentifierValueSpy.mockReturnValue(undefined);
        decideBookIdentifierValueSpy.mockReturnValue(undefined);

        startModule.start();

        expect(cleanUpIdentifierValueSpy).not.toHaveBeenCalled();
        expect(addRedirectButtonToDomSpy).not.toHaveBeenCalled();
    });

    test("adds redirect button with book url and supplied identifier value", () => {
        var identifierValue = "A123";
        getBookIdentifierValueSpy.mockReturnValueOnce(identifierValue);
        getAudibleBookIdentifierValueSpy.mockReturnValue(undefined);
        decideBookIdentifierValueSpy.mockReturnValue(identifierValue);
        cleanUpIdentifierValueSpy.mockReturnValue(identifierValue);

        startModule.start();

        expect(getBookIdentifierValueSpy).toHaveBeenCalledTimes(3);
        expect(decideBookIdentifierValueSpy).toHaveBeenCalledWith(identifierValue, undefined, undefined, undefined);
        expect(cleanUpIdentifierValueSpy).toHaveBeenCalledWith(identifierValue);
        expect(addRedirectButtonToDomSpy).toHaveBeenCalledWith(`https://www.goodreads.com/book/isbn/${identifierValue}`);
    });
});