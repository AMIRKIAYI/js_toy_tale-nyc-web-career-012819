const addBtn = document.querySelector('#new-toy-btn');
const toyForm = document.querySelector('.container');
const toyNameInput = document.querySelector('input[name="name"]');
const toyImageInput = document.querySelector('input[name="image"]');
const toyFormSubmitBtn = document.querySelector('form');
let addToy = false;

const toyCollection = document.getElementById('toy-collection');

function getToys(toys) {
  toyCollection.innerHTML = "";
  toys.forEach(function (toy) {
    toyCollection.innerHTML += `
      <div class="card" data-id=${toy.id}>
        <h2>${toy.name}</h2>
        <img src="${toy.image}" class="toy-avatar" />
        <p>${toy.likes} Likes</p>
        <button class="like-btn">Like <3</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;
  });
  addEventListeners();
}

function fetchToys() {
  fetch('http://localhost:3000/toys')
    .then(resp => resp.json())
    .then(getToys);
}

function addEventListeners() {
  document.querySelectorAll('.like-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const toyCard = event.target.closest('.card');
      const toyId = toyCard.dataset.id;
      const likesP = toyCard.querySelector('p');
      const currentLikes = parseInt(likesP.textContent);

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ likes: currentLikes + 1 })
      })
      .then(resp => resp.json())
      .then(updatedToy => {
        likesP.textContent = `${updatedToy.likes} Likes`;
      });
    });
  });

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const toyCard = event.target.closest('.card');
      const toyId = toyCard.dataset.id;

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'DELETE'
      })
      .then(() => {
        toyCard.remove();
      });
    });
  });
}

addBtn.addEventListener('click', () => {
  addToy = !addToy;
  if (addToy) {
    toyForm.style.display = 'block';
  } else {
    toyForm.style.display = 'none';
  }
});

toyFormSubmitBtn.addEventListener('submit', (event) => {
  event.preventDefault();

  const newToy = {
    name: toyNameInput.value,
    image: toyImageInput.value,
    likes: 0
  };

  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newToy)
  })
  .then(resp => resp.json())
  .then((toy) => {
    toyCollection.innerHTML += `
      <div class="card" data-id=${toy.id}>
        <h2>${toy.name}</h2>
        <img src="${toy.image}" class="toy-avatar" />
        <p>${toy.likes} Likes</p>
        <button class="like-btn">Like <3</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;
    addEventListeners();
    toyForm.style.display = 'none';
    toyNameInput.value = '';
    toyImageInput.value = '';
    addToy = false;
  });
});

document.addEventListener('DOMContentLoaded', () => {
  fetchToys();
});
