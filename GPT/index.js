const config = require("./utils/config");
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());

// Configura tu API key de OpenAI
const openai = new OpenAI({
  apiKey: config.API_KEY,
});

app.get("/chat", async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: "Hola qué tal" }],
      model: "gpt-3.5-turbo",
    });
    console.log(data.completion);

    res.json({
      completion:
        completion.choices[0]?.message?.content || "No se recibió respuesta.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error en la solicitud." });
  }
});

app.listen(config.PORT, () => {
  console.log(
    `La aplicación está corriendo en http://localhost:${config.PORT}`
  );
});
