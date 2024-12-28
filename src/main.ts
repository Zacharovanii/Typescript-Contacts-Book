import "./style.scss";

interface IUser {
  id: number;
  name: string;
  email: string;
  phone: string;
}

type users = Array<IUser>;

const formInputs = document.querySelectorAll<HTMLInputElement>("input");

const nameInput: HTMLInputElement = formInputs[0];
const emailInput: HTMLInputElement = formInputs[1];
const phoneInput: HTMLInputElement = formInputs[2];

const addContactBTN = document.querySelector<HTMLButtonElement>("#form-btn");
const editContactBTN =
  document.querySelector<HTMLButtonElement>("#form-btn-edit");

const usersContainer = document.querySelector<HTMLDivElement>(".users");

let users: users = readUsers();
let currentEditingUser: IUser;

function changeToEditMode(): void {
  if (addContactBTN && editContactBTN) {
    addContactBTN.className = "hide";
    editContactBTN.className = "";
  }
}

function changeToAddMode(): void {
  if (addContactBTN && editContactBTN) {
    addContactBTN.className = "";
    editContactBTN.className = "hide";
  }
}

function readUsers(): users {
  const savedUsers: string | null = localStorage.getItem("users");

  return savedUsers ? JSON.parse(savedUsers) : [];
}

function saveNewUser(user: IUser): void {
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
}

function clearForm(): void {
  formInputs.forEach((input) => {
    input.value = "";
  });
}

function getNewContactHTML({ id, name, email, phone }: IUser): HTMLDivElement {
  const newContactHTML = document.createElement("div");
  newContactHTML.className = "user";
  newContactHTML.innerHTML = `
          <div class="contact">
            <p class="user-name">${name}</p>

            <div class="user-info">
              <p class="user-email">${email}</p>
              <p class="user-phone">${phone}</p>
            </div>
          </div>
          <div class="buttons">
            <button class="delete-btn" type="button" data-id=${id}>Delete</button>
            <button class="edit-btn" type="button" data-id=${id}>Edit</button>
          </div>
        `;

  newContactHTML
    .querySelector<HTMLButtonElement>(".delete-btn")
    ?.addEventListener("click", deleteContact);

  newContactHTML
    .querySelector<HTMLButtonElement>(".edit-btn")
    ?.addEventListener("click", editContact);

  return newContactHTML;
}

function renderUsers(): void {
  if (users && usersContainer) {
    usersContainer.innerHTML = "";
    for (const user of users) {
      const renderedUser = getNewContactHTML(user);
      usersContainer?.appendChild(renderedUser);
    }
  }
}

function editContact(e: MouseEvent): void {
  const { dataset } = e.currentTarget as HTMLButtonElement;

  if (dataset.id) {
    const id: number = Number(dataset.id);
    currentEditingUser = users.filter((item) => item.id === id)[0];

    nameInput.value = currentEditingUser.name;
    emailInput.value = currentEditingUser.email;
    phoneInput.value = currentEditingUser.phone;

    changeToEditMode();
  }
}

function submitEdit(): void {
  currentEditingUser.name = nameInput.value;
  currentEditingUser.email = emailInput.value;
  currentEditingUser.phone = phoneInput.value;

  changeToAddMode();
  renderUsers();
  clearForm();
  localStorage.setItem("users", JSON.stringify(users));
}

function createContact(): void {
  const user: IUser = {
    id: users.length !== 0 ? users[users.length - 1].id + 1 : 0,
    name: nameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
  };

  saveNewUser(user);
  const newContactHTML: HTMLDivElement = getNewContactHTML(user);

  usersContainer?.appendChild(newContactHTML);

  clearForm();
}

function deleteContact(e: MouseEvent): void {
  const button = e.currentTarget as HTMLButtonElement;

  if (button.dataset.id) {
    const id: number = Number(button.dataset.id);

    users = users.filter((item) => item.id !== id);
    localStorage.setItem("users", JSON.stringify(users));

    renderUsers();
  }
}

document.addEventListener("DOMContentLoaded", renderUsers);
addContactBTN?.addEventListener("click", createContact);
editContactBTN?.addEventListener("click", submitEdit);
