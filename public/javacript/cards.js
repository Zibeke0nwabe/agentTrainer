// Department data
const departments = [
  {
    title: "Customer Service",
    description: "Assisting customers with inquiries and ensuring smooth experiences.",
    image: "/icons/image2.jpeg",
  },
  {
    title: "Tech Support",
    description: "Providing technical support and troubleshooting product issues.",
    image: "https://th.bing.com/th/id/OIP.MosVHgElnuMFcamuzOzVzgHaEK?w=305&h=180&c=7&r=0&o=5&pid=1.7",
  },
  {
    title: "Retention",
    description: "Keeping customers engaged and ensuring long-term relationships.",
    image: "https://th.bing.com/th/id/OIP.o333TxekALpbApH58rqBGgHaE8?w=253&h=180&c=7&r=0&o=5&pid=1.7",
  },
  {
    title: "Complaints",
    description: "Handling customer concerns and ensuring satisfaction.",
    image: "https://th.bing.com/th/id/OIP.7P-e5bSn20eZxoAfPgtXqgHaEK?w=272&h=180&c=7&r=0&o=5&pid=1.7",
  }
];

// Check login status (mock logic — replace with real auth)
function isLoggedIn() {
  return !!localStorage.getItem('userLoggedIn'); // Adjust to your auth system
}

function renderDepartmentCards(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const currentPage = window.location.pathname;
  const loggedIn = isLoggedIn();

  const chatLink = loggedIn ? "/chat" : "/login";
  const callLink = loggedIn ? "/voice" : "/login";

  if (currentPage === '/home' || currentPage === '/') {
    container.innerHTML = '';

    departments.forEach(dept => {
      const card = document.createElement("div");
      card.className = `
        bg-white
        rounded-sm
        overflow-hidden
        flex flex-col
        transition-colors duration-300
        hover:border-gray-700
      `;

      card.innerHTML = `
        <img src="${dept.image}" alt="${dept.title}" class="w-full h-40 object-cover">
        <div class="p-5 flex flex-col flex-grow">
          <h3 class="text-lg font-semibold text-black">${dept.title}</h3>
          <p class="text-sm text-gray-600 mt-2 flex-grow">${dept.description}</p>
          <div class="mt-5 flex space-x-3">
            <!-- Chat App Button -->
            <a href="${chatLink}" class="
              flex items-center gap-2
              bg-black text-white
              px-4 py-2
              rounded-md
              text-sm
              transition-colors duration-200
              hover:bg-gray-800
              focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1
            ">
              <i class="fas fa-comments"></i> Chat App
            </a>

            <!-- Voice Call Button -->
            <a href="${callLink}" class="
              flex items-center gap-2
              bg-white text-black
              border-2 border-black
              px-4 py-2
              rounded-md
              text-sm
              transition-colors duration-200
              hover:bg-black hover:text-white
              focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1
            ">
              <i class="fas fa-phone-alt"></i> Voice Call
            </a>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  } else {
    container.innerHTML = '';
  }
}
