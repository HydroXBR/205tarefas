document.getElementById('menuIcon').addEventListener('click', function () {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active'); 
});

function randomid() {
	return Math.random().toString(36).slice(-10);
}

let vopt = document.createElement("option")
vopt.value = ""
vopt.innerHTML = "Selecione..."
let vopt2 = document.createElement("option")
vopt2.value = ""
vopt2.innerHTML = "Selecione..."

document.getElementById("author").appendChild(vopt)
document.getElementById("disciplina").appendChild(vopt2)

const alunos = [
  {
    "complete": "Addlynes Avelino",
    "id": "addlynes"
  },
  {
    "complete": "Amanda Luizy",
    "id": "luizy"
  },
  {
    "complete": "Ana Júlia",
    "id": "ajulia"
  },
  {
    "complete": "Ana Laura",
    "id": "alaura"
  },
  {
    "complete": "Anna Paula",
    "id": "annap"
  },
  {
    "complete": "Beatriz Moreira",
    "id": "bmoreira"
  },
  {
    "complete": "Carla Isabela",
    "id": "carla"
  },
  {
    "complete": "Carlos Eduardo",
    "id": "ceduardo"
  },
  {
    "complete": "Derick Mendes",
    "id": "derick"
  },
  {
    "complete": "Emanuel Kalebe",
    "id": "kalebe"
  },
  {
    "complete": "Gabriel Castro",
    "id": "gabriel"
  },
  {
    "complete": "Isaías Nascimento",
    "id": "isaias"
  },
  {
    "complete": "Izabele Miranda",
    "id": "izabele"
  },
  {
    "complete": "Jaqueline Catunda",
    "id": "jaque"
  },
  {
    "complete": "Jennifer Gurgel",
    "id": "jennifer"
  },
  {
    "complete": "João Diego",
    "id": "jdiego"
  },
  {
    "complete": "José Henrique",
    "id": "jhenri"
  },
  {
    "complete": "Josué Souto",
    "id": "josue"
  },
  {
    "complete": "Júlia Dianny",
    "id": "juliad"
  },
  {
    "complete": "Laura Albuquerque",
    "id": "laura"
  },
  {
    "complete": "Lauro Tomaz",
    "id": "lauro"
  },
  {
    "complete": "Letícia Dayanne",
    "id": "leticia"
  },
  {
    "complete": "Livinny Batalha",
    "id": "livinny"
  },
  {
    "complete": "Lohannah Katharina",
    "id": "lohannah"
  },
  {
    "complete": "Lucas Daniel",
    "id": "ldaniel"
  },
  {
    "complete": "Lucas Prestes",
    "id": "lprestes"
  },
  {
    "complete": "Luiz Gustavo",
    "id": "luizg"
  },
  {
    "complete": "Lyzbrenda Frota",
    "id": "lyzbrenda"
  },
  {
    "complete": "Maria Eduarda Cruz",
    "id": "mcruz"
  },
  {
    "complete": "Maria Eduarda dos Anjos",
    "id": "manjos"
  },
  {
    "complete": "Maria Isabelle",
    "id": "misabelle"
  },
  {
    "complete": "Nicolas Barboza",
    "id": "nicolas"
  },
  {
    "complete": "Nicole Maciel",
    "id": "nmaciel"
  },
  {
    "complete": "Nicole Lopes",
    "id": "nlopes"
  },
  {
    "complete": "Nicolly Franco",
    "id": "nicolly"
  },
  {
    "complete": "Roberta Cambriai",
    "id": "roberta"
  },
  {
    "complete": "Safira Tomiko",
    "id": "safira"
  },
  {
    "complete": "Thicyane Fernanda",
    "id": "thicyane"
  },
  {
    "complete": "Ulysses Vidal",
    "id": "ulysses"
  },
  {
    "complete": "Vitória Lavínia",
    "id": "vitoria"
  },
  {
    "complete": "Wilmones",
    "id": "wilmones"
  }
]

const disciplinas = [
	{ value: "art", label: "Artes" },
	{ value: "port", label: "Português" },
	{ value: "mat", label: "Matemática" },
	{ value: "fis", label: "Física" },
	{ value: "hist", label: "História" },
	{ value: "socio", label: "Sociologia" },
	{ value: "geo", label: "Geografia" },
	{ value: "edfis", label: "Educação Física" },
	{ value: "ing", label: "Inglês" },
	{ value: "fil", label: "Filosofia" },
	{ value: "bio", label: "Biologia" },
	{ value: "quim", label: "Química" }
];

for(var i = 0; i < disciplinas.length; i++){
	let opt = document.createElement("option")
	opt.value = disciplinas[i].value	
	opt.innerHTML = disciplinas[i].label
	document.getElementById("disciplina").appendChild(opt)
}

for(var i = 0; i < alunos.length; i++){
	let opt = document.createElement("option")
	opt.value = alunos[i].id
	opt.innerHTML = alunos[i].complete
	document.getElementById("author").appendChild(opt)
}

document.addEventListener('DOMContentLoaded', function() {
	console.log("loaded")
	const form = document.getElementById('addTaskForm');

	form.addEventListener('submit', function(event) {
		event.preventDefault();
		
		const tipo = document.getElementById('tipo').value
		const titulo = document.getElementById('titulo').value
		const disciplina = document.getElementById('disciplina').value
		const pedidaa = Date.parse(document.getElementById('pedida-em').value)
		const pedidaEm = new Date(pedidaa).setHours(new Date(pedidaa).getHours() + 24);
		const entregaa = Date.parse(document.getElementById('entrega').value)
		const entrega = new Date(entregaa).setHours(new Date(entregaa).getHours() + 24)
		const author = document.getElementById('author').value
		const desc = document.getElementById('desc').value
		console.log("DESC:", desc)
		const nivel = document.getElementById('nivel').value

		if(entrega < pedidaEm){
			alert("A data de entrega não pode ser anterior à data de pedida.")
			return;
		}

		add(author, tipo, titulo, desc, disciplina, pedidaEm, entrega, nivel).then(e=>console.log("added"))

		async function addd(author, tipo, titulo, desc, disc, pedida, entrega, nivel){
			const response = await fetch(`/addtar?author=${author}&tipo=${tipo}&titulo=${titulo}&desc=${desc}&disciplina=${disc}&pedida=${pedida}&entrega=${entrega}&nivel=${nivel}`)
			console.log("addded")
			const rr = await response
			if(!rr) return false
			return rr
		}
		
		async function add(author, tipo, titulo, desc, disc, pedida, entrega, nivel){
			addd(author, tipo, titulo, desc, disc, pedida, entrega, nivel).then(async response => {
				const rr = await response.json()
				console.log(rr)

				if(rr.success == false){
					alert("Erro ao adicionar! Contate o Isaías, por favor.")
					console.log("Reason", rr.reason)
				}else{
					alert("Enviado com sucesso!")
					window.location.href = "/index.html"
				}
			})
		}
	})
})
