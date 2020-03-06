var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('users');

//var mass = 88;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('manualrace', { title: 'Enter a race manually' });
});

/* POST form. */
router.post('/', function(req, res, next) {
  calculatePace(req.body.distance, req.body.time, function(rslt) {

//    console.log(getMets(findClosest(array, rslt)));
//    console.log(getCalories(getMets(findClosest(array, rslt)), req.body.time));
    var totalCalories = getCalories(getMets(findClosest(array, rslt)), req.body.time, req.body.weight);

    res.render('recommendations', { pace: rslt, totalCalories: totalCalories});
  });

});

const calculatePace = (distance, time, callback) => {
  var pace = (1.60934*(time/distance));

  callback(pace);

};

var array = [6, 6.5, 7, 7.5, 8, 8.5, 9, 10, 11.5, 12];
var metsTable = [
  {
    pace: 6,
    met: 16
  },
  {
    pace: 6.5,
    met: 15
  },
  {
    pace: 7,
    met: 14
  },
  {
    pace: 7.5,
    met: 13.5
  },
  {
    pace: 8,
    met: 12.5
  },
  {
    pace: 8.5,
    met: 11.5
  },
  {
    pace: 9,
    met: 11
  },
  {
    pace: 10,
    met: 10
  },
  {
    pace: 11.5,
    met: 9
  },
  {
    pace: 12,
    met: 8
  }
];

function getMets(pace) {
  var filteredMets = metsTable.filter(function (result) {
    return result.pace === pace;
  });

  return filteredMets[0].met;
};

function findClosest(array,num) {
  var i=0;
  var minDiff=1000;
  var ans;
  for(i in array){
    var m=Math.abs(num-array[i]);
    if(m<minDiff){
      minDiff=m;
      ans=array[i];
    }
  }
  return ans;
}

function getCalories(mets, time, weight) {
  var calories = (((weight*(mets*3.5))/200)*time);
  return calories;
}

module.exports = router;
