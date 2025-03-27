const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Credenciales
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Ruta a la carpeta uploads en Strapi
const uploadsDir = './public/uploads';

// Estructura de carpetas de Strapi obtenida desde la base de datos
const folderStructure = [
  { name: 'Serie Circolante', path: '/1' },
  { name: 'Serie Conexiones Lineales', path: '/2' },
  { name: 'Serie Onírica', path: '/3' },
  { name: 'Serie Sutiles', path: '/4' },
  { name: 'Serie Ventanas', path: '/5' },
  { name: 'Lienzo', path: '/4/6' },
  { name: 'Papel de algodón', path: '/4/7' },
];

// Función para subir las imágenes a Cloudinary
const uploadImages = (folderPath, cloudinaryFolder) => {
  const files = fs.readdirSync(folderPath);
  
  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    
    // Subir solo archivos
    if (fs.lstatSync(filePath).isFile()) {
      console.log(`Subiendo: ${filePath} a Cloudinary (${cloudinaryFolder})`);
      cloudinary.uploader.upload(filePath, {
        folder: cloudinaryFolder, // Se sube en la carpeta correcta
        public_id: path.parse(file).name, // Se usa el nombre del archivo sin extensión
      }, (error, result) => {
        if (error) {
          console.error('Error al subir:', error);
        } else {
          console.log(`Imagen subida correctamente: ${result.secure_url}`);
        }
      });
    }
  });
};

// Subir imágenes por cada carpeta de la base de datos
folderStructure.forEach(folder => {
  const folderPath = path.join(uploadsDir, folder.path.slice(1)); // Sin el "/"
  uploadImages(folderPath, folder.name);
});
