import Char from "./Char";
import Identifier from "./Identifier";

class CRDT {
    siteID: number;
    struct: Array<Char>;

    constructor(siteID: number) {
        this.siteID = siteID;
        this.struct = [];
    }

    generateIdBetween(min: number, max: number): number {
        return min + Math.floor(Math.random() * (max - min));
    }

    generatePosBetween(pos_l: Array<Identifier>, pos_r: Array<Identifier>, newPos: Array<Identifier> = []): Array<Identifier> {
        let id_l = pos_l[0] || new Identifier(0, this.siteID);
        let id_r = pos_r[0] || new Identifier(999999, this.siteID);

        if (id_r.digit - id_l.digit > 1) {
            let newDigit = this.generateIdBetween(id_l.digit, id_r.digit);
            newPos.push(new Identifier(newDigit, this.siteID));
            return newPos;
        }
        else if (id_r.digit - id_l.digit === 1) {
            newPos.push(id_l);
            return this.generatePosBetween(pos_l.slice(1), pos_r, newPos);
        }
    }

    generateChar(value: string, pos: number): Char {
        // get identifier of the preceeding Char
        const posBefore = (this.struct[pos - 1] && this.struct[pos - 1].position) || [];
        const posAfter = (this.struct[pos] && this.struct[pos].position) || [];
        const newPos = this.generatePosBetween(posBefore, posAfter);

        return new Char(value, 1, newPos, this.siteID);
    }

    localInsert(value: string, pos: number) {
        const char = this.generateChar(value, pos);
        this.struct.splice(pos, 0, char);               // at pos, remove 0, insert char

        return char;
    }

    toText() {
        return this.struct.map(char => char.value).join('');
    }

}

export default CRDT;