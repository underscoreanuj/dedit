import CRDT from "../lib/CRDT";

describe("CRDT", () => {
    describe("localInsert:", () => {
        let insert_txt = "abcdefghijklmnopqrstuvwxyz";
        let random_txt = "abcdefghij";

        it("checks that insertion at front works", () => {
            const crdt_obj = new CRDT(1);

            for (let i = 0; i < insert_txt.length; ++i) {
                crdt_obj.localInsert(insert_txt[insert_txt.length - i - 1], 0);
            }

            expect(crdt_obj.toText()).toEqual(insert_txt);
        });

        it("checks that insertion at back works", () => {
            const crdt_obj = new CRDT(1);

            for (let i = 0; i < insert_txt.length; ++i) {
                crdt_obj.localInsert(insert_txt[i], i);
            }

            expect(crdt_obj.toText()).toEqual(insert_txt);
        });

        it("checks that insertion at random positions works", () => {
            const crdt_obj = new CRDT(1);

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

            for (let c of crdt_obj.text) {
                console.log(c);
            }

            expect(crdt_obj.toText()).toEqual(random_txt);
        });
    });

    describe("localDelete:", () => {
        it("checks that deleteing empty crdt object returns undefined", () => {
            let crdt_obj = new CRDT(1);

            expect(crdt_obj.localDelete(0)).toBe(undefined);
        });

        it("checks that inserting and deleteing returns valid values", () => {
            let crdt_obj = new CRDT(1);

            crdt_obj.localInsert("a", 0);
            expect(crdt_obj.localDelete(0)?.value).toEqual("a");
            expect(crdt_obj.text.length).toEqual(0);

            crdt_obj.localInsert("a", 0);
            crdt_obj.localInsert("b", 0);
            expect(crdt_obj.localDelete(0)?.value).toEqual("b");
            expect(crdt_obj.text.length).toEqual(1);

            crdt_obj.localInsert("b", 0);
            expect(crdt_obj.localDelete(1)?.value).toEqual("a");
            expect(crdt_obj.text.length).toEqual(1);
        });
    });
});

export { };

