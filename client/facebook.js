if(Meteor.isClient) {
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '{your-app-id}',
      status     : true,
      xfbml      : true
    });
  };
}