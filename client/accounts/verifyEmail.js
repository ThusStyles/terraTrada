Template.verifyEmail.rendered = function(){
	if(Session.get("verifyToken")){
		Accounts.verifyEmail(Session.get("verifyToken"), function(error){
			if(error){
				console.log(error.reason);
				toastr.options = {
					  "closeButton": true,
					  "positionClass": "toast-top-left"
					}
				toastr.error("Error", "Email could not be verified");
			} else{
				if(Session.get("referralId")){
					Meteor.call("referral", Session.get("referralId"), function(err, res){
						if(!err){
							Session.set("referralId", null);
						}
					});
				}
				Router.go("dashboard");
				toastr.options = {
							  "closeButton": true,
							  "positionClass": "toast-top-left"
							}
				toastr.success("Verified", "Email successfully verified");
			}
		});
	} else{
		
	}
}