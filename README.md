# Ring Image File Processor

This script processes ring image files by creating copies with sequential numbers based on specific rules.

## Folder Structure

```
changeRingFileName/
├── node_modules/
├── rings/           (place your images here)
├── result/          (processed images will appear here)
├── index.js
└── package.json
```

## Rules for File Processing

The script processes files based on their number in the filename (e.g., 23260-O-07-SP2.jpg):

1. For files with numbers less than 09 (e.g., 07):
   - Copies the original file to result folder
   - Creates new files incrementing the number up to 09
   - Starting from 6 for example(the minimun ring size)
   Example:
   - Original: 23260-O-07-SP2.jpg
   - Creates: 
     - 23260-O-06-SP2.jpg
     - 23260-O-07-SP2.jpg (copy of original)
     - 23260-O-08-SP2.jpg
     - 23260-O-09-SP2.jpg

2. For files with number 09:
   - Copies the original file to result folder
   - Creates new files with numbers 10, 11, and 12
   Example:
   - Original: 23292-CO-09-SP.jpg
   - Creates:
     - 23292-CO-09-SP.jpg (copy of original)
     - 23292-CO-10-SP.jpg
     - 23292-CO-11-SP.jpg
     - 23292-CO-12-SP.jpg

## Installation

1. Make sure you have Node.js installed on your computer
2. Open a terminal in the `changeRingFileName` folder
3. Run:
   ```
   npm install
   ```

## Usage

1. Place all your .jpg files in the `rings` folder
2. Open a terminal in the `changeRingFileName` folder
3. Run:
   ```
   npm start
   ```
4. Check the `result` folder for the processed images

## File Naming Convention

Files must follow this format:
- Pattern: `XXXXX-X-XX-XXX.jpg`
- Example: `23260-O-07-SP2.jpg`
  - First part: number (e.g., 23260)
  - Second part: letter(s) (e.g., O)
  - Third part: number (06-12)
  - Fourth part: text (e.g., SP2)

Files that don't follow this format will be skipped. 