const express = require("express");
const app = express();
const https = require("https");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));  //To be able to render static local files like CSS and Image files

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
})


app.post("/", function(req,res){
  const fName = req.body.FirstName;
  const lName = req.body.LastName;
  const email = req.body.Email;

  const data = {
    members:[{
      email_address : email,
      status :"subscribed",
      merge_fields :{
        FNAME : fName,
        LNAME:lName
                    }
    }

            ]
            }
//Remember JSON.stringify converts a JSON object into its simpler version
  const jsonData = JSON.stringify(data); //This data is what we will be sending to mailchimp


//Now we should make a GET requet to Mailchimp's server to store this const jsonData
const url = "https://us4.api.mailchimp.com/3.0/lists/a490e63859";
const options = {
  method : 'POST',
  auth : "manaswini:083665b2983f14bc2fd74385bd2fd290-us4"
}
const request = https.request(url, options, function(response){
  response.on("data", function(data){
    const receivedData = JSON.parse(data);
    console.log(receivedData.error_count);
    if(receivedData.error_count ==0){
        res.sendFile(__dirname + "/success.html");
    }

    else{
      res.sendFile(__dirname + "/failure.html");
    }
  })
})

request.write(jsonData);
request.end();

})

app.post("/failure", function(req, res){
  res.redirect("/");
})


app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running at port 3000");
})


//API Key
//083665b2983f14bc2fd74385bd2fd290-us4

//List id
//a490e63859
