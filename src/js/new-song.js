{
  let view = {
    el: '.newSong',
    template: `
    新建歌曲
    `,
    render(data) {
      $(this.el).html(this.template);
    }
  };
  let model = {};
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.view.render(this.model.data);
      this.active();
      window.eventHub.on('upload', (data) => {
        this.active();
      });
      window.eventHub.on('selected', (data) => {
        this.deactive();
      });
    },
    deactive() {
      $(this.view.el).removeClass('active');
    },
    active() {
      $(this.view.el).addClass('active');
    }
  };
  controller.init(view, model);
}