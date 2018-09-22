export class Quantities {

    quantities: Map<number, number>;
    maximum: Map<number, number>;

    constructor(max: Map<number, number>) {
        this.maximum = max;

        this.quantities = new Map();
        max.forEach((value, key) => {
            this.quantities.set(key, 0);
        });
    }

    get totalQuantities(): number {

        return Array.from(this.quantities.values()).reduce((acum, current) => acum + current);

    }

    get totalValue(): number {

        return Array.from(this.quantities.entries())
            .map(entry => entry[0]*entry[1])
            .reduce((acum, current) => acum + current);

    }

    increment() {

        const keys = this.quantities.keys();

        let incrementando = true;
        let next = keys.next();
        while (incrementando && !next.done) {

            const key = next.value;

            if (this.quantities.get(key) < this.maximum.get(key)) {
                // We have enought room to increase
                this.quantities.set(key, this.quantities.get(key) + 1);
                incrementando = false;
            } else {
                // Overflow, set this to 0 and add to the next
                this.quantities.set(key, 0);
                next = keys.next();
            }

        }

        return !incrementando;

    }

}
