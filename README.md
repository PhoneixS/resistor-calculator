# ResistorCalculator

This project aims to help you when you have a bunch of resistors but you need a specific resistor value that you don't have. What you usually do is connect them to get a similar value but, at the same time, you want to only use the minimum number of resistors necessary. And that's what this app does, calculate what resistors you need to connect to get the specified value.

For now, this calculator only takes into account resistors connected in serial (sum of their values) but in a (far) future it would also have into account parallel resistors.

## How to use it ##

You can clone this project and run it locally as in the next section or simply go to https://phoneixs.github.io/resistor-calculator/ and use it.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

To build it for github you should do with `ng build --prod --base-href /resistor-calculator/`

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
