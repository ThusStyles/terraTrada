Meteor.startup(function() {

  // Remove configuration entries in case service is already configured
  Accounts.loginServiceConfiguration.remove({
      service: "facebook",
      service: "google",
      service: "linkedin"
  });

  // Add Facebook configuration entry
  Accounts.loginServiceConfiguration.insert({
    "service": "facebook",
    "appId": Meteor.settings.FACEBOOK_1,
    "secret": Meteor.settings.FACEBOOK_2
  });

  // Add Linkedin configuration entry
  Accounts.loginServiceConfiguration.insert({
    "service": "linkedin",
    "clientId": Meteor.settings.LINKEDIN_1,
    "secret": Meteor.settings.LINKEDIN_2
  });

  // Add Google configuration entry
  Accounts.loginServiceConfiguration.insert({
    "service": "google",
    "clientId": Meteor.settings.GOOGLE_1,
    "client_email": Meteor.settings.GOOGLE_2,
    "secret": Meteor.settings.GOOGLE_3
  }); 

  AccountsMeld.configure({
      askBeforeMeld: false
  });

  Accounts.config({
    sendVerificationEmail: true
  });


  Accounts.onCreateUser(function(options, user) {
      user.terras = 100;
      if (options.profile)
          user.profile = options.profile;
      return user;
  });
  
});
