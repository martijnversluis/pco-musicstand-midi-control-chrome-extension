export default function element(tagName, children) {
  const element = document.createElement(tagName);
  [children].flat().filter(c => c).forEach((child) => element.appendChild(child));
  return element;
}
