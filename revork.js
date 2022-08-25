class Storage {
  constructor(storage, index) {
    this._storage = storage;
    this._index = index;
  }
  get storage() {
    return this._storage;
  }
  get index() {
    return this._index;
  }
  set index(value) {
    this._index = value;
  }
  log(){
    console.log(this._storage);
  }
}

class Task {
  constructor(ul, storage) {
    ul.addEventListener("click", (e) => {
      if (e.target.classList.contains("doneBtn")) {
        const lis = document.querySelectorAll("li div");
        lis.forEach((element, i) => {
          if (element.textContent == e.target.nextSibling.textContent) {
            storage.index = i;
          }
        });

        e.target.nextSibling.classList.toggle("done");
        if (e.target.nextSibling.nextSibling.disabled === false) {
          e.target.nextSibling.nextSibling.disabled = true;
          e.target.textContent = "Доделать";
          storage.storage.forEach((item, i) => {
            if (i == storage.index) {
              item.completed = true;
            }
          });
        } else {
          e.target.nextSibling.nextSibling.disabled = false;
          e.target.textContent = "Выполнено";
          storage.storage.forEach((item, i) => {
            if (i == storage.index) {
              item.completed = false;
            }
          });
        }
      }
      if (
        e.target.classList.contains("changeBtn") &&
        !e.target.previousSibling.classList.contains("done")
      ) {
        if (e.target.previousSibling.classList.contains("content")) {
          const lis = document.querySelectorAll("li div");
          lis.forEach((element, i) => {
            if (element.textContent == e.target.previousSibling.textContent) {
              storage.index = i;
            }
          });
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
          e.target.previousSibling.value =
            e.target.previousSibling.value.trim();
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
            storage.storage.forEach((item, i) => {
              if (i == storage.index) {
                item.content = redContent.textContent;
              }
            });
          } else {
            alert("Заметка должна что-то содержать!");
          }
        }
      }
      if (e.target.classList.contains("deconsteBtn")) {
        const lis = document.querySelectorAll("li div");
        let index = 0;
        lis.forEach((element, i) => {
          if (
            element.textContent ==
            e.target.previousSibling.previousSibling.textContent
          ) {
            index = i;
          }
        });

        storage.storage.forEach((item, i) => {
          if (i == index) {
            storage.storage.splice(i, 1);
          }
        });

        e.target.parentNode.remove();
      }
      storage.log();
    });
  }
  addNewPost(textBox, ul, storage) {
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

    if (storage.storage.length !== 0) {
      storage.storage.push({
        id: storage.storage[storage.storage.length - 1].id + 1,
        content: textBox.value,
        completed: false,
      });
    } else {
      storage.storage.push({
        id: 0,
        content: textBox.value,
        completed: false,
      });
    }

    textBox.value = "";
  }
}

class Form {
  constructor() {
    const textBox = document.createElement("input");
    const addBtn = document.createElement("button");
    const ul = document.createElement("ul");
    const storage = new Storage([], 0);
    const taskList = new Task(ul, storage);

    addBtn.textContent = "Добавить запись";
    textBox.placeholder = "Введи заметку";
    textBox.classList.add("textBox");

    addBtn.addEventListener("click", (e) => {
      textBox.value = textBox.value.trim();
      if (textBox.value.length !== 0) {
        taskList.addNewPost(textBox, ul, storage);
      } else {
        alert("Нечего добавить, введи заметку!");
      }
    });

    document.body.append(textBox);
    document.body.append(addBtn);
    document.body.append(ul);
  }
}

const form = new Form();
