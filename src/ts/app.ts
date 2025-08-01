import { multiply, divide } from './utils/math';

multiply(2, 2);
divide(2, 2);

const DB_TEST_HOST = `<p>DB_HOST: ${process.env.DB_TEST_HOST}</p>`;
const mathResults = `<p>2 * 2 = ${multiply(2, 2)}</p><p>2 / 2 = ${divide(2, 2)}</p>`;

const container: HTMLElement | null = document.querySelector('.js-container');
if (container) {
  container.insertAdjacentHTML('beforeend', DB_TEST_HOST);
  container.insertAdjacentHTML('beforeend', mathResults);
}
