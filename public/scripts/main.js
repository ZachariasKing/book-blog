
/********* Theme Toggle ************/
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark-theme');
  
  // Optional: Save preference
  if (document.documentElement.classList.contains('dark-theme')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

// Load saved preference
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark-theme');
}


/********Modal functionality **********/
const modal = document.getElementById('add-book-modal');
const modalClose = document.getElementById('close-modal-btn');
const openModalBtn = document.getElementById('open-modal-btn');

openModalBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
});

modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});
