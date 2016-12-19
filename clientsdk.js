var http = require('http');
var urlencode = require('urlencode');
var querystring = require('querystring');
var request = require('request');
var fs = require('fs');

module.exports = {
  uploadProfilePicture: function (student, fullFileName, resultfn) {
      UploadFile(student, fullFileName, resultfn);
  },
  getStudents: function (teacherId, resultfn) {
      GetStudents(teacherId, resultfn);
  },
  getStudent: function (studentId, resultfn) {
      GetStudent(studentId, resultfn);
  },
  getRandomStudent: function (resultfn) {
      GetRandomStudent(resultfn);
  },
  addStudent: function (studentreq, resultfn) {
      AddStudent(studentreq, resultfn);
  },
  deleteStudent: function (studentId, resultfn) {
      DeleteStudent(studentId, resultfn);
  }

};




var urlaws = 'http://studentapplication.us-east-1.elasticbeanstalk.com/api/photo';
var urllocal = 'http://localhost:8081/api/photo';


// var photo1 = 'd:\\temp\\dev\\john.png';
// var photo2 = 'd:\\temp\\dev\\jane.png';

function UploadFile(student, filename, resultfn)
{
  ////console.log(filename);
  var formData = {
    id: 'uploadForm',
    userPhoto: fs.createReadStream(filename)

  };

  // //console.log(formData.userPhoto);

  request.post({url:urlaws+'/'+urlencode(student), formData: formData}, function optionalCallback(err, httpResponse, url) {
    if (err) {
       //console.error('upload failed:', err);
       resultfn(err);
    }
    //console.log('Upload successful!  Server responded with:', url);
    resultfn(err, url);

  });
}

// UploadFile("John Wayne", photo1);
// //console.log('UploaFile -1 returned');
// UploadFile("Jane Austin", photo2);
// //console.log('UploaFile -2 returned');
// return;


function PostCode(studentreq, callback) {
//
  // Build the post string from an object
  //console.log(studentreq);
  var data = querystring.stringify({
        student: JSON.stringify(studentreq)
      });

  //console.log(data);
  // An object of options to indicate where to post to
  var post_options = {
      host: host,
      port: port,
      path: '/api/students',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(data)
      }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          //console.log('Response: ' + chunk);
          callback(null, chunk);
      });
  });

  // post the data
  post_req.write(data);
  post_req.end();

}



/**
 * HOW TO Make an HTTP Call - GET
 */
// options for GET
var baseUrl = '/api';
// var host = 'localhost';
var host = 'studentapplication.us-east-1.elasticbeanstalk.com';
// var port = 8081;
var port = 80;

function SetOptions(path, method)
{
  var method = 'GET';
  var call = '/students?teacher=Ken';
  var options = {
      host : host, // here only the domain name
      // (no http/https !)
      port : port,
      path : baseUrl+path, // the rest of the url with parameters if needed
      method : method || "GET" // do GET
  };
  return options;
}
// do the GET request
function GetStudents(teacher, callback){
  var options = SetOptions('/students?teacher=' + urlencode(teacher));
  HttpRequest(options, callback);
}

function GetStudent(student, callback){
  //console.log('/students/' + student);
  var options = SetOptions('/students/' + urlencode(student));
  //console.log(options);
  HttpRequest(options, callback);
}

function GetRandomStudent(callback){
  //console.log('/randomstudent');
  var options = SetOptions('/randomstudent');
  //console.log(options);
  HttpRequest(options, callback);
}

function DeleteStudent(student, callback){
  // var options = SetOptions('/students/'+ urlencode(student), "DELETE");
  // //console.log(options);
  // HttpRequest(options, callback);

  request.delete(urlaws+'/api/students/'+ urlencode(student), function(err, data){
      if (err)
      {
        callback(err);
      }
      else
      {
        callback(null, data);
      }
  });

}


// AddStudent
function AddStudent(studentreq, callback){
  PostCode(studentreq, callback);
}

// DeleteStudent

// UploadPhoto


function HttpRequest(optionsget, callback)
{
    var reqGet = http.request(optionsget, function(res) {
        // //console.log("statusCode: ", res.statusCode);
        // //console.log(res);
        if (res.statusCode != 200){
            callback(res.statusMessage);
            return;
        }

        res.on('data', function(d) {
            // //console.log('err:', err,'data:', d);
            callback(null, JSON.parse(d));
        });
        reqGet.on('error', function(e) {
            // ////console.error(e);
            callback(e);

        });
    });

    reqGet.end();

}

// GetStudents('Ken', function(data){
//    //console.log('Get Students Returned', data);
// });
//
// GetStudent('john-tarzan st.', function(data){
//    //console.log('Get Student Returned', data);
// });


// GetRandomStudent( function(data){
//    //console.log('Get Random Student Returned', data);
// });
// Add Student
