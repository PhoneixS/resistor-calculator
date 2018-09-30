export interface IQuantities {

    readonly totalQuantities: number;

    readonly totalValue: number;

    readonly quantities: Map<number, number>;

    readonly maximum: Map<number, number>;

    increment(): boolean;

    snapshot(): IQuantities;

    maximized(): IQuantities;

}
