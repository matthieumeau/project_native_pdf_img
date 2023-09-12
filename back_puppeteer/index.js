const express = require("express");
const puppeteer = require("puppeteer");
const multer = require("multer");
const cors = require("cors");

const app = express();
const port = 3000;
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors());

app.post("/generate-pdf", upload.single("htmlFile"), generatePDF);
app.post("/generate-image", upload.single("htmlFile"), generateImage);
app.post("/generate-image-from-url", express.json(), generateImageFromURL);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

async function generatePDF(req, res) {
  if (!req.file) return res.status(400).send("No file uploaded.");

  try {
    const pdf = await renderContent(req.file.buffer.toString("utf-8"), "pdf");
    res.contentType("application/pdf").send(pdf);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Failed to generate PDF.");
  }
}

async function generateImage(req, res) {
  if (!req.file) return res.status(400).send("No file uploaded.");

  try {
    const image = await renderContent(
      req.file.buffer.toString("utf-8"),
      "image"
    );
    res.contentType("image/png").send(image);
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).send("Failed to generate image.");
  }
}

async function generateImageFromURL(req, res) {
  console.log(req.body);
  const url = req.body.url;
  if (!url) return res.status(400).send("No URL provided.");

  try {
    const image = await captureURL(url);
    res.contentType("image/png").send(image);
  } catch (error) {
    console.error("Error generating image from URL:", error);
    res.status(500).send("Failed to generate image from URL.");
  }
}

async function renderContent(content, type) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(content, { waitUntil: "networkidle0" });

  let data;

  switch (type) {
    case "pdf":
      data = await page.pdf({ format: "A4" });
      break;
    case "image":
      data = await page.screenshot({ type: "png" });
      break;
  }

  await browser.close();
  return data;
}

async function captureURL(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });
  const image = await page.screenshot({ type: "png" });
  await browser.close();
  return image;
}
