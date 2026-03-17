document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // Scroll reveal logic
  const reveals = document.querySelectorAll(".reveal");
  function revealOnScroll(){
    reveals.forEach(el => {
      if(el.getBoundingClientRect().top < window.innerHeight - 80){
        el.classList.add("active");
      }
    });
  }
  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  // Project filters logic
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      document.querySelectorAll(".project-card").forEach(card => {
        card.style.display =
          filter === "all" || card.dataset.category === filter
          ? "flex"
          : "none";
      });
    });
  });

  // GitHub API stats
  fetch("https://api.github.com/users/heyitzamjad")
    .then(res => res.json())
    .then(data => {
      document.getElementById("github-stats").innerHTML = `
        <strong>${data.public_repos}</strong> Repositories ·
        <strong>${data.followers}</strong> Followers ·
        <strong>${data.following}</strong> Following
      `;
    })
    .catch(() => {
      document.getElementById("github-stats").innerText = "GitHub data unavailable";
    });
});
