var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
//  title : String,
  name: String,
  email: String,
  dob: Date,
  weight: Number
});

var Product = new Schema({
  product_type: String,
  product_name: String,
  flavour: String,
  mass: Number,
  calories: Number,
  carbs: Number,
  protein: Number,
  fat: Number,
  sodium: Number,
  chloride: Number,
  potassium: Number,
  calcium: Number,
  caffeine: Number,
  vendor: String,
  notes: String
});

mongoose.model('users', User);

mongoose.model('products', Product);

mongoose.connect(`${process.env.DATABASECONN}`, { useNewUrlParser: true });
