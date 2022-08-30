//сконфигурировать приттиер
//настроить самому вебпак
//переписать фронт на реакт на классах
//приложение без креейт реакт апп

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
      event.forEach((callback) =>  callback.call(null, ...args));
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
  add(id, content, completed) {
    this.storage.push({
      id: id,
      content: content,
      completed: completed,
    });
    this.addPostInDB(this.storage[this.storage.length - 1]);
  }
  load(id, content, completed) {
    this.storage.push({
      id: id,
      content: content,
      completed: completed,
    });
  }
  complete(id) {
    this.storage.forEach((elem) => {
      if (elem.id === id) {
        if (elem.completed == true) {
          elem.completed = false;
          this.updatePostInDB(elem);
        } else {
          elem.completed = true;
          this.updatePostInDB(elem);
        }
      }
    });
  }
  edit(id, content) {
    this.storage.forEach((elem) => {
      if (elem.id === id) {
        elem.content = content;
        this.updatePostInDB(elem);
      }
    });
  }
  delete(id) {
    this.storage.forEach((elem, i) => {
      if (elem.id === id) {
        this.deletePostInDB(elem);
        this.storage.splice(i, 1);
      }
    });
  }
  async addPostInDB(elem) {
    let url = "http://localhost:3000";
    const response = await fetch(`${url}/addpost`, {
      mode: "no-cors",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: elem.id,
        content: elem.content,
        completed: elem.completed,
      }),
    });
    const responseText = await response.text();
    console.log(responseText);
  }
  async updatePostInDB(elem) {
    let url = "http://localhost:3000";
    const response = await fetch(`${url}/editpost`, {
      mode: "no-cors",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: elem.id,
        content: elem.content,
        completed: elem.completed,
      }),
    });
    const responseText = await response.text();
    console.log(responseText);
  }

  async deletePostInDB(elem) {
    let url = "http://localhost:3000";
    const response = await fetch(`${url}/deletepost`, {
      mode: "no-cors",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: elem.id,
        content: elem.content,
        completed: elem.completed,
      }),
    });
    const responseText = await response.text();
    console.log(responseText);
  }
}

class Task {
  constructor(eventStorages) {
    this.eventStorage = eventStorages;
    this.eventStorage.subscribe("done",this.done);
    this.eventStorage.subscribe("edit", this.edit);
    this.eventStorage.subscribe("delete", this.delete);
  }
  addNewPost(storage) {
    let content = document.querySelector(".textBox");
    const id = document.querySelector("ul")?.lastChild?.getAttribute("id");
    if (id) {
      storage.add(+id+1, content.value, false);
    } else {
      storage.add(0, content.value, false);
    }
    this.render(storage);
    content.value = "";
  }
  done(storage, id) {
    storage.complete(id);
    this.render(storage);
  }
  delete(storage, id) {
    storage.delete(id);
    this.render(storage);
  }
  edit(storage, e, id) {
    if (e.target.previousSibling.classList.contains("content")) {
      const redBox = document.createElement("input");
      redBox.value = e.target.previousSibling.textContent;
      e.target.previousSibling.replaceWith(redBox);
      let memory = redBox.value;
      const btn = e.target;
      e.target.previousSibling.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const event = new Event("click", { bubbles: true });
          btn.dispatchEvent(event);
        }
        if (e.key === "Escape") {
          e.target.value = memory;
          e.target.blur();
          const event = new Event("click", { bubbles: true });
          btn.dispatchEvent(event);
        }
      });
      e.target.textContent = "Save changes";
      e.target.previousSibling.previousSibling.disabled = true;
      e.target.nextSibling.disabled = true;
    } else {
      e.target.previousSibling.value = e.target.previousSibling.value.trim();
      if (e.target.previousSibling.value.length != 0) {
        const redContent = document.createElement("div");
        redContent.classList.add("content");
        redContent.textContent = e.target.previousSibling.value;
        storage.edit(id, redContent.textContent)
        redContent.addEventListener("click", () => {
          const event = new Event("click", { bubbles: true });
          e.target.dispatchEvent(event);
        });
        e.target.previousSibling.replaceWith(redContent);
        e.target.textContent = "Change";
        e.target.previousSibling.previousSibling.disabled = false;
        e.target.nextSibling.disabled = false;
      } else {
        alert("Input something");
      }
    }
  }

  render(storage) {
    let ul = document.querySelector("ul");
    ul?.remove();
    ul = document.createElement("ul");

    storage.storage.forEach((elem) => {
      const li = document.createElement("li");
      const content = document.createElement("div");
      const doneBtn = document.createElement("button");
      const changeBtn = document.createElement("button");
      const deconsteBtn = document.createElement("button");

      doneBtn.textContent = "Done";
      doneBtn.classList.add("doneBtn");
      changeBtn.textContent = "Change";
      changeBtn.classList.add("changeBtn");
      deconsteBtn.textContent = "Delete";
      deconsteBtn.classList.add("deconsteBtn");
      content.textContent = elem.content;
      content.classList.add("content");
      li.setAttribute("id", elem.id);

      content.addEventListener("click", () => {
        const event = new Event("click", { bubbles: true });
        changeBtn.dispatchEvent(event);
      });

      if (elem.completed) {
        doneBtn.textContent = "Cancel";
        content.classList.add("done");
        changeBtn.disabled = true;
      }

      li.append(doneBtn);
      li.append(content);
      li.append(changeBtn);
      li.append(deconsteBtn);
      ul.append(li);
    });
    ul.addEventListener("click", (e) => {
      const id =+ e.target.parentNode.getAttribute("id");
      if (e.target.classList.contains("doneBtn")) {
        this.done(storage, id);
      }
      if (
        e.target.classList.contains("changeBtn") &&
        !e.target.previousSibling.classList.contains("done")
      ) {
        this.edit(storage,e, id);
      }
      if (e.target.classList.contains("deconsteBtn")) {
        this.delete(storage, id);
      }
      storage.log();
    });
    document.body.append(ul);
  }
}

class Form {
  constructor() {
    const eventStorage = new EventEmitter();
    const textBox = document.createElement("input");
    const addBtn = document.createElement("button");

    const storage = new Storage([], 0);
    const taskList = new Task(eventStorage);

    addBtn.textContent = "Add";
    textBox.placeholder = "Enter text";
    textBox.classList.add("textBox");

    addBtn.addEventListener("click", (e) => {
      textBox.value = textBox.value.trim();
      if (textBox.value.length !== 0) {
        taskList.addNewPost(storage);
      } else {
        alert("Nothing to add, please enter something!");
      }
    });
    textBox.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const event = new Event("click", { bubbles: true });
        addBtn.dispatchEvent(event);
      }
      if (e.key === "Escape") {
        e.target.value = "";
        e.target.blur();
      }
    });

    document.body.append(textBox);
    document.body.append(addBtn);
    this.loadNotates(storage, taskList);
  }
  async loadNotates(storage, taskList) {
    let posts;
    let url = "http://localhost:3000";
    await fetch(`${url}/getposts`)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        posts = data;
        console.log(data);
      });

    posts.forEach((elem) => {
      storage.load(elem.id, elem.content, elem.completed);
    });
    taskList.render(storage);
  }
}

const form = new Form();
