Meteor.startup(function(){

	Accounts.emailTemplates.resetPassword.text = function(user, url){
		url = url.replace('#/reset-password', 'login')
		return "Click this link to reset your password: " + url
	}

	Accounts.emailTemplates.verifyEmail.text = function(user, url){
		url = url.replace('#/', '')
		return "Click this link to verify your email: " + url
	}

});