export default class {
   constructor(key, description) {
      this.Key = key;
      this.Description = description;
   }

   static BuildAny() {
      return new this("Harness.Socket.Type.Any","Will allow any type of connection.");
   }

   static BuildScalar() {
      return new this("Harness.Socket.Type.Scalar","A single value");
   }

   static BuildVector() {
      return new this("Harness.Socket.Type.Vector","A 1 dimensional array of values");
   }
}