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
        <input name="name" type="text" value="__name__">
      </div>
      <div class="row">
        <label>
          歌手
        </label>
        <input name="singer" type="text" value="__singer__">
      </div>
      <div class="row">
        <label>
          外链
        </label>
        <input name="url" type="text" value="__url__">
      </div>
      <div class="row">
        <button type="submit">保存</button>
      </div>
    </form>
    `,
    render(data = {}) {
      let placeHolders = ['name', 'singer','url','id'];
      let template = this.template;
      placeHolders.map((string) => {
        template = template.replace(`__${string}__`, data[string] || '');
      });
      $(this.el).html(template);
    }
  };
  let model = {
    data: {
      name: '',
      singer: '',
      url: '',
      id: ''
    },
    creat(data) {
      var Song = AV.Object.extend('Song');
      var song = new Song();
      song.set({
        'name': data.name,
        'singer': data.singer,
        'url': data.url
      });
      return song.save().then((newSong) => {
        let {
          attributes,
          id
        } = newSong;
        this.data = {...id, ...attributes}
      }, (error) => {
        console.error(error);
      });
    }
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.view.render();
      this.bindEvents();
      window.eventHub.on('upload', (data) => {
        this.view.render(data);
      });
    },
    bindEvents() {
      $(this.view.el).on('submit', 'form', (e) => {
        e.preventDefault();
        let needs = ['name', 'singer', 'url'];
        let data = {};
        needs.map((string) => {
          data[string] = $(this.view.el).find(`input[name='${string}']`).val();
        });
        this.model.creat(data).then(()=>{
          this.view.render({});
          window.eventHub.emit('create',this.model.data);
        });
      });
    }
  };
  controller.init(view, model);
}