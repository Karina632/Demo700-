function initChatbot() {
  const chatbotToggle = document.getElementById("chatToggleBtn");
  const chatbotWindow = document.getElementById("chatbotBox");
  const chatbotClose = document.getElementById("closeChat");
  const chatbotSend = document.getElementById("sendChat");
  const chatbotInput = document.getElementById("chatInput");
  const chatbotMessages = document.getElementById("chatMessages");

  if (!chatbotToggle || !chatbotWindow) return;

  /* =========================
     ONLY ON HOMEPAGE
     EVERY NEW VISIT
  ========================= */
  const isHomePage =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname === "";

  function showHomepageChatbot() {
    if (isHomePage) {
      setTimeout(() => {
        chatbotWindow.classList.remove("hidden");
      }, 1800);
    }
  }

  /* IF COOKIE ALREADY CHOSEN */
  if (localStorage.getItem("cookieConsent")) {
    showHomepageChatbot();
  }

  /* AFTER COOKIE CHOICE */
  window.addEventListener("cookieConsentGiven", () => {
    showHomepageChatbot();
  });

  /* TOGGLE BUTTON */
  chatbotToggle.addEventListener("click", () => {
    chatbotWindow.classList.toggle("hidden");
  });

  /* CLOSE BUTTON */
  chatbotClose?.addEventListener("click", () => {
    chatbotWindow.classList.add("hidden");
  });

  /* CLICK OUTSIDE */
  document.addEventListener("click", (e) => {
    if (
      !chatbotWindow.classList.contains("hidden") &&
      !chatbotWindow.contains(e.target) &&
      !chatbotToggle.contains(e.target)
    ) {
      chatbotWindow.classList.add("hidden");
    }
  });

  /* ADD MESSAGE */
  function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add(sender === "user" ? "user-message" : "bot-message");
    msg.innerHTML = text;
    chatbotMessages.appendChild(msg);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  /* SEND MESSAGE */
  async function sendMessage() {
    const message = chatbotInput.value.trim();

    if (!message) return;

    addMessage(message, "user");
    chatbotInput.value = "";

    addMessage("Se scrie...", "bot");

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();

      chatbotMessages.lastChild.remove();
      addMessage(data.reply, "bot");

    } catch (error) {
      chatbotMessages.lastChild.remove();
      addMessage("Momentan nu pot răspunde 🤍", "bot");
    }
  }

  chatbotSend?.addEventListener("click", sendMessage);

  chatbotInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
}