import { fetchGitHubUserData } from "./github.js";

export class GitFav {
  constructor(rootElement) {
    this.root = document.querySelector(rootElement);
    this.table_body = this.root.querySelector('table tbody');
    this.loadLocalStorageData();
    this.updateTable();
    this.onAdd();
  }

  loadLocalStorageData() {
    const localStorageData = localStorage.getItem('@gitfav:')
    this.userEntries = JSON.parse(localStorageData) || [];
  }

  saveToLocalStorage() {
    localStorage.setItem('@gitfav:', JSON.stringify(this.userEntries));
  }

  deleteUser(user) {
    const filteredEntries = this.userEntries
      .filter((entry) => entry.login !== user.login);
    this.userEntries = filteredEntries;
    this.updateTable();
    this.saveToLocalStorage();
  }


  async addUser(username) {
    try {

      const userExists = this.userEntries.find(entry => entry.login === username);
      if (userExists) {
        throw new Error('User already exists');
      }

      const githubUser = await fetchGitHubUserData(username);

      if (githubUser.login === undefined) {
        throw new Error('User not found');
      }

      this.userEntries = [githubUser, ...this.userEntries];
      this.updateTable();
      this.saveToLocalStorage()

    } catch (error) {
      alert(error.message);
    }
  }

  onAdd() {
    const addButton = this.root.querySelector('.search button');
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input');
      this.addUser(value);
    }
  }

  emptyTableBackground(){
    const bg = document.createElement('td');
    bg.classList.add("empty-table")
    bg.colSpan = "4";
    const htmlContent =
      `<img src="./assets/nofavorites.svg" class="star-emote">`
    bg.innerHTML = htmlContent;
    return bg;
  }

  updateTable() {

    this.removeAllTableRows();
    if (this.userEntries.length == 0){
      const bgHTML = this.emptyTableBackground();
      this.table_body.append(bgHTML);
    }

    this.userEntries.forEach(user => {
      const row = this.createTableRow(user);
      this.table_body.append(row);
      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Are you sure you want to remove this entry?');
        if (isOk) {
          this.deleteUser(user);
        };
      };
    });
  }

  createTableRow(user) {
    const tr = document.createElement('tr');
    const htmlContent =
      `
          <td class="user">
          <div>
            <img src="https://github.com/${user.login}.png" alt="" class="usr-img">
            <div class="username-data">
              <span>${user.name == null ? user.login : user.name}</span>
              <a href="https://github.com/${user.login}" target="_blank">/${user.login}</a>
            </div>
          </div>
          </td>
          <td class="repositories">${user.public_repos}</td>
          <td class="followers">${user.followers}</td>
          <td class="remove">Remove</td>
        `
    tr.innerHTML = htmlContent;
    return tr;
  }

  removeAllTableRows() {
    this.table_body.querySelectorAll('tr').forEach((tr) => { tr.remove() });
    this.table_body.querySelectorAll('td').forEach((td) => { td.remove() });
  }

}