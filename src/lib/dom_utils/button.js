import element from './element';

export default function button(text) {
  const button = element('button');
  button.innerText = text;
  return button;
}
