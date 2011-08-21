/**
 * Created by JetBrains WebStorm.
 * User: k33g_org
 * Date: 21/08/11
 * Time: 19:48
 * To change this template use File | Settings | File Templates.
 */
(function(){
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