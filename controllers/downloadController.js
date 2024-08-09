const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// File download controller
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

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Pipe the file stream to the response
    response.body.pipe(res)
  } catch (error) {
    console.error('Error downloading file:', error);
    next(error);
  }
};


module.exports = downloadFile;