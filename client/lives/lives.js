Template.lives.helpers({
	areLives: function(){
		return Lives.find().count() > 0;
	}
});