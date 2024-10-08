const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()
//hello
const app = express()
app.use(cors())
app.use(express.json({ limit: "10mb" }))

const PORT = process.env.PORT || 8080

//mongodb connection
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Connect to Database"))
    .catch((err) => console.log(err))

//schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    confirmPassword: String,
    image: String,
})

const userModel = mongoose.model("user", userSchema)

//api
app.get("/", (req, res) => {
    res.send("Server is running")
})

//signup
app.post("/signup", async (req, res) => {
    console.log(req.body)
    const { email } = req.body

    userModel.findOne({ email: email }, (err, result) => {
        console.log(result)
        console.log(err);
        if (result) {
            res.send({ message: "Email id is already register", alert: false });
        } else {
            const data = userModel(req.body);
            const save = data.save();
            res.status(200).send({ message: "Successfully sign up", alert: true });
        }
    });
})
//edited on github directly
//api login
app.post("/login", (req, res) => {
    console.log(req.body)
    const { email } = req.body
    userModel.findOne({ email: email }, (err, result) => {
        if (result) {
            const dataSend = {
                _id: result._id,
                fristName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                image: result.image,
            }
            console.log(dataSend)
            res.send({ message: "Login is successfully", alert: true, data: dataSend })
        } else {
            res.send({ message: "Email is not available, Please sign up", alert: false })
        }
    })
})

//product section

const schemaProduct = mongoose.Schema({
    name: String,
    category: String,
    image: String,
    price: String,
    description: String,
})
const productModel = mongoose.model("product", schemaProduct)


//save product in data
//api
app.post("/uploadProduct", async (req, res) => {
    console.log(req.body)
    const data = productModel(req.body)
    const datasave = await data.save()
    res.send({ message: "Upload successfully" })
})

//
app.get("/product", async (req, res) => {
    const data = await productModel.find({})
    res.send(JSON.stringify(data))
})

app.listen(PORT, () => console.log("sarver is running at port : " + PORT))
