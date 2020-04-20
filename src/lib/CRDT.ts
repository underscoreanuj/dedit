import Char from "./Char";
import Identifier from "./Identifier";

class CRDT {
    siteID: number;
    base: number;
    text: Array<Char>;

    constructor(siteID: number, base: number = 32) {
        this.siteID = siteID;
        this.base = base;
        this.text = [];
    }

    generateIdBetween(min: number, max: number): number {
        /**
         * generates a number between min & max
         * by incrementing the value of min by a value smaller than (max - min)
         * such that min < return value < max
         * 
         * expects max - min > 1, to generate a good value
         */
        min += 1;
        return min + Math.floor(Math.random() * (max - min));
    }

    generatePosBetween(pos_l: Array<Identifier>, pos_r: Array<Identifier>, newPos: Array<Identifier> = [], level = 0): Array<Identifier> | undefined {
        /**
         * recursively generates a position between pos_l and pos_r
         * such that pos_l < new _pos < pos_r
         */
        let base = Math.pow(2, level) * this.base;
        let id_l = pos_l[0] || new Identifier(0, this.siteID);
        let id_r = pos_r[0] || new Identifier(base, this.siteID);

        if (id_r.digit - id_l.digit > 1) {
            // can generate a new digit between the left and right positions
            let newDigit = this.generateIdBetween(id_l.digit, id_r.digit);
            newPos.push(new Identifier(newDigit, this.siteID));
            return newPos;
        }
        else if (id_r.digit - id_l.digit === 1) {
            // recursively look at next level for generating a new position
            newPos.push(id_l);
            return this.generatePosBetween(pos_l.slice(1), [], newPos, level + 1);
        }
        else if (id_r.digit === id_l.digit) {
            // sites must be different and follow the sort order
            if (id_l.siteID < id_r.siteID) {
                newPos.push(id_l);
                return this.generatePosBetween(pos_l.slice(1), [], newPos, level + 1);
            }
            else if (id_r.siteID === id_l.siteID) {
                // current most significant digits match and sites match too
                // *** generally happens when inserting at front
                newPos.push(id_l);
                return this.generatePosBetween(pos_l.slice(1), pos_r.slice(1), newPos, level + 1);
            }
        }
        else {
            throw new Error("ERROR: Invalid site ordering.");
        }

        return undefined;
    }

    generateChar(value: string, index: number): Char | undefined {
        /**
         * generates a new Char object for the given value and index
         * such that its identifier lies between the preceeding and succeeding Chars, if any
         */
        const posBefore = (this.text[index - 1] && this.text[index - 1].position) || [];    // get identifier of the preceeding Char, if any
        const posAfter = (this.text[index] && this.text[index].position) || [];             // get identifier of the succeeding Char, if any

        const newPos = this.generatePosBetween(posBefore, posAfter);
        if (newPos)
            return new Char(value, 0, newPos, this.siteID);
        return undefined;
    }

    localInsert(value: string, index: number): Char | undefined {
        /**
         * inserts the given value at the given index by generating a valid character identifier
         */
        const char = this.generateChar(value, index);
        if (char) {
            this.text.splice(index, 0, char);
            return char;
        }
        return undefined;
    }

    toText(): String {
        return this.text.map(char => char.value).join('');
    }

}

export default CRDT;