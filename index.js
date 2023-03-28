const connectToMongo = require("./db");

connectToMongo();
const express = require("express");
const app = express();
const port =process.env.PORT|| 5000;

app.use(express.json())
// available routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/doctors', require('./routes/doctors'))
app.use('/patient', require('./routes/patient'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
