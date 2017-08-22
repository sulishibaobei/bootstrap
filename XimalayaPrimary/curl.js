'use strict';
var http=require("http");
var request =require("request");
var server=http.createServer(function(req,res){
    if(req.url!=="/favicon.ico"){
        request.post({url: 'http://api.ximalaya.com/oauth2/secure_access_token', timeout: 3000, form: {client_id:'8a6ac9fa6af234963329f674d3513f95',device_id:'myweb',grant_type:'client_credentials',nonce:'7abe3tsfef',timestamp:'1453116822556',sig:'cab74d75d8744ad331c0283b0a18964d'}},
          function (error, response, data) {
             if (!error && response.statusCode == 200) {
                  console.log(data);
            } else {
                  console.log(data);
        }
        res.statusCode=200;
        res.sendDate=true;
        res.setHeader("Content-Type","text/plain");
        res.setHeader("Access-Control-Allow-Origin","*");
        res.write(data.toString());
        res.end();
     });
    }
});
server.listen(1053,"localhost",function(){
    console.log("开始监听...");
});

