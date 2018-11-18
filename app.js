const express = require("express");
const bodyParser = require("body-parser");
const mongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
const mongoose = require("mongoose");

const app = express();
const jsonParser = bodyParser.json();
const url = "mongodb://localhost:27017/usersdb";

app.use(express.static(__dirname + "/public"));


app.get("/api/users", function(req, res){

    mongoClient.connect(url,{ useNewUrlParser: true },function(err,client){
      client.db("userdb").collection("users").find({}).toArray(function(err,users){
        res.send(users);
        client.close();
      });
    });
});


app.get("/api/users/:id",function(req,res){
    var id = new objectId(req.params.id);
    mongoClient.connect(url,{ useNewUrlParser: true },function(err,client){
      client.db("userdb").collection("users").findOne({_id: id}, function(err,user){
        res.send(user);
        client.close();
      });
    });
});




app.post("/api/users", jsonParser, function(req, res){
    if(!req.body) return res.sendStatus(400);

    var userName = req.body.name;
    var userAge = req.body.age;
    var user = {name: userName, age: userAge};

    mongoClient.connect(url, { useNewUrlParser: true }, function(err, client){
      client.db("userdb").collection("users").insertOne(user,function(err, result){
          if(err) return res.status(400).send();

          res.send(user);
          client.close();
      });
    });
});


app.delete("/api/users/:id", function(req, res){
    var id = new objectId(req.params.id);
    mongoClient.connect(url, {useNewUrlParser: true}, function(err,client){
      client.db("userdb").collection("users").findOneAndDelete({_id: id},function(err,result){

        if(err) return res.status(400).send();

        var user = result.value;
        res.send(user);
        client.close();
      });
    });
});
//редактирование
app.put("/api/users", jsonParser, function(req, res){
       
  if(!req.body) return res.sendStatus(400);
  var id = new objectId(req.body.id);
  var userName = req.body.name;
  var userAge = req.body.age;
    
  mongoClient.connect(url, {useNewUrlParser: true}, function(err, client){
      client.db("userdb").collection("users").findOneAndUpdate({_id: id}, { $set: {age: userAge, name: userName}},
           {returnOriginal: false },function(err, result){
            
          if(err) return res.status(400).send();
            
          var user = result.value;
          res.send(user);
          client.close();
      });
  });
});






app.listen(3000, function(){
  console.log("Сервер ожидает подключения...");
});