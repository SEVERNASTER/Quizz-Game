const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();  // Cargar las variables de entorno

module.exports = async (req, res) => {
    const API_KEY = process.env.API_KEY;
    const { assertedQuestions, totalQuestions, category, level } = req.query;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Genera una frase sarcástica y humorística basada en el hecho de que el usuario respondió correctamente ${assertedQuestions} de ${totalQuestions} preguntas en un cuestionario de la categoria ${category} de nivel ${level}. Haz mofa de su puntaje si este fue bajo o di algo ingenioso y divertido si fue alto. Evita frases genéricas como 'sigue así' y apunta a un tono irónico, ingenioso y sarcastico, puedes incluir emojis.`;

    try {
        const result = await model.generateContent(prompt);
        res.status(200).send(result.response.candidates[0].content.parts[0].text);
    } catch (error) {
        res.status(500).send('Error al generar la frase: ' + error.message);
    }
};
