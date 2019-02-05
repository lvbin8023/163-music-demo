{
  let view = {
    el: '.songList-container',
    template: `
    <ul class="songList">
    </ul>
    `,
    activeItem(li) {
      let $li = $(li);
      $li.addClass('active').siblings('.active').removeClass('active');
    },
    render(data) {
      $(this.el).html(this.template);
      let {
        songs
      } = data;
      let liList = songs.map((song) => $('<li></li>').text(song.name).attr('song-id',song.id));
      $(this.el).find('ul').empty();
      liList.map((domLi) => $(this.el).find('ul').append(domLi));
    },
    clearActive() {
      $(this.el).find('.active').removeClass('active');
    }
  };
  let model = {
    data: {
      songs: []
    },
    find() {
      let query = new AV.Query('Song');
      return query.find().then((songs) => {
        this.data.songs = songs.map((song) => {
          return {
            id: song.id,
            ...song.attributes
          };
        });
        return this.data.songs;
      });
    }
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.getAllSongs();
      this.bindEventHub();
      this.bindEvents();
      this.view.render(this.model.data);
    },
    getAllSongs() {
      return this.model.find().then(() => {
        this.view.render(this.model.data);
      });
    },
    bindEvents() {
      $(this.view.el).on('click','li',(event)=>{
        this.view.activeItem(event.currentTarget);
        let songId = event.currentTarget.getAttribute('song-id');
        window.eventHub.emit('selected',{id:songId});
      })
    },
    bindEventHub() {
      window.eventHub.on('upload', () => {
        this.view.clearActive();
      });
      window.eventHub.on('create', (songData) => {
        this.model.data.songs.push(songData);
        this.view.render(this.model.data);
      });
    }
  };
  controller.init(view, model);
}