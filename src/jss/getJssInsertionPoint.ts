export default function getJssInsertionPoint(id = 'jss-insertion-point'): HTMLElement {
  const element = document.getElementById(id);
  if (!element) throw new Error(`JssInsertionPoint "${id}" not found.`);
  return element;
}
