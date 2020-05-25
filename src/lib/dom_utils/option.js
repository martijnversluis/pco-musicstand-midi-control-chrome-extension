export default function option(select, value, text) {
  const option = document.createElement('option');
  option.value = value;
  option.innerText = text;
  select.add(option);
}
