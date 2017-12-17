const express = require("express");
const sqlCon = require("../config/database");
const router = express.Router();

const db = sqlCon.connection;

//Add a new route
router.post("/new", (req, res)=>{
    const routeNum = req.body.routeNum;
    const routeStart = req.body.routeStart;
    const routeEnd = req.body.routeEnd;
    var routeStops = req.body.routeStops;

    if(routeStops != null){
        routeStops = routeStops.split(" ");
    } else{
        routeStops = [];
    }

    routeStops.unshift(routeStart);
    routeStops.push(routeEnd);

    while(routeStops.includes("")){
        routeStops.splice(routeStops.indexOf(""), 1);
        console.log(routeStops);
    }

    var sql = "INSERT INTO route(route_num, start, end) VALUES (?, ?, ?);";

    db.query(sql, [routeNum, routeStart, routeEnd],(error, result)=>{
        if(error){
            console.log(error);
            return res.json({success: false, msg: "Failed to add route to the system"});
        } else{
            var sql2 = "SELECT route_id FROM route WHERE route_num=? AND start=? AND end=?;";

            db.query(sql2, [routeNum, routeStart, routeEnd], function(error, foundID){
                if(error){
                    console.log(error);
                    return res.json({success: false, msg: "Failed to add route to the system"});
                } else{
                    var routeID = foundID[0].route_id;
                    for(var i=0; i<routeStops.length; i++){
                        var sql3 = "INSERT INTO route_stop VALUES (?, ?, ?);";
                        db.query(sql3, [routeID, routeStops[i], (i+1)], function(error, stop){
                            if(error){
                                console.log(error);
                                return res.json({success: false, msg: "Failed to add route to the system"});
                            } else{
                                console.log("Added stop to database");
                            }
                        });
                    }
                }
            });
            console.log("Route added to the database");
            return res.json({success:true, msg: "Route successfully added to the database"})
        }
    });
});

//Search for a route
router.post("/search", (req, res)=>{
    const routeNum = req.body.routeNum;
    const city = req.body.city;

    var sql1 = "SELECT DISTINCT route_id " +
        "FROM route NATURAL LEFT JOIN route_stop " +
        "WHERE route_num LIKE \"%" + routeNum + "%\" AND stop LIKE \"%" + city + "%\";";

    db.query(sql1, (error, foundIDs)=>{
        if(error){
            console.log(error);
            return res.json({success: false, msg: "Could not the complete the search"});
        } else{
            if(foundIDs.length === 0){
                return res.json({success: false, msg: "Could not find the requested route"});
            } else{
                var output = [];
                
                foundIDs.forEach((foundID)=>{
                    var route = {
                        routeID: "",
                        routeNum: "",
                        routeStart: "",
                        routeEnd: "",
                        routeStops: []
                    };

                    var sql2 = "SELECT * FROM route WHERE route_id=?;";
                    var sql3 = "SELECT * FROM route_stop WHERE route_id=? ORDER BY route_id ASC, stop_num ASC";

                    db.query(sql2, [foundID.route_id], (error, foundRoutes)=>{
                        if(error){
                            console.log(error);
                        } else{
                            console.log(foundRoutes[0].route_id);
                            route.routeID = foundRoutes[0].route_id;
                            route.routeNum = foundRoutes[0].route_num;
                            route.routeStart = foundRoutes[0].start;
                            route.routeEnd = foundRoutes[0].end;

                            db.query(sql3, [foundID.route_id], (error, foundStops)=>{
                                if(error){
                                    console.log(error);
                                } else{
                                    foundStops.forEach((foundStop)=>{
                                        route.routeStops.push(foundStop.stop);
                                    });
                                }
                            });
                            output.push(route);
                        }
                    });
                });

                for(var i=0; i<foundIDs.length; i++){

                }
                setTimeout(()=>{
                    return res.json({success: true, msg:output})
                }, 1000);
            }
        }
    });
});

//Delete a route
router.post("/:id/delete", (req, res)=>{
    var routeID = req.params.id;

    var sql1 = "DELETE FROM route_stop WHERE route_id=?;";
    var sql2 = "DELETE FROM route WHERE route_id=?;";

    db.query(sql1, [routeID], (error, deletedRoute)=>{
        if(error){
            console.log(error);
            return res.json({success: false, msg: "The requested route couldn't be deleted"});
        } else{
            db.query(sql2, [routeID], (error, deletedStops)=>{
                if(error){
                    console.log(error);
                    return res.json({success: false, msg: "The requested route stops couldn't be deleted"});
                } else{
                    console.log("Route deleted");
                    return res.json({success: true, msg: "The requested route was deleted"});
                }
            })
        }
    })
});

//Edit a route - going to the edit page
router.get("/:id/edit", (req, res)=>{
    var routeID = req.params.id;

    var sql1 = "SELECT * FROM route WHERE route_id=?;";
    var sql2 = "SELECT * FROM route_stop WHERE route_id=? ORDER BY route_id ASC, stop_num ASC;";

    var routeToEdit = {
        routeID: "",
        routeNum: "",
        routeStart: "",
        routeEnd: "",
        routeStops: []
    };

    db.query(sql1, [routeID], (error, foundRoute)=>{
        if(error){
            console.log(error);
            return res.json({success:false, msg:"The route couldn't be found"});
        } else{
            routeToEdit.routeID = foundRoute[0].route_id;
            routeToEdit.routeNum = foundRoute[0].route_num;
            routeToEdit.routeStart = foundRoute[0].start;
            routeToEdit.routeEnd = foundRoute[0].end;

            db.query(sql2, [routeID], (error, foundStops)=>{
                if(error){
                    console.log(error);
                    return res.json({success:false, msg:"The route stops couldn't be found"});
                } else{
                    foundStops.forEach((foundStop)=>{
                        routeToEdit.routeStops.push(foundStop.stop);
                    });
                    routeToEdit.routeStops.pop();
                    routeToEdit.routeStops.shift();

                    setTimeout(()=>{
                        return res.json({success:true, msg:routeToEdit});
                    }, 1000);
                }
            });

        }

    });

});

//Edit a route - handling the edit logic
router.post("/:id/edit", (req, res)=>{
    const routeID = req.params.id;
    const routeNum = req.body.routeNum;
    const routeStart = req.body.routeStart;
    const routeEnd = req.body.routeEnd;
    var routeStops = req.body.routeStops;

    if(routeStops != null){
        routeStops = routeStops.split(" ");
    } else{
        routeStops = [];
    }

    routeStops.unshift(routeStart);
    routeStops.push(routeEnd);

    while(routeStops.includes("")){
        routeStops.splice(routeStops.indexOf(""), 1);
        console.log(routeStops);
    }

    var sql1 = "UPDATE route SET route_num=?, start=?, end=? WHERE route_id=?;";
    var sqlDel = "DELETE from route_stop WHERE route_id=?;";

    db.query(sql1, [routeNum, routeStart, routeEnd, routeID], (error, updatedRoute)=>{
        if(error){
            console.log(error);
            return res.json({success: false, msg: "The route couldn't be updated"});
        } else{
            console.log("The route successfully updated");

            db.query(sqlDel, [routeID], (error, deletedStops)=>{
                if(error){
                    console.log(error);
                    return res.json({success: false, msg: "The stops couldn't be deleted"});
                } else{
                    console.log("Stops deleted successfully");

                    for(var i=0; i<routeStops.length; i++){
                        var sql3 = "INSERT INTO route_stop VALUES(?, ?, ?);";
                        db.query(sql3, [routeID, routeStops[i], (i+1)], function(error, stop){
                            if(error){
                                console.log(error);
                                return res.json({success: false, msg: "Failed to add stop to the database"});
                            } else{
                                console.log("Added stop to the database");
                            }
                        });
                    }
                    return res.json({success: true, msg: "The route successfully updated"});
                }
            });
        }
    });

});

module.exports = router;