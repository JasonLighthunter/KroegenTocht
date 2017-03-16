var mongoose = require('mongoose');

console.log('Initializing places schema');

var placeSchema = new mongoose.Schema({
      "geometry" : {
        "location" : {
          "lat" : Number,
          "lng" : Number
        }
      },
      "icon" : String,
      "id" : String,
      "name" : String,
      "opening_hours" : {
        "open_now" : Boolean
      },
      "photos" : [
        {
          "height" : Number,
          "html_attributions" : [],
          "photo_reference" : String,
          "width" : Number
        }
      ],
      "place_id" : String,
      "scope" : String,
      "alt_ids" : [
        {
          "place_id" : String,
          "scope" : String
        }
      ],
      "reference" : String,
      "types" : [ String ],
      "vicinity" : String
});

placeSchema.query.byPlaceId = function(place_id) {
  return this.find({ place_id: new RegExp(place_id, 'i') });
};

module.exports = mongoose.model('Place', placeSchema);