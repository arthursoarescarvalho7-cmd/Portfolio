const traducoes = {
    pt: {
        "nav-sobre": "Sobre Mim",
        "nav-projetos": "Projetos",
        "nav-experiencias": "Experiências",
        "nav-contatos": "Contatos",
        "apresentacao-titulo": "Apresentação",
        "formacao-titulo": "Formação",
        "interesses-titulo": "Interesses",
        "objetivos-titulo": "Objetivos Profissionais",
        "apresentacao-texto": `Sou graduando do 2° período do curso de Ciências da Computação da PUC Minas - Coreu, 
                                com experiência acadêmica com a linguagem C, C++, Java, HTML, CSS e JavaScript, além de 
                                projetos desenvolvidos em discicplinas usando algumas destas linguagens em conjunto do sistema
                                arduíno, mas estou aberto para aprender conforme seja requisitado na minha trajetória profissional.
                                Procuro oportunidades para expandir meu conhecimento técnico sobre a área da tecnologia da 
                                informação e desenvolver outros projetos que me desafiem e possibilitem a evolução de minhas 
                                habilidades. Já participo de oficinas e eventos que proporcionam momentos de aprendizado, mas 
                                também prática, sempre a procura de mais oportunidades como as que eu já participei.`,
        "formacao-texto": `Desenvolvedor | Ciências da Computação - PUC Minas`,
        "objetivos-texto": `Busco uma oportunidade de estágio em desenvolvimento web, com interesse em frontend. Meu objetivo 
                            é crescer como programador, e mais para frente como Creative Developer, e contribuir com projetos
                            em que eu possa criar experiências únicas que marcaram os visitantes e/ou usuários de sites toda
                            vez que eles passarem por ele, seja devido o seu design ou o seu fluxo.`,
        "interesses-1": '-Design gráfico',
        "interesses-2": '-Frontend',
        "interesses-3": '-Processo criativo',
        "contatos-texto": 'Fale Comigo',
        "contatos-nome": 'Nome',
        "contatos-mensagem": 'Mensagem',
        "placeholder-nome": "Seu nome",
        "placeholder-email": "voce@exemplo.com",
        "placeholder-mensagem": "Escreva sua mensagem",
        "botao-enviar": 'Enviar',
        "modal-voltar": '← Voltar',
        "modal-github": 'Ver no GitHub',
        "habilidade1": '-Organização',
        "habilidade2": '-Trabalho em equipe',
        "habilidade3": '-Comunicação clara',
        "habilidade4": '-Fácil aprendizagem',
        "habilidades-titulo": 'Habilidades',
        "linguagens-titulo": 'Linguagens'
    },
    en: {
        "nav-sobre": "About Me",
        "nav-projetos": "Projects",
        "nav-experiencias": "Experiences",
        "nav-contatos": "Contacts",
        "apresentacao-titulo": "Presentation",
        "formacao-titulo": "Degree",
        "interesses-titulo": "Interests",
        "objetivos-titulo": "Professional Goals",
        "apresentacao-texto": `I am a second-semester Computer Science student at PUC Minas (Coreu) with academic experience in C,
        C++, Java, HTML, CSS, and JavaScript. I have also worked on course projects utilizing some of these languages ​​in conjunction
        with Arduino systems, though I am open to learning new technologies as required throughout my professional career. I am seeking
        opportunities to expand my technical knowledge in the IT field and to work on projects that challenge me and foster the growth 
        of my skills. I already participate in workshops and events that offer both learning and hands-on practice, and I am constantly
        looking for further opportunities similar to those I have already experienced.`,
        "formacao-texto": `Developer | Computer Science - PUC Minas`,
        "objetivos-texto": `I am seeking a web development internship with a focus on frontend development. My goal is to grow as a 
        programmer—and eventually as a Creative Developer—and to contribute to projects where I can create unique experiences that leave 
        a lasting impression on visitors and users, whether through design or user flow.`,
        "interesses-1": '-Graphic Design',
        "interesses-2": '-Frontend',
        "interesses-3": '-Creative Thinking',
        "contatos-texto": 'Contact me',
        "contatos-nome": 'Name',
        "contatos-mensagem": 'Message',
        "placeholder-nome": "Your name",
        "placeholder-email": "you@example.com",
        "placeholder-mensagem": "Write down your message",
        "botao-enviar": 'Send',
        "modal-voltar": '← Back',
        "modal-github": 'View on GitHub',
        "habilidade1": '-Organization',
        "habilidade2": '-Teamwork',
        "habilidade3": '-Clear comunication',
        "habilidade4": '-Fast learning',
        "habilidades-titulo": 'Abilities',
        "linguagens-titulo": 'Languages'
    }
};

let idiomaAtual = "pt";

function alternarIdioma()
{
    idiomaAtual = idiomaAtual === "pt" ? "en" : "pt";

    const spanPt = document.querySelector(".opcao-lang.pt");
    const spanEn = document.querySelector(".opcao-lang.en");

    if(idiomaAtual === "en")
    {
        spanPt.classList.remove("ativo");
        spanEn.classList.add("ativo");
    }
    else
    {
        spanPt.classList.add("ativo");
        spanEn.classList.remove("ativo");
    }

    atualizarTextosNaTela();
}

function atualizarTextosNaTela()
{
    document.querySelectorAll("[data-i18n]").forEach(elemento =>
    {
        const chave = elemento.getAttribute("data-i18n");
        if(traducoes[idiomaAtual][chave])
        {
            elemento.textContent = traducoes[idiomaAtual][chave];
        }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(elemento =>
    {
        const chave = elemento.getAttribute("data-i18n-placeholder");
        if(traducoes[idiomaAtual][chave])
        {
            elemento.placeholder = traducoes[idiomaAtual][chave];
        }
    });

    const eventoIdioma = new CustomEvent("mudancaIdioma", { detail:{ idioma: idiomaAtual}});
    document.dispatchEvent(eventoIdioma);
}

document.getElementById("botao-idioma").addEventListener("click", alternarIdioma)