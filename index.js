const fs = require("fs-extra");
const path = require("path");

// Define the paths relative to the script location
const sourceDir = path.join(__dirname, "rings"); // rings folder next to script
const resultDir = path.join(__dirname, "result"); // result folder next to script

// Create result directory if it doesn't exist
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

  // If number is less than 9, create copies up to 9
  //women
  if (numberPart < 9) {
    //let i = 6; is the first number of the ring size and the last number is 9
    for (let i = 6; i <= 9; i++) {
      const newFileName = `${parts[0]}-${parts[1]}-${i
        .toString()
        .padStart(2, "0")}-${parts[3]}${fileExt}`;
      const newFilePath = path.join(resultDir, newFileName);
      fs.copySync(filePath, newFilePath);
      console.log(`Created: ${newFileName}`);
    }
  }

  // If number is 9, create copies with 10, 11, and 12
  //men
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
