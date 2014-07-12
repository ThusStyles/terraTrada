productListingSchema = new SimpleSchema({
  title: {
    type: String,
    label: "Title",
    max: 50
  },
  description: {
    type: String,
    label: "Description",
    max: 500
  },
  overviewPoints: {
    label: "Overview Point",
    type: [String],
    minCount: 1,
    maxCount: 6
  },
  quantity: {
    type: Number,
    label: "Amount",
    min: 1
  },
  price: {
    type: Number,
    label: "Price",
    min: 10
  },
  type: {
    type: String,
    label: "Type"
  },
  categoryTitle: {
    label: "Category",
    type: String,
    allowedValues: [ "Antiques",
                    "Art",
                    "Baby",
                    "Books",
                    "Cameras",
                    "Cars, Vehicles & Parts",
                    "Cell Phones",
                    "Clothing, Shoes & Accessories",
                    "Collectibles",
                    "Computers & Networking",
                    "Crafts",
                    "Electronics",
                    "Health & Beauty",
                    "Holiday & Seasonal",
                    "Home & Garden",
                    "Jewelry & Watches",
                    "Movies & TV Shows",
                    "Music & Instruments",
                    "Pet",
                    "Sporting Goods",
                    "Toys & Hobbies",
                    "Video Games & Consoles",
                    "Other Stuff"]
  },
  categorySlug: {
    type: String,
    allowedValues: [
                "antiques",
                "art",
                "baby",
                "books",
                "cameras",
                "cars-vehicles-and-parts",
                "cell-phones",
                "clothing-shoes-and-accessories",
                "collectibles",
                "computers-and-networking",
                "crafts",
                "electronics",
                "health-and-beauty",
                "holiday-and-seasonal",
                "home-and-garden",
                "jewelry-and-watches",
                "movies-and-tv-shows",
                "music-and-instruments",
                "pet",
                "sporting-goods",
                "toys-and-hobbies",
                "video-games-and-consoles",
                "other-stuff"
    ]
  }
});

serviceListingSchema = new SimpleSchema({
  title: {
    type: String,
    label: "Title",
    max: 50
  },
  description: {
    type: String,
    label: "Description",
    max: 500
  },
  quantity: {
    type: Number,
    label: "Amount",
    min: 1
  },
  price: {
    type: Number,
    label: "Price",
    min: 10
  },
  type: {
    type: String,
    label: "Type"
  },
  overviewPoints: {
    label: "Overview Point",
    type: [String],
    minCount: 1,
    maxCount: 6
  },
  categoryTitle: {
    type: String,
    allowedValues: [ "Business Support",
                      "Graphics & Design",
                      "Online Marketing",
                      "Sales & Marketing",
                      "Social Media",
                      "Software Dev & Mobile",
                      "Video, Photo & Audio",
                      "Web Development",
                      "Writing & Translation"
    ] 
  },
  categorySlug: {
    type: String,
    allowedValues: serviceCategoriesArray
  }
});

signupSchema = new SimpleSchema({
  firstName: {
    type: String,
    label: "First Name",
    max: 30
  },
  lastName: {
    type: String,
    label: "Last Name",
    max: 30
  }
});