var user_aera = []
var package_area = []

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
        db_package[0] = request
        console.log("new package: ")
        console.log(db_package)
    }
}