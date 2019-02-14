{
  let view = {
    el: '.page>main',
    template: `
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
        <label>
          封面
        </label>
        <input name="cover" type="text" value="__cover__">
      </div>
      <div class="row">
        <label>
          歌词
        </label>
        <textarea name="lyrics" rows="15" cols="50">__lyrics__</textarea>
      </div>
      <div class="row">
        <button type="submit">保存</button>
      </div>
    </form>
    `,
    render(data = {}) {
      let placeHolders = ['name', 'singer', 'url', 'id', 'cover', 'lyrics'];
      let template = this.template;
      placeHolders.map((string) => {
        template = template.replace(`__${string}__`, data[string] || '');
      });
      $(this.el).html(template);
      if (data.id) {
        $(this.el).prepend('<h1>编辑歌曲</h1>');
      } else {
        $(this.el).prepend('<h1>新建歌曲</h1>')
      }
    }
  };
  let model = {
    data: {
      name: '',
      singer: '',
      url: '',
      id: '',
      cover: '',
      lyrics: ''
    },
    createItem(data) {
      var Song = AV.Object.extend('Song');
      var song = new Song();
      song.set({
        'name': data.name,
        'singer': data.singer,
        'url': data.url,
        'cover': data.cover,
        'lyrics': data.lyrics
      });
      return song.save().then((newSong) => {
        let {
          attributes,
          id
        } = newSong;
        this.data = {
          ...id,
          ...attributes
        }
      });
    },
    updateItem(data) {
      var song = AV.Object.createWithoutData('Song', this.data.id);
      song.set({
        'name': data.name,
        'singer': data.singer,
        'url': data.url,
        'cover': data.cover,
        'lyrics': data.lyrics
      });
      return song.save().then((response) => {
        Object.assign(this.data, data);
        return response;
      });
    }
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.view.render();
      this.bindEvents();
      this.bindEventHub();
    },
    bindEventHub() {
      window.eventHub.on('selected', (data) => {
        this.model.data = data;
        this.view.render(this.model.data);
      });
      window.eventHub.on('new', (data) => {
        if (this.model.data.id) {
          this.model.data = {
            name: '',
            singer: '',
            url: '',
            id: '',
            lyrics: ''
          };
        } else {
          Object.assign(this.model.data, data);
        }
        this.view.render(this.model.data);
      });
    },
    create() {
      let needs = 'name singer url cover lyrics'.split(' ');
      let data = {};
      needs.map((string) => {
        data[string] = $(this.view.el).find(`[name='${string}']`).val();
      });
      this.model.createItem(data).then(() => {
        this.view.render({});
        window.eventHub.emit('create', JSON.parse(JSON.stringify(data)));
      });
    },
    update() {
      let needs = 'name singer url cover lyrics'.split(' ');
      let data = {};
      needs.map((string) => {
        data[string] = $(this.view.el).find(`[name='${string}']`).val();
      });
      this.model.updateItem(data).then(() => {
        window.eventHub.emit('update', Object.assign(this.model.data, data));
        window.location.reload();
      });
    },
    bindEvents() {
      $(this.view.el).on('submit', 'form', (e) => {
        e.preventDefault();
        if (this.model.data.id && this.model.data.name) {
          this.update();
        } else {
          this.create();
        }
      });
    }
  };
  controller.init(view, model);
}