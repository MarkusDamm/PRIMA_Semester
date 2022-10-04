"use strict";
var Utils;
(function (Utils) {
    const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    /**
     * randID returns a random ID out of ALPHABET with the provided length
     * @param _length The length of the random ID
     */
    function randID(_length) {
        let id = "";
        for (let i = 0; i < _length; i++) {
            const index = randInt(0, ALPHABET.length - 1);
            id += ALPHABET[index];
        }
        return id;
    }
    Utils.randID = randID;
    /**
     * randInt returns an integer between _min and _max
     * @param _min min integer
     * @param _max max integer
     */
    function randInt(_min, _max) {
        return Math.floor(Math.random() * (_max - _min) + _min);
    }
    Utils.randInt = randInt;
})(Utils || (Utils = {}));
//# sourceMappingURL=random.js.map