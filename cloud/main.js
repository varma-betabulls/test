// Use Parse.Cloud.define to define as many cloud functions as you want.
// For Signup:
Parse.Cloud.define("signUp", function(request, response) {
     var user = new Parse.User();	 
user.set("username", request.params.username);
user.set("password", request.params.password);
user.set("email", request.params.email);
user.set("user", request.params.user);


// other fields can be set just like with Parse.Object


user.signUp(null, {
  success: function(user) {
    // Hooray! Let them use the app now.
	 response.success('User Saved successfully!');
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
   
	 response.error('Uh oh, something went wrong');
  }
});
  

  
});

//user reset password

Parse.Cloud.define("resetPassword", function(request, response){
    var query = new Parse.Query(Parse.User);
    query.equalTo("email", request.params.email);
    query.find({
        success: function(results){
            if (results) {
                Parse.Cloud.useMasterKey();
				results.set("password", request.params.password);
                /* var password = request.params.password;
                console.log(results);
                results[0].setPassword(password); */
				results.save(); 
                response.success(1);
            };
        },
        error: function(){
            response.error("Error");
        }
    });
});


// signing location admin
Parse.Cloud.define("signUpForLocationAdmin", function(request, response) {
     var user = new Parse.User();
	 
	 
user.set("username", request.params.username);
user.set("firstname", request.params.firstname);
user.set("lastname", request.params.lastname);
user.set("password", request.params.password);
user.set("email", request.params.email);
user.set("phone", request.params.phone);
user.set("user", request.params.user);
user.set("Status", true);
user.set("locationId", request.params.locationId);


// other fields can be set just like with Parse.Object


user.signUp(null, {
  success: function(user) {
    // Hooray! Let them use the app now.
	 response.success('User Saved successfully!');
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
   
	 response.error('Uh oh, something went wrong');
  }
});
  

  
});


// updating admin information
Parse.Cloud.define("updateAdminInformation", function(request, response) {
	
	
    var user = new Parse.User();
    var query = new Parse.Query(Parse.User);
    query.equalTo("objectId", request.params.objectId);
    query.first({
      success: function(object) {
	     console.log(object);
		 Parse.Cloud.useMasterKey();
         object.set("firstname", request.params.firstname);
		 object.set("lastname", request.params.lastname);
		 object.set("username", request.params.username);
		 object.set("email", request.params.email);
		 object.set("phone", request.params.phone);
         object.save();
		 response.success('User updated successfully!');
      },
      error: function(error) {
         response.error('Uh oh, something went wrong');
      }
    });
	
});


Parse.Cloud.define("deleteImage", function(request, response) {
  Parse.Cloud.httpRequest({
  url: request.params.imgUrl,
  method: 'DELETE',
  headers: {
    'X-Parse-Application-Id': 'MLcbPuzJbmv1ZQcMjj9n',
    'X-Parse-Master-Key':    'JzFFPgdDeW7lo5x9LXbN'
  }
}).then(function(httpResponse) {
  console.log(httpResponse.text);
}, function(httpResponse) {
   console.error('Request failed with response code ' + httpResponse.status);
});
});


Parse.Cloud.define("updatePasswordToUser", function(request, response){
    Parse.Cloud.useMasterKey();

    var query = new Parse.Query(Parse.User);
    query.equalTo("username", request.params.username);

    query.first({
        success: function(theUser){
            var newPassword = request.params.password;
            console.log("New Password: " + newPassword);

            console.log("set: " + theUser.set("password", newPassword));
            console.log("setPassword: " + theUser.setPassword(newPassword));

            theUser.save(null,{
                success: function(theUser){
                    // The user was saved correctly
                    response.success("user updated successfully");
                },
                error: function(SMLogin, error){
                    response.error("No se pudo guardar la contraseña");
                }
            });
        },
        error: function(error){
            response.error("No se encontró al usuario");
        }
    });
});


// deleting admin information
/* Parse.Cloud.define("deleteAdminInformation", function(request, response) {
	
	
    var user = new Parse.User();
    var query = new Parse.Query(Parse.User);
    query.equalTo("objectId", request.params.objectId);
    query.first({
      success: function(object) {
	     console.log(object);
		 Parse.Cloud.useMasterKey();
         object.set("Status", false);
		 
         object.save();
		 response.success('User deleted successfully!');
      },
      error: function(error) {
         response.error('Uh oh, something went wrong');
      }
    });
	
}); */

Parse.Cloud.define('deleteAdminInformation', function(request, response) {                                                                                      
  Parse.Cloud.useMasterKey();                                                                                                                
  var query = new Parse.Query(Parse.User);                                                                                             
  query.get(request.params.objectId, {                                                                                                       
    success: function(user) {                                                                                          
      user.destroy({                                                                                                                        
        success: function() {                                                                                                               
          response.success('User deleted');                                                                                                  
        },                                                                                                                             
        error: function(error) {                                                                                                        
          response.error(error);                                                                                                        
        }                                                                                                                           
      });                                                                                                                                   
    },                                                                                                                                   
    error: function(error) {                                                                                                           
      response.error(error);                                                                                                              
    }                                                                                                                               
  });                                                                                                                                    
});

// signing location admin
Parse.Cloud.define("addingLocationId", function(request, response) {

			Parse.Cloud.useMasterKey();

			
			console.log("adminId:"+request.params.adminId);
			console.log("locationId:"+request.params.locationId);

			var query = new Parse.Query(Parse.User);
			query.equalTo("objectId", request.params.adminId);  // find all the women
			query.first({
			  success: function(user) {
				  
				 // console.log("username:"+user.get("username"));
				  
				  user.set("locationId",request.params.locationId);
				  
				  user.save(null, {

  			success: function(result) {

    			response.success("Success");

 			},

  			error: function(error) {

 			}

		  });

		},

		error: function() {

		  response.error("Failed");

		}

    });

  
});



// removing location admin
Parse.Cloud.define("removingLocationId", function(request, response) {

			Parse.Cloud.useMasterKey();

			
//console.log("adminId:"+request.params.adminId);
			console.log("locationId:"+request.params.locationId);

			var query1=new Parse.Query("DirectoryItem");
				query1.equalTo("LocationId",request.params.locationId);
				query1.find({
				 success:function (user){
					
					Parse.Object.destroyAll(user).then(
								
					);
				},
				error:function(error){
					response.error(error);
					}
				});
			 console.log("DirectoryItems are deleted");

			 var query2=new Parse.Query("Style");
				query2.equalTo("LocationId",request.params.locationId);
				query2.find({
				 success:function (user){
					
					Parse.Object.destroyAll(user).then(
								
					);
				},
				error:function(error){
					response.error(error);
					}
				});
			 console.log("Styles are deleted");

			 var query3=new Parse.Query("Phones");
				query3.equalTo("LocationId",request.params.locationId);
				query3.find({
				 success:function (user){
					
					Parse.Object.destroyAll(user).then(
								
					);
				},
				error:function(error){
					response.error(error);
					}
				});
			 console.log("Phones are deleted");
			 
			 var query15=new Parse.Query("Menu");
				query15.equalTo("LocationId",request.params.locationId);
				query15.find({
				 success:function (user){
					
					Parse.Object.destroyAll(user).then(
								
					);
				},
				error:function(error){
					response.error(error);
					}
				});
			 console.log("Menus are deleted");

			
			var query = new Parse.Query(Parse.User);
			query.equalTo("locationId", request.params.locationId);  // find all the women
			query.first({
			  success: function(user) {
				  
				 // console.log("username:"+user.get("username"));
				  
				  user.set("locationId","empty");
				  
				  user.save(null, {

  			success: function(result) {

    			response.success("Successfully location removed from user");

 			},

  			error: function(error) {

 			}

		  });

		},

		error: function() {

		  response.error("Failed");

		}

    });

  
});




