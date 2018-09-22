import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';
import { Quantities } from '../quantities';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  constructor() { }

  start(resistors: Map<number, number>, targetValue: number): Observable<Map<number, number>> {

    resistors.forEach(element => {
      console.log(element);
    });

    // Start with all elements at 0.
    const currentQuantities = new Quantities(resistors);
    let currentValue = currentQuantities.totalValue;

    // Search the exact value.
    while (currentValue != targetValue) {

      if (!currentQuantities.increment()) {
        return of(null);
      }

      currentValue = currentQuantities.totalValue;

    }

    // TODO Return the best result (for now the first)
    return of(currentQuantities.quantities);

  }

}
