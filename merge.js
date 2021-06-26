var user = []
var package_as = []

var request_1 = {"userid": "001", "x": "100", "y": "120"}
var request_2 = {"userid": "002", "x": "100", "y": "120"}

// user[0] = "001"
// package_as[0] = request_1

handleRequset(request_1, user, package_as) 

// received a request
function updatePackage(request, db_user, db_package){
    if(db_user.length > 0){
        for (var i=0; i<db_user.length; i++)
        {
            if(db_user[i] === request.userid){
                db_package[i] = request
                console.log("updated: ")
                console.log(db_package[i])
                console.log("new package: ")
                console.log(db_package)
                return
            }
        }
    }else if(db_user.length == 0){
        db_user[0] = request.userid
        db_package = request
        console.log(db_package)
    }
}

// received the first request
function init(request, db_user, db_package){
    if(db_user.length == 0){
        db_user[0] = request.userid
        db_package = request
        console.log("package: " + db_package)
    } 
}

// received a request that not in the array/db
function addInformation(request, db_user, db_package){
    console.log("old package: ")
    console.log(db_package)
    if(db_user.length > 0){
        for (var i=0; i<db_user.length; i++)
        {
            if(db_user[i] === request.userid){
                console.log("is found, not add any date")
                return
            }
        }
        console.log("not found, so add request's date...")
        db_package[db_user.length] = request
        console.log("new package: ")
        console.log(db_package)
    }else if(db_user.length == 0){
        db_user[0] = request.userid
        db_package = request
        console.log(db_package)
    }
}

// handleRequset for 3 status
function handleRequset(request, db_user, db_package){
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
        console.log("not found, so add request's date...")
        console.log("old package: ")
        console.log(db_package)
        db_package[db_user.length] = request
        console.log("new package: ")
        console.log(db_package)
    }else if(db_user.length == 0){
        console.log("Received the first request...")
        db_user[0] = request.userid
        db_package = request
        console.log("new package: ")
        console.log(db_package)
    }
}