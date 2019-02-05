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
    // this.events[eventName].map((fn)=>{
    //   fn.call(undefined, data);
    // });
  },
  on(eventName, fn) { //订阅
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(fn);
  }
};