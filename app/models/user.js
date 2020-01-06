import Model, { attr } from "@ember-data/model";

export default Model.extend({
  firstName: attr("string"),
  lastName: attr("string"),
  username: attr("string")
});
