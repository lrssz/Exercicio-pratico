function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3000);
}

function checkAuth() {
  const token = sessionStorage.getItem('token');
  if (token !== 'jwt123') {
    window.location.href = 'index.html';
  }
}

checkAuth();

let cardsData = [];
let nextCardId = 1;

const cardsContainer = document.getElementById('cards-container');
const cardsCountBadge = document.getElementById('cards-count');
const btnAddCard = document.getElementById('btn-add-card');
const btnLogout = document.getElementById('btn-logout');
const userDisplayName = document.getElementById('user-display-name');

const addCardModal = document.getElementById('add-card-modal');
const addCardForm = document.getElementById('add-card-form');
const btnCancelAdd = document.getElementById('btn-cancel-add');
const cardTitleInput = document.getElementById('card-title-input');
const cardDescInput = document.getElementById('card-desc-input');

document.addEventListener('DOMContentLoaded', () => {
  const registeredName = sessionStorage.getItem('registeredName');
  if (registeredName && userDisplayName) {
    userDisplayName.textContent = registeredName;
  }

  fetchCards();
});

async function fetchCards() {
  try {
    const response = await fetch('cards.json');
    if (!response.ok) {
      throw new Error('Falha ao carregar o arquivo cards.json');
    }
    const data = await response.ok ? await response.json() : [];
    
    cardsData = data;
    
    if (cardsData.length > 0) {
      const maxId = Math.max(...cardsData.map(c => c.id));
      nextCardId = maxId + 1;
    }
    cardsData.forEach(card => {
      renderCard(card.id, card.title, card.description);
    });

    updateCounters();
    
  } catch (error) {
    console.error('Erro na requisição dos cards:', error);
    showToast('Erro ao carregar dados iniciais dos cards.', 'error');
  }
}

function renderCard(id, title, description) {
  const cardElement = document.createElement('article');
  
  cardElement.id = `card-${id}`;
  cardElement.setAttribute('data-id', id);
  cardElement.className = 'custom-card';

  cardElement.innerHTML = `
    <div class="card-top">
      <span class="card-id-badge">ID #${id}</span>
      <h3 class="card-title">${escapeHTML(title)}</h3>
      <p class="card-description">${escapeHTML(description)}</p>
    </div>
    <div class="card-actions">
      <button class="btn-card-delete" title="Excluir Card" aria-label="Excluir card número ${id}">
        <!-- Ícone de Lixeira SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
      </button>
    </div>
  `;

  const deleteBtn = cardElement.querySelector('.btn-card-delete');
  deleteBtn.addEventListener('click', () => {
    deleteCard(id);
  });

  cardsContainer.appendChild(cardElement);
}

function addNewCard(title, description) {
  const newId = nextCardId++;
  
  cardsData.push({ id: newId, title, description });
  
  renderCard(newId, title, description);
  
  updateCounters();
  
  showToast(`Card #${newId} adicionado com sucesso!`, 'success');
}

function deleteCard(id) {
  const cardElement = document.getElementById(`card-${id}`);
  if (cardElement) {
    cardElement.style.transform = 'scale(0.9) translateY(10px)';
    cardElement.style.opacity = '0';
    
    setTimeout(() => {
      cardElement.remove();
      
      cardsData = cardsData.filter(card => card.id !== id);
      
      updateCounters();
      
      showToast(`Card #${id} excluído com sucesso!`, 'success');
    }, 250);
  }
}

function openModal() {
  addCardModal.classList.add('active');
  cardTitleInput.focus();
}

function closeModal() {
  addCardModal.classList.remove('active');
  addCardForm.reset();
}

btnAddCard.addEventListener('click', openModal);
btnCancelAdd.addEventListener('click', closeModal);
addCardModal.addEventListener('click', (e) => {
  if (e.target === addCardModal) {
    closeModal();
  }
});

addCardForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const title = cardTitleInput.value.trim();
  const desc = cardDescInput.value.trim();

  if (!title || !desc) {
    showToast('Por favor, preencha todos os campos do card.', 'error');
    return;
  }

  addNewCard(title, desc);
  closeModal();
});

function updateCounters() {
  if (cardsCountBadge) {
    cardsCountBadge.textContent = cardsContainer.childElementCount;
  }
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    sessionStorage.removeItem('token');
    showToast('Sessão encerrada. Redirecionando...', 'info');
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  });
}
