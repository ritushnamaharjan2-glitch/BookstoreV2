const { createApp } = Vue;

createApp({
  data() {
    return {
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

      lessons: [],
      sortAttribute: "subject",
      sortOrder: "asc",
      searchText: "",

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
        return this.sortOrder === "asc"
          ? (valA > valB ? 1 : -1)
          : (valA < valB ? 1 : -1);
      });
    },
    filteredLessons() {
  const query = this.searchText.toLowerCase();

  return this.sortedLessons.filter(lesson => {
    return (
      lesson.subject.toLowerCase().includes(query) ||
      lesson.location.toLowerCase().includes(query) ||
      lesson.tutor.toLowerCase().includes(query) ||
      lesson.book.toLowerCase().includes(query)
    );
  });
},


    isCheckoutValid() {
      return /^[A-Za-z\s]+$/.test(this.checkoutName) &&
        /^[0-9]+$/.test(this.checkoutPhone) &&
        this.cart.length > 0;
    }
  },

  methods: {
    toggleForm(show) {
      this.showLogin = show;
      this.errorMessage = "";
    },

    toggleCartView(state) {
      this.showCart = state;
    },

    // -------------------------
    // REGISTER USER
    // -------------------------
    registerUser() {
      if (!this.registerUsername || !this.registerEmail || !this.registerPassword || !this.confirmPassword)
        return this.errorMessage = "All fields are required!";

      if (this.registerPassword !== this.confirmPassword)
        return this.errorMessage = "Passwords do not match!";

      fetch("https://bookstorev2-1.onrender.com/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.registerUsername,
          email: this.registerEmail,
          password: this.registerPassword
        })
      })
        .then(async response => {
          const data = await response.json();
          if (!response.ok)
            return this.errorMessage = data.message || "Registration failed.";

          alert("Registration successful!");
          this.showLogin = true;
          this.errorMessage = "";
        })
        .catch(() => {
          this.errorMessage = "Could not connect to server.";
        });
    },

    // -------------------------
    // LOGIN USER
    // -------------------------
    validateLogin() {
     fetch("https://bookstorev2-1.onrender.com/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.loginEmail,
          password: this.loginPassword
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.username) {
            this.isLoggedIn = true;
            this.currentUser = data;
            this.errorMessage = "";
          } else {
            this.errorMessage = data.message || "Invalid login";
          }
        })
        .catch(() => {
          this.errorMessage = "Server error";
        });
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
      const lesson = this.lessons.find(l => l._id === item._id);
      if (lesson) lesson.space++;
      this.cart.splice(index, 1);
    },

    // -------------------------
    // CHECKOUT
    // -------------------------
    checkout() {
      const lessonIDs = this.cart.map(item => item._id);
      const spaces = this.cart.map(() => 1);

     fetch("https://bookstorev2-1.onrender.com/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: this.checkoutName,
          phone: this.checkoutPhone,
          lessonIDs,
          spaces
        })
      })
        .then(() => {
          // Update spaces in DB
          this.cart.forEach(item => {
            fetch(`https://bookstorev2-1.onrender.com/lessons/${item._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ space: item.space })
            });
          });

          alert(`Order confirmed for ${this.checkoutName}`);

          this.cart = [];
          this.checkoutName = "";
          this.checkoutPhone = "";
          this.showCart = false;
        })
        .catch(() => {
          alert("Checkout failed. Server error.");
        });
    }
  },

  // -------------------------
  // LOAD LESSONS
  // -------------------------
  mounted() {
    fetch("https://bookstorev2-1.onrender.com/lessons")
      .then(res => res.json())
      .then(data => {
        console.log("Lessons fetched:", data);
        this.lessons = data;
      })
      .catch(err => console.error("Fetch error:", err));
  }
}).mount("#app");
