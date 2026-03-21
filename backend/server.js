const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
require('dotenv').config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend")));

// ensure quotes folder exists
const quotesDir = path.join(__dirname, "quotes");
if (!fs.existsSync(quotesDir)) {
    fs.mkdirSync(quotesDir);
}

const localString = 'mongodb://127.0.0.1:27017/test'
// MongoDB connection
mongoose.connect(process.env.MONGO_URI || localString)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// schema
const quotationSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String,

    features: [String],

    paymentGateway: String,
    domainSelection: String,
    frontendSelection: String,

    backendHosting: {
        type: String,
        default: "Render"
    },

    databasePlan: {
        type: String,
        default: "MongoDB Atlas"
    },

    maintenance: Boolean,

    message: String,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Quotation = mongoose.model("Quotation", quotationSchema);

// PDF generator
function generatePDF(data, filePath) {

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(22).text("Website Quotation Request", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(18).text("by Webscope", { align: "center" });
    doc.moveDown(1.5);

    doc.fontSize(14);
    doc.text(`Name: ${data.name || "-"}`);
    doc.moveDown(0.5);
    doc.text(`Email: ${data.email || "-"}`);
    doc.moveDown(0.5);
    doc.text(`Phone: ${data.phone || "-"}`);
    doc.moveDown(0.5);
    doc.text(`Address: ${data.address || "-"}`);
    doc.moveDown(1);

    doc.text("Features:");
    if (data.features && data.features.length) {
        data.features.forEach((feature, idx) => {
            doc.text(`  • ${feature}`);
        });
    } else {
        doc.text("  • None");
    }
    doc.moveDown(1);

    doc.text(`Payment Gateway: ${data.paymentGateway || "-"}`);
    doc.moveDown(0.5);
    doc.text(`Domain: ${data.domainSelection || "-"}`);
    doc.moveDown(0.5);
    doc.text(`Frontend: ${data.frontendSelection || "-"}`);
    doc.moveDown(0.5);
    doc.text(`Backend: ${data.backendHosting || "-"}`);
    doc.moveDown(0.5);
    doc.text(`Database: ${data.databasePlan || "-"}`);
    doc.moveDown(0.5);
    doc.text(`Maintenance: ${data.maintenance ? "Yes" : "No"}`);
    doc.moveDown(1);

    doc.text(`Additional Details: ${data.message || "-"}`);
    doc.moveDown(2);
    doc.text("Thank you for your request.", { align: "center" });
    doc.text("I will contact you soon.", { align: "center" });

    doc.end();
}

// routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.post("/submit", async (req, res) => {
    try {

        const {
            name,
            email,
            phone,
            address,
            message,
            paymentGateway,
            domainSelection,
            frontendSelection
        } = req.body;

        // handle features (important)
        let features = req.body.features || [];

        if (!Array.isArray(features)) {
            features = [features];
        }

        // Maintenance is checked if req.body.maintenance is defined (checkbox sends value only if checked)
        const maintenanceChecked = typeof req.body.maintenance !== 'undefined';

        const quoteData = {
            name,
            email,
            phone,
            address,
            message,
            paymentGateway,
            domainSelection,
            frontendSelection: frontendSelection || req.body.frontendSelection || "-",
            backendHosting: req.body.backendHosting || "Render",
            databasePlan: req.body.databasePlan || "MongoDB Atlas",
            maintenance: maintenanceChecked,
            features
        };

        console.log('Quote data to save:', quoteData);

        // save to DB
        const quote = new Quotation(quoteData);
        await quote.save();

        console.log('Quote saved successfully:', quote);

        // generate PDF
        const fileName = `quotation-${uuidv4()}.pdf`;
        const filePath = path.join(quotesDir, fileName);

        generatePDF(quoteData, filePath);

        // response
        res.send(`
            <h2 style="text-align:center;margin-top:50px;">
                Submitted Successfully
            </h2>

            <p style="text-align:center;">
                Download your quotation below:
            </p>

            <div style="text-align:center;margin-top:20px;">
                <a href="/quotes/${fileName}" download
                style="background:#007bff;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">
                Download PDF
                </a>
            </div>

            <div style="text-align:center;margin-top:20px;">
                <a href="/">Submit another response</a>
            </div>
        `);

    } catch (err) {
        console.log(err);
        res.send("Error submitting form");
    }
});

// serve PDFs
app.use("/quotes", express.static(quotesDir));

const PORT = process.env.PORT || 3000;
// start server
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

