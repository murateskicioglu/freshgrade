var validator = require('validator');
var config = require('config');

// Mandatory to have the config values at least in ./config/default.json, Exception otherwise
var titles = config.get('Titles');
var LIMIT = config.get('CharacterLimit');
var allowedPunctuations = config.get('AllowedPunctuations');
var pickMiddleAsFirstName = config.get('PickMiddleAsFirstName');

var patternPunctuations = new RegExp('['+allowedPunctuations+']', 'gi');
// unfortunately there is a dependency on the order longest pattern with overlapping patterns first
// var titles = ["Mrs", "PhD", "MSc", "Sir", "bin", "Mr", "Ms"];
var titles = titles.map(function(x){
    return x + "(\\.)*";
});
var patternToRemove = new RegExp(titles.join("|"), 'gi');

module.exports = {
  extractNameParts: function (fullname) {
      var response = defaultParser.ValidateInput(fullname);
      if (response.error) {
        return response;
      }

      // to use map to be able to chain
      name = [fullname];
      parsedName = name.map(defaultParser.FilterName).map(defaultParser.ParseFirstnameLastname)[0];
      return {
        status: 200,
        firstname: parsedName.firstname.trim(),
        lastname: parsedName.lastname.trim()
      }

  }
};

var defaultParser = {
  ValidateInput : function ValidateInput(name)
  {

    if (name.length > LIMIT)
    {
      return {
        status: 400,
        error: "Name too big"
      };
    }

    if (!validator.isAlphanumeric(name.replace(patternPunctuations,"")))
    {
      return {
        status: 400,
        error: "Name contains Illegal characters"
      };
    }

    return {
      status: 200
    }


  },

  FilterName : function FilterName(name)
  {
      name = name.replace(patternToRemove, "");
      return name.trim();
  },

  ParseFirstnameLastname : function ParseFirstnameLastname(name)
  {
    // 1- Rule if there is ,  assume  Lastname, Firstname
    var parsedName={};
    var nameparts = name.trim().split(',');
    if (nameparts.length == 2){
      // lastname, firstname
      parsedName.lastname = nameparts[0];
      parsedName.firstname = nameparts[1];
      return parsedName;
    }

    // Mr. Robert Downey Jr.
    if (nameparts.length == 1){
      // firstname lastname

      var re = /\s+/;
      nameparts = nameparts[0].split(re);


      if (nameparts.length == 1)
      {
        // single name no surname not allowed
        parsedName.firstname = nameparts[0];
        parsedName.lastname = '';
        return parsedName;
      }
      // common case
      if (nameparts.length == 2)
      {
        parsedName.lastname = nameparts[1];
        parsedName.firstname = nameparts[0];

      } else {
        if (pickMiddleAsFirstName){
          parsedName.lastname = nameparts[nameparts.length-1];
          parsedName.firstname = nameparts.slice(0,nameparts.length-1).join(' ');
        } else {
          parsedName.firstname = nameparts[0];
          parsedName.lastname = nameparts.slice(1,nameparts.length).join(' ');

        }
      }

    }

    return parsedName;
   }

};
