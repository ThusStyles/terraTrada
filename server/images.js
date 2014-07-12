Meteor.startup(function(){
  imageStore = new FS.Store.S3("mains", {
    region: "eu-west-1",
    folder: "mains",
    accessKeyId: Meteor.settings.ACCESS_KEY,
    secretAccessKey: Meteor.settings.SECRET_KEY,
    bucket: "terramains",
    transformWrite: function(fileObj, readStream, writeStream) {
            gm(readStream, fileObj.name()).resize('500', '500').stream().pipe(writeStream);
    }

  });

  thumbStore = new FS.Store.S3("thumbs",{
      region: "eu-west-1",
      folder: "thumbs",
      accessKeyId: Meteor.settings.ACCESS_KEY,
      secretAccessKey: Meteor.settings.SECRET_KEY,
      bucket: "terramains",
      transformWrite: function(fileObj, readStream, writeStream) {
            gm(readStream, fileObj.name()).resize('100', '100').stream().pipe(writeStream);
      }
    });

  Images = new FS.Collection("mains", {
    stores: [imageStore, thumbStore],
    filter: {
        allow: {
          contentTypes: ['image/*'] //allow only images in this FS.Collection
        },
        maxSize: 5242880
      }
  });

  Images.allow({
    insert: function(userId, doc){
      if(userId)
        return true
      return false;
    },
    download: function(userId, doc){
      return true;
    },
    update: function(userId, doc){
      return true;
    }
  });

  Images.deny({
    insert: function(userId, doc){
      if(userId != doc.userId)
        return true
      return false;
    },
    update: function(userId, doc, fields, modifier){
      return false;
    },
    remove: function(userId, doc){
      return true;
    },
  });
});
