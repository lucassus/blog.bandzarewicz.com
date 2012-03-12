TodoList.Models.Task = Backbone.Model.extend({
    url: function() {
        if (this.isNew()) {
            return '/tasks.json';
        } else {
            return '/tasks/' + this.getId() + '.json';
        }
    },

    toJSON: function() {
        return {
            task: this.attributes
        };
    },

    defaults: {
        name: '',
        complete: false
    },

    getId: function() {
        return this.id;
    },

    getName: function() {
        return this.get('name');
    },

    getComplete: function() {
        return this.get('complete');
    }
});
