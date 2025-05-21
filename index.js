const fs = require("fs-extra");
const path = require("path");
const AdmZip = require("adm-zip");

// Define the paths
const sourceDir = path.join(__dirname, "rings"); // rings folder next to script
const resultDir = path.join(__dirname, "result"); // result folder next to script
const inputZipPath = path.join(__dirname, "rename.zip");
const tempDir = path.join(__dirname, "temp");
const outputZipPath = path.join(__dirname, "result.zip");

// Clean up function
async function cleanup() {
  if (await fs.pathExists(tempDir)) {
    await fs.remove(tempDir);
  }
}

// Function to extract zip file
async function extractZip() {
  try {
    const zip = new AdmZip(inputZipPath);
    await fs.ensureDir(tempDir);
    zip.extractAllTo(tempDir, true);
    return true;
  } catch (error) {
    console.error("Error extracting zip file:", error.message);
    return false;
  }
}

// Function to create zip file
async function createZip(sourceDir, outputPath) {
  try {
    const zip = new AdmZip();
    zip.addLocalFolder(sourceDir);
    zip.writeZip(outputPath);
    return true;
  } catch (error) {
    console.error("Error creating zip file:", error.message);
    return false;
  }
}

// Process a single file
function processFile(filePath, resultDir) {
  const fileName = path.basename(filePath);
  const fileExt = path.extname(filePath).toLowerCase();
  
  // Skip non-JPG files
  if (fileExt !== '.jpg' && fileExt !== '.jpeg') {
    console.log(`Skipping non-JPG file: ${fileName}`);
    return;
  }

  const fileNameWithoutExt = path.basename(fileName, fileExt);
  const parts = fileNameWithoutExt.split("-");

  if (parts.length !== 4) {
    console.log(`Skipping ${fileName} - invalid format`);
    return;
  }

  const numberPart = parseInt(parts[2]);
  if (isNaN(numberPart)) {
    console.log(`Skipping ${fileName} - invalid number format`);
    return;
  }

  // Create result directory if it doesn't exist
  fs.ensureDirSync(resultDir);

  // Copy original file
  const originalCopyPath = path.join(resultDir, fileName);
  fs.copySync(filePath, originalCopyPath);
  console.log(`Copied original: ${fileName}`);

  // Process women's sizes (6-9)
  if (numberPart < 9) {
    for (let i = 6; i <= 9; i++) {
      const newFileName = `${parts[0]}-${parts[1]}-${i.toString().padStart(2, "0")}-${parts[3]}${fileExt}`;
      const newFilePath = path.join(resultDir, newFileName);
      fs.copySync(filePath, newFilePath);
      console.log(`Created: ${newFileName}`);
    }
  }

  // Process men's sizes (10-12)
  if (numberPart === 9) {
    for (let i = 10; i <= 12; i++) {
      const newFileName = `${parts[0]}-${parts[1]}-${i}-${parts[3]}${fileExt}`;
      const newFilePath = path.join(resultDir, newFileName);
      fs.copySync(filePath, newFilePath);
      console.log(`Created: ${newFileName}`);
    }
  }
}

// Main function
async function main() {
  try {
    // Clean up any previous temp files
    await cleanup();

    // Check if input zip exists
    if (!await fs.pathExists(inputZipPath)) {
      console.log(`Error: rename.zip not found at ${inputZipPath}`);
      return;
    }

    // Extract zip
    console.log("Extracting zip file...");
    const extracted = await extractZip();
    if (!extracted) return;

    // Process files
    const resultDir = path.join(tempDir, "processed");
    const files = await fs.readdir(tempDir);
    let processedCount = 0;

    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const stats = await fs.stat(filePath);
      
      if (stats.isFile()) {
        processFile(filePath, resultDir);
        processedCount++;
      }
    }

    if (processedCount === 0) {
      console.log("No files found in the zip.");
      return;
    }

    // Create result zip
    console.log("Creating result zip...");
    const created = await createZip(resultDir, outputZipPath);
    
    if (created) {
      console.log(`\nSuccess! Result saved to: ${outputZipPath}`);
      console.log(`Processed ${processedCount} files.`);
    }

  } catch (error) {
    console.error("An error occurred:", error.message);
  } finally {
    // Clean up temp files
    await cleanup();
  }
}

// Run the script
main();
fs.ensureDirSync(resultDir);

// Function to process a single file
function processFile(filePath) {
  const fileName = path.basename(filePath);
  const fileExt = path.extname(fileName);
  const fileNameWithoutExt = path.basename(fileName, fileExt);

  // Split the filename by dashes
  const parts = fileNameWithoutExt.split("-");

  if (parts.length !== 4) {
    console.log(`Skipping ${fileName} - invalid format`);
    return;
  }

  const numberPart = parseInt(parts[2]);

  // First, always copy the original file to results folder
  const originalCopyPath = path.join(resultDir, fileName);
  fs.copySync(filePath, originalCopyPath);
  console.log(`Copied original: ${fileName}`);

  //*women
  // If number is less than 9, create copies up to 9
  if (numberPart < 9) {
    //let i = 6; is the first number of the ring size and the last number is 9
    //i inicia en 6 y termina en 9
    for (let i = 6; i <= 9; i++) {
      const newFileName = `${parts[0]}-${parts[1]}-${i
        .toString()
        .padStart(2, "0")}-${parts[3]}${fileExt}`;
      const newFilePath = path.join(resultDir, newFileName);
      fs.copySync(filePath, newFilePath);
      console.log(`Created: ${newFileName}`);
    }
  }

  //*men
  // If number is 9, create copies with 10, 11, and 12
  if (numberPart === 9) {
    for (let i = 10; i <= 12; i++) {
      const newFileName = `${parts[0]}-${parts[1]}-${i}-${parts[3]}${fileExt}`;
      const newFilePath = path.join(resultDir, newFileName);
      fs.copySync(filePath, newFilePath);
      console.log(`Created: ${newFileName}`);
    }
  }
}

// Main function to process all files in the rings directory
function processAllFiles() {
  // Check if rings directory exists
  if (!fs.existsSync(sourceDir)) {
    console.log(`Error: rings directory not found at ${sourceDir}`);
    console.log(
      'Make sure you have a "rings" folder next to this script with your images inside.'
    );
    return;
  }

  const files = fs.readdirSync(sourceDir);

  if (files.length === 0) {
    console.log("No files found in the rings directory.");
    return;
  }

  let jpgCount = 0;
  files.forEach((file) => {
    if (file.endsWith(".jpg")) {
      const filePath = path.join(sourceDir, file);
      processFile(filePath);
      jpgCount++;
    }
  });

  if (jpgCount === 0) {
    console.log("No .jpg files found in the rings directory.");
  } else {
    console.log(`Processed ${jpgCount} .jpg files.`);
  }
}

// Run the script
processAllFiles();
console.log("Processing complete!");
