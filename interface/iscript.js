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
    // 1º Período
    { value: "isc", label: "Introdução à Saúde Coletiva" },
    { value: "bcm", label: "Biologia Celular e Molecular" },
    { value: "ah1", label: "Anatomia Humana I" },
    { value: "emb", label: "Embriologia" },
    { value: "metodologia", label: "Metodologia do Trabalho Científico" },
    { value: "etica", label: "Ética Médica" },
    
    // 2º Período
    { value: "histo", label: "Histologia" },
    { value: "bioq", label: "Bioquímica Celular e Metabólica" },
    { value: "ah2", label: "Anatomia Humana II" },
    { value: "genetica", label: "Genética" },
    { value: "ppgs", label: "Política, Planejamento e Gestão em Saúde" },
    
    // 3º Período
    { value: "micro", label: "Microbiologia Médica" },
    { value: "para", label: "Parasitologia Médica" },
    { value: "mico", label: "Micologia Médica" },
    { value: "epidemio", label: "Epidemiologia e Bioestatística" },
    { value: "imuno", label: "Imunologia Médica" },
    { value: "fisio", label: "Fisiologia Humana" },
    
    // 4º Período
    { value: "aps", label: "Atenção Primária em Saúde" },
    { value: "patolgeral", label: "Patologia Geral" },
    { value: "farmaco1", label: "Farmacologia I" },
    { value: "proped", label: "Propedêutica Médica" },
    { value: "tecop", label: "Técnica Operatória e Cirurgia Experimental" },
    
    // 5º Período
    { value: "patoesp", label: "Patologia Especial" },
    { value: "farmaco2", label: "Farmacologia II" },
    { value: "anestesio", label: "Anestesiologia Clínica" },
    { value: "cirurgia_dig", label: "Cirurgia do Sistema Digestório e Anexos" },
    { value: "climed1", label: "Clínica Médica Integrada I" },
    { value: "trauma", label: "Atenção ao Trauma" },
    
    // 6º Período
    { value: "climed2", label: "Clínica Médica Integrada II" },
    { value: "doencas_inf", label: "Doenças Infecciosas e Parasitárias" },
    { value: "cirurgia_int", label: "Cirurgia Integrada" },
    { value: "otorrino", label: "Otorrino e Cirurgia de Cabeça e Pescoço" },
    
    // 7º Período
    { value: "climed3", label: "Clínica Médica Integrada III" },
    { value: "urologia", label: "Urologia" },
    { value: "oftalmo", label: "Oftalmologia" },
    { value: "neuro", label: "Neurociências" },
    { value: "saude_mulher1", label: "Saúde da Mulher I - Ginecologia" },
    { value: "dermato", label: "Dermatologia" },
    
    // 8º Período
    { value: "saude_mulher2", label: "Saúde da Mulher II - Obstetrícia" },
    { value: "saude_crianca", label: "Saúde da Criança" },
    { value: "saude_idoso", label: "Saúde do Idoso" },
    { value: "psiquiatria", label: "Psiquiatria" },
    { value: "medicina_legal", label: "Medicina Legal" },
    { value: "traumato", label: "Traumatologia e Ortopedia" },
    
    // Estágios (Internato)
    { value: "estagio_climed", label: "Estágio em Clínica Médica" },
    { value: "estagio_cirurgica", label: "Estágio em Clínica Cirúrgica" },
    { value: "estagio_pediatria", label: "Estágio em Saúde da Criança" },
    { value: "estagio_gineco", label: "Estágio em Saúde da Mulher" },
    { value: "estagio_urgencia", label: "Estágio em Urgência e Emergência" },
    { value: "estagio_tropicais", label: "Estágio em Doenças Tropicais e Infecciosas" },
    { value: "estagio_onco", label: "Estágio em Oncologia" },
    { value: "estagio_neuro", label: "Estágio em Neurociências" },
    { value: "estagio_mental", label: "Estágio em Saúde Mental" },
    { value: "estagio_rural", label: "Estágio em Saúde Coletiva Rural" },
    { value: "estagio_urbana", label: "Estágio em Saúde Coletiva Urbana" },
    { value: "estagio_complementar", label: "Estágio Complementar" }
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
        'prática': 'tipo-pratica',
        'leitura': 'tipo-leitura'
    };
    return classes[tipo.toLowerCase()] || 'tipo-atividade';
}

function formatTurmasInfo(turmasInfo) {
    if (!turmasInfo || turmasInfo.length === 0) return '<span class="turma-badge-small">Geral</span>';
    
    return turmasInfo.map(info => {
        const turmaLabel = info.turma === 't1-t3' ? 'T1-T3' : 'T4-T6';
        const turmaClass = info.turma === 't1-t3' ? 'turma-t1' : 'turma-t4';
        const entregaDate = new Date(info.entrega);
        const hoje = new Date();
        const isUrgent = entregaDate <= hoje && hoje.getHours() < 12;
        
        return `
            <div class="turma-info-tooltip" title="${info.observacao || 'Sem observações específicas'}">
                <span class="turma-badge-small ${turmaClass}">
                    ${turmaLabel}
                </span>
                <span class="turma-entrega ${isUrgent ? 'urgent-date' : ''}">
                    ${entregaDate.toLocaleDateString('pt-BR')}
                </span>
                ${info.observacao ? '<i class="fas fa-info-circle turma-info-icon"></i>' : ''}
            </div>
        `;
    }).join('');
}

// Função para verificar se a tarefa está pendente para uma turma específica
function isTaskPendingForTurma(entregaTimestamp, turma) {
    const now = new Date();
    const todayOnlyDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const entregaDate = new Date(entregaTimestamp);
    const entregaOnlyDate = new Date(entregaDate.getFullYear(), entregaDate.getMonth(), entregaDate.getDate());
    
    if (now.getHours() >= 12) {
        return entregaOnlyDate > todayOnlyDate;
    }
    return entregaOnlyDate >= todayOnlyDate;
}

// Função para filtrar tarefas baseado nas turmasInfo
function filterTasksByTurma(tasks, currentTurma) {
    if (currentTurma === 'all') return tasks;
    
    return tasks.filter(task => {
        // Se tiver turmasInfo (novo formato)
        if (task.turmasInfo && task.turmasInfo.length > 0) {
            return task.turmasInfo.some(info => info.turma === currentTurma);
        }
        // Compatibilidade com formato antigo
        return task.turma === currentTurma;
    });
}

// Função para verificar se a tarefa está pendente (considerando múltiplas turmas)
// Função para verificar se a tarefa está pendente (considerando múltiplas turmas)
function isTaskPending(task) {
    const now = new Date();
    const todayOnlyDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentHour = now.getHours();
    
    // Se tiver turmasInfo (novo formato)
    if (task.turmasInfo && task.turmasInfo.length > 0) {
        return task.turmasInfo.some(info => {
            const entregaDate = new Date(info.entrega);
            const entregaOnlyDate = new Date(entregaDate.getFullYear(), entregaDate.getMonth(), entregaDate.getDate());
            
            // Se for entrega hoje
            if (entregaOnlyDate.getTime() === todayOnlyDate.getTime()) {
                // Se ainda não passou das 12h, mostra tarefa de hoje
                // Se já passou das 12h, não mostra mais tarefas de hoje
                return currentHour < 18;
            }
            // Tarefas futuras
            return entregaOnlyDate > todayOnlyDate;
        });
    }
    
    // Compatibilidade com formato antigo
    if (task.entrega) {
        const entregaDate = new Date(task.entrega);
        const entregaOnlyDate = new Date(entregaDate.getFullYear(), entregaDate.getMonth(), entregaDate.getDate());
        
        if (entregaOnlyDate.getTime() === todayOnlyDate.getTime()) {
            return currentHour < 12;
        }
        return entregaOnlyDate > todayOnlyDate;
    }
    
    return false;
}

// Função para obter a menor data de entrega (para ordenação)
function getEarliestDelivery(task) {
    if (task.turmasInfo && task.turmasInfo.length > 0) {
        return Math.min(...task.turmasInfo.map(info => info.entrega));
    }
    return task.entrega || Infinity;
}

async function loadTasks() {
    try {
        // SEMPRE buscar todas as tarefas
        const response = await fetch('/tasks');
        const tasks = await response.json();
        
        // Ordenar por data de entrega (a mais próxima primeiro)
        tasks.sort((a, b) => getEarliestDelivery(a) - getEarliestDelivery(b));
        
        // FILTRAR POR TURMA no frontend
        let tasksFiltradas = tasks;
        if (currentTurma !== 'all') {
            tasksFiltradas = tasks.filter(task => {
                // Verifica se a tarefa tem a turma selecionada
                if (task.turmasInfo && task.turmasInfo.length > 0) {
                    return task.turmasInfo.some(info => info.turma === currentTurma);
                }
                // Compatibilidade com formato antigo
                return task.turma === currentTurma;
            });
        }
        
        // Separar pendentes e anteriores das tarefas já filtradas
        const tasksPendentes = tasksFiltradas.filter(task => isTaskPending(task));
        const tasksAnteriores = tasksFiltradas.filter(task => !isTaskPending(task));
        
        // Renderizar tabelas
        renderTabelaPendentes(tasksPendentes);
        renderTabelaAnteriores(tasksAnteriores);
        
    } catch (err) {
        console.error('Erro ao obter dados das tarefas:', err);
        const tableBody = document.getElementById('tabela-tarefas');
        tableBody.innerHTML = '<tr><td colspan="7" class="error-cell"><i class="fas fa-exclamation-triangle"></i> Erro ao carregar tarefas</td></tr>';
    }
}

// Funções de renderização separadas para organizar
function renderTabelaPendentes(tasks) {
    const tableBody = document.getElementById('tabela-tarefas');
    tableBody.innerHTML = '';
    
    if (tasks.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="empty-cell"><i class="fas fa-check-circle"></i> Nenhuma tarefa pendente!</td></tr>';
        return;
    }
    
    tasks.forEach(task => {
        const row = tableBody.insertRow();
        const tipoCell = row.insertCell(0);
        const tituloCell = row.insertCell(1);
        const disciplinaCell = row.insertCell(2);
        const turmaCell = row.insertCell(3);
        const pedidaCell = row.insertCell(4);
        const entregaCell = row.insertCell(5);
        const nivelCell = row.insertCell(6);
        
        // Tipo
        const tipoSpan = document.createElement("span");
        tipoSpan.innerHTML = pmaiuscula(task.tipo);
        tipoSpan.classList.add('tipo-badge', getTipoClass(task.tipo));
        tipoCell.appendChild(tipoSpan);
        
        // Título com link
        const id = task._id;
        const link = document.createElement("a");
        link.href = isAdmin ? `/tarefa?id=${id}&admin=true` : `/tarefa?id=${id}`;
        link.innerHTML = pmaiuscula(task.title);
        link.classList.add('task-link');
        tituloCell.appendChild(link);
        
        // Disciplina
        disciplinaCell.textContent = getLabelByValue(task.disc);
        
        // Turmas
        turmaCell.innerHTML = formatTurmasInfo(task.turmasInfo);
        
        // Data solicitada
        pedidaCell.textContent = new Date(task.pedida).toLocaleDateString('pt-BR');
        
        // Data de entrega
        if (task.turmasInfo && task.turmasInfo.length > 0) {
            const entregas = task.turmasInfo.map(info => {
                const entregaDate = new Date(info.entrega);
                const isUrgent = entregaDate <= new Date() && new Date().getHours() < 12;
                return `<span class="${isUrgent ? 'urgent-date' : ''}">${info.turma === 't1-t3' ? 'T1-T3' : 'T4-T6'}: ${entregaDate.toLocaleDateString('pt-BR')}</span>`;
            }).join('<br>');
            entregaCell.innerHTML = entregas;
        } else if (task.entrega) {
            const entregaDate = new Date(task.entrega);
            const isUrgent = entregaDate <= new Date() && new Date().getHours() < 12;
            entregaCell.innerHTML = `<span class="${isUrgent ? 'urgent-date' : ''}">${entregaDate.toLocaleDateString('pt-BR')}</span>`;
        } else {
            entregaCell.textContent = '—';
        }
        
        // Nível
        nivelCell.innerHTML = `<span class="nivel-badge nivel-${task.nivel.toLowerCase()}">${task.nivel}</span>`;
    });
}

function renderTabelaAnteriores(tasks) {
    const tableBody2 = document.getElementById('tabela-anteriores');
    tableBody2.innerHTML = '';
    
    if (tasks.length === 0) {
        tableBody2.innerHTML = '<tr><td colspan="7" class="empty-cell"><i class="fas fa-smile"></i> Nenhuma tarefa anterior</td></tr>';
        return;
    }
    
    tasks.forEach(task => {
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
        turmaCell2.innerHTML = formatTurmasInfo(task.turmasInfo);
        pedidaCell2.textContent = new Date(task.pedida).toLocaleDateString('pt-BR');
        
        if (task.turmasInfo && task.turmasInfo.length > 0) {
            const entregas = task.turmasInfo.map(info => {
                const entregaDate = new Date(info.entrega);
                return `${info.turma === 't1-t3' ? 'T1-T3' : 'T4-T6'}: ${entregaDate.toLocaleDateString('pt-BR')}`;
            }).join('<br>');
            entregaCell2.innerHTML = entregas;
        } else if (task.entrega) {
            entregaCell2.textContent = new Date(task.entrega).toLocaleDateString('pt-BR');
        } else {
            entregaCell2.textContent = '—';
        }
        
        nivelCell2.innerHTML = `<span class="nivel-badge nivel-${task.nivel.toLowerCase()}">${task.nivel}</span>`;
    });
}

async function loadLembretes() {
    try {
        const response = await fetch('/lembretes');
        const lembretes = await response.json();
        
        const containerLembretes = document.getElementById('container-lembretes');
        containerLembretes.innerHTML = '';
        
        // Função para formatar data no padrão YYYY-MM-DD usando UTC
        function formatarDataUTC(data) {
            const ano = data.getUTCFullYear();
            const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
            const dia = String(data.getUTCDate()).padStart(2, '0');
            return `${ano}-${mes}-${dia}`;
        }
        
        // Data atual em UTC
        const agora = new Date();
        const hojeUTC = formatarDataUTC(agora);
        
        // Verificar se deve incluir ontem (antes das 7h no horário de Brasília)
        // Brasília é UTC-3
        const horaBrasilia = agora.getUTCHours() - 3;
        const incluirOntem = horaBrasilia < 8;
        
        let ontemUTC = '';
        if (incluirOntem) {
            const dataOntem = new Date(agora);
            dataOntem.setUTCDate(dataOntem.getUTCDate() - 1);
            ontemUTC = formatarDataUTC(dataOntem);
        }
        
        // Filtrar lembretes que são para hoje ou para ontem (se for antes das 8h)
        const lembretesHoje = lembretes.filter(lembrete => {
            // A data do lembrete já está no formato YYYY-MM-DD
            const dataLembrete = lembrete.date;
            return dataLembrete === hojeUTC || (incluirOntem && dataLembrete === ontemUTC);
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
                        <span style="white-space: pre-wrap;">${lembrete.desc}</span>
                    </div>
                `;
                containerLembretes.appendChild(divLembrete);
            });
            containerLembretes.style.display = 'block';
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
