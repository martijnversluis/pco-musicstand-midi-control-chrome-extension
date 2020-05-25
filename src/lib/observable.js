import IObservable from './i_observable';

class Observable extends IObservable {
  constructor(initialValue) {
    super();
    this.value = initialValue;
  }

  set(value) {
    if (this.value !== value) {
      const previousValue  = this.value;
      this.value = value;
      this.valueChanged(previousValue, this.value);
    }
  }

  update(func) {
    this.set(func(this.get()));
  }

  toggle() {
    this.set(!this.get());
  }

  get() {
    return this.value;
  }
}

export default Observable;
