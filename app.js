const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

require("dotenv").config();

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT;
const apikey = process.env.MAILCHIMP_API_KEY;
const listid = process.env.MAILCHIMP_LIST_ID;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

// Manage post request on home route and
// Send data to the MailChimp account via API
app.post("/", function (req, res) {
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = `https://us19.api.mailchimp.com/3.0/lists/${listid}`;
  const options = {
    method: "POST",
    auth: `201951173:${apikey}`,
  };

  const request = https.request(url, options, function (response) {
    if(response.statusCode===200){
      res.sendFile(__dirname+"/success.html");
    }else{
      res.sendFile(__dirname+"/failure.html");
    }
    // console.log(response.statusCode);
    response.on("data", function (data) {
      // console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

// Failure route
app.post("/failure",function(req,res){
  res.redirect("/");
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

