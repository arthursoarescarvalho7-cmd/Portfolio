const conteinerExp = document.getElementById("linha-tempo");
const listaExp = document.getElementById("lista-experiencias");
const svgExp = document.getElementById("linha-svg");
const caminhoExp = document.getElementById("linha-caminho");
const bolinhaExp = document.getElementById("bolinha-fixa");
const progressoExp = document.getElementById("linha-progresso");

const experienciasOrdenadas = [...experiencias].sort((a,b) =>
{
    return a.inicio.localeCompare(b.inicio);
});

function formatarMesExp(data)
{
    const meses = ["jan", "fev", "mar", "abr", "mai", "jun",
                   "jul", "ago", "set", "out", "nov", "dez"];
    const partes = data.split("-");
    return meses[Number(partes[1]) - 1] + "/" + partes[0];
}

function formatarPeriodoExp(inicio,fim)
{
    const ate = fim ? formatarMesExp(fim) : "atual";
    return formatarMesExp(inicio) + "-" + ate;
}

function desenharExperiencias(lang)
{
    const html = experienciasOrdenadas.map((e,i) =>
    {
        const lado = (i%2 === 0) ? "dir" : "esq";
        return `<article class="exp ${lado}">
                    <div class="exp-card">
                        <div class="exp-foto">
                            <img src="${e.imagem}" alt="Imagem de ${e.instituicao[lang]}">
                        </div>
                        <div class="exp-texto">
                            <h3>${e.cargo[lang]}</h3>
                            <p class="exp-inst">${e.instituicao[lang]}</p>
                            <time datetime="${e.inicio}">${formatarPeriodoExp(e.inicio, e.fim)}</time>
                            <p>${e.descricao[lang]}</p>
                        </div>
                    </div>
                </article>`;
    }).join("");

    listaExp.innerHTML = html;

    ativarRevelacao();
}

function ativarRevelacao()
{
    conteinerExp.classList.add("animada");

    const observador = new IntersectionObserver((entradas) =>
    {
        entradas.forEach((entrada) =>
        {
            entrada.target.classList.toggle("visivel", entrada.isIntersecting);
        });
    },
    {
        rootMargin: "-49% 0px -49% 0px"
    });

    listaExp.querySelectorAll(".exp-card").forEach((card) =>
    {
        observador.observe(card);
    });
}

const DESLOCAMENTO_MAX = 70;
const CURVA_MAX = 360;
const LINHA_PROGRESSIVA = true;
const PASSO_AMOSTRA = 2;

let pontosLinha = [];
let comprimentoTotal = 0;

function montarLinha()
{
    const largura = conteinerExp.offsetWidth;
    const altura = conteinerExp.offsetHeight;
    const celular = window.innerWidth <= 768;

    const xBase = celular ? 24 : largura/2;
    const desloc = celular ? 0 : Math.min(DESLOCAMENTO_MAX, largura * 0.08);

    svgExp.setAttribute("viewBox", `0 0 ${largura} ${altura}`);

    const paradas = [];
    listaExp.querySelectorAll(".exp").forEach((bloco) =>
    {
        const card = bloco.querySelector(".exp-card");
        const centro = bloco.offsetTop + bloco.offsetHeight/2;
        const meia = card.offsetHeight/2 + 20;
        const sentido = bloco.classList.contains("dir") ? -1 : 1;

        paradas.push({centro: centro, meia: meia, x: xBase + sentido * desloc});
    });

    let passo = Infinity;
    let maiorMeia = 0;
    paradas.forEach((p,i) =>
    {
        if(p.meia > maiorMeia)
        {
            maiorMeia = p.meia;
        }
        if(i>0)
        {
            passo = Math.min(passo, p.centro - paradas[i-1].centro);
        }
    });

    let curva = Math.max(20, Math.min(CURVA_MAX, (passo - 2 *maiorMeia)/2 - 10));

    if(paradas.length > 0)
    {
        const primeira = paradas[0];
        const ultima = paradas[paradas.length - 1];
        const folgaTopo = primeira.centro - primeira.meia;
        const folgaBase = altura - (ultima.centro + ultima.meia);
        curva = Math.max(20, Math.min(curva, folgaTopo, folgaBase));
    }

    let d = `M ${xBase} 0`;

    paradas.forEach((p) =>
    {
        const ini = p.centro - p.meia;
        const fim = p.centro + p.meia;
        const m = curva/2;

        d+= ` L ${xBase} ${ini - curva}`;
        d+= ` C ${xBase} ${ini - m}, ${p.x} ${ini - m}, ${p.x} ${ini}`;
        d+= ` L ${p.x} ${fim}`;
        d+= ` C ${p.x} ${fim + m}, ${xBase} ${fim + m}, ${xBase} ${fim + curva}`;
    });

    d+= ` L ${xBase} ${altura}`;
    caminhoExp.setAttribute("d", d);

    comprimentoTotal = caminhoExp.getTotalLength();
    pontosLinha = [];
    for(let c =0; c<= comprimentoTotal; c+=PASSO_AMOSTRA)
    {
        const ponto = caminhoExp.getPointAtLength(c);
        pontosLinha.push({ x: ponto.x, y: ponto.y, c: c});
    }
    const ultimo = caminhoExp.getPointAtLength(comprimentoTotal);
    pontosLinha.push({ x: ultimo.x, y: ultimo.y, c: comprimentoTotal });

    if(LINHA_PROGRESSIVA)
    {
        progressoExp.setAttribute("d", d);
        progressoExp.style.strokeDasharray = comprimentoTotal;
        progressoExp.style.strokeDashoffset = comprimentoTotal;
    }

    conteinerExp.classList.add("com-svg");
}

function pontoNaAltura(y)
{
    let baixo = 0;
    let alto =  pontosLinha.length - 1;
    while(baixo < alto)
    {
        const meio = Math.floor((baixo + alto) / 2);
        if(pontosLinha[meio].y < y)
        {
            baixo = meio + 1;
        }
        else
        {
            alto = meio;
        }
    }

    const b = pontosLinha[baixo];
    if(baixo === 0)
    {
        return { x: b.x, c: b.c};
    }
    const a = pontosLinha[baixo - 1];

    const intervalo = b.y - a.y;
    const t = (intervalo === 0) ? 0 : (y - a.y) / intervalo;

    return {
        x: a.x + (b.x - a.x) * t,
        c: a.c + (b.c - a.c) * t
    };
}

function moverBolinha()
{
    if(pontosLinha.length === 0)
    {
        return;
    }

    const caixa = conteinerExp.getBoundingClientRect();
    const y = window.innerHeight / 2 - caixa.top;
    const yMaximo = pontosLinha[pontosLinha.length - 1].y;
    
    const dentro = (y >= 0 && y <= yMaximo);
    bolinhaExp.classList.toggle("fora", !dentro);

    const yUsado = Math.max(0, Math.min(y, yMaximo));
    const ponto = pontoNaAltura(yUsado);

    const meia = bolinhaExp.offsetWidth / 2;
    const xTela = caixa.left + ponto.x - meia;
    bolinhaExp.style.transform = `translate3d(${xTela}px, -50%, 0)`;

    if(LINHA_PROGRESSIVA)
    {
        progressoExp.style.strokeDashoffset = comprimentoTotal -  ponto.c;
    }
}

let quadroPendente = false;

function aoRolar()
{
    if(quadroPendente)
    {
        return;
    }
    quadroPendente = true;
    requestAnimationFrame(() =>
    {
        quadroPendente = false;
        moverBolinha();
    });
}

function iniciarLinha()
{
    const observador = new ResizeObserver(() =>
    {
        if(conteinerExp.offsetWidth === 0)
        {
            return;
        }
        montarLinha();
        moverBolinha();
    });
    observador.observe(conteinerExp);

    window.addEventListener("scroll", aoRolar);
}

desenharExperiencias("pt");
iniciarLinha();

document.addEventListener("mudancaIdioma", (evento) =>
{
    const lang = evento.detail.idioma;
    desenharExperiencias(lang);
})