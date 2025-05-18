document.addEventListener("DOMContentLoaded", function () {
  const allMenuRoots = document.querySelectorAll("ul.nav.navbar-nav");

  if (allMenuRoots.length === 0) {
    console.error(
      "No base menu ULs (ul.nav.navbar-nav) found. Cannot enhance any menu."
    );
    return;
  }
  
  if (!document.getElementById("myig-menu-styles")) {
    const styleElement = document.createElement("style");
    styleElement.id = "myig-menu-styles";
    styleElement.textContent = `
      .nav-menu-container .nav-item {
        width: 100%;
      }
      .nav-menu-container .nav-link {
        color: white;
        text-decoration: none;
        font-family: inherit;
        font-weight: 500;
        font-size: 14px;
        line-height: 24px;
        transition: all 0.2s ease;
        padding: 8px 12px;
        display: block;
        box-sizing: border-box;
      }
      .nav-menu-container .nav-link.myig-menu-item-hover {
        background-color: #2A3C5E;
        border-radius: 4px;
      }
      .nav-menu-container .nav-link.myig-menu-item-selected {
        background-color: #2A3C5E !important;
        border-radius: 4px !important;
      }
      .nav-menu-container .dropdown-toggle {
        display: flex !important;
        align-items: center;
        gap: 9px;
      }
      .nav-menu-container .dropdown-toggle::after {
        display: none !important;
      }
      .nav-menu-container .menu-chevron {
        width: 6px;
        height: 10px;
        fill: none;
        stroke: #A0AEC7;
        stroke-width: 1.33333;
        stroke-linecap: round;
        stroke-linejoin: round;
        transition: transform 0.2s ease;
        flex-shrink: 0;
      }
      .nav-menu-container ul.myig-dropdown-menu { 
        list-style: none;
        margin: 0;
        overflow: hidden;
        max-height: 0;
        transition: max-height 0.3s ease-in-out, padding-top 0.3s ease-in-out, padding-bottom 0.3s ease-in-out;
        padding-left: 1.5rem;
        padding-top: 0;
        padding-bottom: 0;
        box-sizing: border-box;
      }
      .nav-menu-container ul.myig-dropdown-menu.show {
        max-height: 1000px;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
      }
    `;
    document.head.appendChild(styleElement);
  }

  allMenuRoots.forEach((menuUl, menuIndex) => {
    const navWrapper = document.createElement("nav");
    navWrapper.className = `navbar navbar-dark d-flex flex-column justify-content-start align-items-baseline nav-menu-container nav-menu-instance-${
      menuIndex + 1
    }`;

    Object.assign(navWrapper.style, {
      width: "100%",
      backgroundColor: "#121C2D",
      padding: "24px 16px",
      fontFamily: "inter, sans-serif",
      fontWeight: "500",
      fontSize: "14px",
    });

    if (menuUl.parentNode && !menuUl.parentNode.classList.contains("nav-menu-container")) {
      menuUl.parentNode.insertBefore(navWrapper, menuUl);
      navWrapper.appendChild(menuUl);
    } else if (!menuUl.parentNode) {
      console.error(
        `Menu UL #${menuIndex + 1} has no parent. Cannot wrap with NAV.`
      );
      return;
    }

    menuUl.classList.add("nav", "flex-column", "w-100");

    menuUl.querySelectorAll(":scope > li").forEach((li, itemIndex) => {
      li.classList.add("nav-item");
      const link = li.querySelector(":scope > a");

      if (!link) {
      } else {
        link.classList.add("nav-link");
        link.addEventListener("mouseover", function () {
          if (!this.classList.contains("myig-menu-item-selected")) {
            this.classList.add("myig-menu-item-hover");
          }
        });
        link.addEventListener("mouseout", function () {
          this.classList.remove("myig-menu-item-hover");
        });
      }

      if (li.classList.contains("dropdown")) {
        const toggleLink =
          li.querySelector(":scope > a.dropdown-toggle") || link;

        if (toggleLink && !toggleLink.classList.contains("dropdown-toggle")) {
          toggleLink.classList.add("dropdown-toggle");
        }

        const originalCaret = toggleLink
          ? toggleLink.querySelector("b.caret")
          : null;
        if (originalCaret) originalCaret.remove();

        if (toggleLink) {
          const existingChevron = toggleLink.querySelector(".menu-chevron");
          if (!existingChevron) {
            const svgChevron = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "svg"
            );
            svgChevron.setAttribute("class", "menu-chevron");
            svgChevron.setAttribute("viewBox", "0 0 6 10");
            const path = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "path"
            );
            path.setAttribute("d", "M1 9L5 5L1 1");
            svgChevron.appendChild(path);
            toggleLink.insertBefore(svgChevron, toggleLink.firstChild);
          }
        }

        const submenuUl = li.querySelector(":scope > ul.dropdown-menu");
        if (submenuUl) {
          submenuUl.classList.remove("dropdown-menu");
          submenuUl.classList.add("myig-dropdown-menu");

          submenuUl.querySelectorAll(":scope > li").forEach((subLi) => {
            subLi.classList.add("nav-item");
            const subLinks = subLi.querySelectorAll(":scope > a");
            subLinks.forEach((subLink) => {
              subLink.classList.add("nav-link");
              subLink.addEventListener("mouseover", function () {
                if (!this.classList.contains("myig-menu-item-selected")) {
                  this.classList.add("myig-menu-item-hover");
                }
              });
              subLink.addEventListener("mouseout", function () {
                this.classList.remove("myig-menu-item-hover");
              });
            });
          });

          const submenuId = `myig-submenu-m${menuIndex + 1}-${Math.random()
            .toString(36)
            .substring(2, 9)}`;
          submenuUl.id = submenuId;

          if (toggleLink) {
            toggleLink.addEventListener("click", function (e) {
              e.preventDefault();
              const chevron = toggleLink.querySelector(".menu-chevron");
              const isExpanded = submenuUl.classList.contains("show");
              if (isExpanded) {
                submenuUl.classList.remove("show");
                if (chevron) chevron.style.transform = "rotate(0deg)";
                localStorage.setItem(submenuUl.id + "-state", "closed");
              } else {
                submenuUl.classList.add("show");
                if (chevron) chevron.style.transform = "rotate(90deg)";
                localStorage.setItem(submenuUl.id + "-state", "open");
              }
            });

            if (localStorage.getItem(submenuUl.id + "-state") === "open") {
              submenuUl.classList.add("show");
              const chevron = toggleLink.querySelector(".menu-chevron");
              if (chevron) chevron.style.transform = "rotate(90deg)";
            }
          }
        }
      }
    });
  });

  function setActiveMenuItem() {
    const currentPath = window.location.pathname.split("/").pop();
    const targetFilename = currentPath === "" ? "index.html" : currentPath;
    let itemFoundInAnyMenu = false;

    document
      .querySelectorAll(".nav-menu-container .nav-link")
      .forEach((link) => {
        link.classList.remove("myig-menu-item-selected");
        const linkFilename = link.getAttribute("href")?.split("/").pop();

        if (linkFilename === targetFilename) {
          link.classList.add("myig-menu-item-selected");
          itemFoundInAnyMenu = true;

          let currentElement = link;
          const parentMenuUl = currentElement.closest(
            "ul.nav.flex-column.w-100"
          );

          while (
            currentElement &&
            currentElement !== parentMenuUl &&
            parentMenuUl
          ) {
            if (
              currentElement.classList &&
              currentElement.classList.contains("myig-dropdown-menu")
            ) {
              if (!currentElement.classList.contains("show")) {
                currentElement.classList.add("show");
                const toggleForThisSubmenu =
                  currentElement.previousElementSibling;
                if (
                  toggleForThisSubmenu &&
                  toggleForThisSubmenu.classList.contains("dropdown-toggle")
                ) {
                  const svg =
                    toggleForThisSubmenu.querySelector(".menu-chevron");
                  if (svg) svg.style.transform = "rotate(90deg)";
                  if (currentElement.id)
                    localStorage.setItem(currentElement.id + "-state", "open");
                }
              }
            }
            currentElement = currentElement.parentElement;
          }
        }
      });

    if (!itemFoundInAnyMenu && targetFilename === "index.html") {
      document
        .querySelectorAll('.nav-menu-container a[href="index.html"].nav-link')
        .forEach((homeLink) => {
          homeLink.classList.add("myig-menu-item-selected");
        });
    }
  }

  setActiveMenuItem();

  document.body.classList.add("js-menu-ready");
  const allProcessedNavContainers = document.querySelectorAll(
    ".nav-menu-container"
  );

  if (allProcessedNavContainers.length > 0) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        allProcessedNavContainers.forEach((container) => {
          container.classList.add("nav-initialized");
        });
      });
    });
  }
});
