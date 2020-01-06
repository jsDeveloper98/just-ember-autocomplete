/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import Controller from "@ember/controller";
import faker from "npm:faker";
import { inject as service } from "@ember/service";
import { computed } from "@ember/object";

const usersCount = 100;

export default Controller.extend({
  store: service(),
  inputValue: "",
  selectedUser: "",
  indexOfUsers: -1,
  indexOfRecentUsers: -1,
  loading: true,
  users: [],
  recentUsers: [],

  recomendedProps: computed("users.[]", "inputValue", function() {
    if (!this.get("inputValue")) {
      return [];
    } else {
      const filteredUsers = this.get("users")
        .filter(
          user => user.get("username").indexOf(this.get("inputValue")) > -1
        )
        .slice(0, 5);
      return filteredUsers.mapBy("username");
    }
  }),

  filteredUsers: computed("users.[]", "selectedUser", function() {
    if (this.get("selectedUser")) {
      return this.get("users").filter(
        user =>
          user
            .get("username")
            .toLowerCase()
            .indexOf(this.get("selectedUser").toLowerCase()) > -1
      );
    }
    return this.get("users");
  }),

  recUsers: computed('recentUsers.length', 'recProps', 'inputValue', function() {
    return this.get('recentUsers.length') && this.get('recProps') && !this.get('inputValue');
  }),

  seed() {
    for (let i = 1; i <= usersCount; i++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const username = faker.internet.userName();
      const user = this.get("store").createRecord("user", {
        id: i,
        firstName,
        lastName,
        username
      });
      this.get("users").pushObject(user);
    }
  },

  init() {
    this._super(...arguments);
    setTimeout(() => {
      this.seed();
      this.set('loading', false);
    },2000)
  },

  actions: {
    selectUser(username) {
      if(this.get('inputValue') !== '') {
        this.set("inputValue", username);
        this.set("selectedUser", username);
        if(this.get('recentUsers').indexOf(this.get('inputValue')) === -1) {
           this.get("recentUsers").pushObject(this.get("inputValue"));
           if (this.get("recentUsers.length") > 5) {
               this.get("recentUsers").shiftObject();
           }
         this.get('recomendedProps').removeObject(username);
         }
       } 
    },
    selectRecentUser(recentUser) {
      this.set("inputValue", recentUser);
      this.set("selectedUser", recentUser);
      this.set('recProps', false); 
    },
    keyUp(value, event) {
      if (event.key === "Enter") {
        if (this.get("recUsers")) {
          const recentArr = this.get("recentUsers")[this.get("indexOfRecentUsers")];
          this.set("selectedUser", recentArr);
          this.set("inputValue", recentArr);
          if(this.get('inputValue') !== '') {
          this.get('recomendedProps').removeObject(recentArr);  
          }
          return;
        }
        if (
          this.get("recomendedProps.length") &&
          this.get("indexOfUsers") > -1
        ) {
          const arr = this.get("recomendedProps")[this.get("indexOfUsers")];
          this.set("selectedUser", arr);
          this.set("inputValue", arr);
           if(this.get('recentUsers').indexOf(this.get('inputValue')) === -1) {
           this.get("recentUsers").pushObject(this.get("inputValue"));
           }
          if (this.get("recentUsers.length") > 5) {
            this.get("recentUsers").shiftObject();
          }
          this.get('recomendedProps').removeObject(arr);
        } else {
          this.set("inputValue", value);
          this.set("selectedUser", value);
        }
      } else if (event.key === "ArrowUp") {
        this.decrementProperty("indexOfUsers");
        this.decrementProperty("indexOfRecentUsers");
        if (this.get("indexOfRecentUsers") < -1) {
          this.set("indexOfRecentUsers", this.get("recentUsers.length") - 1);
        }
        if (this.get("indexOfUsers") < -1) {
          this.set("indexOfUsers", this.get("recomendedProps.length") - 1);
        }
      } else if (event.key === "ArrowDown") {
        this.incrementProperty("indexOfUsers");
        this.incrementProperty("indexOfRecentUsers");
        if (
          this.get("indexOfRecentUsers") >
          this.get("recentUsers.length") - 1
        ) {
          this.set("indexOfRecentUsers", -1);
        }
        if (this.get("indexOfUsers") > this.get("recomendedProps.length") - 1) {
          this.set("indexOfUsers", -1);
        }
      }
    }
  }
});
