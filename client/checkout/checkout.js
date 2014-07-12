Template.checkout.events({
	"click .place-order": function(e, t){
		
		var cartId = Session.get("cartId") || false;

		Meteor.call("placeOrder", cartId, function(err, res){
			if(err){
				throwError(err.reason);
			} else{
				Session.set("cartId", null);
				toastr.options = {
							  "closeButton": true,
							  "positionClass": "toast-top-left"
							}
				toastr.success("Order placed", "Success");
			}
		});
	}
});

Template.checkout.rendered = function(){
	$(".spinner-05").spinner();
}