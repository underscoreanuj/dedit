import Identifier from "./Identifier";

class Char {
    value: string;
    counter: number;
    position: Array<Identifier>;
    siteID: number;

    constructor(value: string, counter: number, position: Array<Identifier>, siteID: number) {
        this.value = value;
        this.counter = counter;
        this.position = position;
        this.siteID = siteID;
    }

    compareTo(otherChar: Char) {
        /**
         * compare the identifiers untill a mismatch is found
         * use the identifier array length as a tie breaker
         */
        let comp;
        const pos1 = this.position.length;
        const pos2 = otherChar.position.length;
        const len = Math.min(this.position.length, otherChar.position.length);

        for (let i = 0; i < len; ++i) {
            comp = this.position[i].compareTo(otherChar.position[i]);
            if (comp !== 0)
                return comp;
        }

        if (pos1 < pos2)
            return -1;
        else if (pos1 > pos2)
            return 1;
        return 0;
    }
}

export default Char;