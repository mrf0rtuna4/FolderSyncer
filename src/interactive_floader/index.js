const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Введите путь к папке на компьютере: ', (computerFolderPath) => {
  rl.question('Введите путь к папке на флешке: ', (flashDriveFolderPath) => {
    rl.close();

    try {
      copyFolderRecursiveSync(computerFolderPath, flashDriveFolderPath);
      console.log('Синхронизация завершена успешно.');
    } catch (err) {
      console.error('Ошибка при синхронизации:', err);
    }
  });
});
