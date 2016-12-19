var nameparser = require('../name-parser.js');

function assert(expected, actual)
{
  if (expected == actual)
  {
    console.log("TEST PASS");
  }
  else {
    console.log("TEST FAIL", " Expected: ", expected, " Actual: ", actual);
  }
}

function test(fullname, firstname, lastname)
{
  var parsedName = nameparser.extractNameParts(fullname);
  assert(firstname,parsedName.firstname);
  assert(lastname,parsedName.lastname);

}

// var fullname = 'Eskicioglu, Murat';
// var parsedName = nameparser.extractNameParts(fullname);
// assert('Murat',parsedName.firstname);
// assert('Eskicioglu',parsedName.lastname);

// var allowedPunctuations = " \\.,\'\"-";
// var patternPunctuations = new RegExp('['+allowedPunctuations+']', 'gi');
// var LIMIT = 200;
// var PickMiddleAsFirstName = true;
// var titles = ["Mr", "Ms", "Mrs", "Jr", "PhD", "MSc", "Sir", "bin"];


test("Eskicioglu, Murat", "Murat", "Eskicioglu");
test("Eskicioglu, Murat Mahmut", "Murat Mahmut", "Eskicioglu");
test("Kennedy, John F.", "John F.", "Kennedy");
test("Cook, John PhD.", "John", "Cook");
// Msc.,  M.Sc.: not supported
test("Msc. Carrie-Anne Moss", "Carrie-Anne", "Moss");
// ?? forgotten period ???
test("Mrs Carrie-Anne Moss", "Carrie-Anne", "Moss");

test("Carrie-Anne Moss", "Carrie-Anne", "Moss");
test("Mr. Murat Eskicioglu", "Murat", "Eskicioglu");
test(" Mrs. Ann Brown", "Ann", "Brown");
test("Sir tim berners-lee", "tim", "berners-lee");

// Jose Maria Fernandes
test("Carrie-Anne Moss", "Carrie-Anne", "Moss");
// is Maria part of surname

// what to do if there are more than 1 ???
test("Jose Huan Antonio Fernandes", "Jose Huan Antonio", "Fernandes");
test("Jose Huan Antonio Fernandes-Lopez", "Jose Huan Antonio", "Fernandes-Lopez");

// special combinations   Jr part of lastname or firstname
test("Downey, Robert Jr.", "Robert Jr.", "Downey");
test("Al-cabir bin Sayid", "Al-cabir", "Sayid");
test("Jean d'Arc", "Jean", "d'Arc");
test("Darya' Kuzmanov", "Darya'", "Kuzmanov");

// Unicode not supported yet
//test("\u0180Darya' Kuzmanov", "\u0180Darya'", "Kuzmanov");

// incorrect inputs
test("!@#$<>#$#$#", null, null);
var bigname = Array(3000).join("a");
test(bigname, null, null);
