const { createApp } = Vue;

createApp({
  data() {
    return {
      // Auth
      isLoggedIn: false,
      showLogin: true,
      errorMessage: "",
      currentUser: {},
      loginEmail: "",
      loginPassword: "",
      registerUsername: "",
      registerEmail: "",
      registerPassword: "",
      confirmPassword: "",

      // Lessons
      lessons: [
         { subject: "Mathematics", location: "New York", price: 50, space: 10, tutor: "John Doe", rating: 4.5, book: "Algebra Made Easy" }, 
        { subject: "Physics", location: "Chicago", price: 45, space: 8, tutor: "Jane Smith", rating: 4.8, book: "The Quantum World" },
         { subject: "Chemistry", location: "Los Angeles", price: 40, space: 12, tutor: "Dr. Albert", rating: 4.2, book: "Organic Basics" },
          { subject: "English Literature", location: "Houston", price: 35, space: 15, tutor: "Emily Brown", rating: 4.7, book: "Shakespeare Complete Works" }, 
          { subject: "Computer Science", location: "Boston", price: 60, space: 7, tutor: "Mark Wilson", rating: 4.9, book: "Intro to Algorithms" }, 
          { subject: "Biology", location: "San Diego", price: 42, space: 9, tutor: "Sarah Lee", rating: 4.6, book: "Human Anatomy Guide" }, 
          { subject: "Economics", location: "Miami", price: 38, space: 11, tutor: "Robert King", rating: 4.3, book: "Macro & Micro Economics" },
           { subject: "History", location: "Seattle", price: 33, space: 10, tutor: "Anne Carter", rating: 4.4, book: "World History 101" }, 
           { subject: "Music", location: "Dallas", price: 55, space: 6, tutor: "Paul Green", rating: 4.8, book: "Theory of Sound" },
            { subject: "Art", location: "Denver", price: 48, space: 8, tutor: "Lucy Adams", rating: 4.5, book: "Modern Art Explained" } 
          ],
      sortAttribute: "subject",
      sortOrder: "asc",

      // Cart
      cart: [],
      showCart: false,
      checkoutName: "",
      checkoutPhone: ""
    };
  },

  computed: {
    sortedLessons() {
      return [...this.lessons].sort((a, b) => {
        let valA = a[this.sortAttribute];
        let valB = b[this.sortAttribute];
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();
        if (this.sortOrder === "asc") return valA > valB ? 1 : -1;
        else return valA < valB ? 1 : -1;
      });
    },
    isCheckoutValid() {
      const nameValid = /^[A-Za-z\s]+$/.test(this.checkoutName);
      const phoneValid = /^[0-9]+$/.test(this.checkoutPhone);
      return nameValid && phoneValid && this.cart.length > 0;
    }
  },

  methods: {
    toggleForm(show) { this.showLogin = show; this.errorMessage = ""; },
    toggleCartView(state) { this.showCart = state; },

    registerUser() {
      if (!this.registerUsername || !this.registerEmail || !this.registerPassword || !this.confirmPassword)
        return this.errorMessage = "All fields are required!";
      if (this.registerPassword !== this.confirmPassword)
        return this.errorMessage = "Passwords do not match!";
      let users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.some(u => u.email === this.registerEmail || u.username === this.registerUsername))
        return this.errorMessage = "User already exists!";
      users.push({ username: this.registerUsername, email: this.registerEmail, password: this.registerPassword });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Registration successful!");
      this.showLogin = true;
      this.errorMessage = "";
    },

    validateLogin() {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(u =>
        (u.email === this.loginEmail || u.username === this.loginEmail) && u.password === this.loginPassword);
      if (user) {
        this.isLoggedIn = true; this.currentUser = user; this.errorMessage = "";
      } else this.errorMessage = "Invalid credentials.";
    },

    logout() {
      this.isLoggedIn = false;
      this.currentUser = {};
      this.cart = [];
      this.showCart = false;
    },

    addToCart(lesson) {
      if (lesson.space > 0) {
        lesson.space--;
        this.cart.push({ ...lesson });
      }
    },

    removeFromCart(index) {
      const item = this.cart[index];
      const lesson = this.lessons.find(l => l.subject === item.subject);
      if (lesson) lesson.space++;
      this.cart.splice(index, 1);
    },

    checkout() {
      alert(`✅ Order confirmed for ${this.checkoutName}. We’ll contact you at ${this.checkoutPhone}.`);
      this.cart = [];
      this.checkoutName = "";
      this.checkoutPhone = "";
      this.showCart = false;
    }
  }
}).mount("#app");
