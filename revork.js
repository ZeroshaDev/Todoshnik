class EventEmitter {
  constructor() {
    this.events = {};
  }
  subscribe(eventName, callback) {
    if (!this.events[eventName] && (this.events[eventName] = [])) {
      this.events[eventName].push(callback);
    }
  }
  unsubscribe(eventName, callback) {
    this.events[eventName] = this.events[eventName].filter(
      (eventCallback) => callback !== eventCallback
    );
  }
  emit(eventName, args) {
    const event = this.events[eventName];
    if (event) {
      event.forEach((callback) => callback.call(null, ...args));
    }
  }
}

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
  log() {
    console.log(this._storage);
  }
  add(textBox) {
    if (this.storage.length !== 0) {
      this.storage.push({
        id: this.storage[this.storage.length - 1].id + 1,
        content: textBox.value,
        completed: false,
      });
    } else {
      this.storage.push({
        id: 0,
        content: textBox.value,
        completed: false,
      });
    }
  }
  complete(lis, e) {
    lis.forEach((element, i) => {
      if (element.textContent == e.target.nextSibling.textContent) {
        this.index = i;
      }
    });
    if (e.target.nextSibling.nextSibling.disabled === false) {
      this.storage.forEach((item, i) => {
        if (i == this.index) {
          item.completed = true;
        }
      });
    } else {
      this.storage.forEach((item, i) => {
        if (i == this.index) {
          item.completed = false;
        }
      });
    }
  }
  redact(lis, e, ...args) {
    if (e.target.previousSibling.classList.contains("content")) {
      lis.forEach((element, i) => {
        if (element.textContent == e.target.previousSibling.textContent) {
          this.index = i;
        }
      });
    } else {
      this.storage.forEach((item, i) => {
        if (i == this.index) {
          item.content = args[0].textContent;
        }
      });
    }
  }
  delete(lis, e) {
    lis.forEach((element, i) => {
      if (
        element.textContent ==
        e.target.previousSibling.previousSibling.textContent
      ) {
        this.index = i;
      }
    });
    this.storage.forEach((item, i) => {
      if (i == this.index) {
        this.storage.splice(i, 1);
      }
    });
  }
}

class Task {
  constructor(eventStorage) {
    eventStorage.subscribe("done", this.done);
    eventStorage.subscribe("edit", this.edit);
    eventStorage.subscribe("delete", this.delete);
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

    storage.add(textBox);

    textBox.value = "";
  }
  done(storage, e) {
    const lis = document.querySelectorAll("li div");
    e.target.nextSibling.classList.toggle("done");
    storage.complete(lis, e);
    if (e.target.nextSibling.nextSibling.disabled === false) {
      e.target.nextSibling.nextSibling.disabled = true;
      e.target.textContent = "Доделать";
    } else {
      e.target.nextSibling.nextSibling.disabled = false;
      e.target.textContent = "Выполнено";
    }
  }
  delete(storage, e) {
    const lis = document.querySelectorAll("li div");
    storage.delete(lis, e);

    e.target.parentNode.remove();
  }
  edit(storage, e) {
    if (e.target.previousSibling.classList.contains("content")) {
      const lis = document.querySelectorAll("li div");
      storage.redact(lis, e);
      const redBox = document.createElement("input");
      redBox.value = e.target.previousSibling.textContent;
      e.target.previousSibling.replaceWith(redBox);
      let memory=redBox.value;
      const btn = e.target;
      e.target.previousSibling.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const event = new Event("click", { bubbles: true });
          btn.dispatchEvent(event);
        }
        if(e.key==="Escape"){
          e.target.value=memory;
          e.target.blur();
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
        storage.redact(1, e, redContent);
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
}

class Form {
  constructor() {
    const eventStorage = new EventEmitter();
    const textBox = document.createElement("input");
    const addBtn = document.createElement("button");
    const ul = document.createElement("ul");
    const storage = new Storage([], 0);
    const taskList = new Task(eventStorage);

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
    textBox.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const event = new Event("click", { bubbles: true });
        addBtn.dispatchEvent(event);
      }
      if(e.key==="Escape"){
        e.target.value="";
        e.target.blur();
      }
    });

    ul.addEventListener("click", (e) => {
      if (e.target.classList.contains("doneBtn")) {
      
        eventStorage.emit("done",[storage,e]);
      }
      if (
        e.target.classList.contains("changeBtn") &&
        !e.target.previousSibling.classList.contains("done")
      ) {
       
        eventStorage.emit("edit",[storage,e]);
      }
      if (e.target.classList.contains("deconsteBtn")) {
       
        eventStorage.emit("delete",[storage,e]);
      }
      storage.log();
    });

    document.body.append(textBox);
    document.body.append(addBtn);
    document.body.append(ul);
  }

}

const form = new Form();
