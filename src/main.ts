import './style.css';
import { renderAboutPage } from './pages/about';
import { renderCatalog } from './pages/catalog';
const routes = ['about', 'catalog', 'cart'];

function navigate() {
  let hash = window.location.hash.replace('#/', '');
  if (!routes.includes(hash)) {
    hash = 'about';
    window.location.hash = '#/about';
  }

  document.querySelectorAll('.section').forEach((el) => el.classList.add('hidden'));

  const activeSection = document.getElementById(`section-${hash}`);
  if (activeSection) {
    activeSection.classList.remove('hidden');

    // Вызываем рендер при переходе на страницу
    if (hash === 'about') renderAboutPage();
    // Для catalog и cart рендер сделаем позже, когда будут данные
    if (hash === 'catalog') renderCatalog();
  }

  document.querySelectorAll('.nav-link').forEach((el) => el.classList.remove('active'));
  const activeLink = document.getElementById(`nav-${hash}`);
  if (activeLink) activeLink.classList.add('active');
}

window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', navigate);
