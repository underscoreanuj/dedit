import Identifier from "../lib/Identifier";

describe("Identifier: compareTo", () => {

    // tests for same identifier
    it("returns 0 if the digit and site are same", () => {
        const siteID1 = 1;
        const siteID2 = 1;
        const id1 = new Identifier(2, siteID1);
        const id2 = new Identifier(2, siteID2);

        expect(id1.compareTo(id2)).toEqual(0);
    });

    // tests for smaller identifier
    it("returns -1 if the digit is SMALLER", () => {
        const siteID1 = 1;
        const siteID2 = 20;
        const id1 = new Identifier(1, siteID1);
        const id2 = new Identifier(2, siteID2);

        expect(id1.compareTo(id2)).toEqual(-1);
    });

    it("returns -1 if the site is SMALLER", () => {
        const siteID1 = 1;
        const siteID2 = 20;
        const id1 = new Identifier(2, siteID1);
        const id2 = new Identifier(2, siteID2);

        expect(id1.compareTo(id2)).toEqual(-1);
    });

    // tests for larger identifier
    it("returns 1 if the digit is LARGER", () => {
        const siteID1 = 1;
        const siteID2 = 20;
        const id1 = new Identifier(2, siteID1);
        const id2 = new Identifier(1, siteID2);

        expect(id1.compareTo(id2)).toEqual(1);
    });

    it("returns 1 if the site is LARGER", () => {
        const siteID1 = 20;
        const siteID2 = 1;
        const id1 = new Identifier(2, siteID1);
        const id2 = new Identifier(2, siteID2);

        expect(id1.compareTo(id2)).toEqual(1);
    });
});

export { };

