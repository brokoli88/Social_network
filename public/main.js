var allPeople;
var friendsNumber = [];
var friendsOfFriends = [];
var suggestedFriends = [];

function loadJSON(callback) {   
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', '/data.json', true); 
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    }
    xobj.send(null);  
}

function init() {
    loadJSON(function(response) {
        allPeople = JSON.parse(response);
        findPerson()
    })
}

//Find person by typing letters
function findPerson () {
    document.getElementById("people").innerHTML = "";
    suggestedFriends = [];
    friendsNumber = [];
    friendsOfFriends = [];

    for (var i = 0; i < allPeople.length; i++) {  
        var firstName = allPeople[i].firstName.toLowerCase();
        var surname = allPeople[i].surname.toLowerCase();
        var autocompleteText = autocomplete.value.toLowerCase();

        if (firstName.indexOf(autocompleteText) >= 0 || surname.indexOf(autocompleteText) >= 0) {
            const newOption = document.createElement("option");
            newOption.value = allPeople[i].firstName + allPeople[i].surname;
            document.getElementById("people").appendChild(newOption);
        }            
    }          
}

//Choose person and show all data
function choosePerson() {
    const searchValue = autocomplete.value;
    const choosenPerson = allPeople.filter(function(person) {
        var selectedPerson = person.firstName + person.surname;
        if (selectedPerson == searchValue) {
            document.getElementById('info').innerHTML = person.firstName + ' ' + person.surname + ', ' + person.age + ', ' + person.gender;
            document.getElementById('directFriends').innerHTML = 'Direct friends: ';
            document.getElementById('friendsOfFriends').innerHTML = 'Friends of friends: ';
            document.getElementById('suggestedFriends').innerHTML = 'Suggested friends: ';
            
            person.friends.forEach(function(entry) {
                friendsNumber.push(entry);
                for (var i=0; i < allPeople.length; i++) {
                    if (entry === allPeople[i].id ) {
                        friendsOfFriends.push( allPeople[i]);

                        node = document.createElement("LI"); 
                        textnode = document.createTextNode(allPeople[i].firstName + ' ' + allPeople[i].surname);     
                        node.appendChild(textnode);                              
                        document.getElementById("directFriends").appendChild(node); 

                        var friendsFriends = allPeople[i].friends;
                        friendsFriends.forEach(function(number) {
                            for (var j=0; j < allPeople.length; j++) {
                                if(number === allPeople[j].id && number !== person.id) {

                                    node = document.createElement("LI");                 
                                    textnode = document.createTextNode(allPeople[j].firstName + ' ' + allPeople[j].surname);       
                                    node.appendChild(textnode);                            
                                    document.getElementById("friendsOfFriends").appendChild(node); 
                                }
                            }
                        })
                    }
                } 
            }) 
            var count = 0;
            if(person.friends.length > 2) {
                allPeople.forEach( function(element) {
                    person.friends.forEach( function(index) {
                        if(element.friends.indexOf(index) > -1) {
                            count++;
                            if (count >= 2) {
                                friendsOfFriends.forEach( function(number) {
                                    if (person.friends.indexOf(element.id) == -1 && element.firstName !== person.firstName  &&  number.id !== element.id ) {
                                        textnode = document.createTextNode(element.firstName + element.surname);  
                                        document.getElementById('suggestedFriends').appendChild(node); 
                                    }
                                })
                            }
                        }
                    }) 
                })
            }
        }
    })
    autocomplete.value = ''; 
}; 

