import IObservable from './i_observable';

class Computed extends IObservable {
  constructor(func, dependencies) {
    super();
    this.func = func;
    this.value = func();

    dependencies.forEach((dependency) => {
      dependency.addObserver(() => this.recompute())
    });
  }

  recompute() {
    const previousValue = this.value;
    this.value = this.func();
    this.notifyObservers({ previousValue, newValue: this.value, observable: this });
  }
}

export default Computed;
