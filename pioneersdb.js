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
        }
    });
    Template.adminLogin.events({
        'submit form': function(event) {
            event.preventDefault();
            var email = event.target.loginEmail.value;
            var password = event.target.loginPassword.value;
            Meteor.loginWithPassword(email, password);
        }
    });
    Template.dashboard.events({
        'click .logout': function(event) {
            event.preventDefault();
            Meteor.logout();
        }
    });
    Template.dashboard.helpers({
        "user": function() {  return Meteor.users.find(); }
    });
    Template.potentialAdmin.helpers({
        "userEmail": function() {
            return this.emails[0].address;
        }
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
