const mockUser = {
    username: "user",
    password: "1234",
    fullName: "John Doe",
    email: "johndoe@example.com",
    location: "Sydney, Australia"
};

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === mockUser.username && password === mockUser.password) {
        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("profilePage").classList.remove("hidden");
        document.getElementById("userFullName").textContent = mockUser.fullName;
        document.getElementById("userEmail").textContent = mockUser.email;
        document.getElementById("userLocation").textContent = mockUser.location;
    } else {
        alert("Invalid username or password!");
    }
}

function logout() {
    document.getElementById("loginPage").classList.remove("hidden");
    document.getElementById("profilePage").classList.add("hidden");
}