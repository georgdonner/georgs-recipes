import addMenuButtons from './modules/nav-menu.mjs';
import { showToast } from './modules/toast.mjs';

let noSleep;

addMenuButtons([
  {
    icon: 'keep_awake',
    onClick: (button) => {
      if (button.classList.contains('active')) {
        noSleep.disable();
        showToast('Kochmodus deaktiviert - Display kann sich wieder automatisch ausschalten');
      } else {
        if (!noSleep) {
          // eslint-disable-next-line no-undef
          noSleep = new NoSleep();
        }
        noSleep.enable();
        showToast('Kochmodus aktiviert - Display schaltet sich nicht automatisch aus');
      }
    },
    hasActiveState: true,
  },
]);

// item that is currently edited
let currentlyEditing = null;

const getList = () => (
  Array.from(document.querySelectorAll('.item'))
    .map(node => node.innerText.trim())
);

const updateList = list => (
  fetch('/api/list', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ list }),
  })
);

const onEditButtonClick = (button) => {
  currentlyEditing = button.parentNode.querySelector('span');
  const input = document.querySelector('#new-item input');
  input.value = currentlyEditing.innerText;
  input.focus();
};

const addItem = (item) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'item-wrapper';
  wrapper.innerHTML = `
    <label class="input-container">
      <input type="checkbox" />
      <span class="checkmark box"></span>
      <span class="item">
        <span>${item}</span>
        <button><svg class="icon"><use xlink:href="#icon-pencil"></use></svg></button>
      </span>
    </label>
  `;
  const list = document.querySelector('.list');
  list.appendChild(wrapper);
  // eslint-disable-next-line no-use-before-define
  wrapper.querySelector('.checkmark').addEventListener('click', removeItem);
  const editButton = wrapper.querySelector('.item button');
  editButton.addEventListener('click', () => onEditButtonClick(editButton));
};

function removeItem({ target }) {
  const wrapperNode = target.parentNode.parentNode;
  const itemNode = target.parentNode.querySelector('.item');
  const updated = getList().filter(entry => entry !== itemNode.innerText.trim());
  updateList(updated).then(() => {
    wrapperNode.remove();
    const item = target.parentNode.innerText;
    showToast(`${item} entfernt.`, {
      duration: 10000,
      button: {
        text: 'Rückgängig',
        onClick: (e, toast) => {
          const list = getList().concat([item]);
          updateList(list).then(() => {
            addItem(item);
            toast.classList.remove('visible');
          });
        },
      },
    });
  });
}

const fetchList = async () => {
  const loader = document.getElementById('loader');
  loader.classList.add('active');
  const res = await fetch('/api/list');
  const { list } = await res.json();
  if (!list) {
    showToast('Konnte Liste nicht aktualisieren.', { isError: true });
  }
  loader.classList.remove('active');
  return list;
};

const init = async () => {
  const listEl = document.querySelector('.list');
  if (listEl) {
    // eslint-disable-next-line no-undef
    Sortable.create(listEl, {
      delay: 250,
      draggable: '.item-wrapper',
      filter: 'button, .checkmark',
      chosenClass: 'chosen',
      onUpdate: () => {
        updateList(getList());
      },
    });
  }
  const input = document.querySelector('#new-item input');
  if (input) {
    input.addEventListener('keydown', ({ key, target }) => {
      if (key === 'Enter') {
        if (currentlyEditing) {
          currentlyEditing.innerText = target.value;
        }
        const list = currentlyEditing
          ? getList()
          : getList().concat([target.value]);
        updateList(list).then(() => {
          if (!currentlyEditing) {
            addItem(target.value);
          }
          input.value = '';
          if (currentlyEditing) {
            input.blur();
            currentlyEditing = null;
          }
        });
      }
    });
  }
  const list = await fetchList();
  list.forEach((item) => {
    addItem(item);
  });
};

init();
