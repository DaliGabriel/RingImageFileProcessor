# File Number Processor

This script processes image files with specific naming patterns and creates modified copies according to the following rules:

1. For files matching the pattern `x-x-09-x.jpg`:
   - Creates copies with numbers 10, 11, and 12
2. For files with numbers less than 09 (e.g., 07 or 06):
   - Creates a copy with the number increased to 09

All generated files are saved in the `result/` directory.

## Installation

1. Make sure you have Node.js installed
2. Run `npm install` to install dependencies

## Usage

1. Place your .jpg files in the same directory as the script
2. Run the script using:
   ```
   npm start
   ```
3. Check the `result/` directory for the processed files

## File Naming Convention

The script expects files to follow this pattern:
- `x-x-xx-x.jpg` where:
  - First x: any text
  - Second x: any text
  - Third xx: number (06-12)
  - Fourth x: any text 