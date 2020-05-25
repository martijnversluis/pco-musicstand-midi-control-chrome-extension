class ElementBinding {
  constructor(observable, element) {
    element.addEventListener('change', () => {
      const value = element.value;
      observable.set(value)
    });

    observable.addObserver(({ newValue }) => {
      if ('value' in element) {
        element.value = newValue;
      } else if ('innerText' in element) {
        element.innerText = newValue;
      }
    });
  }
}

export default ElementBinding;
