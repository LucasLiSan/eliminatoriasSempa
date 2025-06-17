//Carregar infos do JSON

let participantes = [];

function calcularIdade(dataNascimento) {
  const hoje = new Date();
  const [dia, mes, ano] = dataNascimento.split("/").map(Number);
  const nascimento = new Date(ano, mes - 1, dia);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

function descobrirCategoria(anoNasc) {
  const categorias = {
    A: [2017, 2016],
    B: [2015, 2014],
    C: [2013, 2012],
    D: [2011, 2010],
    E: [2009, 2008]
  };
  for (const [categoria, anos] of Object.entries(categorias)) {
    if (anos.includes(anoNasc)) return categoria;
  }
  return "Sem categoria";
}

function gerarIconeModalidade(nome) {
  return `assets/${nome}.png`;
}

function criarCard(participante) {
    const idade = calcularIdade(participante.nascimento);
    const anoNascimento = parseInt(participante.nascimento.split("/")[2]);
    const categoria = descobrirCategoria(anoNascimento);

    const container = document.getElementById("containerParticipantes");
    container.innerHTML = "";  // Limpa o conteúdo anterior

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <div class="ds-top"></div>
        <div class="avatar-holder">
        <img src="assets/profilePic.Standard.webp" alt="Aluno">
        </div>
        <div class="name">
        <a>${participante.nome}</a>
        <h6 title="idade"><i class="fas fa-users"></i> <span class="idade">${idade} anos</span></h6>
        </div>
        <div class="ds-info">
        <div class="ds pens">
        <h6 title="Number of pens created by the user">Turma <i class="fas fa-edit"></i></h6>
        <p>${participante.turma}</p>
        </div>
        <div class="ds projects">
        <h6 title="Number of projects created by the user">Categoria <i class="fas fa-project-diagram"></i></h6>
        <p>Categoria ${categoria}</p>
        </div>
        <div class="ds posts">
        <h6 title="Number of posts">Equipe <i class="fas fa-comments"></i></h6>
        <p>${participante.equipe}</p>
        </div>
        </div>
        <div class="ds-skill">
            <h6>Modalidades <i class="fa fa-code" aria-hidden="true"></i></h6>
            ${participante.modalidades.map(modalidade => {
                const img = gerarIconeModalidade(modalidade);
                return `<div class="skill">
                <h6><img src="${img}" alt="${modalidade}"> ${modalidade}</h6>
                </div>`;
            }).join("")}
        </div>
    `;
    container.appendChild(card);
}

document.addEventListener("DOMContentLoaded", () => {
  // Carrega o JSON só uma vez no início
  fetch("json/db.json")
    .then(response => response.json())
    .then(dados => {
      participantes = dados.eliminatorias[0].participantes;
    })
    .catch(erro => {
      console.error("Erro ao carregar os dados:", erro);
    });

  document.querySelector(".inptSubmit").addEventListener("click", () => {
    const senhaDigitada = document.querySelector(".inptPass").value.trim();

    const participante = participantes.find(p => p.senha === senhaDigitada);

    if (participante) {
      document.getElementById("login").style.display = "none";
      const container = document.getElementById("containerParticipantes");
      container.style.display = "block";
      criarCard(participante);
    } else {
      alert("Senha não encontrada. Verifique e tente novamente.");
    }
  });
});