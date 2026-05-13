import pkg from "mongoose";
const { Schema, model } = pkg;

const comentarioSchema = Schema({
    author: { type: String, required: true },
    comment: { type: String, required: true },
    date: { type: Number, default: Date.now }
});

const perguntaSchema = Schema({
    pergunta: { type: String, required: true },
    resposta: { type: String, default: "" },
    autor: { type: String, required: true },
    hashtags: [{ type: String }], // Array de tags (ex: "RCP", "OVA")
    comentarios: [comentarioSchema],
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now }
});

const Pergunta = model("alfa_perguntas", perguntaSchema);
export default Pergunta;
