
(function($) {

    window.converter = new Showdown.converter();

    window.Post = Backbone.Model.extend({});

    window.Posts = Backbone.Collection.extend({
        model : Post,
        initialize : function() {
            var that = this;
            that.launch = arguments[1];
            console.log('Posts collection Constructor');
            this.gitHubStorage = new Store('k33g','ossicle','master','posts', function(){
                that.fetch({ result : function() {
                    that.launch(); /* launched when loaded */
                } });
            });
        }
    });

    window.PostsCollectionView = Backbone.View.extend({
        el : $('#posts-collection-container'),

        initialize : function() {
            //this.el = $('#posts-collection-container'); console.log(this.el);
            this.template = _.template($('#posts-collection-template').html());
        },

        render : function() {
            var renderedContent = this.template({ posts : this.collection.toJSON() });
            $(this.el).html(renderedContent);
            return this;
        }

    });

    window.PostView = Backbone.View.extend({
        el : $('#post-details-container'),

        initialize : function() {
            this.template = _.template($('#post-details-template').html());

        },

        setModel : function(model) {
            this.model = model;
            return this;
        },

        render : function() {
            var renderedContent = this.template(this.model.toJSON());
            $(this.el).html(renderedContent);
            return this;
        }


    });

    window.Workspace = Backbone.Router.extend({
        initialize : function() {
            window.posts = new Posts(null,function(){
                console.log('Ready');
                window.postsCollectionView = new PostsCollectionView({ collection : posts });
                window.postView = new PostView({ model : posts.models[0] });
                postsCollectionView.render();
                postView.render();
            });

            this.route("post/:name", "post", function(name){
                if(postView != undefined) {postView.setModel(posts.get(name)).render();}
            });
        },

        routes: {}

    });

    $(function() {
        /*--- initialisation de la webapp ---*/
        window.blablabla = new Workspace();

        /*--- activation du monitoring des "hashchange events" et dispatch des routes ---*/
        Backbone.history.start();
    });


})(Zepto);