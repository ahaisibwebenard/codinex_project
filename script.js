/* =========================================================
   Codinex — script.js
   Nav, reveal, terminal typing, FAQ, contact form, chatbot
   ========================================================= */
(function () {
  "use strict";

  var yearEl = document.getElementById("year");

  function createRipple(event) {
    var button = event.currentTarget;
    var ripple = document.createElement("span");
    ripple.className = "ripple";
    var rect = button.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height) * 1.2;
    ripple.style.width = size + "px";
    ripple.style.height = size + "px";
    ripple.style.left = (event.clientX - rect.left) + "px";
    ripple.style.top = (event.clientY - rect.top) + "px";
    button.appendChild(ripple);
    setTimeout(function () { ripple.remove(); }, 600);
  }

  document.querySelectorAll(".btn, .filter-btn, .tab-button, .nav__toggle, .chatbot__toggle, .chatbot__close, .chatbot__form button, .chatbot__signup button").forEach(function (button) {
    button.addEventListener("click", createRipple);
  });

  var progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  document.body.appendChild(progressBar);

  var backToTop = document.createElement("button");
  backToTop.className = "back-to-top";
  backToTop.setAttribute("aria-label", "Back to top");
  backToTop.innerHTML = "↑";
  document.body.appendChild(backToTop);

  function updateScrollState() {
    var scrollTop = window.scrollY || window.pageYOffset || 0;
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var progress = maxScroll > 0 ? (scrollTop / maxScroll) : 0;
    progressBar.style.transform = "scaleX(" + Math.min(Math.max(progress, 0), 1) + ")";
    backToTop.classList.toggle("is-visible", scrollTop > 320);
  }

  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("resize", updateScrollState);
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  updateScrollState();

  var path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__links a").forEach(function (link) {
    var href = link.getAttribute("href") || "";
    var isMatch = href === path || (path === "" && href === "index.html") || (href === "index.html" && path === "");
    link.classList.toggle("is-active", isMatch);
  });
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Mobile nav ---------------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  var revealTargets = document.querySelectorAll(
    ".course-card, .process__step, .outcome, .instructor-card, .testimonial, .section__title, .section__lead, .service-card, .feature-card, .timeline-card, .contact-card, .page-hero__copy, .page-hero__panel, .service-filter, .tab-list, .tab-panel"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------- Card tilt ---------------- */
  document.querySelectorAll(".service-card, .feature-card, .timeline-card, .contact-card, .panel-card, .quote-card").forEach(function (card) {
    card.addEventListener("mousemove", function (event) {
      var rect = card.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      var rotateY = ((x / rect.width) - 0.5) * 8;
      var rotateX = ((0.5 - (y / rect.height))) * 8;
      card.style.transform = "perspective(900px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-6px) scale(1.01)";
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  });

  /* ---------------- Service filter ---------------- */
  var filterButtons = document.querySelectorAll("[data-service-filter] .filter-btn");
  var serviceCards = document.querySelectorAll(".service-card");

  if (filterButtons.length) {
    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.getAttribute("data-filter") || "all";
        filterButtons.forEach(function (other) {
          other.classList.toggle("is-active", other === button);
        });

        serviceCards.forEach(function (card) {
          var category = card.getAttribute("data-category") || "all";
          var match = filter === "all" || category === filter;
          card.style.display = match ? "block" : "none";
        });
      });
    });
  }

  /* ---------------- Training tabs ---------------- */
  var tabButtons = document.querySelectorAll("[data-tab-button]");
  var tabPanels = document.querySelectorAll("[data-tab-panel]");

  if (tabButtons.length && tabPanels.length) {
    tabButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var target = button.getAttribute("data-tab-button");
        tabButtons.forEach(function (other) {
          other.classList.toggle("is-active", other === button);
        });
        tabPanels.forEach(function (panel) {
          var isMatch = panel.getAttribute("data-tab-panel") === target;
          panel.hidden = !isMatch;
          panel.classList.toggle("is-active", isMatch);
        });
      });
    });
  }

  /* ---------------- Quote estimator ---------------- */
  var quoteService = document.getElementById("quoteService");
  var quoteSize = document.getElementById("quoteSize");
  var quoteUrgent = document.getElementById("quoteUrgent");
  var quoteSizeLabel = document.getElementById("quoteSizeLabel");
  var quoteOutput = document.getElementById("quoteOutput");

  function formatCurrency(value) {
    return "UGX " + value.toLocaleString("en-US");
  }

  function updateQuote() {
    if (!quoteService || !quoteSize || !quoteOutput) return;

    var base = 650000;
    var sizeValue = Number(quoteSize.value) || 3;
    var labels = ["Small scope", "Simple scope", "Medium scope", "Broader scope", "Large scope", "Full-scale scope"];
    var serviceValue = quoteService.value;

    if (serviceValue === "network") base = 850000;
    if (serviceValue === "web") base = 950000;
    if (serviceValue === "training") base = 400000;

    var estimate = base + (sizeValue * 120000);
    if (quoteUrgent && quoteUrgent.checked) estimate += 150000;
    if (quoteSizeLabel) quoteSizeLabel.textContent = labels[sizeValue - 1] || labels[2];
    quoteOutput.textContent = "Estimated starting price: " + formatCurrency(estimate);
  }

  if (quoteService && quoteSize && quoteOutput) {
    [quoteService, quoteSize, quoteUrgent].forEach(function (field) {
      if (field) field.addEventListener("input", updateQuote);
      if (field) field.addEventListener("change", updateQuote);
    });
    updateQuote();
  }

  /* ---------------- Terminal typing animation ---------------- */
  var terminalBody = document.getElementById("terminalBody");
  var terminalLines = [
    { text: "Requesting laptop repair service", cls: "t-cyan" },
    { text: "Logging ticket at Mbarara City Mall, Level 2 ...", cls: "t-slate" },
    { text: "Technician assigned. Diagnosis today.", cls: "t-amber" },
    { text: "Reviewing training: Computer Applications", cls: "t-cyan" },
    { text: "Word · Excel · Access · PowerPoint · Publisher", cls: "t-slate" },
    { text: "Email, internet use, computer security basics", cls: "t-slate" },
    { text: "Contacting an advisor", cls: "t-cyan" },
    { text: "+256 756 198 585 · info@codinex.co.ug", cls: "t-amber" }
  ];

  function typeTerminal() {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      terminalBody.innerHTML = terminalLines
        .map(function (l) { return '<span class="' + l.cls + '">' + l.text + "</span>"; })
        .join("\n");
      return;
    }

    var lineIndex = 0;
    var charIndex = 0;

    function typeChar() {
      if (lineIndex >= terminalLines.length) {
        setTimeout(function () {
          terminalBody.innerHTML = "";
          lineIndex = 0;
          charIndex = 0;
          typeChar();
        }, 3200);
        return;
      }
      var line = terminalLines[lineIndex];
      var current = terminalBody.querySelector("#tl-" + lineIndex);
      if (!current) {
        current = document.createElement("span");
        current.id = "tl-" + lineIndex;
        current.className = line.cls;
        terminalBody.appendChild(current);
      }
      charIndex++;
      current.textContent = line.text.slice(0, charIndex);

      if (charIndex >= line.text.length) {
        terminalBody.appendChild(document.createTextNode("\n"));
        lineIndex++;
        charIndex = 0;
        setTimeout(typeChar, 420);
      } else {
        setTimeout(typeChar, 18 + Math.random() * 22);
      }
    }
    typeChar();
  }
  if (terminalBody) {
    typeTerminal();
  }

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll(".faq__q").forEach(function (btn) {
    var answer = btn.nextElementSibling;
    btn.addEventListener("click", function () {
      var isOpen = btn.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".faq__q").forEach(function (other) {
        other.setAttribute("aria-expanded", "false");
        other.nextElementSibling.style.maxHeight = null;
      });
      if (!isOpen) {
        btn.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---------------- Contact form (front-end validation only) ---------------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("contactStatus");

  if (form) {
    function setError(id, message) {
      var el = document.getElementById(id);
      if (el) el.textContent = message || "";
    }

    form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nameEl = document.getElementById("name");
    var emailEl = document.getElementById("email");
    var serviceEl = document.getElementById("service");
    var messageEl = document.getElementById("message");
    var submitButton = form.querySelector("button");
    var valid = true;

    setError("nameError", "");
    setError("emailError", "");

    if (!nameEl.value.trim()) {
      setError("nameError", "Please tell us your name.");
      valid = false;
    }
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailEl.value.trim())) {
      setError("emailError", "Enter a valid email address.");
      valid = false;
    }

    if (!valid) return;

    submitButton.disabled = true;
    if (status) status.textContent = "Sending...";

    var formData = new FormData(form);
    fetch('https://formspree.io/f/xojglvgg', {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json'
      }
    })
      .then(function (res) {
        return res.json().then(function (body) {
          if (!res.ok) {
            var message = (body && body.error) ? body.error : 'Sorry, we could not send your request.';
            throw new Error(message);
          }
          return body;
        });
      })
      .then(function (data) {
        if (data && data.ok) {
          if (status) status.textContent = "✓ Request received — an advisor will email you within one business day.";
          form.reset();
        } else {
          if (status) status.textContent = data && data.error ? data.error : "Sorry, we could not send your request. Please try again later.";
        }
      })
      .catch(function (error) {
        console.error('Contact submission failed:', error);
        if (status) status.textContent = error && error.message ? error.message : "Sorry, we could not send your request. Please try again later.";
      })
      .finally(function () {
        submitButton.disabled = false;
      });
    });
  }

  /* =========================================================
     CHATBOT
     Intent-aware responder for service and training questions.
     ========================================================= */

  var chatbotUtils = window.chatbotUtils || {};
  var predictIntent = chatbotUtils.predictIntent || function () { return null; };
  var chatbotReply = chatbotUtils.chatbotReply || function () {
    return "I can help with repairs, training, location, hours, and contact details.";
  };

  /* ---------------- Chatbot UI wiring ---------------- */
  var chatbotToggle = document.getElementById("chatbotToggle");
  var chatbotPanel = document.getElementById("chatbotPanel");
  var chatbotClose = document.getElementById("chatbotClose");
  var chatbotLog = document.getElementById("chatbotLog");
  var chatbotForm = document.getElementById("chatbotForm");
  var chatbotInput = document.getElementById("chatbotInput");
  var chatbotQuick = document.getElementById("chatbotQuick");
  var chatbotSignup = document.getElementById("chatbotSignup");
  var chatbotSignupBtn = document.getElementById("chatbotSignupBtn");
  var chatbotName = document.getElementById("chatbotName");
  var chatbotEmail = document.getElementById("chatbotEmail");
  var chatbotSignupStatus = document.getElementById("chatbotSignupStatus");
  var greeted = false;
  var signedIn = false;
  var userName = "";

  // Ensure the chatbot panel starts hidden and has proper accessibility state.
  chatbotPanel.hidden = true;
  chatbotPanel.setAttribute("aria-hidden", "true");
  chatbotToggle.setAttribute("aria-expanded", "false");
  chatbotLog.hidden = true;

  // Prevent scroll events inside the chat from propagating to the page.
  function stopChatScrollPropagation(event) {
    var deltaY = event.deltaY || 0;
    var atTop = chatbotLog.scrollTop === 0;
    var atBottom = chatbotLog.scrollTop + chatbotLog.clientHeight >= chatbotLog.scrollHeight - 1;

    if (chatbotLog.scrollHeight > chatbotLog.clientHeight) {
      if ((deltaY > 0 && !atBottom) || (deltaY < 0 && !atTop) || deltaY === 0) {
        event.stopPropagation();
        return;
      }
    }

    event.preventDefault();
    event.stopPropagation();
  }

  // Attach listeners to the message log element so wheel/touch scrolling stays inside the widget.
  chatbotLog.addEventListener("wheel", stopChatScrollPropagation, { passive: false });

  var touchStartY = null;
  chatbotLog.addEventListener('touchstart', function (e) {
    if (e.touches && e.touches.length === 1) touchStartY = e.touches[0].clientY;
  }, { passive: true });

  chatbotLog.addEventListener('touchmove', function (e) {
    if (touchStartY === null || !e.touches || e.touches.length !== 1) return;
    var currentY = e.touches[0].clientY;
    var delta = touchStartY - currentY;
    var atTop = chatbotLog.scrollTop === 0;
    var atBottom = chatbotLog.scrollTop + chatbotLog.clientHeight >= chatbotLog.scrollHeight - 1;

    if ((delta > 0 && !atBottom) || (delta < 0 && !atTop)) {
      e.stopPropagation();
      return;
    }
    e.preventDefault();
    e.stopPropagation();
  }, { passive: false });

  function addMessage(text, who) {
    var el = document.createElement("div");
    el.className = "msg msg--" + who;
    el.textContent = text;
    chatbotLog.appendChild(el);
    chatbotLog.scrollTop = chatbotLog.scrollHeight;
    return el;
  }

  function addTypingIndicator() {
    var el = document.createElement("div");
    el.className = "msg msg--bot msg--typing";
    el.innerHTML = "<span></span><span></span><span></span>";
    chatbotLog.appendChild(el);
    chatbotLog.scrollTop = chatbotLog.scrollHeight;
    return el;
  }

  function setChatEnabled(enabled) {
    chatbotInput.disabled = !enabled;
    chatbotForm.querySelector("button").disabled = !enabled;
    chatbotInput.placeholder = enabled ? "Ask about repairs, training, hours…" : "Sign in to start chatting";
  }

  function showSignedInGreeting() {
    // remove the signup form so only chat remains
    try {
      if (chatbotSignup && chatbotSignup.parentNode) chatbotSignup.parentNode.removeChild(chatbotSignup);
    } catch (e) {
      chatbotSignup.hidden = true;
    }

    chatbotQuick.hidden = true; // hide quick buttons so only messages + input remain
    chatbotLog.hidden = false;
    chatbotName.disabled = true;
    chatbotEmail.disabled = true;
    chatbotSignupBtn.disabled = true;
    chatbotSignupBtn.textContent = "Signed in";
    chatbotSignupStatus.textContent = "Signed in as " + userName;
    setChatEnabled(true);
    chatbotInput.focus();

    if (!greeted) {
      greeted = true;
      setTimeout(function () {
        addMessage("Hey, " + userName + ", how can we help you?", "bot");
      }, 250);
    }
  }

  function handleSignup() {
    var name = chatbotName.value.trim();
    var email = chatbotEmail.value.trim();
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    chatbotSignupStatus.textContent = "";

    if (!name) {
      chatbotSignupStatus.textContent = "Please enter your name.";
      chatbotName.focus();
      return;
    }

    if (!emailPattern.test(email)) {
      chatbotSignupStatus.textContent = "Please enter a valid email address.";
      chatbotEmail.focus();
      return;
    }

    userName = name;
    signedIn = true;
    chatbotName.value = name;
    chatbotEmail.value = email;
    showSignedInGreeting();
  }

  function handleUserMessage(message) {
    if (!signedIn || !message.trim()) return;
    addMessage(message, "user");
    chatbotInput.value = "";
    var typingEl = addTypingIndicator();

    setTimeout(function () {
      try {
        var reply = chatbotReply(message);
      } catch (e) {
        reply = "Sorry, I didn't understand that. Could you rephrase?";
      }

      // Handle promise or synchronous reply
      if (reply && typeof reply.then === 'function') {
        reply.then(function (res) {
          typingEl.remove();
          addMessage(res || "Sorry, I didn't understand that.", "bot");
        }).catch(function () {
          typingEl.remove();
          addMessage("Sorry, I didn't understand that.", "bot");
        });
      } else {
        typingEl.remove();
        addMessage(reply || "Sorry, I didn't understand that.", "bot");
      }
    }, 500 + Math.random() * 400);
  }

  function openChat() {
    chatbotPanel.hidden = false;
    chatbotPanel.setAttribute("aria-hidden", "false");
    chatbotToggle.setAttribute("aria-expanded", "true");

    if (signedIn) {
      showSignedInGreeting();
    } else {
      chatbotSignup.hidden = false;
      chatbotQuick.hidden = true;
      chatbotLog.hidden = true;
      chatbotName.disabled = false;
      chatbotEmail.disabled = false;
      chatbotSignupBtn.disabled = false;
      chatbotSignupBtn.textContent = "Continue";
      chatbotSignupStatus.textContent = "";
      setChatEnabled(false);
      chatbotName.focus();
    }
  }

  function closeChat() {
    chatbotPanel.hidden = true;
    chatbotPanel.setAttribute("aria-hidden", "true");
    chatbotToggle.setAttribute("aria-expanded", "false");
  }

  chatbotToggle.addEventListener("click", function () {
    if (chatbotPanel.hidden) openChat();
    else closeChat();
  });
  chatbotClose.addEventListener("click", closeChat);
  chatbotSignupBtn.addEventListener("click", handleSignup);

  chatbotForm.addEventListener("submit", function (e) {
    e.preventDefault();
    handleUserMessage(chatbotInput.value);
  });

  chatbotQuick.querySelectorAll("button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      handleUserMessage(btn.getAttribute("data-q"));
    });
  });

})();
