Template.passwordRecovery.helpers({
	resetPassword: function(t){
		return Session.get("resetPassword");
	},
	showResetForm: function(t){
		return Session.get("showResetForm") || Session.get("resetPassword");
	}
});

Template.passwordRecovery.events({
	"click #reset-password": function(e,t){
		Session.set("showResetForm", true);
	},
	"submit #recovery-form": function(e,t){
		e.preventDefault();

		var email = trimInput(t.find('#recovery-email').value);

			if (email.value != "") {
	          Accounts.forgotPassword({email: email}, function(err){
	          if(err){
	            toastr.options = {
					  "closeButton": true,
					  "positionClass": "toast-top-left"
					}
				toastr.error("Email Sending Error", "Error");
			   } else {
		            toastr.options = {
						  "closeButton": true,
						  "positionClass": "toast-top-left"
						}
					toastr.success("Please check your email", "Email Sent");
					Session.set("showResetForm", false);

	        	}
        });
        }
        return false; 
	},

	'submit #new-password' : function(e, t) {
        e.preventDefault();

        var pw = t.find('#new-password-password').value;

        if (pw.value != "" && isValidPassword(pw)) {

          Accounts.resetPassword(Session.get('resetPassword'), pw, function(err){
            if (err){
              toastr.options = {
					  "closeButton": true,
					  "positionClass": "toast-top-left"
					}
			  toastr.error("Password Reset Error", "Error");
            }else {
              toastr.options = {
					  "closeButton": true,
					  "positionClass": "toast-top-left"
					}
		      toastr.success("Password Successfully Reset", "Password Reset");
            }
          });

        }
      return false; 
      }
});