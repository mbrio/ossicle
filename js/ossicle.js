/**
 * Created by JetBrains WebStorm.
 * User: k33g_org
 * Date: 21/08/11
 * Time: 19:48
 * To change this template use File | Settings | File Templates.
 */
(function(){

    /*------------------------------------------------------------*/
    /*                       STORAGE                              */
    /*------------------------------------------------------------*/

    var WareHouse = {

        getLocalStorage :function (kindOfStore, storageName) {
            return {

                storageName : storageName,


                isAvailable : function () {
                    try {
                        kindOfStore.setItem("testKey", "testValue");
                        kindOfStore.removeItem("testKey");
                    } catch (err) {
                        return false; /*not available*/
                    }
                    return true;
                },

                get : function (key) {
                    var obj = JSON.parse(kindOfStore.getItem(this.storageName + '|' + key));
                    if (obj) {obj.key = key; return obj; } else { return null; }
                },

                remove : function (keyOrObject) {
                    var key = this.storageName + '|' + (typeof keyOrObject === 'string' ? keyOrObject : keyOrObject.key);
                    /*TODO: have to verify if exists before delete*/
                    kindOfStore.removeItem(key);
                    return key;
                },

                save : function (obj) {
                    //var id = this.storageName + '|' + (obj.key || cyste.guidGenerator());
                    var id = this.storageName + '|' + obj.key;
                    delete obj.key;
                    //try {
                        kindOfStore.setItem(id, JSON.stringify(obj));

                        return obj.key = id.split('|')[1];

                    //} catch (err) { throw (err); }
                },

                all : function () {
                    var results = [], i, store = kindOfStore, l = store.length, id, key, baseName, obj;
                    for (i = 0; i < l; i += 1) {
                        id = store.key(i);
                        baseName = id.split('|')[0];
                        key = id.split('|').slice(1).join("|");
                        if (baseName === this.storageName) {
                            obj = JSON.parse(kindOfStore.getItem(id));
                            obj.key = key;
                            results.push(obj);
                        }
                    }
                    return results;
                },

                drop : function () {
                    var that = this;

                    this.all(function (r) {
                        var m;
                        for (m in r) {
                            if (r.hasOwnProperty(m)) {
                                that.remove(r[m].key, null);
                            }
                        }
                    });
                }
            };
        },

        getStorage : function (baseName) {
            var storage = this.getLocalStorage(window.localStorage, baseName);
            if (!storage.isAvailable()) { storage = null; }
            return storage;
        }

    }




    Ossicle = this.Ossicle = {};
    
    Ossicle.Class = {
        extend : function(class_def) {
            var m, k = Object.create(this);
            if(k.initialize) { k.initialize.prototype = k; }
            k.parent = class_def; /* on laisse ou pas ??? */
            /*--- define members ---*/
            for(m in class_def) {
                //console.log(m);
                Object.defineProperty(k, m,{
                    value : class_def[m],
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            }
            k.getInstance = function() {
                var inst = Object.create(k),m;
                /*--- apply default values ---*/
                for(m in inst) { //default value
                    if (typeof inst[m] != 'function') inst[m] = inst[m];
                }
                /*---*/
                if (inst.initialize) { inst.initialize.apply(inst, arguments); }
                return inst;
            }
            return k;
        }
    };

    Ossicle.Model = Ossicle.Class.extend({
        save : function() { console.log('Saved : ',JSON.stringify(this)); }
    });


    Ossicle.Models = Ossicle.Class.extend({
        items : [],

        add:function(what){
            if(what.length>0){
                this.items = this.items.concat(what);
            } else {
                this.items.push(what);
            }
        },
        get : function(key) {
          return this.items.filter(function(item){ return item.key === key;})[0];
        },

        all : function() {
            return this.models;
        },

        /*
            Humans.remove(Sam, function(e) { console.log(e); })
            Humans.remove([Sam, Bob], function(e) { console.log(e); })
         */
        remove : function(something, callbk) {
            var i, res, that = this;
            if(Array.isArray(something)) {
                for(i=0;i < something.length; i+=1) {
                    res = that.items.splice(that.items.indexOf(something[i]),1);
                    if(callbk) callbk(res[0]);
                }
            } else {
                res = this.items.splice(this.items.indexOf(something),1);
                if(callbk) callbk(res[0]);
            }
        },


        each : function(handler) {
            this.items.forEach(handler);
        },

        filter : function(handler) { //return an array
            return this.items.filter(handler);
        },

        sort : function() { /* TODO: */ }

    });





}).call(this);