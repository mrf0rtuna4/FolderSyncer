const fs = require('fs');
const path = require('path');

function createSettings(computerFolderPath, flashDriveFolderPath, syncIntervalMinutes) {
  const settings = {
    computerFolderPath,
    flashDriveFolderPath,
    syncIntervalMinutes: parseInt(syncIntervalMinutes)
  };
  const settingsJson = JSON.stringify(settings, null, 2);
  fs.writeFileSync('config.json', settingsJson);
  console.log('Конфигурация сохранена в файл config.json.');
}

module.exports = {
  createSettings
};
