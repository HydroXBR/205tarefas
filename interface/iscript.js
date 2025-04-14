const urlParams = new URLSearchParams(window.location.search);
const isAdmin = urlParams.get('admin')

function pmaiuscula(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
}

document.getElementById('menuIcon').addEventListener('click', function () {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active'); 
});

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

function getLabelByValue(value) {
	const disciplina = disciplinas.find(disciplina => disciplina.value === value);
	return disciplina ? disciplina.label : null;
}

document.addEventListener('DOMContentLoaded', async function() {
	try {
		const response = await fetch('/tasks');
		const tasks = await response.json();
		tasks.sort((a, b) => b.entrega - a.entrega);
		
		const tasks1 = tasks.filter(task => {
		    const now = new Date();
		    const todayOnlyDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		    const entregaDate = new Date(task.entrega);
		    const entregaOnlyDate = new Date(entregaDate.getFullYear(), entregaDate.getMonth(), entregaDate.getDate());
		
		    if (now.getHours() >= 12) {
		        return entregaOnlyDate > todayOnlyDate; // Exclui as tarefas de hoje após meio-dia
		    }
		    return entregaOnlyDate >= todayOnlyDate; // Inclui as tarefas de hoje antes do meio-dia
		});
		
		const tableBody = document.getElementById('tabela-tarefas');

		tasks1.forEach(task => {
			const row = tableBody.insertRow(0); 
			const tipoCell = row.insertCell(0);
			const tituloCell = row.insertCell(1);
			const disciplinaCell = row.insertCell(2);
			const pedidaCell = row.insertCell(3);
			const entregaCell = row.insertCell(4);
			const nivelCell = row.insertCell(5);

				

			const p = document.createElement("p");
			p.innerHTML = pmaiuscula(task.tipo)
			p.classList.add(`tipo-${task.tipo.toLowerCase()}`)
			p.classList.add(`tipo`)
			tipoCell.appendChild(p);
			
			const id = task._id
			const ae = document.createElement("a")
			ae.href = isAdmin ? `/tarefa?id=${id}&admin=true` : `/tarefa?id=${id}`
			ae.innerHTML = pmaiuscula(task.title)
						
			/*tipoCell.textContent = pmaiuscula(task.tipo)*/
			
			tituloCell.appendChild(ae)
			disciplinaCell.textContent = getLabelByValue(task.disc);
			pedidaCell.textContent = new Date(task.pedida).toLocaleDateString(); 
			entregaCell.textContent = new Date(task.entrega).toLocaleDateString();
			nivelCell.textContent = task.nivel;
		});

		// TABELA DOISSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS
		const tasks2 = tasks.filter(task => {
		    const now = new Date();
		    const todayOnlyDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		    const entregaDate = new Date(task.entrega);
		    const entregaOnlyDate = new Date(entregaDate.getFullYear(), entregaDate.getMonth(), entregaDate.getDate());
		
		    if (now.getHours() >= 12) {
		        return entregaOnlyDate <= todayOnlyDate; // Inclui as tarefas de hoje se for 12h ou mais
		    }
		    return entregaOnlyDate < todayOnlyDate; // Apenas tarefas expiradas antes de hoje
		});

		const tableBody2 = document.getElementById('tabela-anteriores');
		tasks2.forEach(task => {
			const row2 = tableBody2.insertRow(0); 
			const tipoCell2 = row2.insertCell(0);
			const tituloCell2 = row2.insertCell(1);
			const disciplinaCell2 = row2.insertCell(2);
			const pedidaCell2 = row2.insertCell(3);
			const entregaCell2 = row2.insertCell(4);
			const nivelCell2 = row2.insertCell(5);

			const id2 = task._id
			const ae2 = document.createElement("a")
			ae2.href = isAdmin ? `/tarefa?id=${id2}&admin=true` : `/tarefa?id=${id2}`
			ae2.innerHTML = pmaiuscula(task.title)

			const p1 = document.createElement("p");
			p1.innerHTML = pmaiuscula(task.tipo)
			p1.classList.add(`tipo-${task.tipo.toLowerCase()}`)
			p1.classList.add(`tipo`)
			tipoCell2.appendChild(p1);
			
			tituloCell2.appendChild(ae2)
			disciplinaCell2.textContent = getLabelByValue(task.disc);
			pedidaCell2.textContent = new Date(task.pedida).toLocaleDateString(); 
			entregaCell2.textContent = new Date(task.entrega).toLocaleDateString();
			nivelCell2.textContent = task.nivel;
		});
	}catch (err){
		console.error('Erro ao obter dados das tarefas:', err);
	}

	// TABELAAAAAAAA
	try {
	    const response = await fetch('/lembretes');
	    const lembretes = await response.json();
	
	    const containerLembretes = document.getElementById('container-lembretes');
	    containerLembretes.innerHTML = '';
	
	    function formatarData2(data) {
	        const ano = data.getFullYear();
	        const mes = String(data.getMonth() + 1).padStart(2, '0');
	        const dia = String(data.getDate()).padStart(2, '0');
	        return `${ano}-${mes}-${dia}`;
	    }
	
	    const agoraUTC4 = new Date()
	
	    const hojeUTC4 = new Date(agoraUTC4);
	    hojeUTC4.setHours(3, 0, 0, 0)
	
	    const amanhaUTC4 = new Date(hojeUTC4);
	    amanhaUTC4.setDate(hojeUTC4.getDate() + 1); 
		
		let agora = new Date();
		let incluirOntem = agora.getHours() < 7;
		let ontem = formatarData2(new Date(agora.setDate(agora.getDate() - 1)));
	    
		const lembretesHoje = lembretes.filter(lembrete => {
		    let dataLembrete = formatarData2(new Date(lembrete.date + "T00:00:00"));
		    const hoje = formatarData2(new Date());
		
		    return dataLembrete === hoje || (incluirOntem && dataLembrete === ontem);
		});

		for(var i in lembretesHoje){
			let dataLembrete = formatarData2(new Date(i.date + "T00:00:00"));
			if(incluirOntem && dataLembrete === ontem){
				let e = i.desc.replace(/[Aa]manh[ãa]/gmi, "Hoje")
				i.desc = e
			}
		}
	
	    const feriadosNacionais = [
	        "01-01", "04-21", "05-01", "09-07",
	        "10-12", "11-02", "11-15", "12-25"
	    ];
	
	    function ehFeriado(data) {
	        const dataFormatada = `${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
	        return feriadosNacionais.includes(dataFormatada);
	    }
	
	    function proximoDiaUtil(data) {
	        const novaData = new Date(data);
	        while (novaData.getDay() === 0 || novaData.getDay() === 6 || ehFeriado(novaData)) {
	            novaData.setDate(novaData.getDate() + 1);
	        }
	        return novaData;
	    }
	
	    // Adiciona lembretes automáticos para revista de cabelo
	    if (amanhaUTC4.getDate() === 5 || amanhaUTC4.getDate() === 20) {
	        let dataRevista = new Date(amanhaUTC4);
	
	        if (dataRevista.getDay() === 0 || dataRevista.getDay() === 6 || ehFeriado(dataRevista)) {
	            dataRevista = proximoDiaUtil(dataRevista);
	        }
	
	        if (dataRevista.getDate() === proximoDiaUtil(amanhaUTC4).getDate()) {
	            const lembreteAutomatico = {
	                title: "Revista de Cabelo",
	                desc: "Amanhã tem revista de cabelo masculina!"
	            };
	            lembretesHoje.push(lembreteAutomatico);
	        }
	    }
	
	    // Adiciona lembretes automáticos para educação física
	    if (amanhaUTC4.getDay() === 1) {
	        const lembreteAutomatico = {
	            title: "Educação Física",
	            desc: "Não esquecer do uniforme na mochila."
	        };
	        lembretesHoje.push(lembreteAutomatico);
	    }
	
	    // Verifica se estamos no intervalo entre 0h e 7h do dia seguinte
	    const deveSubstituirAmanha = agoraUTC4 >= hojeUTC4 && agoraUTC4 < amanhaUTC4;
	
	    if (lembretesHoje.length > 0) {
	        const strong = document.createElement("strong");
	        strong.innerHTML = "⚠️ Lembretes extra";
	        containerLembretes.appendChild(strong);
	
	        lembretesHoje.forEach(lembrete => {
	            const divLembrete = document.createElement('div');
	            divLembrete.classList.add('lembrete');
	
	            const titulo = document.createElement('strong');
	            titulo.textContent = lembrete.title;
	
	            const descricao = document.createElement('span');
	            descricao.textContent = ' | ' + (
	                deveSubstituirAmanha
	                    ? lembrete.desc.replace(/\bamanhã\b/gi, "hoje")
	                    : lembrete.desc
	            );
	
	            divLembrete.appendChild(titulo);
	            divLembrete.appendChild(descricao);
	
	            containerLembretes.appendChild(divLembrete);
	        });
	    } else {
	        containerLembretes.style.display = 'none';
	    }
	} catch (error) {
	    console.error('Erro ao obter lembretes:', error);
	}

});
