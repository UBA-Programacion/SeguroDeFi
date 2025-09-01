class DeFinsurePresentationController {
  constructor() {
    this.currentSlide = 1;
    this.totalSlides = 15;
    this.isPlaying = false;
    this.autoPlayInterval = null;
    this.slideTimer = null;
    this.currentSlideTime = 0;
    this.totalPresentationTime = 0;
    this.presentationStartTime = null;
    this.slideInterval = 30; // segundos por defecto
    this.isMinimized = false;

    // Elementos DOM
    this.slidesContainer = document.getElementById("slidesContainer");
    this.slides = document.querySelectorAll(".slide");
    this.progressFill = document.getElementById("progressFill");
    this.currentSlideDisplay = document.getElementById("currentSlide");
    this.totalSlidesDisplay = document.getElementById("totalSlides");
    this.slideTimerDisplay = document.getElementById("slideTimer");
    this.timerFill = document.getElementById("timerFill");
    this.totalTimeDisplay = document.getElementById("totalTime");
    this.slideNotesDisplay = document.getElementById("slideNotes");
    this.slideNumbers = document.querySelectorAll(".slide-number");

    // Controles
    this.playPauseBtn = document.getElementById("playPauseBtn");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.resetBtn = document.getElementById("resetBtn");
    this.fullscreenBtn = document.getElementById("fullscreenBtn");
    this.speedSelect = document.getElementById("speedSelect");
    this.minimizeBtn = document.getElementById("minimizeBtn");
    this.presenterControls = document.getElementById("presenterControls");

    // Notas por slide
    this.slideNotes = {
      1: "Slide de apertura - Presentar DeFinsure como innovación en seguros blockchain",
      2: "Enfatizar la magnitud del problema - $383B es una cifra impactante",
      3: "Mostrar la solución integral - Pool + IoT + DeFi como trinity tecnológica",
      4: "Explicar la estructura de tramos - Anti-gaming es clave para sostenibilidad",
      5: "Detallar tokenomics - 45% farming incentives muestra compromiso con comunidad",
      6: "Destacar solvencia 1.6x - Superior a seguros tradicionales",
      7: "Explicar innovación NFT - Pólizas negociables revolucionan el mercado",
      8: "Mostrar validación IoT - >80% precisión garantiza confiabilidad",
      9: "Enfatizar democracia real - Una persona = un voto vs. ballenas",
      10: "Casos de uso tangibles - Ejemplos concretos aumentan credibilidad",
      11: "Ecosistema balanceado - Todos los actores tienen incentivos alineados",
      12: "Roadmap científico - Nombres épicos crean narrativa memorable",
      13: "Equipo diverso - Experiencia complementaria en blockchain y negocios",
      14: "Compliance robusto - Marco legal sólido para expansión global",
      15: "Call to action fuerte - Invitar a unirse a la revolución financiera",
    };

    this.init();
  }

  init() {
    console.log("🚀 Iniciando DeFinsure Presentation Controller");

    // Inicializar estado
    this.updateDisplay();
    this.updateSlideNotes();

    // Event listeners para controles - CORREGIDO
    if (this.playPauseBtn) {
      this.playPauseBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.togglePlayPause();
      });
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.previousSlide();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.nextSlide();
      });
    }

    if (this.resetBtn) {
      this.resetBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.resetPresentation();
      });
    }

    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleFullscreen();
      });
    }

    if (this.minimizeBtn) {
      this.minimizeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleMinimize();
      });
    }

    // Speed selector
    if (this.speedSelect) {
      this.speedSelect.addEventListener("change", (e) => {
        this.slideInterval = parseInt(e.target.value);
        console.log(`🔄 Velocidad cambiada a ${this.slideInterval}s`);
        if (this.isPlaying) {
          this.stopAutoPlay();
          this.startAutoPlay();
        }
      });
    }

    // Navegación por números de slide - CORREGIDO
    this.slideNumbers.forEach((number) => {
      number.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const slideNum = parseInt(e.target.getAttribute("data-slide"));
        console.log(`🎯 Click en número de slide: ${slideNum}`);
        if (slideNum && slideNum >= 1 && slideNum <= this.totalSlides) {
          this.goToSlide(slideNum);
        }
      });
    });

    // Teclado - CORREGIDO con F11
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));

    // Touch gestures para móviles
    this.setupTouchGestures();

    // Click en slide para pausar/reanudar
    this.slides.forEach((slide) => {
      slide.addEventListener("click", (e) => {
        // Solo si no es un botón o control
        if (
          !e.target.closest("button, .presenter-controls, .slide-navigation")
        ) {
          this.togglePlayPause();
        }
      });
    });

    // Botones CTA en slide final
    this.setupCTAButtons();

    // Actualizar tiempo total cada segundo
    this.startTotalTimeCounter();

    // Manejar visibilidad de página para pausar/reanudar
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.isPlaying) {
        console.log("📱 Página oculta, pausando presentación");
        this.togglePlayPause();
      }
    });

    // Manejar cambios de fullscreen
    document.addEventListener("fullscreenchange", () => {
      this.updateFullscreenButton();
    });

    console.log("✅ Presentation Controller inicializado correctamente");
  }

  goToSlide(slideNumber) {
    if (
      slideNumber < 1 ||
      slideNumber > this.totalSlides ||
      slideNumber === this.currentSlide
    ) {
      return;
    }

    console.log(`📍 Navegando a slide ${slideNumber}`);

    // Remover active del slide actual
    if (this.slides[this.currentSlide - 1]) {
      this.slides[this.currentSlide - 1].classList.remove("active");
    }
    if (this.slideNumbers[this.currentSlide - 1]) {
      this.slideNumbers[this.currentSlide - 1].classList.remove("active");
    }

    // Actualizar slide actual
    this.currentSlide = slideNumber;

    // Agregar active al nuevo slide
    if (this.slides[this.currentSlide - 1]) {
      this.slides[this.currentSlide - 1].classList.add("active");
    }
    if (this.slideNumbers[this.currentSlide - 1]) {
      this.slideNumbers[this.currentSlide - 1].classList.add("active");
    }

    // Mover contenedor de slides
    const translateX = -((this.currentSlide - 1) * (100 / this.totalSlides));
    if (this.slidesContainer) {
      this.slidesContainer.style.transform = `translateX(${translateX}%)`;
    }

    // Actualizar displays
    this.updateDisplay();
    this.updateSlideNotes();
    this.resetSlideTimer();

    // Anunciar para accesibilidad
    this.announceSlideChange();

    console.log(`✅ Slide cambiado a ${this.currentSlide}`);
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides) {
      this.goToSlide(this.currentSlide + 1);
    } else {
      // CORREGIDO: Auto-loop al final
      console.log("🔄 Llegamos al final, volviendo al slide 1 (loop)");
      this.goToSlide(1);
    }
  }

  previousSlide() {
    if (this.currentSlide > 1) {
      this.goToSlide(this.currentSlide - 1);
    } else {
      // Loop hacia atrás - ir al último slide
      this.goToSlide(this.totalSlides);
    }
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
    this.updatePlayPauseButton();
    console.log(`🎵 Reproducción ${this.isPlaying ? "iniciada" : "pausada"}`);
  }

  startAutoPlay() {
    if (this.isPlaying) return;

    this.isPlaying = true;
    if (!this.presentationStartTime) {
      this.presentationStartTime = Date.now();
    }

    console.log("▶️ Iniciando auto-play");

    // Iniciar timer del slide actual
    this.startSlideTimer();

    // Auto-play interval - CORREGIDO: loop infinito
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide(); // Ya incluye el loop
    }, this.slideInterval * 1000);

    this.updatePlayPauseButton();
    this.updateSlideNotes();
  }

  stopAutoPlay() {
    if (!this.isPlaying) return;

    this.isPlaying = false;

    console.log("⏸️ Pausando auto-play");

    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }

    this.stopSlideTimer();
    this.updatePlayPauseButton();
    this.updateSlideNotes();
  }

  startSlideTimer() {
    this.resetSlideTimer();

    this.slideTimer = setInterval(() => {
      this.currentSlideTime++;
      this.updateSlideTimerDisplay();

      if (this.currentSlideTime >= this.slideInterval) {
        this.currentSlideTime = this.slideInterval;
      }
    }, 1000);
  }

  stopSlideTimer() {
    if (this.slideTimer) {
      clearInterval(this.slideTimer);
      this.slideTimer = null;
    }
  }

  resetSlideTimer() {
    this.currentSlideTime = 0;
    this.updateSlideTimerDisplay();
  }

  resetPresentation() {
    console.log("🔄 Reiniciando presentación");

    this.stopAutoPlay();
    this.goToSlide(1);
    this.totalPresentationTime = 0;
    this.presentationStartTime = null;
    this.updateTotalTimeDisplay();
    this.updateSlideNotes();

    this.showNotification("Presentación reiniciada", "info");
  }

  // CORREGIDO: Mejorado soporte para fullscreen
  toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      !document.mozFullScreenElement
    ) {
      console.log("🖥️ Entrando en pantalla completa");

      const element = document.documentElement;

      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    } else {
      console.log("🖥️ Saliendo de pantalla completa");

      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  updateFullscreenButton() {
    if (this.fullscreenBtn) {
      const isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement
      );
      this.fullscreenBtn.textContent = isFullscreen ? "⛶" : "⛶";
      this.fullscreenBtn.title = isFullscreen
        ? "Salir de pantalla completa (F11/Esc)"
        : "Pantalla completa (F11/F)";
    }
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    if (this.presenterControls) {
      this.presenterControls.classList.toggle("minimized", this.isMinimized);
    }
    if (this.minimizeBtn) {
      this.minimizeBtn.textContent = this.isMinimized ? "+" : "−";
    }
    console.log(`📦 Panel ${this.isMinimized ? "minimizado" : "expandido"}`);
  }

  updateDisplay() {
    // Actualizar contador de slides
    if (this.currentSlideDisplay) {
      this.currentSlideDisplay.textContent = this.currentSlide;
    }

    // Actualizar barra de progreso
    const progress = (this.currentSlide / this.totalSlides) * 100;
    if (this.progressFill) {
      this.progressFill.style.width = `${progress}%`;
    }

    // Actualizar botones de navegación
    if (this.prevBtn) {
      this.prevBtn.style.opacity = "1"; // Siempre habilitado para loop
    }
    if (this.nextBtn) {
      this.nextBtn.style.opacity = "1"; // Siempre habilitado para loop
    }
  }

  updateSlideTimerDisplay() {
    const remaining = this.slideInterval - this.currentSlideTime;
    if (this.slideTimerDisplay) {
      this.slideTimerDisplay.textContent = remaining;
    }

    // Actualizar barra de progreso del timer
    const progress = (this.currentSlideTime / this.slideInterval) * 100;
    if (this.timerFill) {
      this.timerFill.style.width = `${progress}%`;

      // Cambiar color según tiempo restante
      if (remaining <= 5) {
        this.timerFill.style.background = "#ef4444"; // Rojo
      } else if (remaining <= 10) {
        this.timerFill.style.background = "#fbbf24"; // Amarillo
      } else {
        this.timerFill.style.background = "#10b981"; // Verde
      }
    }
  }

  updatePlayPauseButton() {
    if (!this.playPauseBtn) return;

    const playIcon = this.playPauseBtn.querySelector(".play-icon");
    const pauseIcon = this.playPauseBtn.querySelector(".pause-icon");

    if (this.isPlaying) {
      if (playIcon) playIcon.style.display = "none";
      if (pauseIcon) pauseIcon.style.display = "inline";
      this.playPauseBtn.style.background = "#ef4444";
      this.playPauseBtn.style.borderColor = "#ef4444";
      this.playPauseBtn.title = "Pausar presentación (Espacio/P)";
    } else {
      if (playIcon) playIcon.style.display = "inline";
      if (pauseIcon) pauseIcon.style.display = "none";
      this.playPauseBtn.style.background = "#10b981";
      this.playPauseBtn.style.borderColor = "#10b981";
      this.playPauseBtn.title = "Iniciar presentación (Espacio/P)";
    }
  }

  updateSlideNotes() {
    if (!this.slideNotesDisplay) return;

    const note = this.slideNotes[this.currentSlide] || "Slide sin notas";
    let displayText = note;

    if (this.isPlaying) {
      displayText = `▶️ REPRODUCIENDO: ${note}`;
    } else {
      displayText = `⏸️ PAUSADO: ${note}`;
    }

    this.slideNotesDisplay.textContent = displayText;
  }

  startTotalTimeCounter() {
    setInterval(() => {
      if (this.presentationStartTime) {
        const elapsed = Math.floor(
          (Date.now() - this.presentationStartTime) / 1000
        );
        this.totalPresentationTime = elapsed;
        this.updateTotalTimeDisplay();
      }
    }, 1000);
  }

  updateTotalTimeDisplay() {
    if (!this.totalTimeDisplay) return;

    const minutes = Math.floor(this.totalPresentationTime / 60);
    const seconds = this.totalPresentationTime % 60;
    this.totalTimeDisplay.textContent = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  // CORREGIDO: Mejorado soporte de teclado con F11
  handleKeyboard(event) {
    // Evitar interferir con controles de formulario
    if (event.target.tagName === "SELECT" || event.target.tagName === "INPUT") {
      return;
    }

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        this.previousSlide();
        break;
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        this.nextSlide();
        break;
      case " ": // Barra espaciadora
        event.preventDefault();
        this.togglePlayPause();
        break;
      case "Home":
        event.preventDefault();
        this.goToSlide(1);
        break;
      case "End":
        event.preventDefault();
        this.goToSlide(this.totalSlides);
        break;
      case "Escape":
        event.preventDefault();
        if (
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement
        ) {
          this.toggleFullscreen();
        } else {
          this.resetPresentation();
        }
        break;
      case "f":
      case "F":
        event.preventDefault();
        this.toggleFullscreen();
        break;
      case "F11": // CORREGIDO: Soporte para F11
        event.preventDefault();
        this.toggleFullscreen();
        break;
      case "r":
      case "R":
        event.preventDefault();
        this.resetPresentation();
        break;
      case "p":
      case "P":
        event.preventDefault();
        this.togglePlayPause();
        break;
    }

    // Navegación por números (1-9, 0 para slide 10)
    if (event.key >= "1" && event.key <= "9") {
      const slideNum = parseInt(event.key);
      if (slideNum <= this.totalSlides) {
        event.preventDefault();
        this.goToSlide(slideNum);
      }
    } else if (event.key === "0") {
      event.preventDefault();
      this.goToSlide(10);
    }

    // Slides 11-15 con Ctrl
    if (event.ctrlKey) {
      switch (event.key) {
        case "1":
          event.preventDefault();
          this.goToSlide(11);
          break;
        case "2":
          event.preventDefault();
          this.goToSlide(12);
          break;
        case "3":
          event.preventDefault();
          this.goToSlide(13);
          break;
        case "4":
          event.preventDefault();
          this.goToSlide(14);
          break;
        case "5":
          event.preventDefault();
          this.goToSlide(15);
          break;
      }
    }
  }

  setupTouchGestures() {
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      this.handleSwipe();
    });

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const swipeDistanceX = touchEndX - touchStartX;
      const swipeDistanceY = touchEndY - touchStartY;

      // Solo procesar si es principalmente horizontal
      if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
        if (Math.abs(swipeDistanceX) > swipeThreshold) {
          if (swipeDistanceX > 0) {
            // Swipe right - slide anterior
            this.previousSlide();
          } else {
            // Swipe left - slide siguiente
            this.nextSlide();
          }
        }
      }
    };

    this.handleSwipe = handleSwipe;
  }

  setupCTAButtons() {
    // Configurar botones CTA en slide final (slide 15)
    setTimeout(() => {
      const ctaButtons = document.querySelectorAll(".cta-buttons .btn");
      const emailInput = document.getElementById("emailInput");
      const whitelistBtn = document.getElementById("whitelistBtn");
      const docsBtn = document.getElementById("docsBtn");

      // Función para verificar email y habilitar/deshabilitar botones
      const checkEmailAndUpdateButtons = () => {
        const email = emailInput.value.trim();
        const isValidEmail = email.length > 0 && email.includes("@");

        whitelistBtn.disabled = !isValidEmail;
        docsBtn.disabled = !isValidEmail;
      };

      // Event listener para el input de email
      if (emailInput) {
        emailInput.addEventListener("input", checkEmailAndUpdateButtons);
        emailInput.addEventListener("blur", checkEmailAndUpdateButtons);
        emailInput.addEventListener("keyup", checkEmailAndUpdateButtons);
      }

      ctaButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();

          // Verificar que el botón no esté deshabilitado
          if (button.disabled) {
            this.showNotification(
              "Por favor, ingresa un email válido primero",
              "warning"
            );
            return;
          }

          const buttonText = e.target.textContent.trim();

          if (buttonText.includes("Whitelist")) {
            this.showNotification(
              "¡Te has unido a la whitelist de DeFinsure! 🚀",
              "success"
            );
            // Simular redirección
            setTimeout(() => {
              this.showNotification(
                "Su correo ya está fué incorporado.",
                "info"
              );
            }, 2000);
          } else if (buttonText.includes("Documentación")) {
            this.showNotification(
              "Enviando la documentación técnica...",
              "info"
            );
            // Simular apertura de documentación
            setTimeout(() => {
              this.showNotification(
                "Documentación disponible en su mail.",
                "info"
              );
            }, 1500);
          }
        });
      });

      // Inicializar estado de botones
      checkEmailAndUpdateButtons();
    }, 500);
  }

  announceSlideChange() {
    // Para accesibilidad - anunciar cambio de slide
    const slideTitle =
      this.slides[this.currentSlide - 1]?.querySelector("h2, .main-title");
    if (slideTitle) {
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
      announcement.className = "sr-only";
      announcement.textContent = `Slide ${this.currentSlide} de ${this.totalSlides}: ${slideTitle.textContent}`;
      document.body.appendChild(announcement);

      setTimeout(() => {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement);
        }
      }, 1000);
    }
  }

  showNotification(message, type = "info") {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);

    // Crear notificación visual
    const notification = document.createElement("div");
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            color: var(--color-text);
            padding: var(--space-16) var(--space-20);
            border-radius: var(--radius-lg);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            border: 3px solid;
            z-index: 1001;
            max-width: 320px;
            font-size: var(--font-size-base);
            font-weight: var(--font-weight-medium);
            animation: slideInRight 0.3s ease;
            backdrop-filter: blur(10px);
        `;

    // Colores según tipo
    switch (type) {
      case "success":
        notification.style.borderColor = "#10b981";
        notification.style.background =
          "linear-gradient(135deg, #f0fdf4, #ffffff)";
        break;
      case "error":
        notification.style.borderColor = "#ef4444";
        notification.style.background =
          "linear-gradient(135deg, #fef2f2, #ffffff)";
        break;
      case "warning":
        notification.style.borderColor = "#f59e0b";
        notification.style.background =
          "linear-gradient(135deg, #fffbeb, #ffffff)";
        break;
      default:
        notification.style.borderColor = "#3b82f6";
        notification.style.background =
          "linear-gradient(135deg, #eff6ff, #ffffff)";
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    // Remover después de 4 segundos
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.style.animation = "slideOutRight 0.3s ease";
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }
    }, 4000);
  }

  // Método para exportar estado de presentación
  exportPresentationState() {
    return {
      currentSlide: this.currentSlide,
      totalTime: this.totalPresentationTime,
      isPlaying: this.isPlaying,
      slideInterval: this.slideInterval,
      timestamp: Date.now(),
    };
  }

  // Método para importar estado de presentación
  importPresentationState(state) {
    if (state && typeof state === "object") {
      this.goToSlide(state.currentSlide || 1);
      this.slideInterval = state.slideInterval || 30;
      if (this.speedSelect) {
        this.speedSelect.value = this.slideInterval.toString();
      }

      if (state.isPlaying) {
        this.startAutoPlay();
      }
    }
  }
}

// Agregar estilos para animaciones de notificación
const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes expandSegment {
        from {
            transform: scaleX(0);
        }
        to {
            transform: scaleX(1);
        }
    }
    
    @keyframes slideInFromLeft {
        from {
            transform: translateX(-50px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
`;
document.head.appendChild(notificationStyles);

// Inicializar la presentación cuando se carga el DOM
document.addEventListener("DOMContentLoaded", () => {
  console.log("🎯 Iniciando DeFinsure Presentation App v2.0");

  // Verificar que todos los elementos necesarios estén presentes
  const requiredElements = [
    "slidesContainer",
    "progressFill",
    "currentSlide",
    "slideTimer",
    "playPauseBtn",
    "prevBtn",
    "nextBtn",
    "resetBtn",
    "fullscreenBtn",
  ];

  const missingElements = requiredElements.filter(
    (id) => !document.getElementById(id)
  );

  if (missingElements.length > 0) {
    console.error("❌ Elementos faltantes:", missingElements);
    return;
  }

  // Crear instancia del controlador
  const presentation = new DeFinsurePresentationController();

  // Hacer disponible globalmente para debugging
  window.definsurePresentation = presentation;

  // Mostrar ayuda en consola
  console.log(
    "%c🎯 DeFinsure Presentation Controls v2.0",
    "color: #1e40af; font-size: 18px; font-weight: bold;"
  );
  console.log("%cControles de Teclado:", "color: #1e40af; font-weight: bold;");
  console.log("• ← → : Navegación anterior/siguiente (con loop)");
  console.log("• Espacio/P: Play/Pause");
  console.log("• 1-9: Ir a slides 1-9");
  console.log("• 0: Ir a slide 10");
  console.log("• Ctrl+1-5: Ir a slides 11-15");
  console.log("• Home/End: Primer/último slide");
  console.log("• F/F11: Pantalla completa");
  console.log("• R: Reiniciar presentación");
  console.log("• Escape: Salir pantalla completa o reiniciar");

  console.log("%cControles Táctiles:", "color: #1e40af; font-weight: bold;");
  console.log("• Swipe izquierda/derecha: Navegación");
  console.log("• Tap en slide: Play/Pause");
  console.log("• Tap en números: Ir a slide específico");

  console.log("%cFunciones Globales:", "color: #1e40af; font-weight: bold;");
  console.log("• window.definsurePresentation.exportPresentationState()");
  console.log("• window.definsurePresentation.goToSlide(n)");
  console.log("• window.definsurePresentation.togglePlayPause()");
  console.log("• window.definsurePresentation.toggleFullscreen()");

  // Precargar siguiente slide para mejor performance
  const preloadNextSlide = () => {
    const nextSlideIndex = presentation.currentSlide % presentation.totalSlides;
    const nextSlide = presentation.slides[nextSlideIndex];
    if (nextSlide && !nextSlide.classList.contains("preloaded")) {
      nextSlide.classList.add("preloaded");
      // Forzar renderizado
      nextSlide.offsetHeight;
    }
  };

  // Precargar slides en intervalos
  setInterval(preloadNextSlide, 2000);

  // Optimizar rendimiento eliminando animaciones si es necesario
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty("--duration-fast", "50ms");
    document.documentElement.style.setProperty("--duration-normal", "100ms");
  }

  console.log("✅ DeFinsure Presentation v2.0 inicializada correctamente");
  console.log("🔧 Correcciones aplicadas:");
  console.log("  - Navegación por números de slide corregida");
  console.log("  - Soporte completo para F11 y fullscreen");
  console.log("  - Auto-loop infinito al final de la presentación");
  console.log("  - Mejoras en la gestión de eventos");
});

// Manejar errores globales
window.addEventListener("error", (event) => {
  console.error("❌ Error en presentación:", event.error);
});

// Manejar cambios de orientación en móviles
window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    // Reajustar layouts después de cambio de orientación
    if (window.definsurePresentation) {
      window.definsurePresentation.updateDisplay();
    }
  }, 500);
});

// Optimizaciones de rendimiento
const observerOptions = {
  root: null,
  rootMargin: "100px",
  threshold: 0.1,
};

// Observer para lazy loading de contenido pesado
const slideObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !entry.target.classList.contains("enhanced")) {
      entry.target.classList.add("enhanced");
      // Optimizar contenido cuando se hace visible
      optimizeSlideContent(entry.target);
    }
  });
}, observerOptions);

function optimizeSlideContent(slide) {
  // Optimizar imágenes, gráficos y animaciones cuando sean necesarios
  const slideNumber = parseInt(slide.dataset.slide);

  switch (slideNumber) {
    case 5: // Tokenomics
      enhanceTokenomicsChart(slide);
      break;
    case 7: // xSOS Coverage
      enhanceCoverageVisualization(slide);
      break;
    case 12: // Roadmap
      enhanceRoadmapTimeline(slide);
      break;
  }
}

function enhanceTokenomicsChart(slide) {
  const chartSegments = slide.querySelectorAll(".chart-segment");
  chartSegments.forEach((segment, index) => {
    segment.style.animationDelay = `${index * 0.2}s`;
    segment.style.animation = "expandSegment 1s ease forwards";
  });
}

function enhanceCoverageVisualization(slide) {
  const mechanicCards = slide.querySelectorAll(".mechanic-card");
  mechanicCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.style.animation = "fadeInUp 0.6s ease forwards";
  });
}

function enhanceRoadmapTimeline(slide) {
  const roadmapStages = slide.querySelectorAll(".roadmap-stage");
  roadmapStages.forEach((stage, index) => {
    stage.style.animationDelay = `${index * 0.15}s`;
    stage.style.animation = "slideInFromLeft 0.8s ease forwards";
  });
}

// Observar todos los slides para optimización
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  slides.forEach((slide) => slideObserver.observe(slide));
});
