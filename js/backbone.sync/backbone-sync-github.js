/**
 * User: k33g
 * Date: 26/08/11
 */

var Store = function(user,repo,branch,directory, callBk) {
    var that = this;
    this.parameters = {
        gitHubBranchId : "",
        gitHubBranchName : branch,
        gitHubUser : user,
        gitHubRepo : repo,
        gitHubDir : directory
    };
    gh.repo(this.parameters.gitHubUser, this.parameters.gitHubRepo).branches(function(data){
        //get Master Branch sha
        that.parameters.gitHubBranchId = data.branches[that.parameters.gitHubBranchName];
        callBk();
    });
};

_.extend(Store.prototype, {

    save: function() {
        throw "save function not implemented";
    },

    create: function() {
        throw "create function not implemented";
    },

    update: function() {
        throw "update function not implemented";
    },

    find: function(model, callBk) {
        var that = this;
        this.callBk = callBk;

        gh.object(this.parameters.gitHubUser, this.parameters.gitHubRepo)
                .blob(this.parameters.gitHubDir +"/" + model.id ,this.parameters.gitHubBranchId,function(result){

            gh.commit.forPath(that.parameters.gitHubUser, that.parameters.gitHubRepo,
                    that.parameters.gitHubBranchName, result.blob.name ,function(inf){

                        var lastCommit = inf.commits[0];
                        var firstCommit = inf.commits[inf.commits.length-1];

                        model.set({author : lastCommit.author.login});
                        model.set({dateCreate : firstCommit.committed_date});
                        model.set({dateUpdate : lastCommit.committed_date});
                        model.set({message : lastCommit.message});
                        model.set({text : result.blob.data});

                        that.callBk.result(model);

                    });

                });
    },

    // Return the array of all models
    findAll: function(model,callBk) { /* model is a collection */
        var that = this;
        this.callBkFindAll = callBk;

        this.postsIndexes = [];

        gh.object(this.parameters.gitHubUser, this.parameters.gitHubRepo).tree(this.parameters.gitHubBranchId,function(contents){
            var tree  = contents.tree.filter(function(e) { return e.name === that.parameters.gitHubDir; })[0];

            gh.object(that.parameters.gitHubUser, that.parameters.gitHubRepo).tree(tree.sha,function(contents){
                var Files = contents.tree;

                Files.reverse().forEach(function(f){
                    that.postsIndexes.push(f);
                });

                var count = that.postsIndexes.length, i=0;

                that.postsIndexes.forEach(function(element){
                    var post = new Post({ id : element.name });
                    model.add(post);
                    model.get(element.name).fetch({ result : function(){
                            i+=1;
                            if(i==count) {
                                that.callBkFindAll.result();
                            }
                        }
                    });
                });
            });

        });
    },

    destroy: function() {
        throw "destroy function not implemented";
    }

});

Backbone.sync = function(method, model, options) {

  var resp;

  var store = model.gitHubStorage || model.collection.gitHubStorage;

  switch (method) {
    case "read":    resp = model.id ? store.find(model, options) : store.findAll(model, options); break;
    case "create":  resp = store.create(model);                            break;
    case "update":  resp = store.update(model);                            break;
    case "delete":  resp = store.destroy(model);                           break;
  }

  if (resp) {
    options.success(resp);
  } else {
    options.error("Record not found");
  }
};
