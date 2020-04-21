import Char from "../lib/Char";
import CRDT from "../lib/CRDT";
import Identifier from "../lib/Identifier";

describe("CRDT", () => {
    const siteID = Math.floor(Math.random() * 1000);

    describe("localInsert:", () => {
        let crdt_obj: CRDT;
        let insert_txt = "abcdefghijklmnopqrstuvwxyz";
        let random_txt = "abcdefghij";

        beforeEach(() => {
            crdt_obj = new CRDT(siteID);
        });

        it("checks that insertion at front works", () => {
            for (let i = 0; i < insert_txt.length; ++i) {
                crdt_obj.localInsert(insert_txt[insert_txt.length - i - 1], 0);
            }

            expect(crdt_obj.toText()).toBe(insert_txt);
        });

        it("checks that insertion at back works", () => {
            for (let i = 0; i < insert_txt.length; ++i) {
                crdt_obj.localInsert(insert_txt[i], i);
            }

            expect(crdt_obj.toText()).toBe(insert_txt);
        });

        it("checks that insertion at random positions works", () => {
            crdt_obj.localInsert("b", 0);
            crdt_obj.localInsert("a", 0);
            crdt_obj.localInsert("j", 2);
            crdt_obj.localInsert("e", 2);
            crdt_obj.localInsert("i", 3);
            crdt_obj.localInsert("c", 2);
            crdt_obj.localInsert("d", 3);
            crdt_obj.localInsert("g", 5);
            crdt_obj.localInsert("h", 6);
            crdt_obj.localInsert("f", 5);

            expect(crdt_obj.toText()).toBe(random_txt);
        });
    });

    describe("localDelete:", () => {
        let crdt_obj: CRDT;

        beforeEach(() => {
            crdt_obj = new CRDT(siteID);
        });

        it("checks that deleteing empty crdt object returns undefined", () => {
            expect(crdt_obj.localDelete(0)).toBe(undefined);
        });

        it("checks that inserting and deleteing returns valid values", () => {
            crdt_obj.localInsert("a", 0);
            expect(crdt_obj.localDelete(0)?.value).toBe("a");
            expect(crdt_obj.text.length).toBe(0);

            crdt_obj.localInsert("a", 0);
            crdt_obj.localInsert("b", 0);
            expect(crdt_obj.localDelete(0)?.value).toBe("b");
            expect(crdt_obj.text.length).toBe(1);

            crdt_obj.localInsert("b", 0);
            expect(crdt_obj.localDelete(1)?.value).toBe("a");
            expect(crdt_obj.text.length).toBe(1);
        });
    });

    describe("remoteInsert", () => {
        let crdt_obj: CRDT;
        let char_obj: Char;

        beforeEach(() => {
            crdt_obj = new CRDT(siteID);
            const pos = [new Identifier(1, siteID)];
            char_obj = new Char("A", 0, pos, siteID);
        });

        it("adding a char remotely increments the size of text", () => {
            expect(crdt_obj.text.length).toBe(0);
            crdt_obj.remoteInsert(char_obj);
            expect(crdt_obj.text.length).toBe(1);
        });

        it("adding a char remotely adds it to the local instance", () => {
            expect(crdt_obj.text.length).toBe(0);
            crdt_obj.remoteInsert(char_obj);
            expect(crdt_obj.toText()).toBe('A');
        });

        it("adding chars according to their respective positions", () => {
            const other_char_obj = new Char("B", 0, [new Identifier(0, 0), new Identifier(5, 0)], siteID);

            crdt_obj.remoteInsert(char_obj);
            crdt_obj.remoteInsert(other_char_obj);
            expect(crdt_obj.text).toEqual([other_char_obj, char_obj]);
            expect(crdt_obj.toText()).toBe("BA");
        });
    });

    describe("remoteDelete:", () => {
        let crdt_obj: CRDT;
        let char_obj: Char;

        beforeEach(() => {
            crdt_obj = new CRDT(siteID);
            const pos = [new Identifier(1, siteID)];
            char_obj = new Char("A", 0, pos, siteID);
            crdt_obj.remoteInsert(char_obj);
        });

        it("removing a char remotely reduces the length", () => {
            expect(crdt_obj.text.length).toBe(1);
            crdt_obj.remoteDelete(char_obj);
            expect(crdt_obj.text.length).toBe(0);
        });

        it("removing a char remotely changes the text", () => {
            expect(crdt_obj.toText()).toBe('A');
            crdt_obj.remoteDelete(char_obj);
            expect(crdt_obj.toText()).toBe('');
        });
    });

});

export { };

