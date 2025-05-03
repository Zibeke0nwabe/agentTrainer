// Array of department card data
const departments = [
  {
    title: "Customer Service",
    description: "Assisting customers with inquiries and ensuring smooth experiences.",
    image: "https://th.bing.com/th/id/OIP.fyXyg1BJ7AMtjbBY9N4XVwHaEW?w=277&h=180&c=7&r=0&o=5&pid=1.7",
    chatLink: "/login", // Default link for /login
    callLink: "/login"  // Default link for /login
  },
  {
    title: "Tech Support",
    description: "Providing technical support and troubleshooting product issues.",
    image: "https://th.bing.com/th/id/OIP.MosVHgElnuMFcamuzOzVzgHaEK?w=305&h=180&c=7&r=0&o=5&pid=1.7",
    chatLink: "/login", // Default link for /login
    callLink: "/login"  // Default link for /login
  },
  {
    title: "Retention",
    description: "Keeping customers engaged and ensuring long-term relationships.",
    image: "https://th.bing.com/th/id/OIP.o333TxekALpbApH58rqBGgHaE8?w=253&h=180&c=7&r=0&o=5&pid=1.7",
    chatLink: "/login", // Default link for /login
    callLink: "/login"  // Default link for /login
  },
  {
    title: "Complaints",
    description: "Handling customer concerns and ensuring satisfaction.",
    image: "https://th.bing.com/th/id/OIP.7P-e5bSn20eZxoAfPgtXqgHaEK?w=272&h=180&c=7&r=0&o=5&pid=1.7",
    chatLink: "/login", // Default link for /login
    callLink: "/login"  // Default link for /login
  }
];

// Function to check if the user is logged in (you'll need to implement this based on your session management)
function isLoggedIn() {
  // Example: Check if there's a session or a specific token in localStorage, cookies, etc.
  // Replace this with your actual login check logic (e.g., checking a session variable or token)
  return !!localStorage.getItem('userLoggedIn'); // Or check session variable if using session management
}

// Function to render department cards into a container
function renderDepartmentCards(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Determine which page we're on: /home, /, etc.
  const currentPage = window.location.pathname;

  // Check if the user is logged in
  const loggedIn = isLoggedIn();

  // Only show department cards on /home or / if logged in
  if (currentPage === '/home') {
    // If the user is logged in, update the routes for /home or / with proper links
    departments.forEach(dept => {
      dept.chatLink = "/chat";  // Update Chat App link for /home or /
      dept.callLink = "/voice"; // Update Voice Call link for /home or /
    });

    // Loop through departments and create the cards
    departments.forEach(dept => {
      const card = document.createElement("div");
      card.className = "bg-white p-6 rounded-lg hover:shadow-md transition-shadow duration-300";
      card.innerHTML = `
        <img src="${dept.image}" alt="${dept.title}" class="w-full h-48 object-cover rounded-t-lg">
        <h3 class="text-xl font-semibold text-gray-800 mt-4">${dept.title}</h3>
        <p class="text-sm text-gray-600 mt-2">${dept.description}</p>
        <div class="mt-4 flex space-x-4">
          <!-- Chat App Button -->
          <button class="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200">
            <a href="${dept.chatLink}">Chat App</a>
          </button>
          <!-- Voice Call Button -->
          <button class="bg-white text-black border-2 border-black px-4 py-2 rounded-md hover:bg-black hover:text-white transition-colors duration-200">
            <a href="${dept.callLink}">Voice Call</a>
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  } else if (currentPage === '/') {
    // If user is logged out, show the login prompt only on the landing page ('/')
    departments.forEach(dept => {
      dept.chatLink = "/login";  // Default login page link
      dept.callLink = "/login";  // Default login page link
    });

    // Render the login prompt
    departments.forEach(dept => {
      const card = document.createElement("div");
      card.className = "bg-white p-6 rounded-lg hover:shadow-md transition-shadow duration-300";
      card.innerHTML = `
        <img src="${dept.image}" alt="${dept.title}" class="w-full h-48 object-cover rounded-t-lg">
        <h3 class="text-xl font-semibold text-gray-800 mt-4">${dept.title}</h3>
        <p class="text-sm text-gray-600 mt-2">${dept.description}</p>
        <div class="mt-4 flex space-x-4">
          <!-- Chat App Button -->
          <button class="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200">
            <a href="${dept.chatLink}">Chat App</a>
          </button>
          <!-- Voice Call Button -->
          <button class="bg-white text-black border-2 border-black px-4 py-2 rounded-md hover:bg-black hover:text-white transition-colors duration-200">
            <a href="${dept.callLink}">Voice Call</a>
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  } else {
    // If the page is not /home or /, don't render any department cards
    container.innerHTML = ''; // Clear the container if the user is not on /home or /
  }
}
