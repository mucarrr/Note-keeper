/* 1. popup acilmasi
2. input a girilen verilerin gonderilmesi
3. popup kapnmasi*/
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const addBox = document.querySelector(".add-box ");
const popupBox = document.querySelector(".popup-box");
const popup = document.querySelector(".popup");
const popupTitle = popupBox.querySelector("header p");
const closeIcon = popupBox.querySelector("header i");
const form = document.querySelector("form");
const settings = document.querySelector(".settings");
const wrapper = document.querySelector(".wrapper");
const button = document.querySelector("button");

let isUpdate = false;
let updateId;

const notes = JSON.parse(localStorage.getItem("notes")) || [];

addBox.addEventListener("click", () => {
  popupBox.classList.add("show");
  popup.classList.add("show");

  document.querySelector("body").style.overflow = "hidden";
});

closeIcon.addEventListener("click", () => {
  popupBox.classList.remove("show");
  popup.classList.remove("show");

  document.querySelector("body").style.overflow = "auto";
  location.reload();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  /*  console.log(event.target[0]);
    console.log(event.target[1]);
    console.log(event.target[2]); */
  let titleInput = event.target[0];
  let descriptionInput = event.target[1];

  let title = titleInput.value.trim();
  let description = descriptionInput.value.trim();
  /*value input a girilen veridir. trim basinda ve sonunda kazara birakilan bosluklari kaldirir.*/

  if (title && description) {
    const date = new Date();
    let month = months[date.getMonth()];
    let day = date.getDate();
    let year = date.getFullYear();
    let noteInfo = { title, description, date: `${month} ${day}, ${year}` };

    if (isUpdate) {
      notes[updateId] = noteInfo;
      isUpdate = false;
      /* button.textContent = "Add Note";
      popupTitle.textContent = "Add New Note"; */
    } else {
      notes.push(noteInfo);
    }

    localStorage.setItem("notes", JSON.stringify(notes));

    popupBox.classList.remove("show");
    popup.classList.remove("show");
    button.textContent = "Add Note";
    popupTitle.textContent = "Add New Note";

    document.querySelector("body").style.overflow = "auto";
  }
  titleInput.value = "";
  descriptionInput.value = "";
  showNotes();
});

function deleteNote(noteId) {
  if (confirm(`Are you sure you want to delete`)) {
    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
  }
}

function updateNote(noteId, title, description) {
  isUpdate = true;
  updateId = noteId;
  popupBox.classList.add("show");
  popup.classList.add("show");
  popupTitle.textContent = "Update Note";
  button.textContent = "Update Note";
  form.elements[0].value = title;
  form.elements[1].value = description;
}

function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", (event) => {
    if (event.target.tagName != "I" || event.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

function showNotes() {
  if (!notes) return;

  document.querySelectorAll(".note").forEach((li) => li.remove());
  notes.forEach((note, id) => {
    let liTag = `<li class="note" data-id="${id}">
        <div class="details">
          <p>${note.title}</p>
          <span>${note.description}</span>
        </div>
        <div class="bottom-content">
          <span>${note.date}</span>
          <div class="settings">
            <i class="bx bx-dots-horizontal-rounded"></i>
            <ul class="menu">
              <li onclick="updateNote(${id}, '${note.title}', '${note.description}')">
                <i class="bx bx-edit"> Edit</i>
              </li>
              <li onclick="deleteNote(${id})">
                <i class="bx bx-trash"> Delete</i>
              </li>
            </ul>
          </div>
        </div>
    </li>`;

    addBox.insertAdjacentHTML("afterend", liTag);
  });
}


wrapper.addEventListener("click", (event) => {
  if (event.target.classList.contains("bx-dots-horizontal-rounded")) {
    showMenu(event.target);
  } else if (event.target.classList.contains("bx-edit")) {
    const noteElement = event.target.closest(".note");
    const noteId = parseInt(noteElement.dataset.id, 10);
    const title = noteElement.querySelector(".details p").innerText;
    const description = noteElement.querySelector(".details span").innerText;
    updateNote(noteId, title, description);
  }
});
document.addEventListener("DOMContentLoaded", () => showNotes());
