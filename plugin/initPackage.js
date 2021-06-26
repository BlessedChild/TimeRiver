var user = []
var package_as = {}

var request_1 = {"userid": "001", "x": "100", "y": "120"}
var request_2 = {"userid": "002", "x": "100", "y": "120"}

init(request_1, user, package_as)

function init(request, db_user, db_package){
    if(db_user.length == 0){
        console.log("Received the first request...")
        db_user[0] = request.userid
        db_package[0] = request
        console.log("new package: ")
        console.log(db_package)
    } 
}