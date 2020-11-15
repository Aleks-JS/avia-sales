class Observer {
  callbacks = [];

  addSubsriber(callback) {
    this.callbacks.push(callback);
  }

  removeSubsriber(callback) {
    const index = this.callbacks.indexOf(callback);
    if (index !== -1) {
      this.callbacks.splice(index, 1);
    }
  }

  notify(value) {
    this.callbacks.forEach((el) => {
      el(value);
    });
  }
}

class State {
  obs = new Observer();

  constructor(value) {
    this.value = value;
  }

  setState(value) {
    this.value = value;
    this.obs.notify(this.value);
  }

  getValue() {
    return this.value;
  }

  getObs() {
    return this.obs;
  }
}
