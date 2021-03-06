import Char from "./Char";
import Identifier from "./Identifier";


class CRDT {
    /**
    * Conflict-free replicated data type implementation based on the Char and Identifier class
    */
    siteID: number;
    base: number;
    text: Array<Char>;

    constructor(siteID: number, base: number = 32) {
        this.siteID = siteID;
        this.base = base;
        this.text = [];
    }

    toText(): String {
        return this.text.map(char => char.value).join('');
    }


    localInsert(value: string, index: number): Char | undefined {
        /**
         * inserts the given value at the given index locally by generating a valid character identifier
         */
        const char = this.generateChar(value, index);
        if (char !== undefined) {
            this.text.splice(index, 0, char);
            return char;
        }
        return undefined;
    }

    remoteInsert(char: Char): Char | undefined {
        /**
         * places the given Char object coming from another site into the local instance of text
         */
        const index = this.findIndex(char);
        if (index !== undefined) {
            this.text.splice(index, 0, char);
            return char;
        }
        return undefined;
    }

    localDelete(index: number): Char | undefined {
        /**
         * deletes the value at the specified index from the text
         */
        const char = this.text.splice(index, 1)[0];
        if (char !== undefined)
            return char;
        return undefined;
    }

    remoteDelete(char: Char): Char | undefined {
        /**
         * deletes the given char using its identifier, if present
         */
        const index = this.findIndex(char, false);
        if (index !== undefined) {
            const char = this.text.splice(index, 1)[0];
            return char;
        }
        return undefined;
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

    findIndex(char: Char, insert: boolean = true): number | undefined {
        /**
         * uses binary serach to find to position of insertion/actual position of the given char object
         * by default it finds the position of insertion
         * if insert := false, it finds the position in this.text
         */

        let left = 0;
        let right = this.text.length - 1;

        if (insert) {
            if (this.text.length === 0 || char.compareTo(this.text[left]) === -1) {
                // insert at begining
                return 0;
            }
            if (char.compareTo(this.text[right]) === 1) {
                // insert at end
                return this.text.length;
            }
        }
        else {
            if (this.text.length === 0) {
                // char cannot exist
                return undefined;
            }
        }

        let mid = 0;
        let comp = 0;

        while (left + 1 < right) {
            mid = left + ((right - left) >> 1);
            comp = char.compareTo(this.text[mid]);

            if (comp === 0)
                return mid;
            else if (comp === 1)
                left = mid;
            else
                right = mid;
        }

        if (insert)
            return char.compareTo(this.text[left]) === 0 ? left : right;
        else {
            if (char.compareTo(this.text[left]) === 0)
                return left;
            else if (char.compareTo(this.text[right]) === 0)
                return right;
            else
                return undefined;
        }
    }
}

export default CRDT;
