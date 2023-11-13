const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1650310",
  key: "2cb31aaa1fa2eebd8002",
  secret: "8834e63b7376c196ed7b",
  cluster: "ap2",
  useTLS: true
});

pusher.trigger("my-channel", "my-event", {
  message: "hello world"
});