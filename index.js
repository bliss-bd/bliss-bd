const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
// let testAccount = nodemailer.createTestAccount();
const transporter = nodemailer.createTransport({
    host:process.env.HOST,
    port: process.env.PORT || 465,
    secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

const sendEmail = (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    text,
    html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mxnk8qu.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const productCollection = client.db("bliss").collection("products");
    const orderCollection = client.db("bliss").collection("orders");
    const usersCollection = client.db("bliss").collection("users");

    // product collection
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query).sort({ time: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    app.get("/productWomen", async (req, res) => {
      const categories = req.query.category;

      let query = {};
      if (categories && Array.isArray(categories)) {
        query = {
          category: { $in: categories },
        };
      } else if (categories) {
        query = {
          category: categories,
        };
      }

      const result = await productCollection.find(query).sort({ time: -1 }).toArray();
      res.send(result);
    });


    app.get("/productMen", async (req, res) => {
      const categories = req.query.category;

      let query = {};
      if (categories && Array.isArray(categories)) {
        query = {
          category: { $in: categories },
        };
      } else if (categories) {
        query = {
          category: categories,
        };
      }

      const result = await productCollection.find(query).sort({ time: -1 }).toArray();
      res.send(result);
    });


    app.delete("/allproduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/allproducts", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });



    app.get("/advertiseProducts", async (req, res) => {
      const isAdvertised = req.query.isAdvertised;

      // Check if the isAdvertised parameter is explicitly set to "true"
      if (isAdvertised === "1") {
        const query = {
          isAdvertised: true,
        };

        const result = await productCollection.find(query).sort({ time: -1 }).toArray();
        res.send(result);
      } else {
        // If category is not set to "true", return an empty response
        res.send([]);
      }
    });


    app.get("/topSell", async (req, res) => {
      const isTopSell = req.query.isTopSell;

      // Check if the isTopSell parameter is explicitly set to "true"
      if (isTopSell === "1") {
        const query = {
          isTopSell: true,
        };

        const result = await productCollection.find(query).sort({ time: -1 }).toArray();
        res.send(result);
      } else {
        // If category is not set to "true", return an empty response
        res.send([]);
      }
    });


    app.put("/advertiseProduct/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          isAdvertised: status,
        },
      };
      const result = await productCollection.updateOne(query, updatedDoc, options);
      res.send(result);
    });

    app.put("/removeAdvertiseProduct/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          isAdvertised: status,
        },
      };
      const result = await productCollection.updateOne(query, updatedDoc, options);
      res.send(result);
    });

    app.put("/topSell/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          isTopSell: status,
        },
      };
      const result = await productCollection.updateOne(query, updatedDoc, options);
      res.send(result);
    });

    app.put("/removeTopSell/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          isTopSell: status,
        },
      };
      const result = await productCollection.updateOne(query, updatedDoc, options);
      res.send(result);
    });

    // USER COLLECTION

    app.get('/admin/allusres/:email', async (req, res) => {
      const email = req.params.email
      const query = { email }
      const result = await usersCollection.findOne(query)
      res.send(result);
    })

    app.get('/users/:email', async (req, res) => {
      const email = req.params.email
      const query = { email }
      const result = await usersCollection.findOne(query)
      res.send(result);
    })

    app.post("/users", async (req, res) => {
      const query = req.body;
      const result = await usersCollection.insertOne(query);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = usersCollection.find(query).sort({ time: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.put("/verifyuser/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          isVerifyed: status,
        },
      };
      const result = await usersCollection.updateOne(query, updatedDoc, options);
      res.send(result);
    });

    app.delete("/allusers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });


    // ORDERS COLLECTIONS
    app.post('/order', async (req, res) => {
      const product = req.body;
      const result = await orderCollection.insertOne(product);
      function createRowHtml(item) {
        return `
        <tr>
        <td class="esd-structure es-p20t es-p20r es-p20l esdev-adapt-off" align="left" bgcolor="#ffffff" style="background-color: #ffffff;" esdev-config="h1">
        <table width="560" cellpadding="0" cellspacing="0" class="esdev-mso-table">
          
        <td class="esdev-mso-td" valign="top">
        <table cellpadding="0" cellspacing="0" class="es-left" align="left">
            <tbody>
                <tr>
                    <td width="125" class="esd-container-frame" align="left">
                        <table cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                                <tr>
                                    <td align="center" class="esd-block-image es-m-p15l" style="font-size: 0px;"><a target="_blank" href><img class="adapt-img p_image" src="${item.picture}" alt="${item.name}" style="display: block; font-size: 12px;" width="125" title="Marshall Monitor"></a></td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
      </td>
      <td width="20"></td>
      <td class="esdev-mso-td" valign="top">
        <table cellpadding="0" cellspacing="0" class="es-left" align="left">
            <tbody>
                <tr>
                    <td width="125" align="left" class="esd-container-frame">
                        <table cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                                <tr>
                                    <td align="left" class="esd-block-text es-m-txt-l es-p20t es-p20b es-m-p0">
                                        <h3><strong class="p_name">${item.name}</strong></h3>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
      </td>
      <td width="20"></td>
      <td class="esdev-mso-td" valign="top">
        <table cellpadding="0" cellspacing="0" class="es-left" align="left">
            <tbody>
                <tr>
                    <td width="176" align="left" class="esd-container-frame">
                        <table cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                                <tr>
                                    <td align="right" class="esd-block-text es-p20t es-p20b es-m-p0t es-m-p0b">
                                        <p style="color: #666666;" class="p_description">x${item.quantity} <br> ${item.size}</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
      </td>
      <td width="20"></td>
      <td class="esdev-mso-td" valign="top">
        <table cellpadding="0" cellspacing="0" class="es-right" align="right">
            <tbody>
                <tr>
                    <td width="74" align="left" class="esd-container-frame">
                        <table cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                                <tr>
                                    <td align="right" class="esd-block-text es-p20t es-p20b es-m-p0t es-m-p0b">
                                    <p class="p_price">${parseFloat(item.price).toFixed(2)} Taka</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
      </td>
      </tr>
      </tbody>
      </table>
      </td>
      </table>
      </td>
      </tr>
        `;
      }
      
      const rows = product.cartItems.map(item => createRowHtml(item)).join('');
      
      const finalHtml = `<tbody id="container-id">${rows}</tbody>`;

      const htmlContentClient = `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <title></title>
    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
</head>

<body data-new-gr-c-s-loaded="14.1119.0">
    <div class="es-wrapper-color">
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td class="esd-email-paddings" valign="top">
                        <table cellpadding="0" cellspacing="0" class="esd-header-popover es-header" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe" align="center" bgcolor="#ffffff" style="background-color: #ffffff;">
                                        <table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0" cellspacing="0" width="600">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-structure es-p20t es-p20r es-p20l" align="left">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="560" class="esd-container-frame" align="center" valign="top">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-image es-m-txt-c" style="font-size: 0px;"><a target="_blank" href><img src="https://duzuwz.stripocdn.email/content/guids/CABINET_9744fc272e8889ef4a8678d339842dc964f4612d4128988fec9f0f4ef36c0f64/images/logo2.png" alt="Logo" style="display: block; font-size: 12px;" width="120" title="Logo"></a></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-text" bgcolor="#ffffff">
                                                                                        <h1> ${product.name} - Your order is on its way!</h1>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table cellpadding="0" cellspacing="0" class="es-content esd-footer-popover" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe" align="center" bgcolor="#ffffff" style="background-color: #ffffff;">
                                        <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-structure es-p20t es-p20r es-p20l" align="left">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="560" class="esd-container-frame" align="center" valign="top">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="left" class="esd-block-text es-m-txt-c es-p20t" bgcolor="#ffffff">
                                                                                        <p style="color: #a0937d;">ITEMS ORDERED</p>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-spacer es-p5t es-p5b" style="font-size:0" bgcolor="#ffffff">
                                                                                        <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td style="border-bottom: 1px solid #a0937d; background: none; height: 1px; width: 100%; margin: 0px;"></td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                       
                                                ${finalHtml}
                                                <tr>
                                                    <td class="esd-structure es-p20r es-p20l" align="left">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="560" class="esd-container-frame" align="center" valign="top">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-spacer es-p5t es-p5b" style="font-size:0" bgcolor="#ffffff">
                                                                                        <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td style="border-bottom: 1px solid #a0937d; background: none; height: 1px; width: 100%; margin: 0px;"></td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="esd-structure es-p20r es-p20l esdev-adapt-off" align="left" bgcolor="#ffffff" style="background-color: #ffffff;">
                                                        <table width="560" cellpadding="0" cellspacing="0" class="esdev-mso-table">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="esdev-mso-td" valign="top">
                                                                        <table cellpadding="0" cellspacing="0" class="es-left" align="left">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td width="466" class="esd-container-frame" align="left">
                                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td align="left" class="esd-block-text es-p5r es-p10l" bgcolor="#ffffff">
                                                                                                        <p style="line-height: 150%;">Subtotal<br>Delivery Charge<br><b>Total (${product.cartItems.length} item) </b></p>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                    <td width="20"></td>
                                                                    <td class="esdev-mso-td" valign="top">
                                                                        <table cellpadding="0" cellspacing="0" class="es-right" align="right">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td width="74" align="left" class="esd-container-frame">
                                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td align="right" class="esd-block-text" bgcolor="#ffffff">
                                                                                                        <p>${product.subTotal} Taka<br>${product.deliveryCharge} Taka <br><strong>${product.totalPrice} Taka</strong></p>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="esd-structure es-p20t es-p20r es-p20l" align="left">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="560" class="esd-container-frame" align="center" valign="top">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="left" class="esd-block-text es-p20t es-m-txt-l" bgcolor="#ffffff">
                                                                                        <p style="color: #a0937d;">SHIPPING ADDRESS</p>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-spacer es-p5t es-p5b" style="font-size:0">
                                                                                        <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td style="border-bottom: 1px solid #a0937d; background: none; height: 1px; width: 100%; margin: 0px;"></td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" class="esd-block-text es-m-txt-l" bgcolor="#ffffff">
                                                                                        <p>${product.district}<br>${product.address}</p>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-social es-p15t es-p15b" style="font-size:0">
                                                                                        <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social">
                                                                                            <tbody>
                                                                                            <tr>
                                                                                            <td align="center" valign="top" class="es-p10r">
                                                                                                <a target="_blank" href='https://www.facebook.com/blissclothingbangladesh'>
                                                                                                    <img src="https://duzuwz.stripocdn.email/content/assets/img/social-icons/circle-colored/facebook-circle-colored.png" alt="Fb" title="Facebook" width="32">
                                                                                                </a>
                                                                                            </td>
                                                                                            <td align="center" valign="top" class="es-p10r">
                                                                                                <a target="_blank" href='https://www.instagram.com/blissclothingbd/'>
                                                                                                    <img src="https://duzuwz.stripocdn.email/content/assets/img/social-icons/circle-colored/instagram-circle-colored.png" alt="Ig" title="Instagram" width="32">
                                                                                                </a>
                                                                                            </td>
                                                                                            <td align="center" valign="top" class="es-p10r">
                                                                                                <a target="_blank" href='https://www.tiktok.com/@blissbd'>
                                                                                                    <img src="https://duzuwz.stripocdn.email/content/assets/img/social-icons/circle-colored/tiktok-circle-colored.png" alt="Tt" title="TikTok" width="32">
                                                                                                </a>
                                                                                            </td>
                                                                                            <td align="center" valign="top">
                                                                                                <a target="_blank" href>
                                                                                                    <img src="https://duzuwz.stripocdn.email/content/assets/img/social-icons/circle-colored/youtube-circle-colored.png" alt="Yt" title="Youtube" width="32">
                                                                                                </a>
                                                                                            </td>
                                                                                        </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-text es-m-txt-l es-p10b" bgcolor="#ffffff">
                                                                                        <p><b>BE BOLD BE BLISS</b></p>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>
      `;
      const htmlContentOrder = `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <title></title>
    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
</head>

<body data-new-gr-c-s-loaded="14.1119.0">
    <div class="es-wrapper-color">
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td class="esd-email-paddings" valign="top">
                        <table cellpadding="0" cellspacing="0" class="esd-header-popover es-header" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe" align="center" bgcolor="#ffffff" style="background-color: #ffffff;">
                                        <table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0" cellspacing="0" width="600">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-structure es-p20t es-p20r es-p20l" align="left">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="560" class="esd-container-frame" align="center" valign="top">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-image es-m-txt-c" style="font-size: 0px;"><a target="_blank" href><img src="https://duzuwz.stripocdn.email/content/guids/CABINET_9744fc272e8889ef4a8678d339842dc964f4612d4128988fec9f0f4ef36c0f64/images/logo2.png" alt="Logo" style="display: block; font-size: 12px;" width="120" title="Logo"></a></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-text" bgcolor="#ffffff">
                                                                                        <h1> You have a new order!</h1>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table cellpadding="0" cellspacing="0" class="es-content esd-footer-popover" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe" align="center" bgcolor="#ffffff" style="background-color: #ffffff;">
                                        <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-structure es-p20t es-p20r es-p20l" align="left">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="560" class="esd-container-frame" align="center" valign="top">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="left" class="esd-block-text es-m-txt-c es-p20t" bgcolor="#ffffff">
                                                                                        <p style="color: #a0937d;">ITEMS ORDERED</p>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-spacer es-p5t es-p5b" style="font-size:0" bgcolor="#ffffff">
                                                                                        <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td style="border-bottom: 1px solid #a0937d; background: none; height: 1px; width: 100%; margin: 0px;"></td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                       
                                                ${finalHtml}
                                                <tr>
                                                    <td class="esd-structure es-p20r es-p20l" align="left">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="560" class="esd-container-frame" align="center" valign="top">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-spacer es-p5t es-p5b" style="font-size:0" bgcolor="#ffffff">
                                                                                        <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td style="border-bottom: 1px solid #a0937d; background: none; height: 1px; width: 100%; margin: 0px;"></td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="esd-structure es-p20r es-p20l esdev-adapt-off" align="left" bgcolor="#ffffff" style="background-color: #ffffff;">
                                                        <table width="560" cellpadding="0" cellspacing="0" class="esdev-mso-table">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="esdev-mso-td" valign="top">
                                                                        <table cellpadding="0" cellspacing="0" class="es-left" align="left">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td width="466" class="esd-container-frame" align="left">
                                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td align="left" class="esd-block-text es-p5r es-p10l" bgcolor="#ffffff">
                                                                                                        <p style="line-height: 150%;">Subtotal<br>Delivery Charge<br><b>Total (${product.cartItems.length} item) </b></p>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                    <td width="20"></td>
                                                                    <td class="esdev-mso-td" valign="top">
                                                                        <table cellpadding="0" cellspacing="0" class="es-right" align="right">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td width="74" align="left" class="esd-container-frame">
                                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td align="right" class="esd-block-text" bgcolor="#ffffff">
                                                                                                        <p>${product.subTotal} Taka<br>${product.deliveryCharge} Taka <br><strong>${product.totalPrice} Taka</strong></p>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="esd-structure es-p20t es-p20r es-p20l" align="left">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="560" class="esd-container-frame" align="center" valign="top">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="left" class="esd-block-text es-p20t es-m-txt-l" bgcolor="#ffffff">
                                                                                        <p style="color: #a0937d;">BILLING DETAIL</p>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-spacer es-p5t es-p5b" style="font-size:0">
                                                                                        <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td style="border-bottom: 1px solid #a0937d; background: none; height: 1px; width: 100%; margin: 0px;"></td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" class="esd-block-text es-m-txt-l" bgcolor="#ffffff">
                                                                                        <p>Customer Name : ${product.name} <br> Customer Email : ${product.email} <br> Phone Number : ${product.phone} <br> District : ${product.district}<br>Delivery Address : ${product.address} <br> Notes : ${product?.note ? product.note: ''}</p>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-social es-p15t es-p15b" style="font-size:0">
                                                                                        <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social">
                                                                                            <tbody>
                                                                                            <tr>
                                                                                            <td align="center" valign="top" class="es-p10r">
                                                                                                <a target="_blank" href='https://www.facebook.com/blissclothingbangladesh'>
                                                                                                    <img src="https://duzuwz.stripocdn.email/content/assets/img/social-icons/circle-colored/facebook-circle-colored.png" alt="Fb" title="Facebook" width="32">
                                                                                                </a>
                                                                                            </td>
                                                                                            <td align="center" valign="top" class="es-p10r">
                                                                                                <a target="_blank" href='https://www.instagram.com/blissclothingbd/'>
                                                                                                    <img src="https://duzuwz.stripocdn.email/content/assets/img/social-icons/circle-colored/instagram-circle-colored.png" alt="Ig" title="Instagram" width="32">
                                                                                                </a>
                                                                                            </td>
                                                                                            <td align="center" valign="top" class="es-p10r">
                                                                                                <a target="_blank" href='https://www.tiktok.com/@blissbd'>
                                                                                                    <img src="https://duzuwz.stripocdn.email/content/assets/img/social-icons/circle-colored/tiktok-circle-colored.png" alt="Tt" title="TikTok" width="32">
                                                                                                </a>
                                                                                            </td>
                                                                                            <td align="center" valign="top">
                                                                                                <a target="_blank" href>
                                                                                                    <img src="https://duzuwz.stripocdn.email/content/assets/img/social-icons/circle-colored/youtube-circle-colored.png" alt="Yt" title="Youtube" width="32">
                                                                                                </a>
                                                                                            </td>
                                                                                        </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-text es-m-txt-l es-p10b" bgcolor="#ffffff">
                                                                                        <p><b>BE BOLD BE BLISS</b></p>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>
      `;
      // Send emails
    //   sendEmail(product.email, 'Order Confirmation', 'Thank you for your order!',htmlContentClient);
    //   sendEmail(process.env.CONFIRM_EMAIL, 'New Order', 'You have a new order!',htmlContentOrder);
      res.send(result);
    });

    app.get("/orders", async (req, res) => {
      const query = {};
      const cursor = orderCollection.find(query).sort({ time: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });


    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await orderCollection.findOne(query);
      res.send(result);
    });

    app.delete("/allorders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/delivered/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const tnx = req.body.tnx;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          isDeliverd: status,
          tnxId: tnx,
        },
      };
      const result = await orderCollection.updateOne(query, updatedDoc, options);
      res.send(result);
    });

    // update banner

    // app.get("/orders", async (req, res) => {
    //     const query = {};
    //     const cursor = orderCollection.find(query).sort({ time: -1 });
    //     const result = await cursor.toArray();
    //     res.send(result);
    //   });
    

  } finally {
  }
}
run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("bliss server is running");
});

app.listen(port, () => {
  console.log(`app is running in port ${port}`);
});
