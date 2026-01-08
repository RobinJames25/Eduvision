// Sidebar elements
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const openBtn = document.getElementById("openSidebar");
const closeBtn = document.getElementById("closeSidebar");

// Optional dropdowns (safe checks)
const headerDropdownBtn = document.querySelector(".dropdown-btn");
const headerDropdownMenu = document.querySelector(".dropdown-menu");
const sidebarDropdownBtn = document.querySelector(".sidebar-dropdown");
const sidebarDropdownMenu = document.querySelector(".sidebar-dropdown-menu");

// Open sidebar
openBtn?.addEventListener("click", () => {
  sidebar.classList.add("open");
  overlay.classList.add("show");
});

// Close sidebar
closeBtn?.addEventListener("click", closeSidebar);
overlay?.addEventListener("click", closeSidebar);

function closeSidebar() {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
}

// Header dropdown
headerDropdownBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  headerDropdownMenu.classList.toggle("open");
  headerDropdownBtn.classList.toggle("active");
});

// Sidebar dropdown
sidebarDropdownBtn?.addEventListener("click", () => {
  sidebarDropdownMenu.classList.toggle("open");
  sidebarDropdownBtn.classList.toggle("active");
});

// Close header dropdown on outside click
document.addEventListener("click", () => {
  headerDropdownMenu?.classList.remove("open");
  headerDropdownBtn?.classList.remove("active");
});
