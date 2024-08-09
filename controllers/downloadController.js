const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fetch = require('node-fetch');


const downloadFile = async (req, res, next) => {
  try {
    const fileId = req.params.fileId;

    const file = await prisma.file.findUnique({
      where: { id: fileId }
    });

    if (!file) {
      return res.status(404).send('File not found');
    }

    const response = await fetch(file.url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    response.body.pipe(res).on('error', (error) => {
      console.error('Error streaming the file:', error);
      res.status(500).send('Error occurred while downloading the file.');
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    next(error);
  }
};


module.exports = downloadFile;