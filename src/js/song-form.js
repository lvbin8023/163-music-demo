{
  let view = {
    el: '.page>main',
    template: `
    <h1>新建歌曲</h1>
    <form class="form" action="post">
      <div class="row">
        <label>
          歌名
        </label>
        <input type="text" value="__key__">
      </div>
      <div class="row">
        <label>
          歌手
        </label>
        <input type="text">
      </div>
      <div class="row">
        <label>
          外链
        </label>
        <input type="text" value="__link__">
      </div>
      <div class="row">
        <button type="submit">保存</button>
      </div>
    </form>
    `,
    render(data = {}) {
      let placeHolders = ['key', 'link'];
      let template = this.template;
      placeHolders.map((string) => {
        template = template.replace(`__${string}__`, data[string] || '');
      });
      $(this.el).html(template);
    }
  };
  let model = {

  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.view.render();
      window.eventHub.on('upload', (data) => {
        this.reset(data);
      });
    },
    reset(data) {
      this.view.render(data);
    }
  };
  controller.init(view, model);
}