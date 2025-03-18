document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("h3, h4, h5");
  const tocList = document.querySelector(".toc-list");

  if (!tocList) return;

  const tocItems = document.querySelectorAll(".toc-item");

  let indicator = document.querySelector(".toc-indicator");
  if (!indicator) {
    indicator = document.createElement("div");
    indicator.classList.add("toc-indicator");
    tocList.appendChild(indicator);
  }

  let manualSelectionActive = false;
  let manualSelectionTimer;
  let initialLoad = true;
  let preserveHash = false;
  let userHasScrolled = false;

  const sectionPositions = Array.from(sections).map((section) => {
    const id =
      section.previousElementSibling &&
      section.previousElementSibling.getAttribute("name");
    return {
      id: id || section.id,
      offsetTop: section.offsetTop - 120,
      element: section,
    };
  });

  function updateIndicator(activeItem) {
    if (!activeItem || !indicator) return;
    indicator.style.transform = `translateY(${activeItem.offsetTop}px)`;
    indicator.style.height = `${activeItem.offsetHeight}px`;
  }

  function highlightActiveTocItem() {
    if (manualSelectionActive || initialLoad) return;

    const scrollPosition = window.scrollY;

    let activeSection = sectionPositions[0]?.id;
    for (let i = 0; i < sectionPositions.length; i++) {
      if (scrollPosition >= sectionPositions[i].offsetTop) {
        activeSection = sectionPositions[i].id;
      } else {
        break;
      }
    }

    tocItems.forEach((item) => {
      item.classList.remove("active");
    });

    if (activeSection) {
      const activeTocItem = document.querySelector(
        `.toc-item a[data-section-id="${activeSection}"]`
      );
      if (activeTocItem) {
        const activeLi = activeTocItem.parentElement;
        activeLi.classList.add("active");

        updateIndicator(activeLi);

        if (!preserveHash) {
          const currentHash = window.location.hash.substring(1);
          if (currentHash !== activeSection) {
            history.replaceState(null, null, `#${activeSection}`);
          }
        }
      }
    }
  }

  tocItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      if (manualSelectionTimer) clearTimeout(manualSelectionTimer);

      manualSelectionActive = true;

      document.querySelector(".toc-item.active")?.classList.remove("active");
      this.classList.add("active");
      updateIndicator(this);

      const sectionId = this.querySelector("a")?.dataset?.sectionId;
      if (sectionId) {
        history.pushState(null, null, `#${sectionId}`);

        let section = document.getElementById(sectionId);

        if (!section) {
          section = document.querySelector(`a[name="${sectionId}"]`);
        }

        if (!section) {
          const anchor = document.querySelector(`a[name="${sectionId}"]`);
          if (anchor && anchor.nextElementSibling) {
            section = anchor.nextElementSibling;
          }
        }

        if (section) {
          const headerOffset = 100;
          const elementPosition = section.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        } else {
          window.location.hash = sectionId;
        }
      }

      manualSelectionTimer = setTimeout(() => {
        manualSelectionActive = false;
      }, 500);
    });
  });

  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const targetTocItem = document.querySelector(
      `.toc-item a[data-section-id="${hash}"]`
    );

    if (targetTocItem) {
      const sectionId = hash;
      preserveHash = true;

      let section = document.getElementById(sectionId);

      if (!section) {
        section = document.querySelector(`a[name="${sectionId}"]`);
      }

      if (!section) {
        const anchor = document.querySelector(`a[name="${sectionId}"]`);
        if (anchor && anchor.nextElementSibling) {
          section = anchor.nextElementSibling;
        }
      }

      if (section) {
        setTimeout(() => {
          manualSelectionActive = true;
          initialLoad = false;
          const headerOffset = 100;
          const elementPosition = section.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "auto",
          });

          const targetLi = targetTocItem.parentElement;
          document
            .querySelector(".toc-item.active")
            ?.classList.remove("active");
          targetLi.classList.add("active");
          updateIndicator(targetLi);

          manualSelectionActive = true;
          initialLoad = false;

          if (manualSelectionTimer) clearTimeout(manualSelectionTimer);
          manualSelectionTimer = setTimeout(() => {
            manualSelectionActive = false;
          }, 1000);
        }, 100);
      }
    }
  }

  window.addEventListener("scroll", function () {
    if (!userHasScrolled) {
      userHasScrolled = true;

      setTimeout(() => {
        preserveHash = false;
      }, 1000);
    }

    if (initialLoad) initialLoad = false;
    highlightActiveTocItem();
  });
});
