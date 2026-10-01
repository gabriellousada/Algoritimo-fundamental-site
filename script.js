const algos = [
  {
    id: "contagem",
    label: "Contagem",
    n: "01",
    title: "Contagem de ocorrências",
    desc: "Percorre uma lista e conta quantas vezes um valor aparece.",
    fields: [
      { key: "lista", label: "Lista (separada por vírgula)", value: "3, 7, 3, 9, 3, 5, 7, 3" },
      { key: "alvo", label: "Valor procurado", value: "3" }
    ],
    run(vals, viz, out) {
      const lista = parseList(vals.lista);
      const alvo = Number(vals.alvo);
      if (lista.some(isNaN) || isNaN(alvo)) throw new Error("Use apenas números.");
      let contador = 0;
      const hits = lista.map(v => v === alvo);
      for (const h of hits) if (h) contador++;
      renderBars(viz, lista, hits, (v) => v);
      out.innerHTML = `O valor <b>${alvo}</b> aparece <b>${contador}</b> ${contador === 1 ? "vez" : "vezes"}.`;
    },
    code: `let lista = [3, 7, 3, 9, 3, 5, 7, 3];
let valorProcurado = 3;
let contador = 0;

for (let i = 0; i < lista.length; i++) {
    if (lista[i] === valorProcurado) {
        contador = contador + 1;
    }
}

console.log("O valor " + valorProcurado + " aparece " + contador + " vezes");`
  },
  {
    id: "fibonacci",
    label: "Fibonacci",
    n: "02",
    title: "Sequência de Fibonacci",
    desc: "Gera os N primeiros termos, onde cada número é a soma dos dois anteriores.",
    fields: [{ key: "n", label: "Quantidade de termos (N)", value: "10" }],
    run(vals, viz, out) {
      const n = parseInt(vals.n, 10);
      if (isNaN(n) || n < 1 || n > 30) throw new Error("Escolha um N entre 1 e 30.");
      const fib = [0, 1];
      for (let i = 2; i < n; i++) fib[i] = fib[i - 1] + fib[i - 2];
      fib.length = n;
      renderBars(viz, fib, fib.map(() => false), (v) => v);
      out.textContent = fib.join(", ");
    },
    code: `let n = 10;
let fibonacci = [];

fibonacci[0] = 0;
fibonacci[1] = 1;

for (let i = 2; i < n; i++) {
    fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2];
}

for (let i = 0; i < n; i++) {
    console.log(fibonacci[i]);
}`
  },
  {
    id: "mdc",
    label: "MDC",
    n: "03",
    title: "Máximo Divisor Comum",
    desc: "Testa cada número até o menor dos dois valores para achar o maior divisor comum a ambos.",
    fields: [
      { key: "a", label: "Primeiro número", value: "48" },
      { key: "b", label: "Segundo número", value: "18" }
    ],
    run(vals, viz, out) {
      const a = parseInt(vals.a, 10), b = parseInt(vals.b, 10);
      if (isNaN(a) || isNaN(b) || a < 1 || b < 1) throw new Error("Use dois inteiros positivos.");
      let mdc = 1;
      const menor = Math.min(a, b);
      for (let i = 1; i <= menor; i++) if (a % i === 0 && b % i === 0) mdc = i;
      viz.innerHTML = "";
      out.innerHTML = `O MDC de <b>${a}</b> e <b>${b}</b> é <b>${mdc}</b>.`;
    },
    code: `let a = 48;
let b = 18;
let mdc = 1;

let menor = a;
if (b < a) {
    menor = b;
}

for (let i = 1; i <= menor; i++) {
    if (a % i === 0 && b % i === 0) {
        mdc = i;
    }
}

console.log("O MDC é " + mdc);`
  },
  {
    id: "primo",
    label: "Número Primo",
    n: "04",
    title: "Verificação de número primo",
    desc: "Testa se um número tem algum divisor entre 2 e sua raiz quadrada.",
    fields: [{ key: "numero", label: "Número", value: "29" }],
    run(vals, viz, out) {
      const numero = parseInt(vals.numero, 10);
      if (isNaN(numero)) throw new Error("Digite um número inteiro.");
      let ehPrimo = true;
      if (numero < 2) ehPrimo = false;
      else {
        for (let i = 2; i <= Math.sqrt(numero); i++) {
          if (numero % i === 0) { ehPrimo = false; break; }
        }
      }
      viz.innerHTML = "";
      out.innerHTML = ehPrimo ? `<b>${numero}</b> é primo.` : `<b>${numero}</b> não é primo.`;
    },
    code: `let numero = 29;
let ehPrimo = true;

if (numero < 2) {
    ehPrimo = false;
} else {
    for (let i = 2; i <= Math.sqrt(numero); i++) {
        if (numero % i === 0) {
            ehPrimo = false;
            break;
        }
    }
}

if (ehPrimo) {
    console.log(numero + " é primo");
} else {
    console.log(numero + " não é primo");
}`
  },
  {
    id: "ordenacao",
    label: "Ordenação",
    n: "05",
    title: "Ordenação por bolha (bubble sort)",
    desc: "Compara pares vizinhos e troca de posição sempre que estão fora de ordem, até a lista ficar crescente.",
    fields: [{ key: "lista", label: "Lista (separada por vírgula)", value: "5, 2, 9, 1, 7, 3" }],
    run(vals, viz, out) {
      const lista = parseList(vals.lista);
      if (lista.some(isNaN)) throw new Error("Use apenas números.");
      if (lista.length > 14) throw new Error("Use no máximo 14 números.");
      const arr = lista.slice();
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
          if (arr[j] > arr[j + 1]) {
            const t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t;
          }
        }
      }
      renderBars(viz, arr, arr.map(() => false), (v) => v);
      out.innerHTML = `Antes: <span class="muted">[${lista.join(", ")}]</span>\nDepois: [${arr.join(", ")}]`;
    },
    code: `let lista = [5, 2, 9, 1, 7, 3];

for (let i = 0; i < lista.length - 1; i++) {
    for (let j = 0; j < lista.length - 1 - i; j++) {
        if (lista[j] > lista[j + 1]) {
            let temp = lista[j];
            lista[j] = lista[j + 1];
            lista[j + 1] = temp;
        }
    }
}

console.log(lista);`
  },
  {
    id: "soma",
    label: "Somatório",
    n: "06",
    title: "Somatório de uma lista",
    desc: "Percorre a lista acumulando cada valor em um total.",
    fields: [{ key: "lista", label: "Lista (separada por vírgula)", value: "4, 8, 15, 16, 23, 42" }],
    run(vals, viz, out) {
      const lista = parseList(vals.lista);
      if (lista.some(isNaN)) throw new Error("Use apenas números.");
      let soma = 0;
      for (const v of lista) soma += v;
      renderBars(viz, lista, lista.map(() => false), (v) => v);
      out.innerHTML = `A soma total é <b>${soma}</b>.`;
    },
    code: `let lista = [4, 8, 15, 16, 23, 42];
let soma = 0;

for (let i = 0; i < lista.length; i++) {
    soma = soma + lista[i];
}

console.log("A soma total é " + soma);`
  }
];

function parseList(str) {
  return str.split(",").map(s => Number(s.trim())).filter(s => s.toString() !== "" && !Number.isNaN(s) || s === 0);
}

function renderBars(viz, values, hitFlags, get) {
  viz.innerHTML = "";
  const max = Math.max(...values.map(get), 1);
  values.forEach((v, i) => {
    const val = get(v);
    const bar = document.createElement("div");
    bar.className = "bar" + (hitFlags[i] ? " hit" : "");
    const h = Math.max(10, (val / max) * 90);
    bar.style.height = h + "px";
    bar.textContent = val;
    viz.appendChild(bar);
  });
}

function highlight(code) {
  return code
    .replace(/\b(let|const|for|if|else|break|return|function)\b/g, '<span class="kw">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="num">$1</span>');
}

let current = algos[0].id;

function buildTabs() {
  const tabs = document.getElementById("tabs");
  tabs.innerHTML = "";
  algos.forEach(a => {
    const b = document.createElement("button");
    b.className = a.id === current ? "active" : "";
    b.innerHTML = `<span class="n">${a.n}</span><span>${a.label}</span>`;
    b.onclick = () => { current = a.id; render(); };
    tabs.appendChild(b);
  });
}

function render() {
  buildTabs();
  const algo = algos.find(a => a.id === current);
  const stage = document.getElementById("stage");
  stage.innerHTML = `
    <h2>${algo.title}</h2>
    <p class="desc">${algo.desc}</p>
    <div class="controls">
      ${algo.fields.map(f => `
        <div class="field">
          <label for="in-${f.key}">${f.label}</label>
          <input id="in-${f.key}" value="${f.value}">
        </div>`).join("")}
      <button class="run" id="run-btn">Executar</button>
    </div>
    <p class="err" id="err" style="display:none"></p>
    <div class="viz" id="viz"></div>
    <div class="out" id="out"><span class="muted">Clique em Executar para ver o resultado.</span></div>
    <details class="code">
      <summary>Ver código original</summary>
      <pre>${highlight(algo.code)}</pre>
    </details>
  `;
  const err = document.getElementById("err");
  const viz = document.getElementById("viz");
  const out = document.getElementById("out");
  function exec() {
    const vals = {};
    algo.fields.forEach(f => vals[f.key] = document.getElementById("in-" + f.key).value);
    try {
      err.style.display = "none";
      algo.run(vals, viz, out);
    } catch (e) {
      viz.innerHTML = "";
      out.innerHTML = '<span class="muted">Corrija a entrada e execute novamente.</span>';
      err.textContent = e.message;
      err.style.display = "block";
    }
  }
  document.getElementById("run-btn").onclick = exec;
  algo.fields.forEach(f => {
    document.getElementById("in-" + f.key).addEventListener("keydown", e => { if (e.key === "Enter") exec(); });
  });
  exec();
}

render();
