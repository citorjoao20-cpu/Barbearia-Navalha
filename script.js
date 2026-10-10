// ===== EDITE AQUI =====
const WHATSAPP = "5500000000000"; // 55 + DDD + número, só dígitos
const SERVICOS = [
  ["Corte masculino", 45],
  ["Barba completa", 35],
  ["Corte + barba", 70],
  ["Pezinho e acabamento", 15],
  ["Sobrancelha", 15]
];
// Horário de funcionamento: dia da semana (0 = domingo) → [abre, fecha]
const HORARIOS = { 1:[9,19], 2:[9,19], 3:[9,19], 4:[9,19], 5:[9,19], 6:[9,17] };
// ======================

const $ = id => document.getElementById(id);
const sel = $("servico");
const data = $("data");
const slots = $("slots");
const msg = $("msg");
const pad = n => String(n).padStart(2, "0");

// Preenche ano do rodapé, link do WhatsApp e a lista de serviços
$("ano").textContent = new Date().getFullYear();
$("zap").href = "https://wa.me/" + WHATSAPP;
SERVICOS.forEach(([nome, preco]) => sel.add(new Option(`${nome} — R$ ${preco}`, nome)));

// Não deixa escolher dias que já passaram
const hoje = new Date();
data.min = `${hoje.getFullYear()}-${pad(hoje.getMonth() + 1)}-${pad(hoje.getDate())}`;

// Quando o cliente escolhe o dia, mostra os horários livres
data.addEventListener("change", () => {
  msg.textContent = "";
  const [ano, mes, dia] = data.value.split("-").map(Number);
  if (!ano) return;

  const faixa = HORARIOS[new Date(ano, mes - 1, dia).getDay()];
  slots.innerHTML = "";
  if (!faixa) { slots.textContent = "Fechado aos domingos. Escolha outro dia."; return; }

  const agora = new Date();
  for (let h = faixa[0]; h < faixa[1]; h++) {
    for (const min of [0, 30]) {
      if (new Date(ano, mes - 1, dia, h, min) <= agora) continue; // já passou
      const hora = `${pad(h)}:${pad(min)}`;
      slots.insertAdjacentHTML("beforeend",
        `<label><input type="radio" name="hora" value="${hora}"><span>${hora}</span></label>`);
    }
  }
  if (!slots.children.length) slots.textContent = "Sem horários livres neste dia.";
});

// Quando clica em confirmar, valida e abre o WhatsApp com a mensagem pronta
$("form").addEventListener("submit", e => {
  e.preventDefault();
  const nome = $("nome").value.trim();
  const hora = document.querySelector('input[name="hora"]:checked');

  if (!nome)       { msg.textContent = "Digite seu nome.";    $("nome").focus(); return; }
  if (!data.value) { msg.textContent = "Escolha o dia.";      data.focus();      return; }
  if (!hora)       { msg.textContent = "Escolha um horário."; return; }

  const [a, m, d] = data.value.split("-");
  const texto = `Olá! Sou ${nome} e quero agendar: ${sel.value}, dia ${d}/${m}/${a} às ${hora.value}.`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
});