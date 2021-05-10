const express = require("express");
const monk = require("monk");
const Joi = require("@hapi/joi");
const { nanoid } = require('nanoid')

require("dotenv").config();


const port = process.env.PORT || 5000;


const app = express();
const db = monk(process.env.DB_URL);
const tiny = db.get("url");

app.use(express.json());
app.use(express.static('./public'))

db.then(() => {
  console.log("Mongo Connected");
}).catch((e) => {
  console.log(e);
});

const schema = Joi.object({
  url: Joi.string().uri().required(),
  slug: Joi.required()
});

app.get('/:slug',async(req,res)=>{
    const { slug } = req.params;

    const slugFound =  await tiny.findOne({slug: slug})
    if(slugFound){
        res.redirect(slugFound.url)
    }
    else{
        res.json({
            message: 'Slug do not Exits'
        })
    }
})


app.post("/create", async (req, res) => {
  const slugFound = await tiny.findOne({ slug: req.body.slug });
  if (slugFound) {
    res.status(500).json({
      message: "Slug in use",
    });
  } else {
    const { error } = schema.validate(req.body);

    if (error) {
      res.json(error);
    } else {
      const tinyData = {
        url: req.body.url,
        slug: req.body.slug || nanoid().substring(0,5),
      };

      tiny.insert(tinyData).then(data => {
          res.json(data)
      })
    }
  }
});

app.listen(port, () => {
  console.log("Listening on port: ", port);
});
