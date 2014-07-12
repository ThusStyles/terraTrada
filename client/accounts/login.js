Template.login.events({
	"submit #login-form": function(e, t){
		e.preventDefault();

		var email = t.find("#login-email").value;
		var password = t.find("#login-password").value;

		Meteor.call("checkVerified", email, function(error, result){
			if(result){
				// not verified
				toastr.options = {
					  "closeButton": true,
					  "positionClass": "toast-top-left"
					}
				toastr.error("Please verify your email before logging in", "Error");
			} else{
				Meteor.loginWithPassword(email, password, function(err){
					if(err){
						toastr.options = {
							  "closeButton": true,
							  "positionClass": "toast-top-left"
							}
						toastr.error(err.reason, "Error");
					}
				});
			}
		});
		
		
		return false;
	},
	"click .login-facebook": function(e, t){
		Meteor.loginWithFacebook();
	},
	"click .login-google": function(e, t){
		Meteor.loginWithGoogle();
	},
	"click .login-linkedin": function(e, t){
		Meteor.loginWithLinkedin();
	}
});