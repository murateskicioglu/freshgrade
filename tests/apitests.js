var apiclient = require('../clientsdk.js');

function callbackfn(exp, fun)
{
    var expected = exp;
    var method = fun;
    // console.log('method: ', fun);
    logfail = function(method, err){console.log("Test"+ method +" FAIL ... Expected: ", exp, ' Actual: ', err);}
    logpass = function(method){console.log("Test "+ method + " PASS");}
    return function callback(err, data)
    {

      if (!exp){
        if (!err){
          logpass(method);
          return;
        }
      }
      if (err)
      {
        if (exp == 'Fail') logpass(method);
        else logfail(method, err);

        return;
      }

      if (!data)
      {
        logfail(method, err);
        return;
      }

      try
      {
        // console.log(data);
        // console.log(data.length);
        if (data.length && data.length>0){
          // console.log('list');
          logpass(method);
          return;
        }

        if (data[expected]){
          logpass(method);
          return;
        }

        data = JSON.parse(data);
        if (data[expected]){
          logpass(method);
        }

        else logfail(method, err);
      }
      catch (e)
      {
        err = e;
        if (exp == 'Fail') logpass(method);
        else logfail(method, err);
      }


    }

}

//////////// ADD A STUDENT /////////////////////////////////
function AddStudentTest(exp)
{
  method = "AddStudentTest";
  // so that it wont be the same name
  var random = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
  var newStudentReq = {"Name":"Leonard Euler " + random,
   "TeacherId":"Leonardo",
   "Photo": "sdfdf"}
  apiclient.addStudent(newStudentReq, callbackfn(exp, method));
}

function AddStudentOnlyFirstname(exp)
{
  method = "AddStudentOnlyFirstname";
  // so that it wont be the same name
  var random = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
  var newStudentReq = {"Name":"Madonna" + random.trim(),
   "TeacherId":"Leonardo",
   "Photo": "sdfdf"}
  apiclient.addStudent(newStudentReq, callbackfn(exp, method));
}


function AddExistingStudent(exp)
{
  method = "AddExistingStudent";
  var newStudentReq = {"Name":"Werner Heisenberg",
   "TeacherId":"Leonardo",
   "Photo": ''}
  apiclient.addStudent(newStudentReq, callbackfn(exp, method));
}


function AddStudentNoPhotoTest(exp)
{
  method = "AddStudentNoPhotoTest";
  var newStudentReq = {"Name":"Werner Heisenberg",
   "TeacherId":"Leonardo",
   "Photo": ''}
  apiclient.addStudent(newStudentReq, callbackfn(exp, method));
}

function AddStudentIllegalNamesTest(exp)
{
  method = "AddStudentIllegalNamesTest";
  // Name too big
  var name = Array(3000).join("a")
  var newStudentReq = {"Name":name,
   "TeacherId":"Leonardo",
   "Photo": ''}
  apiclient.addStudent(newStudentReq, callbackfn(exp, method));

  // Illegal characters
  var name = Array(3000).join("a")
  var newStudentReq = {"Name":"{alert('you are hacked!!')}\\eval(str)<>",
   "TeacherId":"Leonardo",
   "Photo": ''}
  apiclient.addStudent(newStudentReq, callbackfn(exp, method));
}


function AddStudentIncorrectParametersTest(exp)
{
  method = "AddStudentIncorrectParametersTest";
  var newStudentReq = {"Name":"Niels Bohr",
   "TeacherId":"",
   "Photo": "sdfdf"}
  apiclient.addStudent(newStudentReq, callbackfn(exp, method));

  var newStudentReq = {"Name":"Niels Bohr",
   "Photo": "sdfdf"}
  apiclient.addStudent(newStudentReq, callbackfn(exp, method));

  var newStudentReq = {"Name":"",
   "TeacherId":"Leonardo",
   "Photo": "sdfdf"}
  apiclient.addStudent(newStudentReq, callbackfn(exp, method));

  var newStudentReq = {
   "TeacherId":"Leonardo",
   "Photo": "sdfdf"}
  apiclient.addStudent(newStudentReq, callbackfn(exp, method));


}



//////////// GET STUDENT /////////////////////////////////
function GetStudentsOfATeacherTest(exp)
{
  method = "GetStudentsOfATeacherTest";
  var teacher = "Ben";
  apiclient.getStudents(teacher, callbackfn(exp, method));
}

function GetStudentsOfNonExistingTeacherTest(exp)
{
  method = "GetStudentsOfNonExistingTeacherTest";
  var teacher = "Bad Teacher";
  apiclient.getStudents(teacher, callbackfn(exp, method));
}


//////////// GET STUDENT /////////////////////////////////
function GetStudentTest(exp)
{
  method = "GetStudentTest";
  var expected = "PASS";
  var student = "Eskicioglu-Murat M.";
  apiclient.getStudent(student, callbackfn(exp, method));
}

function GetNonExistingStudentTest(exp)
{
  method = "GetNonExistingStudentTest";
  var student = "This student should not exists";
  apiclient.getStudent(student, callbackfn(exp, method));
}


//////////// GET RANDOM STUDENT /////////////////////////////////
function GetRandomStudentTest(exp)
{
  method = "GetRandomStudentTest";
  apiclient.getRandomStudent(callbackfn(exp, method));
}

//////////// DELETE STUDENT /////////////////////////////////
function DeleteExistingStudentTest(exp)
{
  method = "DeleteExistingStudentTest";
  apiclient.deleteStudent("mvfwv-leonard euler", callbackfn(exp, method));
}

function DeleteNonExistingStudentTest(exp)
{
  method = "DeleteNonExistingStudentTest";
  apiclient.deleteStudent("sdfsddfgdfgdf", callbackfn(exp, method));

  apiclient.deleteStudent("", callbackfn(exp, method));
  // });
}

//////////// UPLOAD PICTURE /////////////////////////////////
function UploadProfilePictureTest(exp)
{
   var method = "UploadProfilePictureTest";
  //  console.log('TEST: Uploading Profile Pictures');
    var photo1 = 'media/john.png';
    // var photo2 = 'media/jane.png';

    var student1 = "Carl Sagan";
    // var student2 = "Albert Einstein";

    apiclient.uploadProfilePicture(student1, photo1, callbackfn(exp, method));
    // apiclient.uploadProfilePicture(student2, photo2, callback);

}

function UploadProfilePictureTooBigTest(exp)
{
   var method = "UploadProfilePictureTooBigTest";
  //  console.log('TEST: Uploading Profile Pictures');
   var photo1 = 'media\\bigfile.jpg';
   var student1 = "Benjamin Franklin";
   apiclient.uploadProfilePicture(student1, photo1, callbackfn(exp, method));
}

function UploadProfilePictureNoFileTest(exp)
{
    var method = "UploadProfilePictureNoFileTest";
    //  console.log('TEST: Uploading Profile Pictures');
    var photo1 = '';
    var student1 = "Brian Greene";
    apiclient.uploadProfilePicture(student1, photo1, callbackfn(exp, method));
}

function UploadProfilePictureNoStudentTest(exp)
{
    var method = "UploadProfilePictureNoStudentTest";
    //  console.log('TEST: Uploading Profile Pictures');
    var photo1 = 'media\\john.png';
    var student1 = "";
    apiclient.uploadProfilePicture(student1, photo1, callbackfn(exp, method));
}



var runTest = function(){
  UploadProfilePictureTest("photo");
  UploadProfilePictureNoFileTest("Fail");
  UploadProfilePictureNoStudentTest("Fail");
  UploadProfilePictureTooBigTest("Fail");

  DeleteExistingStudentTest();
  DeleteNonExistingStudentTest();

  GetRandomStudentTest("FirstName");

  GetStudentTest("FirstName");
  GetNonExistingStudentTest("Fail");

  GetStudentsOfATeacherTest("FirstName");
  GetStudentsOfNonExistingTeacherTest("Fail")

  AddStudentTest();
  AddStudentOnlyFirstname('Fail');
  AddExistingStudent('Fail');
  AddStudentIncorrectParametersTest("Fail");
  AddStudentNoPhotoTest();
  AddStudentIllegalNamesTest("Fail");
}();
