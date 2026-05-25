const {GoogleGenAI} = require("@google/genai");

const generator = async (req, res) => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});
        const response = await ai.models.generateContent(
            {
                model: "gemini-2.5-flash",
                contents: "Generate a 4 random topic for doodling in json format with topics as an array inside doodle_topics"
            }
        )
        if(!response.text) throw "response not found";
        let finalResponseText = response.text.replaceAll("```","").replace("json","")
        console.log(JSON.parse(finalResponseText))
        res.json({
            "message": JSON.parse(finalResponseText)
        })

    } catch (err) {
        console.log(err)
        res.status(500).send({
            message: "Error in generator",
            error: err.toString()
        })
    }
}

module.exports = generator;