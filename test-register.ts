const { auth } = require("./src/lib/auth");

async function run() {
  try {
    const user = await auth.api.signUpEmail({
      body: {
        email: "test@example.com",
        password: "password123",
        name: "Test User"
      }
    });
    console.log(user);
  } catch (e) {
    console.error(e);
  }
}
run();
