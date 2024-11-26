const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const { createBot, createProvider, createFlow, EVENTS,addKeyword } = require('@bot-whatsapp/bot')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000; 
app.use(cors());

const flowMenu = addKeyword(EVENTS.WELCOME)
.addAnswer('ᴡ ᴇ ʟ ᴄ ᴏ ᴍ ᴇ  𝓣𝓸  𝓒𝓱𝓪𝓽𝓑𝓸𝓽 The New WORLD')


const main = async () => {
  const adapterDB = new MockAdapter()
  const adapterFlow = createFlow([flowMenu])
  const adapterProvider = createProvider(BaileysProvider)

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  })
}

// // Función para convertir un archivo en base64
// const convertToBase64 = (filePath) => {
//     try {
//         const file = fs.readFileSync(filePath);  // Lee el archivo de forma síncrona
//         return file.toString('base64');  // Convierte a Base64
//     } catch (error) {
//         console.error("Error al leer el archivo:", error);
//         throw error;
//     }
// };

// // Endpoint para ejecutar el método main y devolver la imagen en base64
// app.get('/start-bot', async (req, res) => {
//     try {
//         console.log("Generando qr")
//         // Ejecuta el método main al hacer un fetch a este endpoint
//         await main();

//         // Ruta al archivo PNG generado
//         const imagePath = path.join(process.cwd(), 'bot.qr.png');

//         // Convierte la imagen a base64
//         const imageBase64 = convertToBase64(imagePath);

//         // Devuelve la imagen en base64 y un mensaje
//         res.status(200).json({
//             message: 'Bot iniciado correctamente.',
//             imageBase64: imageBase64,
//         });
//     } catch (error) {
//         res.status(500).json({ error: 'Ocurrió un error al iniciar el bot.' });
//     }
// });


app.get('/start-bot', async (req, res) => {
  try {
    console.log("start bot");
    await main();

    res.status(200).json({
      message: 'Bot iniciado correctamente.'
    });
  } catch (error) {
    res.status(500).json({ error: 'Ocurrió un error al iniciar el bot.' });
  }
});

app.get('/get-qr', async (req, res) => {
  try {
    console.log("Generando qr");
    const imagePath = path.join(process.cwd(), 'bot.qr.png');
    const image = fs.createReadStream(imagePath);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="bot.qr.png"');
    // Envía el archivo directamente
    image.pipe(res);
  } catch (error) {
    res.status(500).json({ error: 'Ocurrió un error al iniciar el bot.' });
  }
});




// Arrancar el servidor de Express
app.listen(port, () => {
  console.log(`Servidor Express corriendo en http://localhost:${port}`);
});
