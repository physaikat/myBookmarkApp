/**
 * Created by 382029 on 4/2/2015.
 */
var bookmarkApi = require('./BookmarkAPI.js');
var express = require('express'),
    request = require('request');
var app = express();

app.post('/newfolder', function (req, res) {
    var body = "";
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        var reqHeaders = req.headers;
        var postBody = JSON.parse(body);
        console.log(body);
        var response = {};
        new bookmarkApi().insertData(postBody,function(err,data){
            if(err){
                console.log(err);
                response = {
                    "Msg":"Data couldn't be saved",
                    "Code":404
                };
            }
            else{
                console.log(data);
                response = {
                    "Msg":"Data saved successfully",
                    "Code":200
                };
            }
            console.log("sending response")
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(response));
        })

    });

});

app.get("/", function (req, res) {
    console.log("info", "request received ")
    //var responseHTML = '<html><head><title>upload</title></head><body><formaction="http://www.google.com"enctype="multipart/form-data"method="GET"><inputtype="file"name="upload"><br><inputtype="submit"value="upload"></form></body></html>';
    //res.setHeader("Content-Type", "text/html");
    res.sendFile(__dirname+'/home.html');
    //res.send(responseHTML)

})

app.get("/viewFolder?",function(req,res){
    var queryObj = {};
    var querySelect = {};
    if(isEmpty(req.query.foldername)){
        querySelect = {'_id':0};
    }
    else{
        queryObj = {'foldername':req.query.foldername};
        querySelect = {'_id':0};
    }
    console.log(req.query.foldername);
    var paramobj = {
        'DBName': "BOOKMARK_DB",
        'collectionName': "Bookmarks",
        'DBVersion': "2.6.1",
        'Query_obj': queryObj,
        'QuerySelect': querySelect
    };
    console.log(paramobj)
    new bookmarkApi().readData(paramobj,function(err,result){
        if(err){
            console.log(err);
            response = {
                "Msg":"Data not found",
                "Code":404
            };
        }
        else{
            console.log(result);
            response = {
                "Msg":"Data found successfully",
                "Code":200,
                "Data":result
            };
        }
        console.log("sending response")
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(response));

    })
})

app.delete('/deleteFolder?',function(req,res){
    var paramobj = {
        'DBName': "BOOKMARK_DB",
        'collectionName': "Bookmarks",
        'DBVersion': "2.6.1",
        'Query_obj':{'foldername':req.query.foldername}
    };
    new bookmarkApi().removeData(paramobj,function(err,data){
        if(err){
            console.log(err);
            response = {
                "Msg":"Data could not be deleted",
                "Code":404
            };
        }
        else{
            response = {
                "Msg":"Data deleted successfully",
                "Code":200
            };
        }
        console.log("sending response")
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(response));

    })
})

app.put('/updateFolder?',function(req,res) {
    var body = "";
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        var reqHeaders = req.headers;
        var postBody = JSON.parse(body);
        var paramobj = {
            'DBName': "BOOKMARK_DB",
            'collectionName': "Bookmarks",
            'DBVersion': "2.6.1",
            'Query_obj': {'foldername':req.query.foldername},
            'data_to_update': postBody,
            'options': {'upsert': true}
        };
        var response = {};
        new bookmarkApi().updateData(paramobj,function(err,data){
            if(err){
                console.log(err);
                response = {
                    "Msg":"Data couldn't be saved",
                    "Code":404
                };
            }
            else {
                console.log(data);
                response = {
                    "Msg":"Data saved successfully",
                    "Code":200
                };
            }
            console.log("sending response")
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(response));
        })
    })
})

app.put('/addDeleteBookmark',function(req,res){
    var body = "";
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        var reqHeaders = req.headers;
        var postBody = JSON.parse(body);
        var addRemoveFlag = postBody.IsRemove;
        var paramobj = {
            'DBName': "BOOKMARK_DB",
            'collectionName': "Bookmarks",
            'DBVersion': "2.6.1",
            'foldername':postBody.foldername,
            'bookmarkname':postBody.bookmarkDetails.name,
            'url':postBody.bookmarkDetails.url,
            'IsRemove':addRemoveFlag
        };
        var response = {};

        new bookmarkApi().addremovebookmark(paramobj,function(err,data){
            if(err){
                console.log(err);
                response = {
                    "Msg":"Failure",
                    "Code":404
                };
            }
            else {
                console.log(data);
                response = {
                    "Msg":"Success",
                    "Code":200
                };
            }
            console.log("sending response")
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(response));
        })
    })
})


function isEmpty(value) {
    return value === null
        || value === undefined
        || value === 'undefined'
        || value === 0
        || value === ""
        || JSON.stringify(value) === '{}'
        || JSON.stringify(value) === '[]';
}

var server = app.listen(8080, function () {

    var host = '10.0.0.51'
    var port = server.address().port

    console.log('ServiceDelay service listening at http://%s:%s', host, port);

});

