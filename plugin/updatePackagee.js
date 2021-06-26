var user = []
var package_as = []

var request_1 = {"userid": "001", "x": "100", "y": "120"}
var request_2 = {"userid": "002", "x": "100", "y": "120"}

user[0] = "001"
package_as[0] = request_1

updatePackage({"userid": "001", "x": "200", "y": "320"}, user, package_as)

function updatePackage(request, db_user, db_package){
    if(db_user.length > 0){
        for (var i=0; i<db_user.length; i++)
        {
            if(db_user[i] === request.userid){
                console.log("Found, so update the date which be found to request's date...")
                console.log("old package: ")
                console.log(db_package[i])
                db_package[i] = request
                console.log("new package: ")
                console.log(db_package[i])
                return
            }
        }
    }else if(db_user.length == 0){
        console.log("Received the first request...")
        db_user[0] = request.userid
        db_package[0] = request
        console.log("new package: ")
        console.log(db_package)
    }
}