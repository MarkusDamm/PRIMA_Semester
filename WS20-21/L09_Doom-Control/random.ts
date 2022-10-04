namespace Utils {
    const ALPHABET: String = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    /**
     * randID returns a random ID out of ALPHABET with the provided length
     * @param _length The length of the random ID
     */
    export function randID(_length: number): String {
        let id: String = "";

        for (let i: number = 0; i < _length; i++) {
            const index: number = randInt(0, ALPHABET.length - 1);
            id += ALPHABET[index];
        }

        return id;
    }

    /**
     * randInt returns an integer between _min and _max
     * @param _min min integer
     * @param _max max integer
     */
    export function randInt(_min: number, _max: number): number {
        return Math.floor(Math.random() * (_max - _min) + _min);
    }
}