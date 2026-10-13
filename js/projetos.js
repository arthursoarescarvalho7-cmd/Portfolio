const areaFiltros = document.getElementById('filtros');
const areaCatalogo = document.getElementById('catalogo');
const modal = document.getElementById('modal-projeto');
const areaDetalhe = document.getElementById('detalhe');

let filtroAtual = 'Todos';
let projetoAtualId = null;

const projetosOrdenados = [...projetos].sort((a,b) =>
{
    return a.data.localeCompare(b.data);
});

function formatarData(data)
{
    const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const partes = data.split('-');
    const ano = partes[0];
    const mes = Number(partes[1]);
    return meses[mes-1]+'/'+ano;
}

function listarLinguagens()
{
    const linguagens = [];

    projetos.forEach((projeto) =>
    {
        projeto.linguagens.forEach((ling) =>
        {
            if(!linguagens.includes(ling))
            {
                linguagens.push(ling);
            }
        });
    });

    linguagens.sort();

    const lang = typeof idiomaAtual !== 'undefined' ? idiomaAtual : 'pt';
    const textoTodos = (lang === 'en') ? 'All' : 'Todos';

    return [textoTodos, ...linguagens];
}

function montarMidia(projeto)
{
    if(!projeto.midia) 
    { 
        return '';
    }

    const lang = typeof idiomaAtual !== 'undefined' ? idiomaAtual : "pt";
    
    if(!projeto.midia)
    {
        return '';
    }

    if(projeto.midia.endsWith('.mp4'))
    {
        return `<video src="${projeto.midia}" controls muted loop autoplay playsinline></video>`;
    }
    else
    {
        return `<img src="${projeto.midia}" alt="Demonstração de ${projeto.nome[lang]}">`;
    }
}

function desenharFiltros()
{
    const html = listarLinguagens().map((ling) =>
    {
        const classe = (ling === filtroAtual) ? 'filtro ativa' : 'filtro';
        return `<button type="button" class="${classe}" data-linguagem="${ling}">${ling}</button>`;
    }).join('');

    areaFiltros.innerHTML = html;

    areaFiltros.querySelectorAll('.filtro').forEach((botao) =>
    {
        botao.addEventListener('click', () =>
        {
            filtroAtual = botao.dataset.linguagem;
            desenharFiltros();
            desenharCatalogo();
        });
    });
}

function desenharCatalogo()
{
    let visiveis;
    if(filtroAtual === 'Todos' || filtroAtual === 'All')
    {
        visiveis = projetosOrdenados;
    }
    else
    {
        visiveis = projetosOrdenados.filter((p) => p.linguagens.includes(filtroAtual));
    }

    if(visiveis.length === 0)
    {
        areaCatalogo.innerHTML = '<p>Nenhum projeto com esta Linguagem.</p>';
        return;
    }

    const lang = typeof idiomaAtual !== 'undefined' ? idiomaAtual : "pt";
    const html = visiveis.map((p) =>
        `<article class="card-projeto" onclick="abrirProjeto('${p.id}')">
            <img src="${p.imagem}" alt="Captura de tela de ${p.nome[lang]}" loading="lazy">
            <div class="card-texto">
                <h3>${p.nome[lang]}</h3>
                <time datetime="${p.data}">${formatarData(p.data)}</time>
                <p>${p.descricaoBreve[lang]}</p>
            </div>
        </article>`
    ).join('');

    areaCatalogo.innerHTML = html;
}

function abrirProjeto(id)
{
    const projeto = projetos.find((p)=>p.id === id);

    if(!projeto)
    {
        return;
    }

    projetoAtualId = id;

    const lang = typeof idiomaAtual !== 'undefined' ? idiomaAtual : "pt";
    const itens = projeto.linguagens.map((ling)=>`<li>${ling}</li>`).join('');

    const midia = montarMidia(projeto);
    const colunaMidia = midia ? `<div class="detalhe-midia">${midia}</div>` : '';

    areaDetalhe.innerHTML = `
    <div class="detalhe-projeto">
        ${colunaMidia}
        <div class="detalhe-texto">
            <h2>${projeto.nome[lang]}</h2>
            <time datetime="${projeto.data}">${formatarData(projeto.data)}</time>
            <p>${projeto.descricaoCompleta[lang]}</p>
            <ul class="tecnologias">${itens}</ul>
            <a class="botao-link" href="${projeto.github}" target="_blank" rel="noopener noreferrer" data-i18n="modal-github">Ver no GitHub</a>
        </div>
    </div>`;

    modal.classList.add('aberto');
    document.body.classList.add('modal-aberto');
}

function fecharProjeto()
{
    modal.classList.remove('aberto');
    document.body.classList.remove('modal-aberto');
    projetoAtualId = null;
    areaDetalhe.innerHTML = '';
}

modal.addEventListener('click', (evento) =>
{
    if(evento.target === modal)
    {
        fecharProjeto();
    }
});

document.addEventListener('keydown', (evento) =>
{
    if(evento.key === 'Escape')
    {
        fecharProjeto();
    }
});

document.addEventListener("mudancaIdioma", (evento) =>
{
    const lang = evento.detail.idioma;

    if(filtroAtual === 'Todos' || filtroAtual === 'All')
    {
        filtroAtual = (lang === 'en') ? 'All' : 'Todos';
    }

    desenharFiltros();
    desenharCatalogo();

    if(modal.classList.contains("aberto") && projetoAtualId)
    {
        abrirProjeto(projetoAtualId);
    }
});

desenharFiltros();
desenharCatalogo();