// Generate a v4 UUID (random)
const uuidV4 = require('uuid/v4');
var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
var s3 = new AWS.S3();
var Client = require('node-rest-client').Client;
var parser = require('./name-parser.js');
var fs = require('fs');
var S3FS = require('s3fs');
var md5 = require('js-md5');
var backend = require('../backend.js');


function CreateBucket()
{
    s3.createBucket({Bucket: "studentappphotos"}, function(err, data) {
        // If an error occurred, handle it (throw, propagate, etc)
      if(err) {
        console.log('Error creating the bucket');
        console.log(err);
        return;
      }
      // Otherwise, log the file contents
      console.log(data);
    });
}

function ListBuckets()
{
    s3.listBuckets(function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
}

function CreateTable()
{
  var dynamodb = new AWS.DynamoDB();

  var params = {
      TableName : "Students",
      KeySchema: [
          { AttributeName: "Id", KeyType: "HASH"},  //Partition key
          // { AttributeName: "TeacherId", KeyType: "RANGE" }  //Sort key
      ],
      AttributeDefinitions: [
          { AttributeName: "Id", AttributeType: "S" },
          { AttributeName: 'TeacherId',  AttributeType: 'S' }

      ],
      GlobalSecondaryIndexes: [
          {
            IndexName: 'TeacherId-index', /* required */
            KeySchema: [ /* required */
              {
                AttributeName: 'TeacherId', /* required */
                KeyType: 'HASH' /* required */
              },
              /* more items */
            ],
            Projection: { /* required */
              NonKeyAttributes: [
                'FirstName',
                'LastName'
                /* more items */
              ],
              ProjectionType: 'INCLUDE'
            },
            ProvisionedThroughput: { /* required */
              ReadCapacityUnits: 1, /* required */
              WriteCapacityUnits: 1 /* required */
            }
          },
          /* more items */
        ],

      ProvisionedThroughput: {
          ReadCapacityUnits: 10,
          WriteCapacityUnits: 10
      }
  };

  dynamodb.createTable(params, function(err, data) {
      if (err) {
          console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
      }
  });
}

function PopulateTable()
{
  student0 = {
    "Id":  "Eskicioglu-Murat M.",
    "TeacherId": "Ken",
    "FirstName":  "Murat M.",
    "LastName":  "Eskicioglu",
    "Photo": "http://sdfds"
   };

    student1 = {
      "Id":  "Wayne-John",
      "TeacherId": "Ken",
      "FirstName":  "John",
      "LastName":  "Wayne",
      "Photo": "http://sdfds"
    };

    student2 = {
      "Id":  "Eastwood-Clint'",
      "TeacherId": "Beck",
      "FirstName":  "Clint'",
      "LastName":  "Eastwood",
      "Photo": "http://sdfds"
    };

    PutItem(student1);
    PutItem(student2);
    PutItem(student0);

    for (var i = 0; i < 5; i++) {
        GetRandomStudent(function(err, randomStudent){
          if (!randomStudent) return;
          console.log(randomStudent);
          AddStudent(randomStudent, function(){});

        });
    }
}

function GetItems(id)
{
  var docClient = new AWS.DynamoDB.DocumentClient();
  var table = "Students";

}

function PutItem(item)
{
  var docClient = new AWS.DynamoDB.DocumentClient();
  var params = {
      TableName: "Students",
      Item: item
  };

  docClient.put(params, function(err, data) {
     if (err) {
         console.error("Unable to add movie", "movie.title", ". Error JSON:", JSON.stringify(err, null, 2));
     } else {
         console.log("PutItem succeeded:", "movie.title");
     }
  });
}


// var params = {
//   Bucket: 'studentappphotos', /* required */
//   Key: '5d8f-Jane Austin-profile.png', /* required */
//
// };
// s3.getObjectAcl(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else
//      console.log(data);           // successful response
//      console.log(data.Grants);           // successful response
// });
//
// var grants = [ { Grantee:
//     { DisplayName: 'murat.eskicioglu',
//       ID: '822295427642fdfa0014bd9ebdd73d10d3d8f6ab7021959c59d2baaecce1df19',
//       Type: 'CanonicalUser' },
//    Permission: 'READ' },
//  { Grantee:
//     { DisplayName: 'murat.eskicioglu',
//       ID: '822295427642fdfa0014bd9ebdd73d10d3d8f6ab7021959c59d2baaecce1df19',
//       Type: 'CanonicalUser' },
//    Permission: 'WRITE' },
//  { Grantee:
//     { DisplayName: 'murat.eskicioglu',
//       ID: '822295427642fdfa0014bd9ebdd73d10d3d8f6ab7021959c59d2baaecce1df19',
//       Type: 'CanonicalUser' },
//    Permission: 'READ_ACP' },
//  { Grantee:
//     { DisplayName: 'murat.eskicioglu',
//       ID: '822295427642fdfa0014bd9ebdd73d10d3d8f6ab7021959c59d2baaecce1df19',
//       Type: 'CanonicalUser' },
//    Permission: 'WRITE_ACP' },
//  { Grantee:
//     { Type: 'Group',
//       URI: 'http://acs.amazonaws.com/groups/global/AllUsers' },
//    Permission: 'READ' } ];
//
// var owner =    { DisplayName: 'murat.eskicioglu',
//      ID: '822295427642fdfa0014bd9ebdd73d10d3d8f6ab7021959c59d2baaecce1df19' };
//
// var publicReadACL = {
//   Owner: owner,
//   Grants: grants
// };
//
//
//    var params = {
//      Bucket: 'studentappphotos', /* required */
//      Key: '5d8f-Jane Austin-profile.png', /* required */
//      ACL: 'public-read',
//     //  AccessControlPolicy: {
//     //      Grants: grants,
//     //      Owner: owner
//     //    }
//    };
//    console.log('S3 putObjectAcl');
//    s3.putObjectAcl(params, function(err, data) {
//      if (err) console.log(err, err.stack); // an error occurred
//      else     console.log(data);           // successful response
//    });
//
// return;

// unicode test
//  a = 'h\u016b\u00ef'
// console.log(md5(a).substring(0,4));

// AddStudent(randomStudent);
//return;

// console.log(uuidV4()); // -> '110ec58a-a0f2-4ac4-8393-c866d813b8d1'
// DeleteStudent("5");
// AddStudent(student);
// CreateTable();
 // PopulateTable();
 // GetStudents("Ken", function(){});
 // return;
