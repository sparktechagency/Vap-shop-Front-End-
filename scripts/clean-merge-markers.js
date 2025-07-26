const fs = require("fs");
const path = require("path");

const directoryPath = path.join(__dirname, "../src");

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  if (content.includes("<<<<<<<") || content.includes(">>>>>>>")) {
    console.log(`⚠️ Cleaning conflicts in ${filePath}`);

    content = content.replace(/<<<<<<<[\s\S]*?=======/g, "");
    content = content.replace(/>>>>>>>[\s\S]*?\n/g, "");

    fs.writeFileSync(filePath, content, "utf8");
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      cleanFile(fullPath);
    }
  });
}

walkDir(directoryPath);
console.log("✅ Merge conflict markers cleaned from src directory.");
