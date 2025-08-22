/********* Theme Toggle ************/
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark-theme");

  // Optional: Save preference
  if (document.documentElement.classList.contains("dark-theme")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

// Load saved preference
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark-theme");
}

/********Modal functionality **********/
const modal = document.getElementById("add-book-modal");
const modalClose = document.getElementById("close-modal-btn");
const openModalBtn = document.getElementById("open-modal-btn");

openModalBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});

/************* DELETE Request when pressing delete button *************/
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".delete-book-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      // Make sure the button has a data-book-id attribute in your HTML: <button class="delete-book-btn" data-book-id="123">
      console.log("Delete button clicked for book ID:", btn.dataset.bookId);
      if (!btn.dataset.bookId) {
        alert("Error: Book ID not found on delete button.");
        return;
      }
      if (confirm("Are you sure you want to delete this book?")) {
        fetch(`/books/${btn.dataset.bookId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          if (res.ok) {
            window.location.reload();
          } else {
            alert("Failed to delete book.");
          }
        });
      }
    });
  });
});
