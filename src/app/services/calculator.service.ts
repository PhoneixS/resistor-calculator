import { QuantitiesResult } from './../quantities-result';

import { Injectable } from '@angular/core';

import { of, Observable, Subject, empty } from 'rxjs';
import { createWorker, ITypedWorker } from 'typed-web-workers';

import { IQuantities } from './../iquantities';
import { Quantities } from '../quantities';

interface WorkerParameter {
  resistors: Map<number, number>;
  targetValue: number;
}

export interface WorkerResult {
  isFinished: boolean;
  result?: QuantitiesResult;
  status?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  private results: Subject<WorkerResult>;

  constructor() { }

  start(resistors: Map<number, number>, targetValue: number, options = {
    findBest: true
  }): Observable<WorkerResult> {

    if (options.findBest) {

      return this.findBest(resistors, targetValue);

    } else {

      return this.findFirst(resistors, targetValue);

    }

  }

  private findFirst(resistors: Map<number, number>, targetValue: number): Observable<WorkerResult> {

    // Start with all elements at 0.
    const currentQuantities = new Quantities(resistors);
    let currentValue = currentQuantities.totalValue;

    // Search the exact value.
    while (currentValue !== targetValue) {

      if (!currentQuantities.increment()) {
        return of(null);
      }

      currentValue = currentQuantities.totalValue;

    }

    // Return the result
    return of({
      isFinished: true,
      result: currentQuantities
    });

  }

  private findBest(resistors: Map<number, number>, targetValue: number): Observable<WorkerResult> {

    // TODO Finish all previous calls

    // Initialize the new things
    this.results = new Subject();

    // Create the new worker.
    const typedWorker: ITypedWorker<WorkerParameter, WorkerResult> = createWorker(this.doSearch, (result) => this.doResult(result));

    // Start the calculus.
    typedWorker.postMessage({
      resistors: resistors,
      targetValue: targetValue
    });

    // Return the observable.
    return this.results.asObservable();

  }

  private doResult(result: WorkerResult) {

    this.results.next(result);

  }

  private doSearch(parameters: WorkerParameter, callback: (_: WorkerResult) => void) {

    console.log('Loading utilities');

    /* ------------------------------------------------------------------
     * Quantities class definition.
     */

    class PrivateQuantities implements IQuantities {

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

      snapshot(): PrivateQuantities {

        const clone = new PrivateQuantities();

        clone._maximum = new Map(this._maximum);
        clone._quantities = new Map(this._quantities);

        return clone;

      }

      maximized(): PrivateQuantities {

        const clone = new PrivateQuantities();

        clone._maximum = new Map(this._maximum);
        clone._quantities = new Map(this._maximum);

        return clone;

      }

    }


    /*
     * End of Quatities class definition.
     * -------------------------------------------------------------------
     */

    console.log('Starting calculation');

    // Start with all elements at 0.
    const currentQuantities = new PrivateQuantities(parameters.resistors);
    let counter = 1;

    // a little optimization if the want 0
    if (parameters.targetValue === 0) {
      const emptyResult: WorkerResult = {
        isFinished: true,
        result: {
          totalQuantities: currentQuantities.totalQuantities,
          totalValue: currentQuantities.totalValue,
          quantities: currentQuantities.quantities
        }
      };
      callback(emptyResult);
      return;
    }

    // and the best is to use all the resistors
    let bestQuantity = currentQuantities.maximized();

    const total = Array.from(parameters.resistors.values()).map(q => q + 1).reduce((previous, current) => previous * current);

    let exactResult = false;

    // TODO Search until we know that we can't improve.
    // Search until we have look at all posibilities.
    while (currentQuantities.increment()) {

      counter++;
      if ((counter % 100000) === 0) {

        // Announce the progress
        const progressResult: WorkerResult = {
          isFinished: false,
          status: (100 * counter / total)
        };
        callback(progressResult);

      }

      // If it is what we want and is better than previous results, save it.
      if (currentQuantities.totalValue === parameters.targetValue && currentQuantities.totalQuantities < bestQuantity.totalQuantities) {
        bestQuantity = currentQuantities.snapshot();
        exactResult = true;
        console.log('Exact match found: ', bestQuantity);
      }

    }

    console.log('finished calculation after ' + counter + ' iterations');

    if (!exactResult) {
      callback({
        isFinished: true,
        result: null
      });
      return;
    }

    // Return the best result
    const endResult: WorkerResult = {
      isFinished: true,
      result: {
        totalQuantities: bestQuantity.totalQuantities,
        totalValue: bestQuantity.totalValue,
        quantities: bestQuantity.quantities
      }
    };
    console.dir(endResult);
    callback(endResult);

  }

}
