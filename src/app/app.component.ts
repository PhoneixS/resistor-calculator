import { Component } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CalculatorService } from './services/calculator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'resistor-calculator';
  progress = null;
  result = null;
  total = null;
  notFound = null;

  public dataForm: FormGroup;

  constructor(private fb: FormBuilder, private calculator: CalculatorService) {
    this.dataForm = this.fb.group({
      availableResistors: this.fb.array([
        this.fb.group({
          value: [220, Validators.min(0)],
          quantity: [10, Validators.min(0)]
        })
      ]),
      requiredValue: [0, [Validators.required, Validators.min(0)]],
      findBest: ['1']
    });
  }

  get resistencias(): FormArray {
    return this.dataForm.get('availableResistors') as FormArray;
  }

  addResistor() {
    this.resistencias.push(this.fb.group({
      value: this.fb.control(1000),
      quantity: this.fb.control(10)
    }));
  }

  public calcular() {

    console.log('Starting...');
    this.progress = 0;
    this.result = null;
    this.total = null;

    const resistors = new Map();

    this.resistencias.controls.forEach(control => {

      const val = control.get('value').value;
      const qua = control.get('quantity').value;

      if (resistors.has(val)) {
        resistors.set(val, resistors.get(val) + qua);
      } else {
        resistors.set(val, qua);
      }

    });

    const desiredValue = this.dataForm.get('requiredValue').value;

    this.calculator.start(resistors, desiredValue, {
      findBest: this.dataForm.get('findBest').value === '1'
    }).subscribe(r => {

      console.log('Finished');
      this.progress = null;

      if (r == null) {
        this.notFound = true;
        this.result = null;
        this.total = null;
      } else {
        this.notFound = false;
        this.result = Array.from(r.quantities.entries());
        this.total = r.totalQuantities;
      }

    });

  }

}
