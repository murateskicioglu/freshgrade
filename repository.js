const uuidV4 = require('uuid/v4');
var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
var md5 = require('js-md5');


module.exports = {
  getStudents: function (teacherId, resultfn) {
      GetStudents(teacherId, resultfn);
  },
  addStudent: function (student, resultfn) {
        AddStudent(student, resultfn);
  },
  getStudent: function (studentId, resultfn) {
      GetStudent(studentId, resultfn);
  },
  deleteStudent: function (studentId, resultfn) {
      DeleteStudent(studentId, resultfn);
  }
};


function DeleteStudent(id, resultfn)
{
  var docClient = new AWS.DynamoDB.DocumentClient();

  var table = "Students";
  var params = {
      TableName:table,
      Key:{
          "Id":id
      },
      // ConditionExpression: "Id <= :id",
      // ExpressionAttributeValues: {
      //     ":val": id
      // }
  };

  console.log("Attempting a conditional delete...");
  docClient.delete(params, function(err, data) {
      if (err) {
          console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
          resultfn(err);
      } else {
          console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
          resultfn(null, data);
      };
  });
}


function AddStudent(student, resultfn)
{
  // Basic Scalar Datatypes
  var docClient = new AWS.DynamoDB.DocumentClient();
  var table = "Students";

  // dynamodb does not like empty or null fields
  // photo is optional so delete it if there are no valid values
  if (student.Photo == false) delete student.Photo;
  student.Id = student.LastName.toLowerCase() + '-' + student.FirstName.toLowerCase();

  var params = {
        TableName:table,
        Item: student,
        ConditionExpression: "attribute_not_exists(Id)"
        // ExpressionAttributeValues:{
        //     ":firstname":student.FirstName
        // },
  };

  docClient.put(params, function(err, data) {
      if (err) {
          resultfn(err);
          console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("Added item:", JSON.stringify(data, null, 2));
          resultfn();
      }
  });
}


function GetStudents(teacherId, resultfn)
{
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: 'Students',
    IndexName: "TeacherId-index",
    KeyConditionExpression: 'TeacherId = :teacherId',
    ExpressionAttributeValues: {
      ':teacherId': teacherId
    }
  };

  docClient.query(params, function(err, data) {
     if (err) {
       console.log(err);
       resultfn(err);
     }
     else {
       console.log(data);
       resultfn(null, data.Items);
     }
  });

}


function GetStudent(id, resultfn)
{
  // Basic Scalar Datatypes
  var docClient = new AWS.DynamoDB.DocumentClient();
  var table = "Students";
  var params = {
      TableName:table,
      Key:{
          "Id": id
      }
    };

    docClient.get(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            resultfn(err);
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            resultfn(null, data.Item);
        }
    });
}
