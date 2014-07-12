Template.signUp.events({
	"submit #register-form": function(e, t){
		e.preventDefault();
		var email = trimInput(t.find("#account-email").value);
		var password = trimInput(t.find("#account-password").value);
		var password2 = trimInput(t.find("#account-password-confirmation").value);
		var firstName = trimInput(t.find("#account-firstname").value);
		var lastName = trimInput(t.find("#account-lastname").value);
		var fullName = firstName + " " + lastName;

		obj = {
			firstName: firstName,
			lastName: lastName
		}

		var context = signupSchema.namedContext("signupForm");
		var isValid = context.validate(obj);

		if(!isValid){
			_.each(context.invalidKeys(), function(object){
				throwError(object.message);
			})
		} else {

			if(password == password2){
				if(isValidPassword(password)){
				$(".form-container").dimmer("show",{
					closable: false
				});
				$('#create-account').val("loading").attr("disabled", 'disabled');
				Accounts.createUser({email: email, password: password, profile: {name: fullName}}, function(err){
					if(err){
						toastr.options = {
						  "closeButton": true,
						  "positionClass": "toast-top-left"
						}
						toastr.error(err.reason, "Error");
						$(".form-container").dimmer("hide");
						$('#create-account').val("Sign Up").removeAttr("disabled");
					} else{
						$("#account-email").val("");
						$("#account-password").val("");
						$("#account-password-confirmation").val("");
						$("#account-firstname").val("");
						$("#account-lastname").val("");
						if(Session.get("referralId")){
							var referralId = Session.get("referralId");
						}
						if(Session.get("cartId")){
							var cartId = Session.get("cartId");
						}
						Meteor.logout();
						if (referralId) {
							Session.set("referralId", referralId);
						}
						if(cartId){
							Session.set("cartId", cartId);
						}
						toastr.options = {
						  "closeButton": true,
						  "positionClass": "toast-top-left"
						}
						toastr.success("Please activate your email before logging in, you have been sent an email", "Success");
						$(".form-container").dimmer("hide");
						$('#create-account').val("Sign Up").removeAttr("disabled");
					}
				});
				} else{
					toastr.options = {
						"closeButton": true,
						"positionClass": "toast-top-left"
					}
					toastr.error("Password must be greater than 6 characters", "Error");


				}
			} else{
				toastr.options = {
						"closeButton": true,
						"positionClass": "toast-top-left"
					}
				toastr.error("Passwords do not match", "Error");
			}
			

		}

		return false;
	}
});