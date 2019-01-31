window.eventHub = {
  events: {

  },
  emit(eventName, data) {
    for (let key in this.events) { //发布
      if (key === eventName) {
        this.events[key].map((fn) => {
          fn.call(undefined, data);
        });
      }
    }
  },
  on(eventName, fn) { //订阅
    if (this.events[eventName] === undefined) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(fn);
  }
};