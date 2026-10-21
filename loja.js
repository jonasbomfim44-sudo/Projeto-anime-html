"use strict";

// Carrinho demonstrativo: não efetua compras nem envia dados pela rede.
const produtos = {
  camiseta: { nome: "Camiseta Príncipe Saiyajin", preco: 59.90 },
  poster: { nome: "Pôster Super Saiyajin Blue", preco: 29.90 },
  caneca: { nome: "Caneca Ultra Ego", preco: 45.90 }
};
const carrinho = new Map();
const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const lista = document.getElementById("carrinho-lista");
const vazio = document.getElementById("carrinho-vazio");
const contagem = document.getElementById("carrinho-contagem");
const total = document.getElementById("carrinho-total");
const finalizar = document.getElementById("finalizar-pedido");
const mensagem = document.getElementById("mensagem-pedido");

function renderizarCarrinho() {
  lista.replaceChildren();
  let quantidade = 0;
  let subtotal = 0;

  for (const [id, qtd] of carrinho) {
    const produto = produtos[id];
    quantidade += qtd;
    subtotal += produto.preco * qtd;

    const item = document.createElement("li");
    const descricao = document.createElement("div");
    const nome = document.createElement("strong");
    nome.textContent = produto.nome;
    const detalhes = document.createElement("span");
    detalhes.textContent = qtd + " × " + moeda.format(produto.preco);
    descricao.append(nome, detalhes);

    const remover = document.createElement("button");
    remover.type = "button";
    remover.textContent = "Remover −";
    remover.setAttribute("aria-label", "Remover uma unidade de " + produto.nome);
    remover.addEventListener("click", function() {
      const novo = (carrinho.get(id) || 0) - 1;
      if (novo <= 0) carrinho.delete(id);
      else carrinho.set(id, novo);
      mensagem.hidden = true;
      renderizarCarrinho();
    });
    item.append(descricao, remover);
    lista.append(item);
  }

  vazio.hidden = quantidade > 0;
  contagem.textContent = quantidade + (quantidade === 1 ? " item" : " itens");
  total.textContent = moeda.format(subtotal);
  finalizar.disabled = quantidade === 0;
}

document.querySelectorAll("[data-add]").forEach(function(botao) {
  botao.addEventListener("click", function() {
    const id = botao.dataset.add;
    if (!produtos[id]) return;
    carrinho.set(id, (carrinho.get(id) || 0) + 1);
    mensagem.hidden = true;
    renderizarCarrinho();
    const textoOriginal = botao.textContent;
    botao.textContent = "Adicionado ✓";
    window.setTimeout(function(){ botao.textContent = textoOriginal; }, 800);
  });
});

finalizar.addEventListener("click", function() {
  if (carrinho.size === 0) return;
  mensagem.hidden = false;
  mensagem.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

renderizarCarrinho();
