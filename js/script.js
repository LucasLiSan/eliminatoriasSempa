//Carregar infos do JSON

const CATEGORIAS = {
  A: [2017, 2016],
  B: [2015, 2014],
  C: [2013, 2012],
  D: [2011, 2010],
  E: [2009, 2008]
};

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
  for (const [categoria, anos] of Object.entries(CATEGORIAS)) {
    if (anos.includes(anoNasc)) return categoria;
  }
  return "Sem categoria";
}

function gerarIconeModalidade(nome) {
  return `assets/${nome}.png`;  // Mantém o nome original com espaços e caracteres
}

function criarCard(participante) {
  const idade = calcularIdade(participante.nascimento);
  const anoNascimento = parseInt(participante.nascimento.split("/")[2]);
  const categoria = descobrirCategoria(anoNascimento);

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="ds-top"></div>
    <div class="avatar-holder">
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1820405/profile/profile-512.jpg?1533058950" alt="Albert Einstein">
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
  return card;
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("json/db.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao carregar o arquivo JSON");
      }
      return response.json();
    })
    .then(dados => {
      const container = document.getElementById("containerParticipantes");
      const participantes = dados.eliminatorias[0].participantes;

      participantes.forEach(part => {
        const card = criarCard(part);
        container.appendChild(card);
      });
    })
    .catch(erro => {
      console.error("Erro ao processar os dados:", erro);
    });
});