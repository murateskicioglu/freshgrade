var parser = require('./name-parser.js');
var filestorage = require('./filestorage.js');
var repository = require('./repository.js');
var randomUserService = require('./randomuser-service.js');

module.exports = {
  uploadProfilePicture: function (student, fullFileName, resultfn) {
      filestorage.uploadProfilePicture(student, fullFileName, resultfn);
  },
  getStudents: function (teacherId, resultfn) {
      repository.getStudents(teacherId, resultfn);
  },
  getStudent: function (studentId, resultfn) {
      repository.getStudent(studentId, resultfn);
  },
  getRandomStudent: function (resultfn) {
      randomUserService.getRandomStudent(resultfn);
  },
  addStudent: function (studentreq, resultfn) {
      if (!studentreq.TeacherId || !studentreq.Name){
         return resultfn({status: 400});
      }
      var rsp = parser.extractNameParts(studentreq.Name);
      if (rsp.status != 200){
         return resultfn(rsp);
      }

      if ( !rsp.firstname || !rsp.firstname ){
         return resultfn({status: 500});
      }

      var student = {
        "FirstName": rsp.firstname,
        "LastName" : rsp.lastname,
        "Photo" : studentreq.Photo,
        "TeacherId": studentreq.TeacherId

      }
      repository.addStudent(student, resultfn);
  },
  deleteStudent: function (studentId, resultfn) {
      repository.deleteStudent(studentId, resultfn);
  }
};
