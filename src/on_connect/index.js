const fs = require('fs');
const path = require('path');
const usbDetect = require('usb-detection');
const { syncFolders } = require('./folderSync');

const computerFolderPath = 'D:/Документы/Heypers Project';
const onAttach = (device) => {
  if (device.deviceType === 'penDrive') {
    const flashDriveFolderPath = device.mountpoints[0].path;
    syncFolders(computerFolderPath, flashDriveFolderPath);
  }
};

// обработчик пон
const onDetach = (device) => {
  if (device.deviceType === 'penDrive') {
  }
};
usbDetect.startMonitoring();
usbDetect.on('add', onAttach);
usbDetect.on('remove', onDetach);
const flashDriveList = usbDetect.find();
flashDriveList.forEach((device) => {
  if (device.deviceType === 'penDrive') {
    const flashDriveFolderPath = device.mountpoints[0].path;
    syncFolders(computerFolderPath, flashDriveFolderPath);
  }
});
const cleanup = () => {
  usbDetect.stopMonitoring();
  process.exit();
};
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
