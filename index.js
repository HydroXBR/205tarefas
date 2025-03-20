import axios from 'axios'
import { join, basename, dirname } from "path"
import * as path from 'path'
import { fileURLToPath } from 'url';
const { token } = process.env
import express from 'express'
import cors from 'cors'
const app = express()
import bodyParser from "body-parser"
const __dirname = dirname(fileURLToPath(import.meta.url))
import tarefa from "./database/tarefa.js"
import lembrete from "./database/lembrete.js"
import visit from "./database/visits.js";
import Db from "mongodb"
import im from "./db_connect.js"
const ec = txt => encodeURIComponent(txt)
const dec = txt => decodeURIComponent(txt)
const fetch = s => import('node-fetch').then(({default: fetch}) => fetch(s))
im()



function round(num, scale) {
	if(!("" + num).includes("e")) {
		return +(Math.round(num + "e+" + scale)  + "e-" + scale);
	} else {
		var arr = ("" + num).split("e");
		var sig = ""
		if(+arr[1] + scale > 0) {
			sig = "+";
		}
		return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
	}
}

const headers = /** @type {import("http").OutgoingHttpHeaders} */ ({
		"Access-Control-Allow-Origin": "https://brainly.com.br",
	"Access-Control-Allow-Methods":"GET",
	"Access-Control-Allow-Headers":"X-Api-Token"
})

app.use(
	cors({ 
		exposedHeaders: [
			'Authorization'
		]
	}),
	bodyParser.json(),
	bodyParser.urlencoded({
		extended: true
	}),
	express.static(path.join(__dirname, '/interface'))
);

app.listen(3000, () => {})


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/interface'));

app.get('/', async function(req, res) {
	console.log("Access PRINCIPAL: " + new Date());

	try {
		const today = new Date();
		const todayStr = today.toISOString().split("T")[0]; // Formato YYYY-MM-DD

		let visitData = await visit.findOne();

		if (!visitData) {
			visitData = new visit({ totalVisits: 1, days: [todayStr] });
		} else {
			visitData.totalVisits += 1;
			if (!visitData.days.includes(todayStr)) {
				visitData.days.push(todayStr);
			}
		}

		await visitData.save();
	} catch (err) {
		console.error("Erro ao registrar visita:", err);
	}

	res.sendFile(__dirname + '/interface/index.html');
});
app.get('/#', async function(req, res) {
	console.log("Access PRINCIPAL: " + new Date());

	try {
		const today = new Date();
		const todayStr = today.toISOString().split("T")[0]; // Formato YYYY-MM-DD

		let visitData = await visit.findOne();

		if (!visitData) {
			visitData = new visit({ totalVisits: 1, days: [todayStr] });
		} else {
			visitData.totalVisits += 1;
			if (!visitData.days.includes(todayStr)) {
				visitData.days.push(todayStr);
			}
		}

		await visitData.save();
	} catch (err) {
		console.error("Erro ao registrar visita:", err);
	}

	res.sendFile(__dirname + '/interface/index.html');
});

app.get('/horarios',function(req,res) {
	console.log("Access HORARIOS: "+ new Date())
	res.sendFile(__dirname + '/interface/horarios.html')
})

app.get('/apagar', async function(req, res) {
	console.log("Access APAGAR: " + new Date())

	if (req.query.token == process.env.token2) {
		if (req.query.id) {
			try {
				const idTarefa = req.query.id;

				const tarefaRemovida = await tarefa.findOneAndDelete({ _id: idTarefa });

				if (!tarefaRemovida) {
					return res.status(404).send('Tarefa não encontrada.');
				}

				console.log(`Tarefa ${idTarefa} removida com sucesso.`);
				res.status(200).send({success: true, reason: "Tarefa removida com sucesso."});
			} catch (err) {
				console.error('Erro ao remover tarefa:', err);
				res.status(500).send({success: false, reason: err});
			}
		} else {
			try {
				const hoje = new Date();
				const trintaDiasAtras = new Date();
				trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

				const tarefasAntigas = await tarefa.find({
					entrega: { $lt: trintaDiasAtras }
				});

				await tarefa.deleteMany({
					entrega: { $lt: trintaDiasAtras }
				});

				console.log(`${tarefasAntigas.length} tarefas removidas com sucesso.`);
				res.send(`${tarefasAntigas.length} tarefas removidas com sucesso.`);
			} catch (err) {
				console.error('Erro ao remover tarefas antigas:', err);
				res.status(500).send('Erro ao remover tarefas antigas.');
			}
		}
	} else {
		res.sendStatus(401);
	}
});

app.get('/sobre',function(req,res) {
	console.log("Access SOBRE: "+ new Date())
	res.sendFile(__dirname + '/interface/sobre.html')
});

app.get('/add',function(req,res) {
	console.log("Access ADD: "+ new Date())
	res.sendFile(__dirname + '/interface/add.html')
});

app.get('/src',function(req,res) {
	let urlparsed = "https://metodosimulados.yeshayahudesigndeveloper.repl.co" + req._parsedOriginalUrl.href
	let required = new URL(urlparsed).searchParams.get('id') || res.sendStatus(404)
	let format = new URL(urlparsed).searchParams.get('format') || "png"


	res.sendFile(__dirname + `/src/${required}.${format}`)
})

app.get('/tasks', async (req, res) => {
	try {
		const tasks = await tarefa.find().sort({ data: -1 }); 
		res.json(tasks);
	}catch (err){
		console.error('Erro ao buscar tarefas:', err);
		res.status(500).send('Erro ao buscar tarefas');
	}
});

app.get('/lembretes', async (req, res) => {
	try {
		const lembretes = await lembrete.find().sort({ data: -1 }); 
		res.json(lembretes);
	}catch (err){
		console.error('Erro ao buscar lembretes:', err);
		res.status(500).send('Erro ao buscar lembretes');
	}
});

app.get('/search', async function(req, res) {
		console.log("Access SEARCH: " + new Date());
		const tasks = await tarefa.find().sort({ data: -1 });
		const id = req.query.id;
		const result = tasks.find(task => task._id == id) || null;
		if (result == null) return res.sendStatus(404);
		// Convertendo o documento MongoDB em JSON
		const jsonResult = JSON.stringify(result);
		res.send(jsonResult);
});

app.get('/tarefa',function(req,res) {
	console.log("Access: "+ new Date())
	res.sendFile(__dirname + '/interface/tarefa.html')
});

app.get('/addlembrete',function(req,res) {
	console.log("Access: "+ new Date())
	res.sendFile(__dirname + '/interface/addlembrete.html')
});

app.get('/moredays', async function(req, res) {
	console.log("Access MOREDAYS: " + new Date());
	const { id, days } = req.query;

	try {
		const tar = await tarefa.findOne({ _id: id });
		if (!tar) {
			return res.status(404).send("Task not found");
		}

		function addmore(d, days){
			let datedays = new Date(d);
			let hoursadded = datedays.getHours() + (24 * Number(days));
			datedays.setHours(hoursadded);
			return datedays.getTime();
		}

		let entrega = tar.entrega;
		tar.entrega = addmore(entrega, parseInt(days));
		await tar.save();
		res.send(JSON.stringify(tar));
	} catch (err) {
		console.log(err);
		res.status(500).send("Internal Server Error");
	}
});

app.get('/addtar', function(req, res) {
	const { author, tipo, titulo, desc, disciplina, pedida, entrega, nivel } = req.query;
	console.log(req.query);

	if (!author || !tipo || !titulo || !desc || !disciplina || !pedida || !entrega || !nivel) {
		return res.send({ success: false, reason: "Missing parameters" });
	}

	const novaTarefa = new tarefa({
		author: author,
		tipo: tipo,
		title: titulo,
		desc: desc,
		disc: disciplina,
		pedida: pedida,
		entrega: entrega,
		nivel: nivel,
		registered: new Date().getTime()
	});

	novaTarefa.save()
		.then(() => {
			res.send({ success: true, reason: "Success" });
		})
			.catch(error => {
				console.error("Erro ao salvar tarefa:", error);
				res.send({ success: false, reason: "Error" });
			});
});

app.get('/addlemb', function(req, res) {
	const { title, desc, date } = req.query;

	if (!title || !desc || !date) {
		return res.send({ success: false, reason: "Missing parameters" });
	}

	const novoLembrete = new lembrete({
		title: title,
		desc: desc,
		date: date,
		registered: new Date().getTime()
	});

		novoLembrete.save()
		.then(() => {
			res.send({ success: true, reason: "Success" });
		})
			.catch(error => {
				console.error("Erro ao salvar lembrete:", error);
				res.send({ success: false, reason: "Error" });
			});
});

app.get('/comment', async function(req, res) {
		const { author, comment, date, idtar } = req.query;

		if (!author || !comment || !date || !idtar) {
				return res.send({ success: false, reason: "Missing parameters" });
		}

		// Converter a data de string para uma timestamp Unix
		const parsedDate = new Date(date).getTime();

		tarefa.findOne({ _id: idtar }, (err, tar) => {
				if (tar) {
						// Adicionar o comentário ao array 'comments' da tarefa
						tar.comments.push({ comment: comment, author: author, date: parsedDate });

						// Salvar a tarefa atualizada
						tar.save((err) => {
								if (err) {
										console.error('Erro ao salvar tarefa:', err);
										res.send({ success: false, reason: "Error at saving task" });
								} else {
										console.log('Comentário adicionado com sucesso à tarefa:', tar);
										res.send({ success: true, reason: "Success" });
								}
						});
				} else {
						res.send({ success: false, reason: "Error at finding task." });
				}
		});
});
