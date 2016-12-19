var apiclient = require('../clientsdk.js');
function callback(err, data)
{
  if (err)
  {
    console.log(err);
    return;
  }
  console.log(data);

}

//////////// ADD A STUDENT /////////////////////////////////
function AddStudentTest()
{
  // so that it wont be the same name
  var random = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
  var newStudentReq = {"Name":"Leonard Euler " + random,
   "TeacherId":"Leonardo",
   "Photo": "sdfdf"}
  apiclient.addStudent(newStudentReq, callback);
}

function AddStudentNoPhotoTest()
{
  var newStudentReq = {"Name":"Werner Heisenberg",
   "TeacherId":"Leonardo",
   "Photo": ''}
  apiclient.addStudent(newStudentReq, callback);
}

function AddStudentIllegalNamesTest()
{
  // Name too big
  var name = Array(3000).join("a")
  var newStudentReq = {"Name":name,
   "TeacherId":"Leonardo",
   "Photo": ''}
  apiclient.addStudent(newStudentReq, callback);

  // Illegal characters
  var name = Array(3000).join("a")
  var newStudentReq = {"Name":"{alert('you are hacked!!')}\\eval(str)<>",
   "TeacherId":"Leonardo",
   "Photo": ''}
  apiclient.addStudent(newStudentReq, callback);
}


function AddStudentIncorrectParametersTest()
{
  var newStudentReq = {"Name":"Niels Bohr",
   "TeacherId":"",
   "Photo": "sdfdf"}
  apiclient.addStudent(newStudentReq, callback);

  var newStudentReq = {"Name":"Niels Bohr",
   "Photo": "sdfdf"}
  apiclient.addStudent(newStudentReq, callback);

  var newStudentReq = {"Name":"",
   "TeacherId":"Leonardo",
   "Photo": "sdfdf"}
  apiclient.addStudent(newStudentReq, callback);

  var newStudentReq = {
   "TeacherId":"Leonardo",
   "Photo": "sdfdf"}
  apiclient.addStudent(newStudentReq, callback);


}



//////////// GET STUDENT /////////////////////////////////
function GetStudentsOfATeacherTest()
{
  var teacher = "Ben";
  apiclient.getStudents(teacher, callback);
}

function GetStudentsOfNonExistingTeacherTest()
{
  var teacher = "Bad Teacher";
  apiclient.getStudents(teacher, callback);
}


//////////// GET STUDENT /////////////////////////////////
function GetStudentTest()
{
  var student = "Eskicioglu-Murat M.";
  apiclient.getStudent(student, callback);
}

function GetNonExistingStudentTest()
{
  var student = "This student should not exists";
  apiclient.getStudent(student, callback);
}


//////////// GET RANDOM STUDENT /////////////////////////////////
function GetRandomStudentTest()
{
  apiclient.getRandomStudent(callback);
}

//////////// DELETE STUDENT /////////////////////////////////
function DeleteExistingStudentTest()
{
  apiclient.deleteStudent("mvfwv-leonard euler", callback);
}

function DeleteNonExistingStudentTest()
{
  apiclient.deleteStudent("sdfsddfgdfgdf", callback);

  apiclient.deleteStudent("", callback);
  // });
}

//////////// UPLOAD PICTURE /////////////////////////////////
function UploadProfilePictureTest()
{
   console.log('TEST: Uploading Profile Pictures');
    var photo1 = 'media/john.png';
    // var photo2 = 'media/jane.png';

    var student1 = "Carl Sagan";
    // var student2 = "Albert Einstein";

    apiclient.uploadProfilePicture(student1, photo1, callback);
    // apiclient.uploadProfilePicture(student2, photo2, callback);

}

function UploadProfilePictureTooBigTest()
{
   console.log('TEST: Uploading Profile Pictures');
   var photo1 = 'media\\bigfile.jpg';
   var student1 = "Benjamin Franklin";
   apiclient.uploadProfilePicture(student1, photo1, callback);
}

function UploadProfilePictureNoFileTest()
{
   console.log('TEST: Uploading Profile Pictures');
    var photo1 = '';
    var student1 = "Brian Greene";
    apiclient.uploadProfilePicture(student1, photo1, callback);
}

function UploadProfilePictureNoStudentTest()
{
   console.log('TEST: Uploading Profile Pictures');
    var photo1 = 'media\\john.png';
    var student1 = "";
    apiclient.uploadProfilePicture(student1, photo1, callback);
}



var runTest = function(){
   UploadProfilePictureTest();
  // UploadProfilePictureNoFileTest();
  // UploadProfilePictureNoStudentTest();
  // UploadProfilePictureTooBigTest();

  // DeleteExistingStudentTest();
  DeleteNonExistingStudentTest();

  GetRandomStudentTest();

  GetStudentTest();
  // GetNonExistingStudentTest();
  //
   GetStudentsOfATeacherTest();
  // GetStudentsOfNonExistingTeacherTest()
  //
  AddStudentTest();
  // AddStudentIncorrectParametersTest();
  // AddStudentNoPhotoTest();
  // AddStudentIllegalNamesTest();
}();
