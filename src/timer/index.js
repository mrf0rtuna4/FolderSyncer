const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const configPath = './config.json';
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const computerFolderPath = config.computerFolderPath;
const flashDriveFolderPath = config.flashDriveFolderPath;
// часики
const syncIntervalMinutes = config.syncIntervalMinutes || 60;

function copyFolderRecursiveSync(source, target) {
  const files = fs.readdirSync(source);

  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }
  files.forEach(function (file) {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    const stat = fs.statSync(sourcePath);

    if (stat.isFile()) {

      if (!fs.existsSync(targetPath)) {
        fs.copyFileSync(sourcePath, targetPath);
      }
    } else if (stat.isDirectory()) {
      copyFolderRecursiveSync(sourcePath, targetPath);
    }
  });
}

function startSync() {
  try {
    copyFolderRecursiveSync(computerFolderPath, flashDriveFolderPath);
    console.log('Синхронизация завершена успешно.');
  } catch (err) {
    console.error('Ошибка при синхронизации:', err);
  }
}

startSync();

setInterval(startSync, syncIntervalMinutes * 60 * 1000);
console.log('Таймер был активирован. Можете продалжать работу и свернуть это окно.')