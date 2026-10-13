const botoes = document.querySelectorAll('nav button');
const abas = document.querySelectorAll('.aba');

function mostrarAba(idAlvo)
{
    abas.forEach((aba) => 
    {
        if(aba.id === idAlvo)
        {
            aba.classList.add('ativa');
        }
        else
        {
            aba.classList.remove('ativa');
        }
    });

    botoes.forEach((botao) =>
    {
        if(botao.dataset.alvo === idAlvo)
        {
            botao.classList.add('ativa');
        }
        else
        {
            botao.classList.remove('ativa');
        }
    });
}

botoes.forEach((botao)=>
{
    botao.addEventListener('click', () =>
    {
        mostrarAba(botao.dataset.alvo);
    });
});

mostrarAba(botoes[0].dataset.alvo);