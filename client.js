const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObeject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObeject.todoPackage;

const text = process.argv[2];

const client = new todoPackage.Todo(
  "localhost:40000",
  grpc.credentials.createInsecure()
);

client.createTodo(
  {
    id: -1,
    text: text,
  },
  (err, response) => {
    console.log("Recieved from server " + JSON.stringify(response));
  }
);

// client.readTodos({}, (err, response) => {
//   console.log("Read the todos from server " + JSON.stringify(response));
// });

const call = client.readTodosStream();

call.on("data", (item) => {
  console.log("Recieved item from server " + JSON.stringify(item));
});

call.on("end", (e) => {
  console.log("Server done! ");
});
