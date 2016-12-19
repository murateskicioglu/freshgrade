var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
var s3 = new AWS.S3();

var fs = require('fs');
var S3FS = require('s3fs');
var md5 = require('js-md5');

module.exports = {
  uploadProfilePicture: function (student, fullFileName, resultfn) {
      UploadProfilePicture(student, fullFileName, resultfn);
    }
};

function UploadProfilePicture(student, filename, resultfn)
{
  console.log('UploadProfilePicture', filename, resultfn);
  var bucketPath = 'studentappphotos';
  var s3Options = {
    region: 'us-east-1',

  };

  var s3fsImpl = new S3FS(bucketPath, s3Options);
  var stream = fs.createReadStream(filename);
  var s3name =  student + '-profile';
  prefix = md5(s3name).substring(0,4);
  var pos = filename.lastIndexOf('.');
  var extension = filename.substring(pos)
  s3name = prefix + '-' + s3name + extension;
  return s3fsImpl.writeFile(s3name, stream).then(function () {
      fs.unlink(filename, function (err) {
          if (err) {
              console.error(err);
              return resultfn(err);
          }

          var params = {
            Bucket: bucketPath, /* required */
            Key: s3name, /* required */
            ACL: 'public-read'
          };
          console.log('S3 putObjectAcl');
          s3.putObjectAcl(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
          });

          var s3url = 'https://s3.amazonaws.com/studentappphotos/' + encodeURIComponent(s3name);
          resultfn(null, s3url)
      });

  });
}
