// ---------- utilidades ----------
function parseList(str){
  return str.split(",").map(s => Number(s.trim())).filter(s => s.toString() !== "" && !Number.isNaN(s) || s === 0);
}
function renderBars(viz, values, hitFlags, get, labelGet){
  labelGet = labelGet || get;
  viz.innerHTML = "";
  const max = Math.max(...values.map(v=>Math.abs(get(v))), 1);
  values.forEach((v,i)=>{
    const h = Math.max(10, (Math.abs(get(v)) / max) * 90);
    const bar = document.createElement("div");
    bar.className = "bar" + (hitFlags[i] ? " hit" : "");
    bar.style.height = h + "px";
    bar.textContent = labelGet(v);
    viz.appendChild(bar);
  });
}
function highlight(code){
  return code
    .replace(/\b(let|const|for|if|else|break|return|function|class|public|private|int|long|boolean|void|while|new|import|static)\b/g, '<span class="kw">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="num">$1</span>');
}

// ---------- algoritmos ----------
const algos = [
  {
    id:"contagem", label:"Contagem", n:"01",
    title:"Contagem em intervalo",
    desc:"Percorre um intervalo de inicio até fim (crescente ou decrescente) e imprime cada valor.",
    fields:[
      {key:"inicio", label:"Início", value:"1"},
      {key:"fim", label:"Fim", value:"10"}
    ],
    run(vals, viz, out){
      const inicio = parseInt(vals.inicio,10), fim = parseInt(vals.fim,10);
      if(isNaN(inicio)||isNaN(fim)) throw new Error("Use apenas números inteiros.");
      if(Math.abs(fim-inicio) > 60) throw new Error("Use um intervalo de no máximo 60 números.");
      const seq = [];
      if(inicio <= fim){ for(let i=inicio;i<=fim;i++) seq.push(i); }
      else{ for(let i=inicio;i>=fim;i--) seq.push(i); }
      renderBars(viz, seq, seq.map(()=>false), v=>v);
      out.textContent = seq.join(" ");
    },
    jsCode:`let inicio = 1, fim = 10;

if (inicio <= fim) {
    for (let i = inicio; i <= fim; i++) console.log(i);
} else {
    for (let i = inicio; i >= fim; i--) console.log(i);
}`,
    javaCode:`class Contagem {

    // Conta de 'inicio' até 'fim' (crescente ou decrescente) e imprime os valores
    public void contar(int inicio, int fim) {
        if (inicio <= fim) {
            for (int i = inicio; i <= fim; i++) {
                System.out.print(i + " ");
            }
        } else {
            for (int i = inicio; i >= fim; i--) {
                System.out.print(i + " ");
            }
        }
        System.out.println();
    }
}`
  },
  {
    id:"fibonacci", label:"Fibonacci", n:"02",
    title:"Sequência de Fibonacci",
    desc:"Gera os N primeiros termos, onde cada número é a soma dos dois anteriores.",
    fields:[{key:"n", label:"Quantidade de termos (N)", value:"10"}],
    run(vals, viz, out){
      const n = parseInt(vals.n, 10);
      if(isNaN(n) || n < 1 || n > 30) throw new Error("Escolha um N entre 1 e 30.");
      const fib = [];
      for(let i=0;i<n;i++){
        if(i<=1) fib[i] = i;
        else fib[i] = fib[i-1] + fib[i-2];
      }
      renderBars(viz, fib, fib.map(()=>false), v=>v);
      out.textContent = fib.join(", ");
    },
    jsCode:`let n = 10;
let fibonacci = [];

fibonacci[0] = 0;
fibonacci[1] = 1;

for (let i = 2; i < n; i++) {
    fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2];
}

for (let i = 0; i < n; i++) {
    console.log(fibonacci[i]);
}`,
    javaCode:`class Fibonacci {

    // Retorna o n-ésimo termo de Fibonacci (0, 1, 1, 2, 3, 5, ...)
    public long calcular(int n) {
        if (n <= 1) {
            return n;
        }
        long anterior = 0, atual = 1;
        for (int i = 2; i <= n; i++) {
            long proximo = anterior + atual;
            anterior = atual;
            atual = proximo;
        }
        return atual;
    }

    // Imprime os 'quantidade' primeiros termos da sequência
    public void imprimirSequencia(int quantidade) {
        for (int i = 0; i < quantidade; i++) {
            System.out.print(calcular(i) + " ");
        }
        System.out.println();
    }
}`
  },
  {
    id:"mdc", label:"MDC", n:"03",
    title:"Máximo Divisor Comum (Euclides)",
    desc:"Aplica o Algoritmo de Euclides: a cada passo, troca (a, b) por (b, a % b) até o resto ser zero.",
    fields:[
      {key:"a", label:"Primeiro número", value:"48"},
      {key:"b", label:"Segundo número", value:"18"}
    ],
    run(vals, viz, out){
      let a = Math.abs(parseInt(vals.a,10)), b = Math.abs(parseInt(vals.b,10));
      if(isNaN(a)||isNaN(b)) throw new Error("Use dois números inteiros.");
      const passos = [];
      while(b !== 0){
        const resto = a % b;
        passos.push(`${a} % ${b} = ${resto}`);
        a = b; b = resto;
      }
      viz.innerHTML = "";
      out.innerHTML = (passos.length ? passos.join("\n") + "\n\n" : "") + `MDC = <b>${a}</b>`;
    },
    jsCode:`let a = 48;
let b = 18;
a = Math.abs(a);
b = Math.abs(b);

while (b !== 0) {
    let resto = a % b;
    a = b;
    b = resto;
}

console.log("O MDC é " + a);`,
    javaCode:`class MDC {

    // Calcula o MDC entre dois números usando o Algoritmo de Euclides
    public int calcular(int a, int b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b != 0) {
            int resto = a % b;
            a = b;
            b = resto;
        }
        return a;
    }
}`
  },
  {
    id:"primo", label:"Número Primo", n:"04",
    title:"Números primos",
    desc:"Verifica um único número, ou lista todos os primos dentro de um intervalo.",
    modes:[
      {
        id:"unico", label:"Verificar número",
        fields:[{key:"numero", label:"Número", value:"29"}],
        run(vals, viz, out){
          const numero = parseInt(vals.numero,10);
          if(isNaN(numero)) throw new Error("Digite um número inteiro.");
          let ehPrimo = numero >= 2;
          if(ehPrimo){
            for(let i=2;i<=Math.sqrt(numero);i++){
              if(numero % i === 0){ ehPrimo = false; break; }
            }
          }
          viz.innerHTML = "";
          out.innerHTML = ehPrimo ? `<b>${numero}</b> é primo.` : `<b>${numero}</b> não é primo.`;
        }
      },
      {
        id:"intervalo", label:"Listar intervalo",
        fields:[
          {key:"inicio", label:"Início", value:"1"},
          {key:"fim", label:"Fim", value:"50"}
        ],
        run(vals, viz, out){
          const inicio = parseInt(vals.inicio,10), fim = parseInt(vals.fim,10);
          if(isNaN(inicio)||isNaN(fim)) throw new Error("Use números inteiros.");
          if(fim < inicio) throw new Error("Fim deve ser maior ou igual ao início.");
          if(fim - inicio > 300) throw new Error("Use um intervalo de no máximo 300 números.");
          function ehPrimo(numero){
            if(numero < 2) return false;
            for(let i=2;i<=Math.sqrt(numero);i++) if(numero % i === 0) return false;
            return true;
          }
          const primos = [];
          for(let i=inicio;i<=fim;i++) if(ehPrimo(i)) primos.push(i);
          renderBars(viz, primos, primos.map(()=>false), v=>v);
          out.textContent = primos.length ? primos.join(" ") : "Nenhum primo nesse intervalo.";
        }
      }
    ],
    jsCode:`let numero = 29;
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
}`,
    javaCode:`class NumeroPrimo {

    // Verifica se um número é primo
    public boolean ehPrimo(int numero) {
        if (numero < 2) {
            return false;
        }
        for (int i = 2; i <= Math.sqrt(numero); i++) {
            if (numero % i == 0) {
                return false;
            }
        }
        return true;
    }

    // Lista todos os primos entre 'inicio' e 'fim'
    public void listarPrimo(int inicio, int fim) {
        for (int i = inicio; i <= fim; i++) {
            if (ehPrimo(i)) {
                System.out.print(i + " ");
            }
        }
        System.out.println();
    }
}`
  },
  {
    id:"ordenacao", label:"Ordenação", n:"05",
    title:"Ordenação por bolha (bubble sort)",
    desc:"Compara pares vizinhos e troca de posição sempre que estão fora de ordem, até a lista ficar crescente.",
    fields:[{key:"lista", label:"Lista (separada por vírgula)", value:"9, 3, 7, 1, 8, 2, 5"}],
    run(vals, viz, out){
      const lista = parseList(vals.lista);
      if(lista.some(isNaN)) throw new Error("Use apenas números.");
      if(lista.length > 14) throw new Error("Use no máximo 14 números.");
      const arr = lista.slice();
      for(let i=0;i<arr.length-1;i++){
        for(let j=0;j<arr.length-1-i;j++){
          if(arr[j] > arr[j+1]){
            const t = arr[j]; arr[j]=arr[j+1]; arr[j+1]=t;
          }
        }
      }
      renderBars(viz, arr, arr.map(()=>false), v=>v);
      out.innerHTML = `Original: <span class="muted">[${lista.join(", ")}]</span>\nOrdenado: [${arr.join(", ")}]`;
    },
    jsCode:`let vetor = [9, 3, 7, 1, 8, 2, 5];

for (let i = 0; i < vetor.length - 1; i++) {
    for (let j = 0; j < vetor.length - 1 - i; j++) {
        if (vetor[j] > vetor[j + 1]) {
            let temp = vetor[j];
            vetor[j] = vetor[j + 1];
            vetor[j + 1] = temp;
        }
    }
}

console.log(vetor);`,
    javaCode:`class Ordenacao {

    // Ordena o vetor em ordem crescente usando Bubble Sort
    public void bubbleSort(int[] vetor) {
        int n = vetor.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - 1 - i; j++) {
                if (vetor[j] > vetor[j + 1]) {
                    int temp = vetor[j];
                    vetor[j] = vetor[j + 1];
                    vetor[j + 1] = temp;
                }
            }
        }
    }

    public void imprimirVetor(int[] vetor) {
        for (int valor : vetor) {
            System.out.print(valor + " ");
        }
        System.out.println();
    }
}`
  },
  {
    id:"soma", label:"Somatório", n:"06",
    title:"Somatório",
    desc:"Soma os elementos de uma lista, ou todos os números dentro de um intervalo.",
    modes:[
      {
        id:"lista", label:"Lista de números",
        fields:[{key:"lista", label:"Lista (separada por vírgula)", value:"4, 8, 15, 16, 23, 42"}],
        run(vals, viz, out){
          const lista = parseList(vals.lista);
          if(lista.some(isNaN)) throw new Error("Use apenas números.");
          let soma = 0;
          for(const v of lista) soma += v;
          renderBars(viz, lista, lista.map(()=>false), v=>v);
          out.innerHTML = `A soma total é <b>${soma}</b>.`;
        }
      },
      {
        id:"intervalo", label:"Intervalo",
        fields:[
          {key:"inicio", label:"Início", value:"1"},
          {key:"fim", label:"Fim", value:"100"}
        ],
        run(vals, viz, out){
          const inicio = parseInt(vals.inicio,10), fim = parseInt(vals.fim,10);
          if(isNaN(inicio)||isNaN(fim)) throw new Error("Use números inteiros.");
          if(fim < inicio) throw new Error("Fim deve ser maior ou igual ao início.");
          let soma = 0;
          for(let i=inicio;i<=fim;i++) soma += i;
          viz.innerHTML = "";
          out.innerHTML = `A soma de <b>${inicio}</b> até <b>${fim}</b> é <b>${soma}</b>.`;
        }
      }
    ],
    jsCode:`let lista = [4, 8, 15, 16, 23, 42];
let soma = 0;

for (let i = 0; i < lista.length; i++) {
    soma = soma + lista[i];
}

console.log("A soma total é " + soma);`,
    javaCode:`public class Somatorio {

    // Soma todos os números de 'inicio' até 'fim'
    public long somarIntervalo(int inicio, int fim) {
        long soma = 0;
        for (int i = inicio; i <= fim; i++) {
            soma += i;
        }
        return soma;
    }

    // Soma todos os elementos de um vetor
    public long somarVetor(int[] vetor) {
        long soma = 0;
        for (int valor : vetor) {
            soma += valor;
        }
        return soma;
    }
}`
  }
];

// ---------- estado ----------
let current = algos[0].id;
const modeState = {};   // algoId -> modeId ativo
const langState = {};   // algoId -> "jsCode" | "javaCode"

function activeModeOf(algo){
  if(!algo.modes) return null;
  if(!modeState[algo.id]) modeState[algo.id] = algo.modes[0].id;
  return algo.modes.find(m => m.id === modeState[algo.id]);
}

// ---------- UI ----------
function buildTabs(){
  const tabs = document.getElementById("tabs");
  tabs.innerHTML = "";
  algos.forEach(a=>{
    const b = document.createElement("button");
    b.className = a.id === current ? "active" : "";
    b.innerHTML = `<span class="n">${a.n}</span><span>${a.label}</span>`;
    b.onclick = ()=>{ current = a.id; render(); };
    tabs.appendChild(b);
  });
}

function render(){
  buildTabs();
  const algo = algos.find(a=>a.id===current);
  const mode = activeModeOf(algo);
  const fields = mode ? mode.fields : algo.fields;
  const lang = langState[algo.id] || "jsCode";
  const stage = document.getElementById("stage");

  stage.innerHTML = `
    <h2>${algo.title}</h2>
    <p class="desc">${algo.desc}</p>
    ${mode ? `<div class="modes" id="modes">${algo.modes.map(m=>`
      <button data-mode="${m.id}" class="${m.id===mode.id?"active":""}">${m.label}</button>
    `).join("")}</div>` : ""}
    <div class="controls">
      ${fields.map(f=>`
        <div class="field">
          <label for="in-${f.key}">${f.label}</label>
          <input id="in-${f.key}" value="${f.value}">
        </div>`).join("")}
      <button class="run" id="run-btn">Executar</button>
    </div>
    <p class="err" id="err" style="display:none"></p>
    <div class="viz" id="viz"></div>
    <div class="out" id="out"><span class="muted">Clique em Executar para ver o resultado.</span></div>
    <details class="code" open>
      <summary>Ver código original</summary>
      <div class="langtabs" id="langtabs">
        <button data-lang="jsCode" class="${lang==="jsCode"?"active":""}">JavaScript</button>
        <button data-lang="javaCode" class="${lang==="javaCode"?"active":""}">Java</button>
      </div>
      <pre id="codepre">${highlight(algo[lang])}</pre>
    </details>
  `;

  if(mode){
    document.querySelectorAll("#modes button").forEach(btn=>{
      btn.onclick = ()=>{ modeState[algo.id] = btn.dataset.mode; render(); };
    });
  }
  document.querySelectorAll("#langtabs button").forEach(btn=>{
    btn.onclick = ()=>{
      langState[algo.id] = btn.dataset.lang;
      document.querySelectorAll("#langtabs button").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("codepre").innerHTML = highlight(algo[btn.dataset.lang]);
    };
  });

  const err = document.getElementById("err");
  const viz = document.getElementById("viz");
  const out = document.getElementById("out");
  function exec(){
    const vals = {};
    fields.forEach(f => vals[f.key] = document.getElementById("in-"+f.key).value);
    try{
      err.style.display = "none";
      (mode ? mode.run : algo.run)(vals, viz, out);
    }catch(e){
      viz.innerHTML = "";
      out.innerHTML = '<span class="muted">Corrija a entrada e execute novamente.</span>';
      err.textContent = e.message;
      err.style.display = "block";
    }
  }
  document.getElementById("run-btn").onclick = exec;
  fields.forEach(f=>{
    document.getElementById("in-"+f.key).addEventListener("keydown", e=>{ if(e.key==="Enter") exec(); });
  });
  exec();
}

render();
