export const getElementById = jest.fn();
export const getElements = jest.fn();
export const querySelectorAll = jest.fn();
export const createElement = jest.fn();
export const appendChild = jest.fn();
export const prepend = jest.fn();

export const document = {
    getElementById,
    getElements,
    querySelectorAll,
    createElement,
    appendChild,
    prepend
};
