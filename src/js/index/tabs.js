{
  let view = {
    el:'#tabs'
  };
  let model = {};
  let controller = {
    init(view,model) {
      this.view = view;
      this.model =model;
      this.bindEvents();
    },
    bindEvents() {
      $(this.view.el).on('click','.tabs-nav>li',(event)=>{
        let $li = $(event.currentTarget);
        let $pageName = $li.attr('data-tab-name');
        $li.addClass('active').siblings().removeClass('active');
        window.eventHub.emit('selectTab',$pageName);
      });
    }
  };
  controller.init(view,model);
}