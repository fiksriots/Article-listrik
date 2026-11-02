import {ringkasan} from './web-modul-format.mjs';
const form = document.querySelector('#form');
const status = document.querySelector('#status');
form.addEventListener('submit', event => {
  event.preventDefault();
  try {
    status.textContent = ringkasan(document.querySelector('#nama').value,
      Number(document.querySelector('#jumlah').value));
  } catch (error) {
    status.textContent = error.message;
  }
});
