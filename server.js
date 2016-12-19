var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var backend = require('./backend.js');
var multer  = require('multer')
var config = require('config');

// Mandatory to have the config values at least in ./config/default.json, Exception otherwise
var MAXFILESIZE = config.get('MaximumFilesize');
var uploadDirectory = config.get('UploadDirectory');

console.log(MAXFILESIZE);
console.log(uploadDirectory);

// configure app to use bodyParser()
// this will let us get the data from a POST
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8081;
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
// res.sendStatus(200); // equivalent to res.status(200).send('OK')
// res.sendStatus(400); // 'Bad Request'
// res.sendStatus(403); // equivalent to res.status(403).send('Forbidden')
// res.sendStatus(404); // equivalent to res.status(404).send('Not Found')
// res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')


// UPLOAD PROFILE PICTURE
// multer  middleware simplifies uploading files to server, it stores the file into the specified directory on the server
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadDirectory);
  },
  filename: function (req, file, callback) {
    console.log(file);
    callback(null, file.fieldname + '-' + Date.now() + '.' + file.originalname);
  }
});

var upload = multer({ storage : storage, limits: { fileSize: MAXFILESIZE}}).single('userPhoto');

router.post('/photo/:student',function(req,res){
     if (!req.params.student)
     {
       console.log('Incomplete request');
       console.log(req.params.student);
       console.log(req.file);
       console.log(req);
       return res.sendStatus(400);

     }

    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.sendStatus(500);

        }
        backend.uploadProfilePicture(req.params.student, req.file.path, function(err, url){
              if (err){
                res.sendStatus(500);
                return;
              }

              console.log(url);
              res.json({photo: url});
         });
    });
});

// GET STUDENTS OF A TEACHER
router.post('/students', function(req, res) {
   console.log(req.body.student);
    backend.addStudent(JSON.parse(req.body.student), function(err){
      if (err){
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
     });
});

// GET STUDENTS OF A TEACHER
router.get('/students', function(req, res) {
    if (!req.query.teacher)
    {
       res.sendStatus(400);
       return;
    }
    console.log('teacher: ', req.query.teacher);
    backend.getStudents(req.query.teacher, function(err, students){
        if (err){
          res.sendStatus(500);
          return;
        }
        if (students.length == 0){
          res.sendStatus(404);
          return;
        }
        res.json(students);
    });
});

// GET RANDOM STUDENT
router.get('/randomstudent', function(req, res) {
    backend.getRandomStudent(function(err, students){
        if (err){
          console.log(err);
          res.sendStatus(500);
          return;
        }
        res.json(students);
    });
});

// GET && DELETE A STUDENT BY ID
router.route('/students/:id')
    .get(function(req, res) {
      //console.log(req);
      backend.getStudent(req.params.id, function(err, student){
          if (err){
            res.sendStatus(500);
            return;
          }
          if (!student){
            res.sendStatus(404);
            return;
          }
          res.json(student);
      });
    })
    .delete(function(req, res) {
        if (!req.params.id)
        {
           res.sendStatus(400);
           return;
        }
        backend.deleteStudent(req.params.id, function(err){
            res.sendStatus(200);
        });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server started on port ' + port);
