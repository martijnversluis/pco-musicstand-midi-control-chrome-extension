import element from './element';

export default function div(classNames, children = null) {
  const div = element('div', children);
  div.setAttribute('class', classNames);
  return div;
}
