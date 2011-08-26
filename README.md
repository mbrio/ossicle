#Samples about Backbone.js


##Backbone.sync + LocalStorage

- JS Lib : [https://github.com/k33g/ossicle/blob/master/js/backbone.sync/backbone-sync-localstorage.js](https://github.com/k33g/ossicle/blob/master/js/backbone.sync/backbone-sync-localstorage.js)
- Sample html files : [https://github.com/k33g/ossicle/blob/master/index-bb-localstorage.html](https://github.com/k33g/ossicle/blob/master/index-bb-localstorage.html)


This is a simple module of localStorage based persistence to override `Backbone.sync` with  ability to use different kinds of models with same keys (ie : "human|001", "doc|001", ...).


**Use : **

- include `backbone-sync-localstorage.js`
- Model and Collection must have a property `storeName` :

        window.Human =  Backbone.Model.extend({
            storeName : "humansDB"
        });

        window.Humans =  Backbone.Collection.extend({
            model : Human,
            storeName : "humansDB"
        });

- `key storage` of a model is calculated like that : `storeName` + "|" + `model.id`
- then you can do that :

        myModel.save()              // save model to local storage
        myModel.fetch()             // get model from local storage
        myModel.destroy()           // delete model from local storage

        myModelsCollection.fetch()  // load all models from local storage


##Backbone.sync + GitHub Api

- JS Lib : [https://github.com/k33g/ossicle/blob/master/js/backbone.sync/backbone-sync-github.js](https://github.com/k33g/ossicle/blob/master/js/backbone.sync/backbone-sync-github.js)
- Sample html files : [https://github.com/k33g/ossicle/blob/master/index-bb-github-api.html](https://github.com/k33g/ossicle/blob/master/index-bb-github-api.html)
- Sample js files : [https://github.com/k33g/ossicle/blob/master/bb-github-api.js](https://github.com/k33g/ossicle/blob/master/bb-github-api.js)


It's a "POC". Goal : to display a few pages (markdown format) stored on a **GitHub** repository.

The main idea is :

- you write your text in a markdown format.
- a webapp (HTML+JS), connects to your **GitHub** repository and is able to display your posts to HTML.
- you can install it on **git-pages**, or to any hoster and even locally.

### Dependencies

- **Backbone.js** : [http://documentcloud.github.com/backbone/](http://documentcloud.github.com/backbone/)
- so, **Underscore.js**
- **GitHub.js** : to connect to **GitHub API v2**, [https://github.com/fitzgen/github-api](https://github.com/fitzgen/github-api)
- **Showdown.js** to convert markdown to html, [https://github.com/guybrush/showdown/blob/master/src/showdown.js](https://github.com/guybrush/showdown/blob/master/src/showdown.js)
- **Zepto** to play with DOM, [https://github.com/madrobby/zepto](https://github.com/madrobby/zepto)

###How to setup ?

1. create a **GitHub** repository with a `posts` directory (or an other name)
2. copy "somewhere" these files : [https://github.com/k33g/ossicle](https://github.com/k33g/ossicle) :

    	.
		|-- css
		|   `-- style.css
		|-- js
		|   `-- backbone.sync
		|       |-- backbone-sync-github.js  /* override Backbone.sync */
		|   `-- vendor
		|       |-- backbone-min.js
		|       |-- github.js
		|       |-- showdown.js
		|       |-- underscore-min.js
		|       `-- zepto.min.js
		|-- bb-github-api.js
		`-- index-bb-github-api.html

3. Edit `bb-github-api.js` : you have to set the `gitHubStorage` of the `Backbone.Collection`

        window.Posts = Backbone.Collection.extend({
            model : Post,
            initialize : function() {
                var that = this;
                that.launch = arguments[1];
                //Set the "gitHub storage"
                this.gitHubStorage = new Store('k33g','ossicle','master','posts',
                    function(){
                        that.fetch({ result : function() {
                        that.launch(); /* launched when loaded */
                    }
                });
            });
            }
        });


Use : `this.gitHubStorage = new Store(github_user_name, github_project_name, branch_name, directory_name, callback_function);`

**That's all.**
