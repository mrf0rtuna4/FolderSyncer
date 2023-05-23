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

function syncFolders(computerFolderPath, flashDriveFolderPath) {
  try {
    copyFolderRecursiveSync(computerFolderPath, flashDriveFolderPath);
    console.log('Синхронизация завершена успешно.');
  } catch (err) {
    console.error('Ошибка при синхронизации:', err);
  }
}

function chooseMode() {
  console.log('Выберите режим:');
  console.log('1. С таймером');
  console.log('2. С выбором папки в консоли');
  console.log('3. Обычный режим');

  rl.question('Введите номер режима: ', (mode) => {
    rl.close();

    switch (mode) {
      case '1':
        const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
        const computerFolderPath = config.computerFolderPath;
        const flashDriveFolderPath = config.flashDriveFolderPath;
        const syncIntervalMinutes = config.syncIntervalMinutes || 60;

        setInterval(() => {
          syncFolders(computerFolderPath, flashDriveFolderPath);
        }, syncIntervalMinutes * 60 * 1000);

        console.log('Синхронизация будет выполняться каждые', syncIntervalMinutes, 'минут.');
        break;

      case '2':
        rl.question('Введите путь к папке на компьютере: ', (computerFolderPath) => {
          rl.question('Введите путь к папке на флешке: ', (flashDriveFolderPath) => {
            rl.close();
            syncFolders(computerFolderPath, flashDriveFolderPath);
          });
        });
        break;

      case '3':
        const configPath = 'config.json';
        if (fs.existsSync(configPath)) {
          const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          const computerFolderPath = config.computerFolderPath;
          const flashDriveFolderPath = config.flashDriveFolderPath;

          syncFolders(computerFolderPath, flashDriveFolderPath);
        } else {
          console.error('Файл конфигурации не найден.');
        }
        break;

      default:
        console.error('Неверный номер режима.');
        break;
    }
  });
}

chooseMode();
