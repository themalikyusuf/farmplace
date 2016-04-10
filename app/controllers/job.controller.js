var Job = require('../models/job.model');
var FarmOwner = require('../models/farmOwner.model');

exports.postJob = function(req, res) {
  FarmOwner.findOne({email: req.decoded._doc.email}, function(err, farmOwner) {
    if (!farmOwner) {
      return res.status(403).send({
        success: false,
        message: 'Please login or signup.'
      });
    }
    else {
      var farmOwnerId = farmOwner._id;
      var farmOwnerFarmName = farmOwner.farmName;
    }
    var year = req.body.year;
    var a = req.body.month;
    var b = req.body.day;

    var month = +a - 1;
    var day = +b + 1;

    function expire(year, month, day) {
      var dates = new Date(year, month, day);
      return dates;
    }

  	var job = new Job();
  	job.ownerId = farmOwnerId;
  	job.title = req.body.title;
  	job.description = req.body.description;
    job.farmName = farmOwnerFarmName;
  	job.location = req.body.location;
    job.agricType = req.body.agricType;
    job.expiryDate = expire(year, month, day);

  	job.save(function(err) {
      if (err) {
        if (err.name === 'ValidationError') {
          return res.status(401).send({
            success: false,
            message: 'Please fill the required field(s)!'
          });
        }
        else {
          return res.status(401).send(err);
        }
      }
  	  else {
  	    return res.status(200).send({
  	      success: true,
  	      message: 'Job Posted.',
  	      id: job._id
  	    });
  	  }
  	});
  });
};

exports.getAllJobs = function(req, res) {
	Job.find({}).exec(function(err, jobs) {
    if (err) {
      res.send(err);
    } 
    else if (!jobs) {
      res.status(404).send({
        success: false,
        message: 'Jobs Posting Not Found!'
      });
    } 
    else {
      res.status(200).send(jobs);
    }
  });
};

exports.getJob = function(req, res) {
	Job.find({_id: req.params.id}, function(err, job) {
    if (err) {
      res.send(err);
    }
    else {
      res.status(200).send(job);
    }
  });
};

exports.editJob = function(req, res) {
	Job.findByIdAndUpdate(req.params.id, req.body, function(err, job) {
    if (err) {
      return res.send(err);
    }
    else {
      res.status(200).send({
        success: true,
        message: 'Job Updated!'
      });
    }
  });
};

exports.deleteJob = function(req, res) {
	Job.findById(req.params.id).remove(function(err, job) {
    if (err) {
      return res.send(err);
    }
    else {
      res.status(200).send({
        success: true,
        message: 'Job Deleted'
      });
    }
  });
};

