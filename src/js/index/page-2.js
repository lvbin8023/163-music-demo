{
  let view = {
    el: '.page-2',
    show() {
      $(this.el).addClass('active');
    },
    hide() {
      $(this.el).removeClass('active');
    }
  };
  let model = {

  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.bindEvents();
      this.bindEventHub();
    },
    bindEvents() {

    },
    bindEventHub() {
      window.eventHub.on('selectTab', (tabName) => {
        if (tabName === 'page-2') {
          this.view.show();
        } else {
          this.view.hide();
        }
      });
    }
  };
  controller.init(view, model);
}