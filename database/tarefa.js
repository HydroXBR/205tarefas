import pkg from "mongoose"
const {Schema, model} = pkg

const comentarioSchema = Schema({
	author: String, 
	comment: String, 
	date: Date 
});

// Schema para informações específicas de cada turma
const turmaInfoSchema = Schema({
	turma: { 
		type: String, 
		required: true,
		enum: ['t1-t3', 't4-t6', 'ambas']
	},
	entrega: { type: Number, required: true }, // Data de entrega específica para esta turma
	observacao: { type: String, default: '' }, // Observação específica para esta turma
	status: { 
		type: String, 
		default: 'pendente',
		enum: ['pendente', 'entregue', 'cancelada']
	}
});

const schema = Schema({
	title: { type: String, required: true },
	tipo: { type: String, required: true },
	desc: { type: String, required: true },
	disc: { type: String, required: true },
	nivel: { type: String, required: true },
	pedida: { type: Number, required: true },
	author: { type: String, required: true },
	
	// Campo para compatibilidade com versão anterior (será depreciado)
	entrega: { type: Number, default: null },
	turma: { type: String, default: null },
	
	// Novo campo para múltiplas turmas
	turmasInfo: [turmaInfoSchema],
	
	observacaoGeral: { type: String, default: '' }, // Observação geral para todas as turmas
	
	comments: [comentarioSchema],
	registered: { type: Number, default: new Date().getTime() }
});

// Middleware para garantir compatibilidade com dados antigos
schema.pre('save', function(next) {
	// Se tem dados antigos e não tem turmasInfo, converter
	if (this.entrega && this.turma && (!this.turmasInfo || this.turmasInfo.length === 0)) {
		this.turmasInfo = [{
			turma: this.turma,
			entrega: this.entrega,
			observacao: '',
			status: 'pendente'
		}];
	}
	next();
});

// Método para adicionar ou atualizar informações de uma turma
schema.methods.addTurmaInfo = function(turma, entrega, observacao = '') {
	const existingIndex = this.turmasInfo.findIndex(t => t.turma === turma);
	if (existingIndex !== -1) {
		this.turmasInfo[existingIndex].entrega = entrega;
		this.turmasInfo[existingIndex].observacao = observacao;
	} else {
		this.turmasInfo.push({
			turma: turma,
			entrega: entrega,
			observacao: observacao,
			status: 'pendente'
		});
	}
};

// Método para obter a data de entrega de uma turma específica
schema.methods.getEntregaByTurma = function(turma) {
	const turmaInfo = this.turmasInfo.find(t => t.turma === turma);
	return turmaInfo ? turmaInfo.entrega : null;
};

// Método para obter todas as datas de entrega formatadas
schema.methods.getDatasEntrega = function() {
	const datas = {};
	this.turmasInfo.forEach(info => {
		datas[info.turma] = {
			entrega: info.entrega,
			observacao: info.observacao,
			status: info.status
		};
	});
	return datas;
};

const tarefa = model('205tarefas', schema);
export default tarefa;
