const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();  // Cargar las variables de entorno

module.exports = async (req, res) => {
    const API_KEY = process.env.API_KEY;
    const { assertedQuestions, totalQuestions, category, level } = req.query;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Crea una frase sarcástica y divertida sobre el usuario que acertó ${assertedQuestions} de ${totalQuestions} preguntas en un quiz de ${category}, nivel ${level}. Si el puntaje es bajo, haz mofa de ello; si es alto, usa un tono irónico e ingenioso. Evita frases genéricas como "sigue así" y usa humor sarcástico. Puedes incluir emojis.`;

    try {
        const result = await model.generateContent(prompt);
        res.status(200).send(result.response.candidates[0].content.parts[0].text);
    } catch (error) {
        res.status(500).send('Error al generar la frase: ' + error.message);
    }
};
