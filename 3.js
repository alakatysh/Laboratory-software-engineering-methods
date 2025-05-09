const weights = [2, 3, 4, 5];
const values = [3, 4, 5, 8];
const n = weights.length;
const W = 10;

let dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
let cells = [];

function createTable() {
  const container = document.getElementById('table-container');
  const table = document.createElement('table');
  cells = [];

  for (let i = 0; i <= n; i++) {
    const row = document.createElement('tr');
    cells[i] = [];
    for (let w = 0; w <= W; w++) {
      const cell = document.createElement(i === 0 ? 'th' : 'td');
      cell.textContent = '0';
      cell.className = 'dimmed';
      row.appendChild(cell);
      cells[i][w] = cell;
    }
    table.appendChild(row);
  }

  container.innerHTML = '';
  container.appendChild(table);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function animateDP() {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';
  resultDiv.style.display = 'block';
  createTable();

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      cells[i][w].classList.remove('highlight');
      await delay(100);

      if (weights[i - 1] <= w) {
        const take = dp[i - 1][w - weights[i - 1]] + values[i - 1];
        const skip = dp[i - 1][w];
        dp[i][w] = Math.max(take, skip);
      } else {
        dp[i][w] = dp[i - 1][w];
      }

      cells[i][w].textContent = dp[i][w];
      cells[i][w].classList.add('highlight');
    }
  }

  highlightSelectedItems();
}

function highlightSelectedItems() {
  let w = W;
  const selectedItems = [];

  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedItems.push(i - 1);
      cells[i][w].classList.add('selected');
      w -= weights[i - 1];
    }
  }

  selectedItems.reverse();
  const result = document.getElementById('result');
  result.innerHTML = `
    <h3>Максимальна цінність: ${dp[n][W]}</h3>
    <p>Обрані предмети (за індексами): [${selectedItems.join(', ')}]</p>
  `;
}

document.getElementById('runBtn').addEventListener('click', animateDP);
