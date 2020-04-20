class Identifier {
    digit: number;
    siteID: number;

    constructor(digit: number, siteID: number) {
        this.digit = digit;
        this.siteID = siteID;
    }

    compareTo(otherIdentifier: Identifier) {
        /**
         * use the digit to determine the larget identifier
         * use the siteID as the tie-breaker
         */
        if (this.digit < otherIdentifier.digit)
            return -1;
        else if (this.digit > otherIdentifier.digit)
            return 1;
        else {
            if (this.siteID < otherIdentifier.siteID)
                return -1;
            else if (this.siteID > otherIdentifier.siteID)
                return 1;
        }
        return 0;
    }
}

export default Identifier;