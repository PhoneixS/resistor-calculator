import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';
import { Quantities } from '../quantities';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  constructor() { }

  start(resistors: Map<number, number>, targetValue: number, options = {
    findBest: true
  }): Observable<Quantities> {

    if (options.findBest) {

      return this.findBest(resistors, targetValue);

    } else {

      return this.findFirst(resistors, targetValue);

    }

  }

  private findFirst(resistors: Map<number, number>, targetValue: number): Observable<Quantities> {

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

    // Return the best result
    return of(currentQuantities);

  }

  private findBest(resistors: Map<number, number>, targetValue: number): Observable<Quantities> {

    // Start with all elements at 0.
    const currentQuantities = new Quantities(resistors);

    // a little optimization if the want 0
    if (targetValue === 0) {
      return of(currentQuantities);
    }

    // and the best is to use all the resistors
    let bestQuantity = currentQuantities.maximized();

    let exactResult = false;

    // TODO Search until we know that we can't improve.
    // Search until we have look at all posibilities.
    while (currentQuantities.increment()) {

      // If it is what we want and is better than previous results, save it.
      if (currentQuantities.totalValue === targetValue && currentQuantities.totalQuantities < bestQuantity.totalQuantities) {
        bestQuantity = currentQuantities.snapshot();
        exactResult = true;
      }

    }

    if (!exactResult) {
      return of(null);
    }

    // Return the best result
    return of(bestQuantity);

  }

}
