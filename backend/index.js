const connectToMongo=require('./DB');
const express = require('express')
var cors=require('cors');
connectToMongo();

const app = express();
const port = 5000

app.use(cors())
app.use(express.json())
// this middleware is used to use access req body

//Available Routes,,Using app.use() to link with our routes created
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

