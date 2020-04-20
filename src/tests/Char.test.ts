import Char from "../lib/Char";
import Identifier from "../lib/Identifier";

describe("Char: compareTo", () => {
    let char1: Char;
    let id1: Identifier;
    let id2: Identifier;
    let id3: Identifier;

    beforeEach(() => {
        id1 = new Identifier(2, 1);
        id2 = new Identifier(5, 1);
        id3 = new Identifier(1, 2);
        char1 = new Char("a", 0, [id1, id2, id3], 2);
    });

    // tests for equal char1
    it("returns 0 if the positions are exactly same", () => {
        const id21 = new Identifier(2, 1);
        const id22 = new Identifier(5, 1);
        const id23 = new Identifier(1, 2);
        const char2 = new Char("b", 0, [id21, id22, id23], 2);

        expect(char1.compareTo(char2)).toEqual(0);
    });

    // tests for smaller char1
    it("returns -1 if the first position is LOWER than the second position", () => {
        const id21 = new Identifier(2, 1);
        const id22 = new Identifier(5, 1);
        const id23 = new Identifier(3, 2);
        const char2 = new Char("b", 0, [id21, id22, id23], 2);

        expect(char1.compareTo(char2)).toEqual(-1);
    });

    it("returns -1 if the site is LOWER than the second site", () => {
        const id21 = new Identifier(2, 1);
        const id22 = new Identifier(5, 2);
        const id23 = new Identifier(1, 2);
        const char2 = new Char("b", 0, [id21, id22, id23], 2);

        expect(char1.compareTo(char2)).toEqual(-1);
    });

    it("returns -1 if the first position is SMALLER than the second position", () => {
        const id21 = new Identifier(2, 1);
        const id22 = new Identifier(5, 1);
        const id23 = new Identifier(1, 2);
        const id24 = new Identifier(8, 2);
        const char2 = new Char("b", 0, [id21, id22, id23, id24], 2);

        expect(char1.compareTo(char2)).toEqual(-1);
    });

    // tests for larger char1
    it("returns 1 if the first position is HIGHER than the second position", () => {
        const id21 = new Identifier(2, 1);
        const id22 = new Identifier(3, 1);
        const id23 = new Identifier(1, 2);
        const char2 = new Char("b", 0, [id21, id22, id23], 2);

        expect(char1.compareTo(char2)).toEqual(1);
    });

    it("returns 1 if the site is HIGHER than the second site", () => {
        const id21 = new Identifier(2, 1);
        const id22 = new Identifier(5, 1);
        const id23 = new Identifier(1, 1);
        const char2 = new Char("b", 0, [id21, id22, id23], 2);

        expect(char1.compareTo(char2)).toEqual(1);
    });

    it("returns 1 if the first position is LARGER than the second position", () => {
        const id21 = new Identifier(2, 1);
        const id22 = new Identifier(5, 1);
        const char2 = new Char("b", 0, [id21, id22], 2);

        expect(char1.compareTo(char2)).toEqual(1);
    });
});

export { };

