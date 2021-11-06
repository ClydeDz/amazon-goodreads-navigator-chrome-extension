import * as util from "../scripts/document"
import {
    document,
    querySelectorAll
} from "./mocks/documentMock";

describe("util", () => {
    beforeEach(() => {
        util.initializeDocument(document);
    }); 

    test("getElement", () => {
        querySelectorAll.mockReturnValue([""]);
        const x = util.getElement();
        expect(querySelectorAll).toHaveBeenCalled();
    });
});