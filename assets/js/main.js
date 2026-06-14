(function () {
  "use strict";

  /**
   * selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  const siteContent = window.siteContent || {};
  const researchProjects = siteContent.researchProjects || [];
  const achievements = siteContent.achievements || {};
  const activities = siteContent.activities || [];
  const activityById = new Map(activities.map((activity) => [activity.id, activity]));

  const createElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  };

  const getPrimaryLink = (links = []) => links.find((link) => link.url);

  const renderLinks = (links, className) => {
    const validLinks = (links || []).filter((link) => link.url);
    if (!validLinks.length) return null;

    const linksElement = createElement("div", className);

    validLinks.forEach((link) => {
      const anchor = createElement("a", "", link.label);
      anchor.href = link.url;
      anchor.target = "_blank";
      anchor.rel = "noopener";
      linksElement.appendChild(anchor);
    });

    return linksElement;
  };

  const renderResearchProjects = () => {
    const container = select("#research-projects-container");
    if (!container) return;

    container.innerHTML = "";

    researchProjects.forEach((project) => {
      const column = createElement("div", "col-lg-6 research-project-item");
      const card = createElement("article", "research-project-card");

      if (project.cover) {
        const media = createElement("div", "research-project-card__media");
        const image = document.createElement("img");
        image.src = project.cover;
        image.alt = project.title;
        image.loading = "lazy";
        media.appendChild(image);
        card.appendChild(media);
      }

      const body = createElement("div", "research-project-card__body");
      const meta = createElement("div", "research-project-card__meta");
      meta.appendChild(createElement("span", "research-project-card__tag", project.category));
      meta.appendChild(createElement("span", "", project.date));

      const title = createElement("h3", "", project.title);
      const summary = createElement("p", "", project.summary);
      body.appendChild(meta);
      body.appendChild(title);
      body.appendChild(summary);

      if (project.outcomes && project.outcomes.length) {
        const outcomes = createElement("ul", "research-project-card__outcomes");
        project.outcomes.forEach((outcome) => {
          outcomes.appendChild(createElement("li", "", outcome));
        });
        body.appendChild(outcomes);
      }

      const links = renderLinks(project.links, "research-project-card__links");
      if (links) body.appendChild(links);

      card.appendChild(body);
      column.appendChild(card);
      container.appendChild(column);
    });
  };

  const renderAchievements = () => {
    const title = select("#achievements-title");
    const introduction = select("#achievements-introduction");
    const container = select("#achievements-container");
    if (!container) return;

    if (title) title.textContent = achievements.title || "Achievements";
    if (introduction) introduction.textContent = achievements.introduction || "";
    container.innerHTML = "";

    (achievements.columns || []).forEach((columnData, columnIndex) => {
      const column = createElement("div", "col-md-6");
      column.setAttribute("data-aos", "fade-up");
      if (columnIndex) column.setAttribute("data-aos-delay", String(columnIndex * 100));

      (columnData.groups || []).forEach((group) => {
        column.appendChild(createElement("h3", "achievements-title", group.title));

        (group.items || []).forEach((item) => {
          const itemElement = createElement("div", "achievements-item");
          itemElement.appendChild(createElement("h4", "", item.title));

          (item.entries || []).forEach((entry) => {
            if (entry.date) {
              itemElement.appendChild(createElement("h5", "", entry.date));
            }

            if (entry.note) {
              const note = createElement("p");
              note.appendChild(createElement("em", "", entry.note));
              itemElement.appendChild(note);
            }

            if (entry.outcomes && entry.outcomes.length) {
              const outcomes = createElement("ul");
              entry.outcomes.forEach((outcome) => {
                outcomes.appendChild(createElement("li", "", outcome));
              });
              itemElement.appendChild(outcomes);
            }
          });

          column.appendChild(itemElement);
        });
      });

      container.appendChild(column);
    });
  };

  const renderActivityFilters = () => {
    const filters = select("#portfolio-filters");
    if (!filters) return;

    filters.innerHTML = "";

    (siteContent.activityTags || []).forEach((tag, index) => {
      const filter = createElement("li", index === 0 ? "filter-active" : "", tag.label);
      filter.dataset.filter = tag.filter;
      filters.appendChild(filter);
    });
  };

  const renderActivities = () => {
    const container = select("#activities-container");
    if (!container) return;

    container.innerHTML = "";

    activities.forEach((activity) => {
      const column = createElement("div", `col-lg-4 col-md-6 portfolio-item filter-${activity.category}`);
      const card = createElement("article", "portfolio-card");
      card.dataset.activityId = activity.id;
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `View ${activity.title}`);

      const wrap = createElement("div", "portfolio-wrap");
      const image = document.createElement("img");
      image.src = activity.cover;
      image.className = "img-fluid";
      image.alt = activity.title;
      image.loading = "lazy";
      wrap.appendChild(image);

      const info = createElement("div", "portfolio-card__info");
      info.appendChild(createElement("span", "portfolio-card__tag", activity.category));
      info.appendChild(createElement("h3", "", activity.title));

      card.appendChild(wrap);
      card.appendChild(info);
      column.appendChild(card);
      container.appendChild(column);
    });
  };

  renderResearchProjects();
  renderAchievements();
  renderActivityFilters();
  renderActivities();

  /**
   * Dark and light theme toggle
   */
  const themeToggles = select(".theme-toggle", true);
  const root = document.documentElement;

  const setTheme = (theme) => {
    const isLight = theme === "light";
    root.setAttribute("data-theme", theme);

    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      // Theme still changes for the current page when storage is unavailable.
    }

    themeToggles.forEach((toggle) => {
      const icon = toggle.querySelector("i");
      const label = toggle.querySelector("span");

      toggle.setAttribute("aria-pressed", String(isLight));
      toggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");

      if (icon) {
        icon.classList.toggle("bx-sun", !isLight);
        icon.classList.toggle("bx-moon", isLight);
      }

      if (label) {
        label.textContent = isLight ? "Dark mode" : "Light mode";
      }
    });
  };

  if (themeToggles.length) {
    setTheme(root.getAttribute("data-theme") || "dark");

    themeToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const currentTheme = root.getAttribute("data-theme") || "dark";
        setTheme(currentTheme === "light" ? "dark" : "light");
      });
    });
  }

  /**
   * set state active for navbar links on scroll
   */
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    const headerOffset = window.innerWidth >= 992 ? 88 : 42;
    let elementPos = select(el).offsetTop - headerOffset;
    window.scrollTo({
      top: elementPos,
      behavior: "smooth",
    });
  };

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function (e) {
    select("body").classList.toggle("mobile-nav-active");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /**
   * Scroll with offset on links with a class name .scrollto
   */
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let body = select("body");
        if (body.classList.contains("mobile-nav-active")) {
          body.classList.remove("mobile-nav-active");
          let navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Scroll with offset on page load with hash links in the url
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Portfolio isotope and filter
   */
  window.addEventListener("load", () => {
    let portfolioContainer = select(".portfolio-container");
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: ".portfolio-item",
      });

      let portfolioFilters = select("#portfolio-filters li", true);

      on(
        "click",
        "#portfolio-filters li",
        function (e) {
          e.preventDefault();
          portfolioFilters.forEach(function (el) {
            el.classList.remove("filter-active");
          });
          this.classList.add("filter-active");

          portfolioIsotope.arrange({
            filter: this.getAttribute("data-filter"),
          });
          portfolioIsotope.on("arrangeComplete", function () {
            AOS.refresh();
          });
        },
        true
      );
    }
  });

  /**
   * Initiate portfolio lightbox
   */
  const portfolioLightbox = GLightbox({
    selector: ".portfolio-lightbox",
  });

  /**
   * Enlarged activity viewer
   */
  const activityModal = select("#activity-modal");

  if (activityModal) {
    const activityMedia = select("#activity-modal-media");
    const activityTitle = select("#activity-modal-title");
    const activityDescription = select("#activity-modal-description");
    const activityCounter = select("#activity-modal-counter");
    const activityLink = select("#activity-modal-link");
    const activityThumbs = select("#activity-modal-thumbs");
    const prevActivityMedia = select(".activity-modal__arrow--prev");
    const nextActivityMedia = select(".activity-modal__arrow--next");
    let activityItems = [];
    let activityIndex = 0;
    let touchStartX = 0;

    const mediaTypeFromSrc = (src) => {
      const cleanSrc = src.split("?")[0].split("#")[0].toLowerCase();
      return cleanSrc.endsWith(".mp4") || cleanSrc.endsWith(".webm") || cleanSrc.endsWith(".ogg") ? "video" : "image";
    };

    const addActivityItem = (items, src, type, title) => {
      if (!src || src === "#") return;
      if (items.some((item) => item.src === src)) return;

      items.push({
        src,
        type: type || mediaTypeFromSrc(src),
        title: title || "",
      });
    };

    const renderActivityMedia = () => {
      const item = activityItems[activityIndex];
      activityMedia.innerHTML = "";

      if (!item) return;

      const media = document.createElement(item.type === "video" ? "video" : "img");
      media.src = item.src;

      if (item.type === "video") {
        media.controls = true;
        media.muted = true;
        media.playsInline = true;
      } else {
        media.alt = item.title || activityTitle.textContent || "Activity media";
      }

      activityMedia.appendChild(media);
      activityCounter.textContent = activityItems.length > 1 ? `${activityIndex + 1} / ${activityItems.length}` : "";
      prevActivityMedia.hidden = activityItems.length < 2;
      nextActivityMedia.hidden = activityItems.length < 2;
      prevActivityMedia.disabled = activityIndex === 0;
      nextActivityMedia.disabled = activityIndex === activityItems.length - 1;

      activityThumbs.querySelectorAll(".activity-modal__thumb").forEach((thumb, index) => {
        thumb.classList.toggle("is-active", index === activityIndex);
        thumb.setAttribute("aria-selected", String(index === activityIndex));
      });
    };

    const renderActivityThumbs = () => {
      activityThumbs.innerHTML = "";
      activityThumbs.hidden = activityItems.length < 2;

      activityItems.forEach((item, index) => {
        const thumb = document.createElement("button");
        const media = document.createElement(item.type === "video" ? "video" : "img");

        thumb.type = "button";
        thumb.className = `activity-modal__thumb${item.type === "video" ? " activity-modal__thumb--video" : ""}`;
        thumb.setAttribute("aria-label", `View media ${index + 1}`);
        thumb.setAttribute("aria-selected", String(index === activityIndex));

        media.src = item.src;

        if (item.type === "video") {
          media.muted = true;
          media.playsInline = true;
          media.preload = "metadata";
        } else {
          media.alt = item.title || `Media ${index + 1}`;
        }

        thumb.addEventListener("click", () => {
          activityIndex = index;
          renderActivityMedia();
        });

        thumb.appendChild(media);
        activityThumbs.appendChild(thumb);
      });
    };

    const moveActivityMedia = (direction) => {
      if (activityItems.length < 2) return;
      const nextIndex = activityIndex + direction;
      if (nextIndex < 0 || nextIndex >= activityItems.length) return;
      activityIndex = nextIndex;
      renderActivityMedia();
    };

    const openActivityViewer = (card) => {
      const activity = activityById.get(card.dataset.activityId);
      const items = [];

      if (activity) {
        (activity.media || []).forEach((item) => {
          addActivityItem(items, item.src, item.type, item.title);
        });

        if (!items.length) {
          addActivityItem(items, activity.cover, null, activity.title);
        }

        activityItems = items;
        activityIndex = 0;
        activityTitle.textContent = activity.title || "Activity";
        activityDescription.innerHTML = "";

        (activity.description || []).forEach((text) => {
          activityDescription.appendChild(createElement("p", "", text));
        });

        const primaryLink = getPrimaryLink(activity.links);
        if (primaryLink) {
          activityLink.href = primaryLink.url;
          activityLink.hidden = false;
          activityLink.querySelector("span").textContent = primaryLink.label || "Open related code or link";
        } else {
          activityLink.hidden = true;
        }

        renderActivityThumbs();
        renderActivityMedia();
        activityModal.classList.add("is-open");
        activityModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("activity-modal-open");
        activityModal.querySelector(".activity-modal__close").focus();
        return;
      }

      const description = card.querySelector(".glightbox-desc");
      const thumb = card.querySelector(":scope > img");

      addActivityItem(items, card.dataset.activityPrimary, null, card.dataset.activityTitle);

      if (description) {
        description.querySelectorAll("img, video").forEach((media) => {
          const src = media.tagName.toLowerCase() === "video"
            ? media.querySelector("source")?.getAttribute("src") || media.getAttribute("src")
            : media.getAttribute("src");
          addActivityItem(items, src, media.tagName.toLowerCase() === "video" ? "video" : "image", media.getAttribute("title"));
        });
      }

      if (!items.length && thumb) {
        addActivityItem(items, thumb.getAttribute("src"), "image", thumb.getAttribute("alt"));
      }

      activityItems = items;
      activityIndex = 0;
      activityTitle.textContent = card.dataset.activityTitle || "Activity";
      activityDescription.innerHTML = "";

      if (description) {
        const descriptionCopy = description.cloneNode(true);
        descriptionCopy.querySelectorAll(".scroll-container, style, video").forEach((el) => el.remove());
        activityDescription.innerHTML = descriptionCopy.innerHTML;
      }

      if (card.dataset.activityLink) {
        activityLink.href = card.dataset.activityLink;
        activityLink.hidden = false;
        activityLink.querySelector("span").textContent = card.dataset.activityLinkTitle || "Open related code or link";
      } else {
        activityLink.hidden = true;
      }

      renderActivityThumbs();
      renderActivityMedia();
      activityModal.classList.add("is-open");
      activityModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("activity-modal-open");
      activityModal.querySelector(".activity-modal__close").focus();
    };

    const closeActivityViewer = () => {
      activityModal.classList.remove("is-open");
      activityModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("activity-modal-open");
      activityMedia.innerHTML = "";
      activityThumbs.innerHTML = "";
    };

    on(
      "click",
      ".portfolio-card",
      function () {
        openActivityViewer(this);
      },
      true
    );

    on(
      "keydown",
      ".portfolio-card",
      function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        openActivityViewer(this);
      },
      true
    );

    activityModal.querySelectorAll("[data-activity-close]").forEach((button) => {
      button.addEventListener("click", closeActivityViewer);
    });

    prevActivityMedia.addEventListener("click", () => moveActivityMedia(-1));
    nextActivityMedia.addEventListener("click", () => moveActivityMedia(1));

    activityMedia.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0].clientX;
    });

    activityMedia.addEventListener("touchend", (event) => {
      const touchDistance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(touchDistance) > 45) {
        moveActivityMedia(touchDistance > 0 ? -1 : 1);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!activityModal.classList.contains("is-open")) return;
      if (event.key === "Escape") closeActivityViewer();
      if (event.key === "ArrowLeft") moveActivityMedia(-1);
      if (event.key === "ArrowRight") moveActivityMedia(1);
    });
  }

  /**
   * Portfolio details slider
   */
  new Swiper(".portfolio-details-slider", {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  });

  /**
   * Animation on scroll
   */
  window.addEventListener("load", () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  });
})();
