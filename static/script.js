// Hamburger Menu Functionality
function hamburg() {
  const navbar = document.querySelector(".dropdown");
  navbar.style.transform = "translateY(0px)";
}

function cancel() {
  const navbar = document.querySelector(".dropdown");
  navbar.style.transform = "translateY(-500px)";
}

// Typewriter Effect for Home Page
const texts = ["SOFTWARE DEVELOPER", "PYTHON DEVELOPER", "DATA ANALYST"];
let speed = 100;
const textElements = document.querySelector(".typewriter-text");
let textIndex = 0;
let charIndex = 0;

function typeWriter() {
  if (charIndex < texts[textIndex].length) {
    textElements.innerHTML += texts[textIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeWriter, speed);
  } else {
    setTimeout(eraseText, 1000); // Delay before erasing
  }
}

function eraseText() {
  if (textElements.innerHTML.length > 0) {
    textElements.innerHTML = textElements.innerHTML.slice(0, -1);
    setTimeout(eraseText, 50);
  } else {
    textIndex = (textIndex + 1) % texts.length; // Cycle through texts
    charIndex = 0;
    setTimeout(typeWriter, 500); // Start typing the next text
  }
}

window.onload = typeWriter;

// Sliding Page Navigation
function navigateWithSlide(targetPage) {
  const body = document.body;
  body.classList.add("slide-out"); // Add the sliding animation class
  setTimeout(() => {
    window.location.href = targetPage; // Navigate to the target page
  }, 50); // Wait for the animation to complete
}

document
  .querySelectorAll(".nav-container .links a, .dropdown .links a")
  .forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default link behavior
      const targetPage = link.getAttribute("href"); // Get the target page
      navigateWithSlide(targetPage); // Call the sliding navigation function
    });
  });

// Chatbox Functionality
const chatbox = document.getElementById("chatbox");
const chatboxHeader = document.querySelector(".chatbox-header");
const messagesContainer = document.getElementById("chatbox-messages");

// Chatbox Dragging
let isDragging = false;
let offsetX, offsetY;

chatboxHeader.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - chatbox.offsetLeft;
  offsetY = e.clientY - chatbox.offsetTop;

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
});

function onMouseMove(e) {
  if (isDragging) {
    chatbox.style.left = `${e.clientX - offsetX}px`;
    chatbox.style.top = `${e.clientY - offsetY}px`;
  }
}

function onMouseUp() {
  isDragging = false;
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
}

// Sending Chat Messages
async function sendChatMessage() {
  const inputField = document.getElementById("chatbox-input");

  const userMessage = inputField.value.trim();
  if (!userMessage) return;

  // Create and append the user's message
  const userDiv = document.createElement("div");
  userDiv.textContent = `You: ${userMessage}`;
  userDiv.style.padding = "8px";
  userDiv.style.marginBottom = "5px";
  userDiv.style.borderRadius = "5px";
  userDiv.style.backgroundColor = "#d1e7ff";
  userDiv.style.alignSelf = "flex-end";
  messagesContainer.appendChild(userDiv);

  // Clear the input field
  inputField.value = "";

  // Scroll to the bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Fetch chatbot response
  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: userMessage }),
    });

    if (response.ok) {
      const data = await response.json();

      // Display the bot's response
      const botDiv = document.createElement("div");
      botDiv.textContent = `Bot: ${data.answer}`;
      botDiv.style.padding = "8px";
      botDiv.style.marginBottom = "5px";
      botDiv.style.borderRadius = "5px";
      botDiv.style.backgroundColor = "#f0f0f0";
      botDiv.style.alignSelf = "flex-start";
      botDiv.style.color = "#007bff";
      messagesContainer.appendChild(botDiv);
    } else {
      throw new Error("Failed to fetch chatbot response.");
    }
  } catch (error) {
    console.error("Error:", error);

    // Display an error message
    const errorDiv = document.createElement("div");
    errorDiv.textContent =
      "Bot: Sorry, something went wrong. Please try again.";
    errorDiv.style.padding = "8px";
    errorDiv.style.marginBottom = "5px";
    errorDiv.style.borderRadius = "5px";
    errorDiv.style.backgroundColor = "#ffcccc";
    errorDiv.style.alignSelf = "flex-start";
    errorDiv.style.color = "red";
    messagesContainer.appendChild(errorDiv);
  }

  // Scroll to the bottom again for the bot's message
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
