const EMAILJS_CHAVE_PUBLICA = "zJp8EQgmY9aFGv7tU";
const EMAILJS_SERVICO = "service_cu95wvq";
const EMAILJS_MODELO = "template_hiladq9";

const formContato = document.getElementById("form-contato");
const avisoContato = document.getElementById("aviso-contato");
const botaoEnviar = document.getElementById("botao-enviar");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoMensagem = document.getElementById("mensagem");

const textosContato = {
    pt: {
        vNome: "Digite seu nome.",
        vEmail: "Digite seu e-mail.",
        vEmailValido: "Digite um e-mail válido.",
        vCurta: "A sua mensagem está muito curta (mínimo de 10 caracteres).",
        servicoIndisponivel: "Servico de e-mail indisponível no momento.",
        enviando: "Enviando...",
        enviado: "Mensagem enviada! Obrigado pelo contato.",
        erroEnvio: "Não foi possível enviar. Tente novamente.",
        botaoPadrao: "Enviar"
    },
    en: {
        vNome: "Please enter your name.",
        vEmail: "Please enter your email.",
        vEmailValido: "Please enter a valid email.",
        vCurta: "Your message is too short (minimum 10 characters).",
        servicoIndisponivel: "Email service unavailable at the moment.",
        enviando: "Sending...",
        enviado: "Message sent! Thanks for getting in touch.",
        erroEnvio: "Could not send. Please try again.",
        botaoPadrao: "Send"
    }
};

if(typeof emailjs !== "undefined")
{
    emailjs.init({ publicKey: EMAILJS_CHAVE_PUBLICA });
}
else
{
    console.log("EmailJS não carregou: confira a tag <script> da CDN no HTML.");
}

function mostrarAviso(texto, tipo)
{
    avisoContato.textContent = texto;

    avisoContato.classList.remove("erro", "sucesso");

    if(tipo !== "")
    {
        avisoContato.classList.add(tipo);
    }
}

function validarFormulario(nome, email, mensagem, lang)
{
    const t = textosContato[lang];

    if(nome === "")
    {
        return t.vNome;
    }
    if(email === "")
    {
        return t.vEmail;
    }

    if(!email.includes("@")||!email.includes("."))
    {
        return t.vEmailValido;
    }

    if(mensagem.length < 10)
    {
        return t.vCurta;
    }

    return "";
}

formContato.addEventListener("submit", (evento) =>
{
    evento.preventDefault();

    const lang = typeof idiomaAtual !== 'undefined' ? idiomaAtual : "pt";
    const t = textosContato[lang];

    const nome = campoNome.value.trim();
    const email = campoEmail.value.trim();
    const mensagem = campoMensagem.value.trim();

    const problema = validarFormulario(nome, email, mensagem, lang);
    if(problema !== "")
    {
        mostrarAviso(problema, "erro");
        return;
    }

    if(typeof emailjs === "undefined")
    {
        mostrarAviso(t.servicoIndisponivel, "erro");
        return;
    }

    botaoEnviar.disabled = true;
    botaoEnviar.textContent = t.enviando;
    mostrarAviso(t.enviando, "");

    emailjs.sendForm(EMAILJS_SERVICO, EMAILJS_MODELO, formContato).then(() =>
    {
        mostrarAviso(t.enviado, "sucesso");
        formContato.requestFullscreen();
    }).catch((falha) =>
    {
        console.log("Falha no envio:", falha);
        mostrarAviso(t.erroEnvio, "erro");
    }).finally(() =>
    {
        botaoEnviar.disabled = false;
        botaoEnviar.textContent = t.botaoPadrao;
    });
});

