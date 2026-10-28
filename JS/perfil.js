/* ==========================================================
   CURRÍCULO WEB INTELIGENTE
   1. Elementos  2. Armazenamento  3. Perfil  4. Tema  5. Visita
   ========================================================== */

/* 1. ELEMENTOS DA PÁGINA */
const form = document.getElementById("form-perfil");
const inputNome = document.getElementById("nome");
const inputProfissao = document.getElementById("profissao");
const inputSobre = document.getElementById("sobre");
const btnLimpar = document.getElementById("btn-limpar");
const btnTema = document.getElementById("btn-tema");
const mensagem = document.getElementById("mensagem");

const secaoVisualizacao = document.getElementById("visualizacao");
const prevNome = document.getElementById("prev-nome");
const prevProfissao = document.getElementById("prev-profissao");
const prevSobre = document.getElementById("prev-sobre");
const textoVisita = document.getElementById("ultima-visita");

const CHAVE_PERFIL = "perfil";
const CHAVE_TEMA = "tema";
const CHAVE_VISITA = "ultimaVisita";

const PADRAO = {
    nome: "Seu Nome",
    profissao: "Sua Profissão",
    sobre: "Sua descrição aparecerá aqui."
};

/* 2. ARMAZENAMENTO (localStorage guarda os dados no navegador) */
function ler(chave) {
    try {
        return localStorage.getItem(chave);
    } catch (erro) {
        return null;
    }
}

function gravar(chave, valor) {
    try {
        localStorage.setItem(chave, valor);
    } catch (erro) {
        /* se o navegador bloquear, o site continua funcionando sem salvar */
    }
}

function apagar(chave) {
    try {
        localStorage.removeItem(chave);
    } catch (erro) {}
}

/* 3. PERFIL */
function mostrarPerfil(perfil) {
    /* textContent insere só texto (seguro contra código malicioso) */
    prevNome.textContent = perfil.nome || PADRAO.nome;
    prevProfissao.textContent = perfil.profissao || PADRAO.profissao;
    prevSobre.textContent = perfil.sobre || PADRAO.sobre;
}

function mostrarMensagem(texto) {
    mensagem.textContent = texto;
    setTimeout(function () {
        mensagem.textContent = "";
    }, 3000);
}

function carregarPerfil() {
    const salvo = ler(CHAVE_PERFIL);
    if (!salvo) return;

    try {
        const perfil = JSON.parse(salvo);
        inputNome.value = perfil.nome || "";
        inputProfissao.value = perfil.profissao || "";
        inputSobre.value = perfil.sobre || "";
        mostrarPerfil(perfil);
    } catch (erro) {
        apagar(CHAVE_PERFIL);
    }
}

/* SALVAR: guarda, atualiza a visualização e desce até ela */
form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const perfil = {
        nome: inputNome.value.trim(),
        profissao: inputProfissao.value.trim(),
        sobre: inputSobre.value.trim()
    };

    gravar(CHAVE_PERFIL, JSON.stringify(perfil));
    mostrarPerfil(perfil);
    mostrarMensagem("Perfil salvo com sucesso!");

    secaoVisualizacao.scrollIntoView({ behavior: "smooth", block: "start" });
});

/* EXCLUIR: apaga os campos, os dados salvos e volta ao texto padrão */
btnLimpar.addEventListener("click", function () {
    if (!confirm("Deseja excluir o perfil salvo?")) return;

    form.reset();
    apagar(CHAVE_PERFIL);
    mostrarPerfil(PADRAO);
    mostrarMensagem("Perfil excluído.");
    inputNome.focus();
});

/* 4. TEMA (claro / escuro) */
function aplicarTema(tema) {
    document.body.classList.toggle("escuro", tema === "escuro");
}

btnTema.addEventListener("click", function () {
    const novoTema = document.body.classList.contains("escuro") ? "claro" : "escuro";
    aplicarTema(novoTema);
    gravar(CHAVE_TEMA, novoTema);
});

/* 5. ÚLTIMA VISITA */
function formatarData(data) {
    return data.toLocaleDateString("pt-BR") + " às " +
        data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function registrarVisita() {
    const agora = new Date();
    const anterior = ler(CHAVE_VISITA);

    /* mostra a visita anterior; na primeira vez, mostra a data de agora */
    const mostrar = anterior ? new Date(anterior) : agora;
    textoVisita.textContent = "Última visita registrada: " + formatarData(mostrar);

    gravar(CHAVE_VISITA, agora.toISOString());
}

/* INÍCIO: roda assim que a página abre */
aplicarTema(ler(CHAVE_TEMA));
carregarPerfil();
registrarVisita();
