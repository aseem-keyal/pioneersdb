Router.configure({
    layoutTemplate: 'main'
});
Router.route('/', {
    name: 'home',
    template: 'home'
});
Router.route('/profile', {
    name: 'profile',
    template: 'dashboard',
    onBeforeAction: function () {
        if (!Meteor.user()) {
            if (Meteor.loggingIn()) {
                this.next();
            }
            else {
                Router.go('login');
            }
        }
    }
});
Router.route('/login', {
    name: 'login',
    template: 'studentLogin'
});
Router.route('/adminLogin', {
    name: 'adminLogin',
    template: 'adminLogin'
});
if (Meteor.isClient) {
    Meteor.subscribe("users");
    Template.adminRegister.events({
        'submit form': function(event) {
            event.preventDefault();
            var email = event.target.registerEmail.value;
            var password = event.target.registerPassword.value;
            var approved = 0;
            var users = Meteor.users.find();
            if (users.count() == 0) approved = 1;
            Accounts.createUser({
                email: email,
                password: password,
                profile: {
                    approved: approved,
                    admin: 1
                }
            });
            Router.go('profile');
        }
    });
    Template.studentRegister.events({
        'submit form': function(event) {
            event.preventDefault();
            var email = event.target.registerEmail.value;
            var password = event.target.registerPassword.value;
            var approved = 0;
            var users = Meteor.users.find();
            Accounts.createUser({
                email: email,
                password: password,
                profile: {
                    approved: 0,
                    admin: 0
                }
            });
            Router.go('profile');
        }
    });
    Template.login.events({
        'submit form': function(event) {
            event.preventDefault();
            var email = event.target.loginEmail.value;
            var password = event.target.loginPassword.value;
            Meteor.loginWithPassword(email, password);
            Router.go('profile');
        }
    });
    Template.navbar.events({
        'click .logout': function(event) {
            event.preventDefault();
            Meteor.logout();
        }
    });
    Template.navbar.helpers({
        "currentEmail": function() { return Meteor.user().emails[0].address; }
    });
    Template.dashboard.helpers({
        "user": function() {  return Meteor.users.find({'profile.admin': 1}, {}); }
    });
    Template.potentialAdmin.helpers({
        "userEmail": function() { return this.emails[0].address; }
    });
    Template.potentialAdmin.events({
        'click .approve': function (event) {
            event.preventDefault();
            Meteor.users.update({_id: this._id}, {$set: {'profile.approved': 1 }});
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
    });
    Meteor.publish("users", function () {
        return Meteor.users.find();
    });
    Meteor.users.allow({
        'update': function (userId,doc) {
            return true;
        }
    });
}
