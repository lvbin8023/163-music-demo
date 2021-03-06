{
  let view = {
    el: '.songList-container',
    template: `
    <ul class="songList">
    </ul>
    `,
    render(data) {
      $(this.el).html(this.template);
      let {
        songs,
        selectSongId
      } = data;
      let liList = songs.map((song) => {
        let $li = $('<li></li>').text(song.name).attr('song-id', song.id);
        if (song.id === selectSongId) {
          $li.addClass('active');
        }
        return $li;
      });
      $(this.el).find('ul').empty();
      liList.map((domLi) => $(this.el).find('ul').append(domLi));
    },
    clearActive() {
      $(this.el).find('.active').removeClass('active');
    }
  };
  let model = {
    data: {
      songs: [],
      selectSongId: undefined,
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
      $(this.view.el).on('click', 'li', (event) => {
        let songId = event.currentTarget.getAttribute('song-id');
        this.model.data.selectSongId = songId;
        this.view.render(this.model.data);
        let data;
        let songs = this.model.data.songs;
        for (let i = 0; i < songs.length; i++) {
          if (songs[i].id === songId) {
            data = songs[i];
          }
        }
        window.eventHub.emit('selected', JSON.parse(JSON.stringify(data)));
      })
    },
    bindEventHub() {
      window.eventHub.on('create', (songData) => {
        this.model.data.songs.push(songData);
        this.view.render(this.model.data);
      });
      window.eventHub.on('new', () => {
        this.view.clearActive();
      });
      window.eventHub.on('update', (songData) => {
        let songs = this.model.data.songs;
        for (let i = 0; i < songs.length; i++) {
          if (songs[i].id === songData.id) {
            Object.assign(songs[i], songData)
          }
        }
        this.view.render(this.model.data);
      })
    }
  };
  controller.init(view, model);
}