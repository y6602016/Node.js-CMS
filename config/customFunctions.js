module.exports = {
    selectOption: function(status, option) {
        return option.fn(this).replace(new RegExp('value=\"'+status+'\"'), '$&selected="selected"');
    },

    isEmpty: function(object) {
        for(let key in object) {
            if (object.hasOwnProperty(key)) {
                return false;
            }
            return true;
        }
    },

    isUserAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            next();
        }
        else {
            res.redirect('/login');
        }
    }
}