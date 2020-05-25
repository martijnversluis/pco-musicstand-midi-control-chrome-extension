import ElementBinding from './element_binding';

class IObservable {
  addObserver(observer) {
    this.observers.push(observer);
    observer({ previousValue: undefined, newValue: this.value, observable: this });
    return this;
  }

  get observers() {
    this._observers || (this._observers = []);
    return this._observers;
  }

  notifyObservers(message) {
    this.observers.forEach((observer) => observer(message));
  }

  valueChanged(from, to) {
    this.notifyObservers({ previousValue: from, newValue: to, observable: this });
  }

  bind(element) {
    new ElementBinding(this, element);
    return this;
  }
}

export default IObservable;
