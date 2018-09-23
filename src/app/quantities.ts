export class Quantities {

    private _quantities: Map<number, number>;
    private _maximum: Map<number, number>;

    constructor(max?: Map<number, number>) {

        if (!max) {
            max = new Map();
        }

        this._maximum = max;

        this._quantities = new Map();
        max.forEach((value, key) => {
            this._quantities.set(key, 0);
        });
    }

    get totalQuantities(): number {

        return Array.from(this._quantities.values()).reduce((acum, current) => acum + current);

    }

    get totalValue(): number {

        return Array.from(this._quantities.entries())
            .map(entry => entry[0] * entry[1])
            .reduce((acum, current) => acum + current);

    }

    get quantities() {
        return this._quantities;
    }

    get maximum() {
        return this._maximum;
    }

    increment() {

        const keys = this._quantities.keys();

        let incrementando = true;
        let next = keys.next();
        while (incrementando && !next.done) {

            const key = next.value;

            if (this._quantities.get(key) < this._maximum.get(key)) {
                // We have enought room to increase
                this._quantities.set(key, this._quantities.get(key) + 1);
                incrementando = false;
            } else {
                // Overflow, set this to 0 and add to the next
                this._quantities.set(key, 0);
                next = keys.next();
            }

        }

        return !incrementando;

    }

    snapshot(): Quantities {

        const clone = new Quantities();

        clone._maximum = new Map(this._maximum);
        clone._quantities = new Map(this._quantities);

        return clone;

    }

    maximized(): Quantities {

        const clone = new Quantities();

        clone._maximum = new Map(this._maximum);
        clone._quantities = new Map(this._maximum);

        return clone;

    }

}
