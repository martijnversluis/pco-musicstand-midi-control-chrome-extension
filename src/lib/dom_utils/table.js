import element from './element';

export default function table(rows) {
  const tbody = element('tbody');

  rows.forEach((cells) => {
    const tr = document.createElement('tr');
    tbody.appendChild(tr);

    cells.forEach((cell) => {
      tr.appendChild(element('td', cell));
    });
  });

  return element('table', tbody);
}
