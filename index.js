const textBox = document.createElement("input");
const addBtn = document.createElement("button");
const ul = document.createElement("ul");
const storage = [];

addBtn.textContent = "Добавить запись";
textBox.placeholder = "Введи заметку";
textBox.classList.add("textBox");

function addNewPost() {
  const li = document.createElement("li");
  const content = document.createElement("div");
  const doneBtn = document.createElement("button");
  const changeBtn = document.createElement("button");
  const deconsteBtn = document.createElement("button");

  doneBtn.textContent = "Выполнено";
  doneBtn.classList.add("doneBtn");
  changeBtn.textContent = "Изменить";
  changeBtn.classList.add("changeBtn");
  deconsteBtn.textContent = "Удалить";
  deconsteBtn.classList.add("deconsteBtn");
  content.textContent = textBox.value;
  content.classList.add("content");

  content.addEventListener("click", () => {
    const event = new Event("click", { bubbles: true });
    changeBtn.dispatchEvent(event);
  });

  li.append(doneBtn);
  li.append(content);
  li.append(changeBtn);
  li.append(deconsteBtn);
  ul.append(li);

  storage.push({
    id: storage.length,
    content: textBox.value,
    completed: false,
  });
  textBox.value = "";
}

textBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const event = new Event("click", { bubbles: true });
    addBtn.dispatchEvent(event);
  }
});

ul.addEventListener("click", (e) => {
  if (e.target.classList.contains("doneBtn")) {
    e.target.nextSibling.classList.toggle("done");
    if (e.target.nextSibling.nextSibling.disabled === false) {
      e.target.nextSibling.nextSibling.disabled = true;
      e.target.textContent = "Доделать";
    } else {
      e.target.nextSibling.nextSibling.disabled = false;
      e.target.textContent = "Выполнено";
    }
  }
  if (
    e.target.classList.contains("changeBtn") &&
    !e.target.previousSibling.classList.contains("done")
  ) {
    if (e.target.previousSibling.classList.contains("content")) {
      const redBox = document.createElement("input");
      redBox.value = e.target.previousSibling.textContent;
      e.target.previousSibling.replaceWith(redBox);
      const btn = e.target;
      e.target.previousSibling.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const event = new Event("click", { bubbles: true });
          btn.dispatchEvent(event);
        }
      });

      e.target.textContent = "Сохранить изменения";
      e.target.previousSibling.previousSibling.disabled = true;
      e.target.nextSibling.disabled = true;
    } else {
      e.target.previousSibling.value = e.target.previousSibling.value.trim();
      if (e.target.previousSibling.value.length != 0) {
        const redContent = document.createElement("div");
        redContent.classList.add("content");
        redContent.textContent = e.target.previousSibling.value;
        redContent.addEventListener("click", () => {
          const event = new Event("click", { bubbles: true });
          e.target.dispatchEvent(event);
        });
        e.target.previousSibling.replaceWith(redContent);
        e.target.textContent = "Изменить";
        e.target.previousSibling.previousSibling.disabled = false;
        e.target.nextSibling.disabled = false;
      } else {
        alert("Заметка должна что-то содержать!");
      }
    }
  }
  if (e.target.classList.contains("deconsteBtn")) {
    e.target.parentNode.remove();
  }
});

addBtn.addEventListener("click", (e) => {
  textBox.value = textBox.value.trim();
  if (textBox.value.length !== 0) {
    addNewPost();
  } else {
    alert("Нечего добавить, введи заметку!");
  }
});

document.body.append(textBox);
document.body.append(addBtn);
document.body.append(ul);
