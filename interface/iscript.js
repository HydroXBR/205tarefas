const urlParams = new URLSearchParams(window.location.search);
const isAdmin = urlParams.get('admin');
let currentTurma = 'all';

function pmaiuscula(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

document.getElementById('menuIcon').addEventListener('click', function () {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.turma-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.turma-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentTurma = this.dataset.turma;
        loadTasks();
    });
});

const disciplinas = [
    { value: "anat", label: "Anatomia" },
    { value: "fisio", label: "Fisiologia" },
    { value: "bioq", label: "Bioquímica" },
    { value: "histol", label: "Histologia" },
    { value: "embrio", label: "Embriologia" },
    { value: "imuno", label: "Imunologia" },
    { value: "farmaco", label: "Farmacologia" },
    { value: "patol", label: "Patologia" },
    { value: "clinica", label: "Clínica Médica" },
    { value: "cirurgia", label: "Cirurgia" },
    { value: "pediatria", label: "Pediatria" },
    { value: "gineco", label: "Ginecologia" },
    { value: "obstet", label: "Obstetrícia" },
    { value: "prev", label: "Medicina Preventiva" },
    { value: "urgencia", label: "Urgência e Emergência" }
];

function getLabelByValue(value) {
    const disciplina = disciplinas.find(d => d.value === value);
    return disciplina ? disciplina.label : value;
}

function getTurmaLabel(turma) {
    if (turma === 't1-t3') return 'T1 - T3';
    if (turma === 't4-t6') return 'T4 - T6';
    return 'Geral';
}

function getTipoClass(tipo) {
    const classes = {
        'prova': 'tipo-prova',
        'trabalho': 'tipo-trabalho',
        'seminário': 'tipo-seminario',
        'atividade': 'tipo-atividade',
        'prática': 'tipo-pratica'
    };
    return classes[tipo.toLowerCase()] || 'tipo-atividade';
}

async function loadTasks() {
    try {
        const url = currentTurma === 'all' ? '/tasks' : `/tasks?turma=${currentTurma}`;
        const response = await fetch(url);
        const tasks = await response.json();
        tasks.sort((a, b) => b.entrega - a.entrega);
        
        const now = new Date();
        const todayOnlyDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const tasksPendentes = tasks.filter(task => {
            const entregaDate = new Date(task.entrega);
            const entregaOnlyDate = new Date(entregaDate.getFullYear(), entregaDate.getMonth(), entregaDate.getDate());
            
            if (now.getHours() >= 12) {
                return entregaOnlyDate > todayOnlyDate;
            }
            return entregaOnlyDate >= todayOnlyDate;
        });
        
        const tableBody = document.getElementById('tabela-tarefas');
        tableBody.innerHTML = '';
        
        if (tasksPendentes.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="empty-cell"><i class="fas fa-check-circle"></i> Nenhuma tarefa pendente!</td></tr>';
        } else {
            tasksPendentes.forEach(task => {
                const row = tableBody.insertRow();
                const tipoCell = row.insertCell(0);
                const tituloCell = row.insertCell(1);
                const disciplinaCell = row.insertCell(2);
                const turmaCell = row.insertCell(3);
                const pedidaCell = row.insertCell(4);
                const entregaCell = row.insertCell(5);
                const nivelCell = row.insertCell(6);
                
                const tipoSpan = document.createElement("span");
                tipoSpan.innerHTML = pmaiuscula(task.tipo);
                tipoSpan.classList.add('tipo-badge', getTipoClass(task.tipo));
                tipoCell.appendChild(tipoSpan);
                
                const id = task._id;
                const link = document.createElement("a");
                link.href = isAdmin ? `/tarefa?id=${id}&admin=true` : `/tarefa?id=${id}`;
                link.innerHTML = pmaiuscula(task.title);
                link.classList.add('task-link');
                tituloCell.appendChild(link);
                
                disciplinaCell.textContent = getLabelByValue(task.disc);
                turmaCell.innerHTML = `<span class="turma-badge-small ${task.turma === 't1-t3' ? 'turma-t1' : 'turma-t4'}">${getTurmaLabel(task.turma)}</span>`;
                pedidaCell.textContent = new Date(task.pedida).toLocaleDateString('pt-BR');
                
                const entregaDate = new Date(task.entrega);
                const isUrgent = entregaDate <= todayOnlyDate && now.getHours() < 12;
                entregaCell.innerHTML = `<span class="${isUrgent ? 'urgent-date' : ''}">${entregaDate.toLocaleDateString('pt-BR')}</span>`;
                
                nivelCell.innerHTML = `<span class="nivel-badge nivel-${task.nivel.toLowerCase()}">${task.nivel}</span>`;
            });
        }
        
        const tasksAnteriores = tasks.filter(task => {
            const entregaDate = new Date(task.entrega);
            const entregaOnlyDate = new Date(entregaDate.getFullYear(), entregaDate.getMonth(), entregaDate.getDate());
            
            if (now.getHours() >= 12) {
                return entregaOnlyDate <= todayOnlyDate;
            }
            return entregaOnlyDate < todayOnlyDate;
        });
        
        const tableBody2 = document.getElementById('tabela-anteriores');
        tableBody2.innerHTML = '';
        
        if (tasksAnteriores.length === 0) {
            tableBody2.innerHTML = '<tr><td colspan="7" class="empty-cell"><i class="fas fa-smile"></i> Nenhuma tarefa anterior</td></tr>';
        } else {
            tasksAnteriores.forEach(task => {
                const row2 = tableBody2.insertRow();
                const tipoCell2 = row2.insertCell(0);
                const tituloCell2 = row2.insertCell(1);
                const disciplinaCell2 = row2.insertCell(2);
                const turmaCell2 = row2.insertCell(3);
                const pedidaCell2 = row2.insertCell(4);
                const entregaCell2 = row2.insertCell(5);
                const nivelCell2 = row2.insertCell(6);
                
                const tipoSpan2 = document.createElement("span");
                tipoSpan2.innerHTML = pmaiuscula(task.tipo);
                tipoSpan2.classList.add('tipo-badge', getTipoClass(task.tipo));
                tipoCell2.appendChild(tipoSpan2);
                
                const id2 = task._id;
                const link2 = document.createElement("a");
                link2.href = isAdmin ? `/tarefa?id=${id2}&admin=true` : `/tarefa?id=${id2}`;
                link2.innerHTML = pmaiuscula(task.title);
                link2.classList.add('task-link');
                tituloCell2.appendChild(link2);
                
                disciplinaCell2.textContent = getLabelByValue(task.disc);
                turmaCell2.innerHTML = `<span class="turma-badge-small ${task.turma === 't1-t3' ? 'turma-t1' : 'turma-t4'}">${getTurmaLabel(task.turma)}</span>`;
                pedidaCell2.textContent = new Date(task.pedida).toLocaleDateString('pt-BR');
                entregaCell2.textContent = new Date(task.entrega).toLocaleDateString('pt-BR');
                nivelCell2.innerHTML = `<span class="nivel-badge nivel-${task.nivel.toLowerCase()}">${task.nivel}</span>`;
            });
        }
    } catch (err) {
        console.error('Erro ao obter dados das tarefas:', err);
        const tableBody = document.getElementById('tabela-tarefas');
        tableBody.innerHTML = '<tr><td colspan="7" class="error-cell"><i class="fas fa-exclamation-triangle"></i> Erro ao carregar tarefas</td></tr>';
    }
}

async function loadLembretes() {
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
        
        const agoraUTC4 = new Date();
        const hojeUTC4 = new Date(agoraUTC4);
        hojeUTC4.setHours(3, 0, 0, 0);
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
        
        if (lembretesHoje.length > 0) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-warning';
            alertDiv.innerHTML = `<i class="fas fa-bell"></i> <strong>Lembretes importantes</strong>`;
            containerLembretes.appendChild(alertDiv);
            
            lembretesHoje.forEach(lembrete => {
                const divLembrete = document.createElement('div');
                divLembrete.className = 'lembrete-card';
                divLembrete.innerHTML = `
                    <i class="fas fa-sticky-note"></i>
                    <div class="lembrete-content">
                        <strong>${lembrete.title}</strong>
                        <span>${lembrete.desc}</span>
                    </div>
                `;
                containerLembretes.appendChild(divLembrete);
            });
        } else {
            containerLembretes.style.display = 'none';
        }
    } catch (error) {
        console.error('Erro ao obter lembretes:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    await loadTasks();
    await loadLembretes();
});
