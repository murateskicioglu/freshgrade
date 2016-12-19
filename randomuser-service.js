var Client = require('node-rest-client').Client;

module.exports = {
  getRandomStudent: function (resultfn) {
      GetRandomStudent(resultfn);
  }
};


function GetRandomStudent(fnCallback)
{
    var client = new Client();

    // direct way
    client.get("https://randomuser.me/api/", function (data, response) {
        // parsed response body as js object
        // console.log(data);
         if (!data.results || !data.results.length  )
         {
           fnCallback({err: "Service not available"}, null);
           return;
         }

        var randomStudent = data.results[0];
        console.log(randomStudent.name.first,randomStudent.name.last, randomStudent.picture);
        // raw response
        //console.log(response);
        fnCallback(null, {
          FirstName: randomStudent.name.first,
          LastName: randomStudent.name.last,
          Photo: randomStudent.picture.thumbnail,
          TeacherId: "Ben"
        });
    });
}
