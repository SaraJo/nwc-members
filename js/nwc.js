(function($){

  // nerf persistent model syncing..

  Backbone.sync = function(method, model, success, error){
    console.log("backbone sync",method,model,success,error);
    success();
  }

  // quick js slugify fn
  // for creating member deatil urls based on name:
  //
  function slugify(text) {
    text = text.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
    text = text.replace(/-/gi, "_");
    text = text.replace(/\s/gi, "-");
    return text;
  }

  var Member = Backbone.Model.extend({
    defaults: {
      name: "Member Name",
      email: "",
      imageUrl: "",
      twitter: "",
      facebook: "",
      linkedin: "",
      google: "",
      personal: "",
      company: "",
      companyUrl: "",
      otherUrl: "",
      focus: "",
      workStatus: "",
      hiringStatus: "",
      bio: "",
      obscure: ""
    }
  });

  var MemberList = Backbone.Collection.extend({
    model: Member
  });

  var MemberItemView = Backbone.View.extend({
    tagName: 'li',

    initialize: function(){
      _.bindAll(this, 'render');
    },

    render: function(){
      $(this.el).html([
        '<a href="',appRoot,'#',this.model.get('id'),'">',
          this.model.get('name'),
        '</a>'
      ].join(""));

      return this;
    }

  });

  var MemberDetailView = Backbone.View.extend({
    el: $('#detailView'),

    initialize: function(){
      _.bindAll(this, 'render');

      this.render();
    },

    render: function(){
      $(this.el).append([
        '<a href="',appRoot,'">< Back</a>',
        '<h1>',this.model.get('name'),'</h1>',
        '<p>',this.model.get('bio'),'<p>'
      ].join(""));
    }

  });

  var MemberListView = Backbone.View.extend({
    el: $('#listView'),

    initialize: function(collection){
      _.bindAll(this, 'render', 'renderMember');

      this.collection = collection;

      this.render();
    },

    render: function(){
      $(this.el).append("<ul></ul>");

      _.forEach(this.collection.models,function(member){
        this.renderMember(member);
      },this);

    },

    renderMember: function(member){
      var memberView = new MemberItemView({
        model: member
      });

      $('ul',this.el).append(memberView.render().el);
    }

  });


  /// Okay now set up the actual app + collection from json + routes
  /// using all the models/views above:

  var memberList
    , nwcMembersView
    , nwcDetailView
    , router;


  // create the actual collection that will be used by all the views:

  memberList = new MemberList();

  _.forEach(Members, function(m){
    var memberModel = new Member(m);

    memberModel.set({
      id: slugify(memberModel.get('name'))
    });

    memberList.add(memberModel);
  });

  // create the main list view, only need to create this
  // once and then show/hide it based on current url:

  nwcMembersView = new MemberListView(memberList);


  // decalre the url routes to create/destroy the views:

  var AppRouter = Backbone.Router.extend({

    routes: {
      "":               "home",
      ":memberId":      "memberDetail"
    },

    home: function(){
      console.log("home");

      $('#listView').show();
      $('#detailView').hide();
    },

    memberDetail: function( memberId ){
      console.log("detail",memberId);

      var memberItem = memberList.get(memberId);

      nwcDetailView = new MemberDetailView({
        model: memberItem
      });

      $('#listView').hide();
      $('#detailView').show();
    }

  });


  // create the router instance, 'root' needs to be
  // defined if its not living at the root of your domain
  //
  router = new AppRouter();

  Backbone.history.start({ root: appRoot });

})(jQuery);

