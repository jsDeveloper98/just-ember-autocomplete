import Model, { attr } from "@ember-data/model";
import { computed } from "@ember/object";

export default Model.extend({
  firstName: attr("string"),
  lastName: attr("string"),
  username: attr("string"),

  fullName: computed("firstName", "lastName", "username", function() {
    return `${this.get(
      "firstName"
    )} ${this.get("lastName")} ${this.get("username")}`;
  })
});
