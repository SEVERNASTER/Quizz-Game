// Importar dependencias
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();  // Cargar las variables de entorno

const app = express();
const port = process.env.port || 3000;

// Servir archivos estáticos (HTML, CSS, JS) desde la carpeta "public"
app.use(express.static('public'));

// Ruta para generar la frase final utilizando la API de Gemini
app.get('/generate-phrase', async (req, res) => {
    const API_KEY = process.env.API_KEY;  // Usar la clave API desde el archivo .env
    const assertedQuestions = req.query.assertedQuestions;
    const totalQuestions = req.query.totalQuestions;
    const genAI = new GoogleGenerativeAI(API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Genera una frase sarcástica y humorística basada en el hecho de que el usuario respondió correctamente ${assertedQuestions} de ${totalQuestions} preguntas en un cuestionario. Haz mofa de su puntaje si este fue bajo o di algo ingenioso y divertido si fue alto. Evita frases genéricas como 'sigue así' y apunta a un tono irónico, ingenioso y sarcastico, puedes incluir emojis.`;
    try {
        const result = await model.generateContent(prompt);
        // console.log(result);
        // res.send(result.contents[0].parts[0].text);
        res.send(result.response.candidates[0].content.parts[0].text);
        
    } catch (error) {
        res.status(500).send('Error al generar la frase: ' + error.message);
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});



/**
 *  {
        "response": {
            "candidates": [
                {
                    "content": {
                        "parts": [
                            {
                                "text": "¡Oh, cielos! Un 80%.  Casi un genio.  Casi.  Apenas te salvás de la humillación pública.  🙄🏆 (El premio de consolación es una palmadita en la espalda... virtual, claro.)\n"
                            }
                        ],
                        "role": "model"
                    },
                    "finishReason": "STOP",
                    "avgLogprobs": -0.4054791072629533
                }
            ],
            "usageMetadata": {
                "promptTokenCount": 83,
                "candidatesTokenCount": 53,
                "totalTokenCount": 136
            },
            "modelVersion": "gemini-1.5-flash"
        }
    }
 */
