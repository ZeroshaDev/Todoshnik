const textBox = document.createElement("input");
const addBtn = document.createElement("button");
const ul = document.createElement("ul");
let storage = [];

addBtn.textContent = "Добавить запись";
textBox.placeholder = "Введи заметку";
textBox.classList.add("textBox");

function addNewPost() {
  let li = document.createElement("li");
  let content = document.createElement("div");
  let doneBtn = document.createElement("button");
  let changeBtn = document.createElement("button");
  let deleteBtn = document.createElement("button");

  doneBtn.textContent = "Выполнено";
  doneBtn.classList.add("doneBtn");
  changeBtn.textContent = "Изменить";
  changeBtn.classList.add("changeBtn");
  deleteBtn.textContent = "Удалить";
  deleteBtn.classList.add("deleteBtn");
  content.textContent = textBox.value;
  content.classList.add("content");

  li.append(doneBtn);
  li.append(content);
  li.append(changeBtn);
  li.append(deleteBtn);
  ul.append(li);

  storage.push({id:storage.length,content:textBox.value});
  textBox.value = "";
}

ul.addEventListener("click", (e) => {
  if (e.target.classList.contains("doneBtn")) {
    e.target.nextSibling.classList.toggle("done");
  }
  if (e.target.classList.contains("changeBtn")) {
    if (e.target.previousSibling.classList.contains("content")) {
      let redBox = document.createElement("input");
      redBox.value = e.target.previousSibling.textContent;
      e.target.previousSibling.replaceWith(redBox);
      e.target.textContent="Сохранить изменения";
    } else {
      let redContent = document.createElement("div");
      redContent.classList.add("content");
      redContent.textContent = e.target.previousSibling.value;
      e.target.previousSibling.replaceWith(redContent);
      e.target.textContent="Изменить";
    }
  }
  if (e.target.classList.contains("deleteBtn")) {
    e.target.parentNode.remove();
  }
});

addBtn.addEventListener("click", (e) => {
  if (textBox.value.length !== 0) {
    addNewPost();
  } else {
    alert("Нечего добавить, введи заметку!");
  }
});

document.body.append(textBox);
document.body.append(addBtn);
document.body.append(ul);
