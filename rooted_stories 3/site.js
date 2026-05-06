function applyTheme(isDark) {
  document.body.classList.toggle('dark-mode', isDark);
  localStorage.setItem('rootedStoriesTheme', isDark ? 'dark' : 'light');
}

function initTheme() {
  const saved = localStorage.getItem('rootedStoriesTheme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved ? saved === 'dark' : prefersDark);
  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => applyTheme(!document.body.classList.contains('dark-mode')));
  });
}

document.addEventListener('DOMContentLoaded', initTheme);
