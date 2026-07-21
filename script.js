"use strict";

/* =========================
   PAGE SCROLL RESET
   새로고침 시 항상 최상단
========================= */

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

function resetPageScrollPosition() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto",
  });
}

resetPageScrollPosition();

window.addEventListener("DOMContentLoaded", () => {
  resetPageScrollPosition();
});

window.addEventListener("pageshow", () => {
  window.requestAnimationFrame(() => {
    resetPageScrollPosition();
  });
});

window.addEventListener("beforeunload", () => {
  resetPageScrollPosition();
});


document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const siteHeader = document.getElementById("siteHeader");
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuLinks = mobileMenu
    ? mobileMenu.querySelectorAll("a")
    : [];
  const revealElements = document.querySelectorAll(".reveal");
  const currentYear = document.getElementById("currentYear");
  const adminEntryButton = document.getElementById("adminEntryButton");

  /* =========================
     CURRENT YEAR
  ========================= */

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* =========================
     HEADER SCROLL
  ========================= */

  const updateHeaderState = () => {
    if (!siteHeader) return;

    siteHeader.classList.toggle("scrolled", window.scrollY > 24);
  };

  updateHeaderState();

  window.addEventListener("scroll", updateHeaderState, {
    passive: true,
  });

  /* =========================
     MOBILE MENU
  ========================= */

  const openMenu = () => {
    if (!menuButton || !mobileMenu) return;

    menuButton.classList.add("active");
    mobileMenu.classList.add("open");
    body.classList.add("menu-open");

    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "메뉴 닫기");
  };

  const closeMenu = () => {
    if (!menuButton || !mobileMenu) return;

    menuButton.classList.remove("active");
    mobileMenu.classList.remove("open");
    body.classList.remove("menu-open");

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "메뉴 열기");
  };

  const toggleMenu = () => {
    if (!mobileMenu) return;

    const isOpen = mobileMenu.classList.contains("open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  if (menuButton) {
    menuButton.addEventListener("click", toggleMenu);
  }

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  /* =========================
     SMOOTH SECTION SCROLL
  ========================= */

  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (!targetElement) return;

      event.preventDefault();

      const headerHeight = siteHeader
        ? siteHeader.offsetHeight
        : 0;

      const targetTop =
        targetElement.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    });
  });

  /* =========================
     REVEAL ANIMATION
  ========================= */

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -45px 0px",
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* =========================
     HERO IMAGE LOAD
  ========================= */

  const heroImage = document.getElementById("heroImage");

  if (heroImage) {
    const markHeroLoaded = () => {
      heroImage.classList.add("loaded");
    };

    if (heroImage.complete) {
      markHeroLoaded();
    } else {
      heroImage.addEventListener("load", markHeroLoaded, {
        once: true,
      });
    }
  }

/* =========================
   ADMIN ENTRY
========================= */

if (adminEntryButton) {
  adminEntryButton.addEventListener("click", () => {
    openAdminLogin();
  });
}
});

/* =========================================================
   ONYOUR ADMIN CMS
   STEP 1 - LOGIN / VIEW NAVIGATION
========================================================= */

/* =========================
   ADMIN ELEMENTS
========================= */

const adminLoginModal =
  document.getElementById("adminLoginModal");

const adminLoginBackdrop =
  document.getElementById("adminLoginBackdrop");

const adminLoginCloseButton =
  document.getElementById("adminLoginCloseButton");

const adminLoginForm =
  document.getElementById("adminLoginForm");

const adminPassword =
  document.getElementById("adminPassword");

const adminPasswordToggle =
  document.getElementById("adminPasswordToggle");

const adminLoginMessage =
  document.getElementById("adminLoginMessage");

const adminDashboard =
  document.getElementById("adminDashboard");

const adminDashboardClose =
  document.getElementById("adminDashboardClose");

const adminLogoutButton =
  document.getElementById("adminLogoutButton");

const adminDashboardTitle =
  document.getElementById("adminDashboardTitle");

const adminDashboardContent =
  document.querySelector(
    "#adminDashboard .admin-dashboard-content"
  );

const adminViews =
  document.querySelectorAll(
    "#adminDashboard [data-admin-view]"
  );

let currentAdminPassword = "";
  

/* =========================
   ADMIN VIEW INFORMATION
========================= */

const ADMIN_VIEW_TITLES = {
  home: "홈페이지 관리",

  news: "News 관리",
  "news-form": "News 작성",

  performance: "공연 관리",
  "performance-form": "공연 작성",

  video: "영상 관리",
  "video-form": "영상 작성",

  music: "음원 관리",
  "music-form": "음원 작성",

  gallery: "갤러리 관리",
  "gallery-form": "갤러리 작성",

  members: "멤버 관리",
  "members-form": "멤버 작성",

  settings: "홈페이지 설정",
};


/* =========================
   LOGIN MODAL
========================= */

function openAdminLogin() {
  if (!adminLoginModal) return;

  adminLoginModal.classList.add("is-open");
  adminLoginModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "admin-modal-open"
  );

  if (adminLoginMessage) {
    adminLoginMessage.textContent = "";
  }

  if (adminPassword) {
    adminPassword.value = "";

    window.setTimeout(() => {
      adminPassword.focus();
    }, 100);
  }
}

function closeAdminLogin() {
  if (!adminLoginModal) return;

  adminLoginModal.classList.remove("is-open");
  adminLoginModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "admin-modal-open"
  );

  if (adminLoginMessage) {
    adminLoginMessage.textContent = "";
  }

  if (adminPassword) {
    adminPassword.value = "";
  }
}

function toggleAdminPassword() {
  if (!adminPassword) return;

  const currentlyHidden =
    adminPassword.type === "password";

  adminPassword.type =
    currentlyHidden ? "text" : "password";

  if (adminPasswordToggle) {
    adminPasswordToggle.textContent =
      currentlyHidden ? "숨기기" : "보기";

    adminPasswordToggle.setAttribute(
      "aria-label",
      currentlyHidden
        ? "비밀번호 숨기기"
        : "비밀번호 표시"
    );
  }
}


/* =========================
   ADMIN VIEW SWITCHING
========================= */

function getAdminView(viewName) {
  return document.querySelector(
    `#adminDashboard [data-admin-view="${viewName}"]`
  );
}

function openAdminView(viewName) {
  const targetView = getAdminView(viewName);

  if (!targetView) {
    console.warn(
      `관리자 화면을 찾을 수 없습니다: ${viewName}`
    );

    return;
  }

  adminViews.forEach((view) => {
    const isTarget = view === targetView;

    view.classList.toggle(
      "is-open",
      isTarget
    );

    view.setAttribute(
      "aria-hidden",
      isTarget ? "false" : "true"
    );
  });

  if (adminDashboardTitle) {
    adminDashboardTitle.textContent =
      ADMIN_VIEW_TITLES[viewName] ||
      "홈페이지 관리";
  }

  if (adminDashboardContent) {
    adminDashboardContent.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }
}


/* =========================
   DASHBOARD OPEN / CLOSE
========================= */

function openAdminDashboard() {
  closeAdminLogin();

  if (!adminDashboard) return;

  adminDashboard.classList.add("is-open");

  adminDashboard.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "admin-dashboard-open"
  );

  openAdminView("home");
  loadAdminDataFromD1();
}

function closeAdminDashboard() {
  if (!adminDashboard) return;

  adminDashboard.classList.remove("is-open");

  adminDashboard.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "admin-dashboard-open"
  );

  openAdminView("home");
}


/* =========================
   FORM RESET
========================= */

function resetAdminForm(sectionName) {
  const form = document.getElementById(
    `admin${
      sectionName.charAt(0).toUpperCase() +
      sectionName.slice(1)
    }Form`
  );

  form?.reset();

  const hiddenId = form?.querySelector(
    'input[type="hidden"]'
  );

  if (hiddenId) {
    hiddenId.value = "";
  }

  form
    ?.querySelectorAll(
      ".admin-image-preview"
    )
    .forEach((preview) => {
      preview.hidden = true;
    });

  form
    ?.querySelectorAll(
      ".admin-video-preview"
    )
    .forEach((preview) => {
      preview.hidden = true;
    });

  const galleryPreview =
    document.getElementById(
      "adminGalleryPreview"
    );

  if (
    sectionName === "gallery" &&
    galleryPreview
  ) {
    galleryPreview.innerHTML = "";
  }
}


/* =========================
   OPEN ADD FORM
========================= */

function openAdminForm(sectionName) {
  const formViewName =
    `${sectionName}-form`;

  resetAdminForm(sectionName);
  openAdminView(formViewName);

  const formView =
    getAdminView(formViewName);

  const firstField =
    formView?.querySelector(
      "input:not([type='hidden']):not([type='file']), select, textarea"
    );

  window.setTimeout(() => {
    firstField?.focus();
  }, 100);
}


/* =========================
   LOGIN EVENTS
========================= */

adminLoginCloseButton?.addEventListener(
  "click",
  closeAdminLogin
);

adminLoginBackdrop?.addEventListener(
  "click",
  closeAdminLogin
);

adminPasswordToggle?.addEventListener(
  "click",
  toggleAdminPassword
);

adminLoginForm?.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();

    const password = adminPassword?.value.trim();

    if (!password) {
      if (adminLoginMessage) {
        adminLoginMessage.textContent =
          "비밀번호를 입력해 주세요.";
      }

      adminPassword?.focus();
      return;
    }

    try {
      // 임시로 비밀번호 저장
      currentAdminPassword = password;

      // 서버 인증 확인
      await adminApiRequest(
        "/api/content?type=news&includePrivate=true"
      );

      if (adminLoginMessage) {
        adminLoginMessage.textContent = "";
      }

      openAdminDashboard();
    } catch (error) {
      currentAdminPassword = "";

      if (adminLoginMessage) {
        adminLoginMessage.textContent =
          "비밀번호가 올바르지 않습니다.";
      }

      adminPassword?.select();
    }
  }
);

/* =========================
   DASHBOARD EVENTS
========================= */

adminDashboardClose?.addEventListener(
  "click",
  closeAdminDashboard
);

adminLogoutButton?.addEventListener(
  "click",
  () => {
    currentAdminPassword = "";
    closeAdminDashboard();
  }
);


/* =========================
   MAIN MENU EVENTS
========================= */

document
  .querySelectorAll(
    "#adminDashboard [data-admin-section]"
  )
  .forEach((button) => {
    button.addEventListener("click", () => {
      const sectionName =
        button.dataset.adminSection;

      if (!sectionName) return;

      openAdminView(sectionName);
    });
  });


/* =========================
   BACK / CANCEL EVENTS
========================= */

document
  .querySelectorAll(
    "#adminDashboard [data-admin-back]"
  )
  .forEach((button) => {
    button.addEventListener("click", () => {
      const targetView =
        button.dataset.adminBack;

      if (!targetView) return;

      openAdminView(targetView);
    });
  });


/* =========================
   ADD BUTTON EVENTS
========================= */

document
  .querySelectorAll(
    "#adminDashboard [data-open-form]"
  )
  .forEach((button) => {
    button.addEventListener("click", () => {
      const sectionName =
        button.dataset.openForm;

      if (!sectionName) return;

      openAdminForm(sectionName);
    });
  });


/* =========================================================
   ADMIN TEMPORARY DATA / CRUD
   D1 연결 전 브라우저 화면에서 작동
========================================================= */

const adminStore = {
  news: [
    {
      id: "news-1",
      category: "Release",
      title: "가을 첫 정규앨범 발매 예정",
      date: "2026 Autumn",
      description: "",
      published: true,
      featured: true,
    },
    {
      id: "news-2",
      category: "Performance",
      title: "강릉 버스킹 전국대회 본선",
      date: "2026.07.25",
      description: "",
      published: true,
      featured: false,
    },
    {
      id: "news-3",
      category: "Video",
      title: "새로운 라이브 영상 공개",
      date: "New",
      description: "",
      published: true,
      featured: false,
    },
  ],

  performance: [
    {
      id: "performance-1",
      title: "강릉 버스킹 전국대회",
      date: "2026-07-25",
      time: "",
      location: "강릉",
      address: "",
      description: "",
      setlist: "",
      ticketUrl: "",
      published: true,
    },
  ],

  video: [
    {
      id: "video-1",
      title: "ONYOUR Live Session",
      url: "",
      description: "",
      featured: true,
      published: true,
    },
  ],

  music: [
    {
      id: "music-1",
      type: "Upcoming Album",
      title: "ONYOUR 1st Full Album",
      artist: "ONYOUR",
      releaseDate: "2026 Autumn",
      description: "",
      youtubeUrl: "",
      spotifyUrl: "",
      appleUrl: "",
      published: true,
    },
    {
      id: "music-2",
      type: "Latest Release",
      title: "최근 발매 음원",
      artist: "이휘근",
      releaseDate: "",
      description: "",
      youtubeUrl: "",
      spotifyUrl: "",
      appleUrl: "",
      published: true,
    },
  ],

  members: [
    {
      id: "member-1",
      name: "이휘근",
      englishName: "",
      role: "Producer · Rap",
      description: "",
      instagram: "",
      order: 1,
      published: true,
    },
    {
      id: "member-2",
      name: "이루니",
      englishName: "",
      role: "Vocal · Rap",
      description: "",
      instagram: "",
      order: 2,
      published: true,
    },
    {
      id: "member-3",
      name: "이체린",
      englishName: "",
      role: "Guitar",
      description: "",
      instagram: "",
      order: 3,
      published: true,
    },
  ],
};


/* =========================
   COMMON HELPERS
========================= */

async function adminApiRequest(
  url,
  options = {}
) {
  const headers = new Headers(
    options.headers || {}
  );

  if (currentAdminPassword) {
    headers.set(
      "X-Admin-Password",
      currentAdminPassword
    );
  }

  if (
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let result;

  try {
    result = await response.json();
  } catch {
    result = {
      success: false,
      message:
        "서버 응답을 읽을 수 없습니다.",
    };
  }

  if (!response.ok) {
    throw new Error(
      result.message ||
        "요청 처리 중 오류가 발생했습니다."
    );
  }

  return result;
}

async function uploadAdminImage(
  file,
  folder = "music"
) {
  if (!file) {
    return "";
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("folder", folder);

  const headers = new Headers();

  if (currentAdminPassword) {
    headers.set(
      "X-Admin-Password",
      currentAdminPassword
    );
  }

  const response = await fetch(
    "/api/upload",
    {
      method: "POST",
      headers,
      body: formData,
    }
  );

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      "이미지 업로드 응답을 읽을 수 없습니다."
    );
  }

  if (
    !response.ok ||
    result.success === false
  ) {
    throw new Error(
      result.message ||
      "이미지를 업로드하지 못했습니다."
    );
  }

  return result.file?.url || "";
}

const ADMIN_CONTENT_TYPES = [
  "news",
  "performance",
  "video",
  "music",
  "members",
];

async function loadAdminDataFromD1() {
  try {
    const results = await Promise.all(
      ADMIN_CONTENT_TYPES.map(async (type) => {
        const result = await adminApiRequest(
          `/api/content?type=${type}&includePrivate=true`
        );

        return {
          type,
          items: result.items || [],
        };
      })
    );

    results.forEach(({ type, items }) => {
      adminStore[type] = items;
    });

    renderAllAdminLists();
  } catch (error) {
    console.error(
      "관리자 데이터 불러오기 실패:",
      error
    );

    alert(
      error.message ||
      "저장된 콘텐츠를 불러오지 못했습니다."
    );
  }
}


function createAdminId(sectionName) {
  return `${sectionName}-${Date.now()}`;
}

function escapeAdminHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getAdminItem(sectionName, itemId) {
  return adminStore[sectionName]?.find(
    (item) => item.id === itemId
  );
}

function getAdminFormElement(id) {
  return document.getElementById(id);
}

function setAdminFormValue(id, value = "") {
  const element = getAdminFormElement(id);

  if (!element) return;

  if (element.type === "checkbox") {
    element.checked = Boolean(value);
    return;
  }

  element.value = value ?? "";
}

function getAdminFormValue(id) {
  const element = getAdminFormElement(id);

  if (!element) return "";

  if (element.type === "checkbox") {
    return element.checked;
  }

  return element.value.trim();
}


/* =========================
   LIST RENDERING
========================= */

function createAdminListItem({
  sectionName,
  id,
  category,
  title,
  meta,
}) {
  return `
    <article
      class="admin-content-item"
      data-content-id="${escapeAdminHtml(id)}"
    >
      <div class="admin-content-item-main">
        <span class="admin-content-category">
          ${escapeAdminHtml(category)}
        </span>

        <strong>
          ${escapeAdminHtml(title)}
        </strong>

        <small>
          ${escapeAdminHtml(meta)}
        </small>
      </div>

      <div class="admin-content-actions">
        <button
          type="button"
          data-action="edit"
          data-content-type="${escapeAdminHtml(sectionName)}"
          data-content-id="${escapeAdminHtml(id)}"
        >
          수정
        </button>

        <button
          type="button"
          data-action="delete"
          data-content-type="${escapeAdminHtml(sectionName)}"
          data-content-id="${escapeAdminHtml(id)}"
        >
          삭제
        </button>
      </div>
    </article>
  `;
}

function renderAdminNewsList() {
  const list = document.getElementById(
    "adminNewsList"
  );

  if (!list) return;

  list.innerHTML = adminStore.news
    .map((item) =>
      createAdminListItem({
        sectionName: "news",
        id: item.id,
        category: item.category,
        title: item.title,
        meta: item.date,
      })
    )
    .join("");
}

function renderAdminPerformanceList() {
  const list = document.getElementById(
    "adminPerformanceList"
  );

  if (!list) return;

  list.innerHTML = adminStore.performance
    .map((item) =>
      createAdminListItem({
        sectionName: "performance",
        id: item.id,
        category: item.published
          ? "Published"
          : "Private",
        title: item.title,
        meta: [item.date, item.location]
          .filter(Boolean)
          .join(" · "),
      })
    )
    .join("");
}

function renderAdminVideoList() {
  const list = document.getElementById(
    "adminVideoList"
  );

  if (!list) return;

  list.innerHTML = adminStore.video
    .map((item) =>
      createAdminListItem({
        sectionName: "video",
        id: item.id,
        category: item.featured
          ? "Featured"
          : "Video",
        title: item.title,
        meta: item.published
          ? "공개"
          : "비공개",
      })
    )
    .join("");
}

function renderAdminMusicList() {
  const profileSettings = {
    onyour: {
      suffix: "Onyour",
      defaultName: "ONYOUR",
      countLabel: "발매",
    },

    leehwigeun: {
      suffix: "Leehwigeun",
      defaultName: "이휘근",
      countLabel: "발매",
    },

    eluni: {
      suffix: "Eluni",
      defaultName: "이루니",
      countLabel: "참여",
    },

    leecherin: {
      suffix: "Leecherin",
      defaultName: "이체린",
      countLabel: "참여",
    },
  };

  Object.entries(
    profileSettings
  ).forEach(
    ([profileKey, setting]) => {
      const item =
        adminStore.music.find(
          (musicItem) =>
            musicItem.profileKey ===
              profileKey ||
            musicItem.id === profileKey
        );

      const image =
        document.getElementById(
          `adminMusicCardImage${setting.suffix}`
        );

      const fallback =
        document.getElementById(
          `adminMusicCardFallback${setting.suffix}`
        );

      const title =
        document.getElementById(
          `adminMusicCardTitle${setting.suffix}`
        );

      const count =
        document.getElementById(
          `adminMusicCardCount${setting.suffix}`
        );

      if (title) {
        title.textContent =
          item?.title ||
          "음원 정보가 없습니다.";
      }

      if (count) {
        const trackCount =
          Number(item?.trackCount) || 0;

        count.textContent =
          `${setting.countLabel} ${trackCount}곡`;
      }

      if (
        image &&
        fallback
      ) {
        const coverUrl =
          String(
            item?.coverUrl || ""
          ).trim();

        if (coverUrl) {
          image.src = coverUrl;

          image.alt =
            `${
              item?.title ||
              setting.defaultName
            } 자켓`;

          image.hidden = false;
          fallback.hidden = true;
        } else {
          image.removeAttribute("src");
          image.alt = "";
          image.hidden = true;

          fallback.hidden = false;
          fallback.textContent =
            setting.defaultName;
        }
      }
    }
  );
}

function renderAdminMembersList() {
  const list = document.getElementById(
    "adminMembersList"
  );

  if (!list) return;

  const sortedMembers = [
    ...adminStore.members,
  ].sort(
    (a, b) =>
      Number(a.order) - Number(b.order)
  );

  list.innerHTML = sortedMembers
    .map((item) =>
      createAdminListItem({
        sectionName: "members",
        id: item.id,
        category: item.role,
        title: item.name,
        meta:
          item.englishName ||
          (item.published
            ? "공개"
            : "비공개"),
      })
    )
    .join("");
}

function renderAllAdminLists() {
  renderAdminNewsList();
  renderAdminPerformanceList();
  renderAdminVideoList();
  renderAdminMusicList();
  renderAdminMembersList();
}

/* =========================================================
   PUBLIC MUSIC RENDERING
========================================================= */

function getPublicMusicLink(item) {
  return (
    item.releaseUrl ||
    item.release_url ||
    ""
  );
}

function createPublicMusicCardHtml(item) {
  const coverUrl = String(
    item.coverUrl ||
    item.cover_url ||
    ""
  ).trim();

  const artworkTitle = String(
    item.artworkTitle ||
    item.artwork_title ||
    item.artist ||
    "ONYOUR"
  ).trim();

  const artistName = String(
    item.artist ||
    item.artist_name ||
    ""
  ).trim();

  const musicLink =
    getPublicMusicLink(item);

  const isUpcoming =
    String(item.type || "")
      .toLowerCase()
      .includes("upcoming") ||
    String(
      item.releaseDate ||
      item.release_date ||
      ""
    )
      .toLowerCase()
      .includes("coming");

  const artworkHtml = coverUrl
    ? `
      <img
        class="music-artwork-image"
        src="${escapeAdminHtml(coverUrl)}"
        alt="${escapeAdminHtml(
          item.title || artworkTitle
        )} 앨범 자켓"
        loading="lazy"
      />

      <div class="music-artwork-shade"></div>
    `
    : `
      <div class="music-artwork-inner">
        <span>
          ${escapeAdminHtml(
            artworkTitle
          )}
        </span>

        <small>
          ${
            isUpcoming
              ? "COMING SOON"
              : "LATEST RELEASE"
          }
        </small>
      </div>
    `;

  const buttonHtml = musicLink
    ? `
      <a
        class="music-button"
        href="${escapeAdminHtml(
          musicLink
        )}"
        target="_blank"
        rel="noopener noreferrer"
      >
        음원 듣기
        <span>↗</span>
      </a>
    `
    : `
      <button
        class="music-button music-button-disabled"
        type="button"
        disabled
      >
        ${
          isUpcoming
            ? "Coming Soon"
            : "링크 준비 중"
        }
      </button>
    `;

  const releaseDate =
    item.releaseDate ||
    item.release_date ||
    "";

  return `
    <article class="music-card visible">
      <div class="music-artwork">
        ${artworkHtml}
      </div>

      <div class="music-info">
        <div>
          <p class="music-type">
            ${escapeAdminHtml(
              item.type || "Music"
            )}
          </p>

          <h3>
            ${escapeAdminHtml(
              item.title || "제목 없음"
            )}
          </h3>

          <p class="music-artist">
            ${escapeAdminHtml(
              artistName
            )}
          </p>
        </div>

        ${
          releaseDate
            ? `
              <span class="music-badge">
                ${escapeAdminHtml(
                  releaseDate
                )}
              </span>
            `
            : ""
        }
      </div>

      <div class="music-description">
        <p>
          ${escapeAdminHtml(
            item.description ||
            "음원 소개가 준비 중입니다."
          )}
        </p>
      </div>

      ${buttonHtml}
    </article>
  `;
}

function fitMusicCardTitle(element) {
  if (!element) return;

  element.style.fontSize = "";
  element.style.whiteSpace = "nowrap";

  const maxSize = 28;
  const minSize = 15;

  let fontSize = maxSize;

  element.style.fontSize =
    `${fontSize}px`;

  while (
    element.scrollWidth >
      element.clientWidth &&
    fontSize > minSize
  ) {
    fontSize -= 1;

    element.style.fontSize =
      `${fontSize}px`;
  }
}

/* =========================================================
   MUSIC PLATFORM ICON
========================================================= */

function getMusicPlatformIcon(
  platform
) {
  const icons = {
    youtube: `
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"
        />
      </svg>
    `,

    spotify: `
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm5.5 17.3a.75.75 0 0 1-1 .25c-2.85-1.74-6.45-2.13-10.68-1.17a.75.75 0 1 1-.33-1.46c4.64-1.05 8.61-.6 11.76 1.32a.75.75 0 0 1 .25 1.03Zm1.43-3.18a.94.94 0 0 1-1.29.31c-3.26-2-8.22-2.58-12.07-1.41a.94.94 0 1 1-.55-1.8c4.4-1.34 9.87-.69 13.6 1.6a.94.94 0 0 1 .31 1.29Zm.12-3.3C15.14 8.5 8.69 8.27 4.96 9.4a1.13 1.13 0 1 1-.66-2.16c4.28-1.3 11.4-1.03 15.91 1.65a1.13 1.13 0 0 1-1.16 1.94Z"
        />
      </svg>
    `,

    apple: `
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M17.05 12.54c.02-2.18 1.78-3.23 1.86-3.28a4 4 0 0 0-3.15-1.7c-1.33-.14-2.62.8-3.3.8-.7 0-1.76-.79-2.9-.76a4.18 4.18 0 0 0-3.52 2.15c-1.52 2.63-.39 6.5 1.07 8.63.73 1.04 1.58 2.2 2.71 2.16 1.1-.04 1.51-.69 2.84-.69 1.32 0 1.7.69 2.86.66 1.19-.02 1.94-1.04 2.64-2.09a8.62 8.62 0 0 0 1.2-2.44 3.76 3.76 0 0 1-2.31-3.44ZM14.89 6.15a3.83 3.83 0 0 0 .88-2.75 3.9 3.9 0 0 0-2.55 1.31 3.65 3.65 0 0 0-.91 2.65 3.22 3.22 0 0 0 2.58-1.21Z"
        />
      </svg>
    `,

    melon: `
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M18.9 5.15c-2.15-1.63-5.42-1.87-8.35-.65-3.14 1.3-5.38 4.06-5.59 6.88-.2 2.57 1.38 4.9 4.02 5.94 2.82 1.12 6.33.58 8.72-1.33 2.18-1.75 3.2-4.43 2.6-6.84a7.14 7.14 0 0 0-1.4-3.99Zm-1.36 8.6c-1.5 1.52-4.08 2.2-6.4 1.68-2.18-.48-3.63-1.84-3.71-3.47-.09-1.87 1.52-3.91 3.92-4.95 2.22-.97 4.71-.88 6.2.23a4.5 4.5 0 0 1 1.73 2.63c.26 1.35-.39 2.51-1.74 3.88Z"
        />
      </svg>
    `,
  };

  return icons[platform] || "";
}


/* =========================================================
   MUSIC PLATFORM LINK
========================================================= */

function createMusicPlatformLink(
  platform,
  url,
  label
) {
  const cleanUrl =
    String(url || "").trim();

  if (!cleanUrl) {
    return "";
  }

  return `
    <a
      class="music-platform-link"
      href="${escapeAdminHtml(cleanUrl)}"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="${escapeAdminHtml(label)}에서 듣기"
      title="${escapeAdminHtml(label)}"
    >
      ${getMusicPlatformIcon(platform)}
    </a>
  `;
}


/* =========================================================
   OLD RELEASE URL PLATFORM CHECK
========================================================= */

function getLegacyMusicPlatform(
  url
) {
  const cleanUrl =
    String(url || "").toLowerCase();

  if (
    cleanUrl.includes("youtube.com") ||
    cleanUrl.includes("youtu.be")
  ) {
    return "youtube";
  }

  if (
    cleanUrl.includes("spotify.com")
  ) {
    return "spotify";
  }

  if (
    cleanUrl.includes("music.apple.com")
  ) {
    return "apple";
  }

  if (
    cleanUrl.includes("melon.com")
  ) {
    return "melon";
  }

  return "";
}


/* =========================================================
   PUBLIC MUSIC LOAD
========================================================= */

async function loadPublicMusic() {
  const musicProfileList =
    document.getElementById(
      "musicProfileList"
    );

  if (!musicProfileList) {
    return;
  }

  const profileSettings = {
    onyour: {
      suffix: "Onyour",
      defaultArtist: "ONYOUR",
      defaultType: "FULL ALBUM",
      defaultTitle:
        "ONYOUR 1st Full Album",
    },

    leehwigeun: {
      suffix: "Leehwigeun",
      defaultArtist: "이휘근",
      defaultType: "SINGLE",
      defaultTitle: "Side by Side",
    },

    eluni: {
      suffix: "Eluni",
      defaultArtist: "이루니",
      defaultType: "SINGLE",
      defaultTitle: "참여 음원",
    },

    leecherin: {
      suffix: "Leecherin",
      defaultArtist: "이체린",
      defaultType: "SINGLE",
      defaultTitle: "참여 음원",
    },
  };

  try {
    const response = await fetch(
      "/api/content?type=music",
      {
        method: "GET",

        headers: {
          Accept: "application/json",
        },

        cache: "no-store",
      }
    );

    const result =
      await response.json();

    if (
      !response.ok ||
      result.success === false
    ) {
      throw new Error(
        result.message ||
        "음원을 불러오지 못했습니다."
      );
    }

    const items =
      Array.isArray(result.items)
        ? result.items
        : [];

    Object.entries(
      profileSettings
    ).forEach(
      ([profileKey, setting]) => {
        const item =
          items.find(
            (musicItem) => {
              const savedProfileKey =
                musicItem.profileKey ||
                musicItem.profile_key ||
                musicItem.id;

              return (
                savedProfileKey ===
                profileKey
              );
            }
          );

        if (!item) {
          return;
        }

        const suffix =
          setting.suffix;

        const coverImage =
          document.getElementById(
            `musicCover${suffix}`
          );

        const fallback =
          document.getElementById(
            `musicFallback${suffix}`
          );

        const artistElement =
          document.getElementById(
            `musicArtist${suffix}`
          );

        const typeElement =
          document.getElementById(
            `musicType${suffix}`
          );

        const titleElement =
          document.getElementById(
            `musicTitle${suffix}`
          );

        const platformContainer =
          document.getElementById(
            `musicPlatforms${suffix}`
          );

        const emptyElement =
          document.getElementById(
            `musicPlatformEmpty${suffix}`
          );

        const coverUrl =
          String(
            item.coverUrl ||
            item.cover_url ||
            ""
          ).trim();

        const artistName =
          String(
            item.artist ||
            item.artist_name ||
            setting.defaultArtist
          ).trim();

        const releaseType =
          String(
            item.albumType ||
            item.album_type ||
            item.type ||
            setting.defaultType
          ).trim();

        const releaseTitle =
          String(
            item.title ||
            setting.defaultTitle
          ).trim();

        /*
         * 자켓
         */
        if (
          coverImage &&
          fallback
        ) {
          if (coverUrl) {
            coverImage.src =
              coverUrl;

            coverImage.alt =
              `${releaseTitle} 앨범 자켓`;

            coverImage.hidden =
              false;

            fallback.hidden =
              true;
          } else {
            coverImage.removeAttribute(
              "src"
            );

            coverImage.alt = "";
            coverImage.hidden =
              true;

            fallback.hidden =
              false;
          }
        }

        /*
         * 아티스트 / 앨범 정보
         */
        if (artistElement) {
          artistElement.textContent =
            artistName;
        }

        if (typeElement) {
          typeElement.textContent =
            releaseType.toUpperCase();
        }

        if (titleElement) {
          titleElement.textContent =
            releaseTitle;
        }

        /*
         * 플랫폼 링크
         */
        let youtubeUrl =
          item.youtubeUrl ||
          item.youtube_url ||
          "";

        let spotifyUrl =
          item.spotifyUrl ||
          item.spotify_url ||
          "";

        let appleUrl =
          item.appleUrl ||
          item.apple_url ||
          "";

        let melonUrl =
          item.melonUrl ||
          item.melon_url ||
          "";

        /*
         * 기존 단일 링크도 임시로 유지
         */
        const legacyUrl =
          item.releaseUrl ||
          item.release_url ||
          "";

        if (legacyUrl) {
          const legacyPlatform =
            getLegacyMusicPlatform(
              legacyUrl
            );

          if (
            legacyPlatform ===
              "youtube" &&
            !youtubeUrl
          ) {
            youtubeUrl =
              legacyUrl;
          }

          if (
            legacyPlatform ===
              "spotify" &&
            !spotifyUrl
          ) {
            spotifyUrl =
              legacyUrl;
          }

          if (
            legacyPlatform ===
              "apple" &&
            !appleUrl
          ) {
            appleUrl =
              legacyUrl;
          }

          if (
            legacyPlatform ===
              "melon" &&
            !melonUrl
          ) {
            melonUrl =
              legacyUrl;
          }
        }

        const platformHtml = [
          createMusicPlatformLink(
            "youtube",
            youtubeUrl,
            "YouTube"
          ),

          createMusicPlatformLink(
            "spotify",
            spotifyUrl,
            "Spotify"
          ),

          createMusicPlatformLink(
            "apple",
            appleUrl,
            "Apple Music"
          ),

          createMusicPlatformLink(
            "melon",
            melonUrl,
            "Melon"
          ),
        ]
          .filter(Boolean)
          .join("");

        if (platformContainer) {
          platformContainer.innerHTML =
            platformHtml;
        }

        if (emptyElement) {
          emptyElement.hidden =
            Boolean(platformHtml);

          emptyElement.textContent =
            profileKey === "onyour"
              ? "Coming Soon"
              : "링크 준비 중";
        }
      }
    );
  } catch (error) {
    console.error(
      "공개 음원 불러오기 실패:",
      error
    );
  }
}

/* =========================
   FORM TITLE
========================= */

const ADMIN_FORM_TITLES = {
  news: {
    add: "새 소식",
    edit: "소식 수정",
  },
  performance: {
    add: "새 공연",
    edit: "공연 수정",
  },
  video: {
    add: "새 영상",
    edit: "영상 수정",
  },
  music: {
    add: "새 음원",
    edit: "음원 수정",
  },
  members: {
    add: "새 멤버",
    edit: "멤버 수정",
  },
};

function setAdminFormTitle(
  sectionName,
  mode
) {
  const titleIdMap = {
    news: "adminNewsFormTitle",
    performance:
      "adminPerformanceFormTitle",
    video: "adminVideoFormTitle",
    music: "adminMusicFormTitle",
    members: "adminMembersFormTitle",
  };

  const titleElement =
    document.getElementById(
      titleIdMap[sectionName]
    );

  if (!titleElement) return;

  titleElement.textContent =
    ADMIN_FORM_TITLES[sectionName]?.[
      mode
    ] || "콘텐츠 작성";
}


/* =========================
   EDIT FORM POPULATION
========================= */

function fillAdminNewsForm(item) {
  setAdminFormValue(
    "adminNewsId",
    item.id
  );
  setAdminFormValue(
    "adminNewsCategory",
    item.category
  );
  setAdminFormValue(
    "adminNewsTitle",
    item.title
  );
  setAdminFormValue(
    "adminNewsDate",
    item.date
  );
  setAdminFormValue(
    "adminNewsDescription",
    item.description
  );
  setAdminFormValue(
    "adminNewsPublished",
    item.published
  );
  setAdminFormValue(
    "adminNewsFeatured",
    item.featured
  );
}

function fillAdminPerformanceForm(item) {
  setAdminFormValue(
    "adminPerformanceId",
    item.id
  );
  setAdminFormValue(
    "adminPerformanceTitle",
    item.title
  );
  setAdminFormValue(
    "adminPerformanceDate",
    item.date
  );
  setAdminFormValue(
    "adminPerformanceTime",
    item.time
  );
  setAdminFormValue(
    "adminPerformanceLocation",
    item.location
  );
  setAdminFormValue(
    "adminPerformanceAddress",
    item.address
  );
  setAdminFormValue(
    "adminPerformanceDescription",
    item.description
  );
  setAdminFormValue(
    "adminPerformanceSetlist",
    item.setlist
  );
  setAdminFormValue(
    "adminPerformanceTicketUrl",
    item.ticketUrl
  );
  setAdminFormValue(
    "adminPerformancePublished",
    item.published
  );
}

function fillAdminVideoForm(item) {
  setAdminFormValue(
    "adminVideoId",
    item.id
  );
  setAdminFormValue(
    "adminVideoTitle",
    item.title
  );
  setAdminFormValue(
    "adminVideoUrl",
    item.url
  );
  setAdminFormValue(
    "adminVideoDescription",
    item.description
  );
  setAdminFormValue(
    "adminVideoFeatured",
    item.featured
  );
  setAdminFormValue(
    "adminVideoPublished",
    item.published
  );

  adminVideoUrl?.dispatchEvent(
    new Event("input")
  );
}

/* =========================
   MUSIC PROFILE FORM
========================= */

const ADMIN_MUSIC_PROFILES = {
  onyour: {
    name: "ONYOUR",
    category: "TEAM MUSIC PROFILE",
    defaultType: "TEAM",
  },

  leehwigeun: {
    name: "이휘근",
    category: "ARTIST MUSIC PROFILE",
    defaultType: "ARTIST",
  },

  eluni: {
    name: "이루니",
    category: "PARTICIPATION PROFILE",
    defaultType: "PARTICIPATION",
  },

  leecherin: {
    name: "이체린",
    category: "PARTICIPATION PROFILE",
    defaultType: "PARTICIPATION",
  },
};

/* =========================
   음악 수정 폼 채우기
========================= */

function fillAdminMusicForm(item) {
  const profileKey =
    item.profileKey ||
    item.profile_key ||
    "";

  const profileSetting =
    ADMIN_MUSIC_PROFILES[
      profileKey
    ] || {};

  const coverUrl =
    item.coverUrl ||
    item.cover_url ||
    "";

  const artistName =
    item.artist ||
    item.artist_name ||
    profileSetting.name ||
    "";

  const cardType =
    item.type ||
    profileSetting.defaultType ||
    "ARTIST";

  const albumType =
    item.albumType ||
    item.album_type ||
    (
      profileKey === "onyour"
        ? "FULL ALBUM"
        : "SINGLE"
    );

  const youtubeUrl =
    item.youtubeUrl ||
    item.youtube_url ||
    "";

  const spotifyUrl =
    item.spotifyUrl ||
    item.spotify_url ||
    "";

  const appleUrl =
    item.appleUrl ||
    item.apple_url ||
    "";

  const melonUrl =
    item.melonUrl ||
    item.melon_url ||
    "";

  /*
   * 기존 단일 링크가 저장되어 있다면
   * 해당 플랫폼 입력칸으로 자동 이동
   */
  const legacyUrl =
    item.releaseUrl ||
    item.release_url ||
    "";

  let finalYoutubeUrl =
    youtubeUrl;

  let finalSpotifyUrl =
    spotifyUrl;

  let finalAppleUrl =
    appleUrl;

  let finalMelonUrl =
    melonUrl;

  if (legacyUrl) {
    const legacyPlatform =
      getLegacyMusicPlatform(
        legacyUrl
      );

    if (
      legacyPlatform ===
        "youtube" &&
      !finalYoutubeUrl
    ) {
      finalYoutubeUrl =
        legacyUrl;
    }

    if (
      legacyPlatform ===
        "spotify" &&
      !finalSpotifyUrl
    ) {
      finalSpotifyUrl =
        legacyUrl;
    }

    if (
      legacyPlatform ===
        "apple" &&
      !finalAppleUrl
    ) {
      finalAppleUrl =
        legacyUrl;
    }

    if (
      legacyPlatform ===
        "melon" &&
      !finalMelonUrl
    ) {
      finalMelonUrl =
        legacyUrl;
    }
  }

  setAdminFormValue(
    "adminMusicId",
    item.id || ""
  );

  setAdminFormValue(
    "adminMusicProfileKey",
    profileKey
  );

  setAdminFormValue(
    "adminMusicCoverUrl",
    coverUrl
  );

  setAdminFormValue(
    "adminMusicEditorName",
    artistName
  );

  setAdminFormValue(
    "adminMusicType",
    cardType
  );

  setAdminFormValue(
    "adminMusicAlbumType",
    albumType
  );

  setAdminFormValue(
    "adminMusicTitle",
    item.title || ""
  );

  setAdminFormValue(
    "adminMusicYoutubeUrl",
    finalYoutubeUrl
  );

  setAdminFormValue(
    "adminMusicSpotifyUrl",
    finalSpotifyUrl
  );

  setAdminFormValue(
    "adminMusicAppleUrl",
    finalAppleUrl
  );

  setAdminFormValue(
    "adminMusicMelonUrl",
    finalMelonUrl
  );

  setAdminFormValue(
    "adminMusicPublished",
    item.published !== false
  );

  const editorCategory =
    document.getElementById(
      "adminMusicEditorCategory"
    );

  if (editorCategory) {
    editorCategory.textContent =
      profileSetting.category ||
      "MUSIC PROFILE";
  }

  const formTitle =
    document.getElementById(
      "adminMusicFormTitle"
    );

  if (formTitle) {
    formTitle.textContent =
      `${artistName || "음원"} 정보 수정`;
  }

  const coverFileInput =
    document.getElementById(
      "adminMusicCoverFile"
    );

  if (coverFileInput) {
    coverFileInput.value = "";
  }

  const previewBox =
    document.getElementById(
      "adminMusicImagePreview"
    );

  const previewImage =
    document.getElementById(
      "adminMusicPreviewImage"
    );

  if (
    previewBox &&
    previewImage &&
    coverUrl
  ) {
    previewImage.src =
      coverUrl;

    previewImage.alt =
      `${artistName || "앨범"} 자켓 미리보기`;

    previewBox.hidden =
      false;
  } else if (
    previewBox &&
    previewImage
  ) {
    previewImage.removeAttribute(
      "src"
    );

    previewImage.alt =
      "앨범 자켓 미리보기";

    previewBox.hidden =
      true;
  }
}

/* =========================
   음악 프로필 수정 화면 열기
========================= */

function openAdminMusicProfileForm(
  profileKey
) {
  const item =
    adminStore.music.find(
      (musicItem) => {
        const itemProfileKey =
          musicItem.profileKey ||
          musicItem.profile_key ||
          musicItem.id;

        return (
          itemProfileKey ===
          profileKey
        );
      }
    );

  if (!item) {
    alert(
      "해당 음원 정보를 찾을 수 없습니다."
    );

    return;
  }

  resetAdminForm("music");

  fillAdminMusicForm(item);

  openAdminView("music-form");

  window.setTimeout(() => {
    document
      .getElementById(
        "adminMusicTitle"
      )
      ?.focus();
  }, 100);
}


/* =========================
   음악 프로필 카드 클릭
========================= */

document
  .getElementById(
    "adminMusicProfileGrid"
  )
  ?.addEventListener(
    "click",
    (event) => {
      const profileCard =
        event.target.closest(
          "[data-music-profile]"
        );

      if (!profileCard) {
        return;
      }

      const profileKey =
        profileCard.dataset
          .musicProfile;

      if (!profileKey) {
        return;
      }

      openAdminMusicProfileForm(
        profileKey
      );
    }
  );

function fillAdminMembersForm(item) {
  setAdminFormValue(
    "adminMemberId",
    item.id
  );
  setAdminFormValue(
    "adminMemberName",
    item.name
  );
  setAdminFormValue(
    "adminMemberEnglishName",
    item.englishName
  );
  setAdminFormValue(
    "adminMemberRole",
    item.role
  );
  setAdminFormValue(
    "adminMemberDescription",
    item.description
  );
  setAdminFormValue(
    "adminMemberInstagram",
    item.instagram
  );
  setAdminFormValue(
    "adminMemberOrder",
    item.order
  );
  setAdminFormValue(
    "adminMemberPublished",
    item.published
  );
}

function openAdminEditForm(
  sectionName,
  itemId
) {
  const item = getAdminItem(
    sectionName,
    itemId
  );

  if (!item) {
    alert(
      "수정할 항목을 찾을 수 없습니다."
    );
    return;
  }

  resetAdminForm(sectionName);
  setAdminFormTitle(
    sectionName,
    "edit"
  );

  const fillFunctions = {
    news: fillAdminNewsForm,
    performance:
      fillAdminPerformanceForm,
    video: fillAdminVideoForm,
    music: fillAdminMusicForm,
    members: fillAdminMembersForm,
  };

  fillFunctions[sectionName]?.(item);

  openAdminView(
    `${sectionName}-form`
  );
}


/* =========================
   EDIT / DELETE CLICK
   이벤트 위임 방식
========================= */

adminDashboard?.addEventListener(
  "click",
  (event) => {
    const actionButton =
      event.target.closest(
        "[data-action]"
      );

    if (!actionButton) return;

    const action =
      actionButton.dataset.action;

    const sectionName =
      actionButton.dataset.contentType;

    const itemId =
      actionButton.dataset.contentId;

    if (
      !action ||
      !sectionName ||
      !itemId
    ) {
      return;
    }

    if (action === "edit") {
      openAdminEditForm(
        sectionName,
        itemId
      );
      return;
    }

    if (action === "delete") {
      deleteAdminItem(
        sectionName,
        itemId
      );
    }
  }
);

async function deleteAdminItem(
  sectionName,
  itemId
) {
  const item = getAdminItem(
    sectionName,
    itemId
  );

  if (!item) return;

  const itemName =
    item.title ||
    item.name ||
    "이 항목";

  const confirmed = window.confirm(
    `"${itemName}"을(를) 삭제할까요?`
  );

  if (!confirmed) return;

  try {
    await adminApiRequest(
      `/api/content?type=${sectionName}&id=${encodeURIComponent(
        itemId
      )}`,
      {
        method: "DELETE",
      }
    );

    adminStore[sectionName] =
      adminStore[sectionName].filter(
        (entry) =>
          entry.id !== itemId
      );

    renderAllAdminLists();

    alert("삭제되었습니다.");
  } catch (error) {
    console.error(
      "콘텐츠 삭제 실패:",
      error
    );

    alert(
      error.message ||
        "삭제하지 못했습니다."
    );
  }
}


/* =========================
   FORM SUBMIT
========================= */

document
  .getElementById("adminNewsForm")
  ?.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const id = getAdminFormValue(
        "adminNewsId"
      );

      const data = {
        id: id || createAdminId("news"),
        category: getAdminFormValue(
          "adminNewsCategory"
        ),
        title: getAdminFormValue(
          "adminNewsTitle"
        ),
        date: getAdminFormValue(
          "adminNewsDate"
        ),
        description: getAdminFormValue(
          "adminNewsDescription"
        ),
        published: getAdminFormValue(
          "adminNewsPublished"
        ),
        featured: getAdminFormValue(
          "adminNewsFeatured"
        ),
      };

      saveAdminItem("news", data);
    }
  );

document
  .getElementById(
    "adminPerformanceForm"
  )
  ?.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const id = getAdminFormValue(
        "adminPerformanceId"
      );

      const data = {
        id:
          id ||
          createAdminId(
            "performance"
          ),
        title: getAdminFormValue(
          "adminPerformanceTitle"
        ),
        date: getAdminFormValue(
          "adminPerformanceDate"
        ),
        time: getAdminFormValue(
          "adminPerformanceTime"
        ),
        location: getAdminFormValue(
          "adminPerformanceLocation"
        ),
        address: getAdminFormValue(
          "adminPerformanceAddress"
        ),
        description:
          getAdminFormValue(
            "adminPerformanceDescription"
          ),
        setlist: getAdminFormValue(
          "adminPerformanceSetlist"
        ),
        ticketUrl: getAdminFormValue(
          "adminPerformanceTicketUrl"
        ),
        published: getAdminFormValue(
          "adminPerformancePublished"
        ),
      };

      saveAdminItem(
        "performance",
        data
      );
    }
  );

document
  .getElementById("adminVideoForm")
  ?.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const id = getAdminFormValue(
        "adminVideoId"
      );

      const data = {
        id: id || createAdminId("video"),
        title: getAdminFormValue(
          "adminVideoTitle"
        ),
        url: getAdminFormValue(
          "adminVideoUrl"
        ),
        description: getAdminFormValue(
          "adminVideoDescription"
        ),
        featured: getAdminFormValue(
          "adminVideoFeatured"
        ),
        published: getAdminFormValue(
          "adminVideoPublished"
        ),
      };

      saveAdminItem("video", data);
    }
  );

/* =========================
   MUSIC PROFILE FORM SUBMIT
========================= */

document
  .getElementById("adminMusicForm")
  ?.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      const form =
        event.currentTarget;

      const submitButton =
        form.querySelector(
          ".admin-form-submit"
        );

      const id =
        getAdminFormValue(
          "adminMusicId"
        );

      const profileKey =
        getAdminFormValue(
          "adminMusicProfileKey"
        );

      const profileSetting =
        ADMIN_MUSIC_PROFILES[
          profileKey
        ] || {};

      const existingItem =
        adminStore.music.find(
          (musicItem) => {
            const savedProfileKey =
              musicItem.profileKey ||
              musicItem.profile_key ||
              musicItem.id;

            return (
              savedProfileKey ===
              profileKey
            );
          }
        );

      const artist =
        getAdminFormValue(
          "adminMusicEditorName"
        ) ||
        existingItem?.artist ||
        existingItem?.artist_name ||
        profileSetting.name ||
        "";

      const albumType =
        getAdminFormValue(
          "adminMusicAlbumType"
        );

      const title =
        getAdminFormValue(
          "adminMusicTitle"
        );

      const imageInput =
        document.getElementById(
          "adminMusicCoverFile"
        );

      let coverUrl =
        getAdminFormValue(
          "adminMusicCoverUrl"
        );

      if (!profileKey) {
        alert(
          "음원 프로필 정보를 찾을 수 없습니다."
        );

        return;
      }

      if (!artist) {
        alert(
          "아티스트 또는 팀 이름을 입력해 주세요."
        );

        document
          .getElementById(
            "adminMusicEditorName"
          )
          ?.focus();

        return;
      }

      if (!albumType) {
        alert(
          "앨범 종류를 선택해 주세요."
        );

        document
          .getElementById(
            "adminMusicAlbumType"
          )
          ?.focus();

        return;
      }

      if (!title) {
        alert(
          "앨범명을 입력해 주세요."
        );

        document
          .getElementById(
            "adminMusicTitle"
          )
          ?.focus();

        return;
      }

      try {
        if (submitButton) {
          submitButton.disabled =
            true;

          submitButton.textContent =
            "저장 중...";
        }

        const selectedFile =
          imageInput?.files?.[0];

        if (selectedFile) {
          coverUrl =
            await uploadAdminImage(
              selectedFile,
              "music"
            );

          setAdminFormValue(
            "adminMusicCoverUrl",
            coverUrl
          );
        }

        const data = {
          id:
            id ||
            profileKey ||
            createAdminId("music"),

          profileKey,

          type:
            getAdminFormValue(
              "adminMusicType"
            ) ||
            profileSetting.defaultType ||
            "ARTIST",

          albumType,

          title,

          artist,

          coverUrl,

          youtubeUrl:
            getAdminFormValue(
              "adminMusicYoutubeUrl"
            ),

          spotifyUrl:
            getAdminFormValue(
              "adminMusicSpotifyUrl"
            ),

          appleUrl:
            getAdminFormValue(
              "adminMusicAppleUrl"
            ),

          melonUrl:
            getAdminFormValue(
              "adminMusicMelonUrl"
            ),

          published:
            getAdminFormValue(
              "adminMusicPublished"
            ),
        };

        await saveAdminItem(
          "music",
          data
        );

        await loadPublicMusic();
      } catch (error) {
        console.error(
          "음원 저장 실패:",
          error
        );

        alert(
          error.message ||
          "음원 정보를 저장하지 못했습니다."
        );
      } finally {
        if (submitButton) {
          submitButton.disabled =
            false;

          submitButton.textContent =
            "저장";
        }
      }
    }
  );


/* =========================
   SAVE ADD / EDIT
========================= */

async function saveAdminItem(
  sectionName,
  data
) {
  try {
    const existingItem =
      adminStore[sectionName]?.find(
        (item) => item.id === data.id
      );

    const isUpdate =
      Boolean(existingItem);

    const url = isUpdate
      ? `/api/content?type=${sectionName}&id=${encodeURIComponent(
          data.id
        )}`
      : `/api/content?type=${sectionName}`;

    const result =
      await adminApiRequest(url, {
        method: isUpdate
          ? "PUT"
          : "POST",
        body: JSON.stringify(data),
      });

    const savedItem = result.item;

    if (isUpdate) {
      const index =
        adminStore[
          sectionName
        ].findIndex(
          (item) =>
            item.id === savedItem.id
        );

      if (index >= 0) {
        adminStore[sectionName][index] =
          savedItem;
      }
    } else {
      adminStore[sectionName].unshift(
        savedItem
      );
    }

    renderAllAdminLists();
    openAdminView(sectionName);

    alert(
      isUpdate
        ? "수정되었습니다."
        : "등록되었습니다."
    );
  } catch (error) {
    console.error(
      "콘텐츠 저장 실패:",
      error
    );

    alert(
      error.message ||
        "저장하지 못했습니다."
    );
  }
}


/* =========================
   SETTINGS TEMPORARY SAVE
========================= */

document
  .getElementById("adminSettingsForm")
  ?.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      alert(
        "홈페이지 설정이 현재 화면에 임시 저장되었습니다.\n다음 단계에서 실제 홈페이지 및 D1과 연결합니다."
      );

      openAdminView("home");
    }
  );


/* =========================
   ADD FORM TITLE RESET
========================= */

document
  .querySelectorAll(
    "#adminDashboard [data-open-form]"
  )
  .forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        const sectionName =
          button.dataset.openForm;

        if (!sectionName) return;

        setAdminFormTitle(
          sectionName,
          "add"
        );
      }
    );
  });


/* =========================
   INITIAL RENDER
========================= */

renderAllAdminLists();

/* =========================
   IMAGE PREVIEW
========================= */

function connectImagePreview(
  inputId,
  previewBoxId,
  previewImageId
) {
  const input =
    document.getElementById(inputId);

  const previewBox =
    document.getElementById(previewBoxId);

  const previewImage =
    document.getElementById(previewImageId);

  if (
    !input ||
    !previewBox ||
    !previewImage
  ) {
    return;
  }

  input.addEventListener("change", () => {
    const file = input.files?.[0];

    if (!file) {
      previewBox.hidden = true;
      previewImage.removeAttribute("src");
      return;
    }

    if (!file.type.startsWith("image/")) {
      input.value = "";
      previewBox.hidden = true;

      alert("이미지 파일만 선택할 수 있습니다.");
      return;
    }

    const imageUrl =
      URL.createObjectURL(file);

    previewImage.src = imageUrl;
    previewBox.hidden = false;

    previewImage.onload = () => {
      URL.revokeObjectURL(imageUrl);
    };
  });
}

connectImagePreview(
  "adminMusicCoverFile",
  "adminMusicImagePreview",
  "adminMusicPreviewImage"
);

connectImagePreview(
  "adminMemberImage",
  "adminMemberImagePreview",
  "adminMemberPreviewImage"
);

connectImagePreview(
  "adminSettingHeroImage",
  "adminSettingHeroPreview",
  "adminSettingHeroPreviewImage"
);


/* =========================
   YOUTUBE PREVIEW
========================= */

function getYoutubeEmbedUrl(url) {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);

    let videoId = "";

    if (
      parsedUrl.hostname.includes(
        "youtu.be"
      )
    ) {
      videoId =
        parsedUrl.pathname
          .replace("/", "")
          .trim();
    }

    if (
      parsedUrl.hostname.includes(
        "youtube.com"
      )
    ) {
      if (
        parsedUrl.pathname === "/watch"
      ) {
        videoId =
          parsedUrl.searchParams.get("v") ||
          "";
      }

      if (
        parsedUrl.pathname.startsWith(
          "/shorts/"
        )
      ) {
        videoId =
          parsedUrl.pathname
            .split("/shorts/")[1]
            ?.split("/")[0] || "";
      }

      if (
        parsedUrl.pathname.startsWith(
          "/embed/"
        )
      ) {
        videoId =
          parsedUrl.pathname
            .split("/embed/")[1]
            ?.split("/")[0] || "";
      }
    }

    if (!videoId) return "";

    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return "";
  }
}

const adminVideoUrl =
  document.getElementById("adminVideoUrl");

const adminVideoPreview =
  document.getElementById(
    "adminVideoPreview"
  );

const adminVideoPreviewFrame =
  document.getElementById(
    "adminVideoPreviewFrame"
  );

adminVideoUrl?.addEventListener(
  "input",
  () => {
    const embedUrl =
      getYoutubeEmbedUrl(
        adminVideoUrl.value.trim()
      );

    if (
      !embedUrl ||
      !adminVideoPreview ||
      !adminVideoPreviewFrame
    ) {
      if (adminVideoPreview) {
        adminVideoPreview.hidden = true;
      }

      if (adminVideoPreviewFrame) {
        adminVideoPreviewFrame.src = "";
      }

      return;
    }

    adminVideoPreviewFrame.src =
      embedUrl;

    adminVideoPreview.hidden = false;
  }
);


/* =========================
   ESCAPE KEY
========================= */

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (
      adminLoginModal?.classList.contains(
        "is-open"
      )
    ) {
      closeAdminLogin();
      return;
    }

    if (
      adminDashboard?.classList.contains(
        "is-open"
      )
    ) {
      closeAdminDashboard();
    }
  }
);

/* =========================================================/* =========================================================
   FAN MESSAGES - D1 API CONNECTION
   - 메시지 목록 조회
   - 더보기
   - 실제 메시지 등록
========================================================= */

const FAN_MESSAGE_API_URL = "/api/messages";

const FAN_MESSAGE_CARD_RECENT_LIMIT = 3;
const FAN_MESSAGE_PINNED_LIMIT = 3;
const FAN_MESSAGE_FETCH_LIMIT = 50;

const fanMessageState = {
  isFormOpen: false,

  editingId: null,
  editingPassword: "",

  total: 0,
  isLoading: false,
  isExpanded: false,

  messages: new Map(),
  allMessages: [],
};



/* =========================================================
   팬 메시지 요소 가져오기
========================================================= */

function getFanMessageElements() {
  return {
    writeToggle: document.getElementById(
      "fanMessageWriteToggle"
    ),

    formWrap: document.getElementById(
      "fanMessageFormWrap"
    ),

    form: document.getElementById(
      "fanMessageForm"
    ),

    messageId: document.getElementById(
      "fanMessageId"
    ),

    nameInput: document.getElementById(
      "fanMessageName"
    ),

    passwordInput: document.getElementById(
      "fanMessagePassword"
    ),

    performanceSelect: document.getElementById(
      "fanMessagePerformance"
    ),

    contentInput: document.getElementById(
      "fanMessageContent"
    ),

    characterCount: document.getElementById(
      "fanMessageCharacterCount"
    ),

    photoInput: document.getElementById(
      "fanMessagePhoto"
    ),

    photoPicker: document.getElementById(
      "fanMessagePhotoPicker"
    ),

    photoPreview: document.getElementById(
      "fanMessagePhotoPreview"
    ),

    photoPreviewImage: document.getElementById(
      "fanMessagePhotoPreviewImage"
    ),

    photoRemoveButton: document.getElementById(
      "fanMessagePhotoRemove"
    ),

    photoName: document.getElementById(
      "fanMessagePhotoName"
    ),

    photoSize: document.getElementById(
      "fanMessagePhotoSize"
    ),

    cancelButton: document.getElementById(
      "fanMessageCancelButton"
    ),

    submitButton: document.getElementById(
      "fanMessageSubmitButton"
    ),

    formStatus: document.getElementById(
      "fanMessageFormStatus"
    ),

    messageList: document.getElementById(
      "fanMessageList"
    ),

    allSection: document.getElementById(
      "fanMessageAllSection"
    ),

    allList: document.getElementById(
      "fanMessageAllList"
    ),

    allCount: document.getElementById(
      "fanMessageAllCount"
    ),

    moreButton: document.getElementById(
      "fanMessageMoreButton"
    ),
  };
}

/* =========================================================
   팬 메시지 첨부 사진 설정
========================================================= */

const FAN_MESSAGE_PHOTO_MAX_SIZE =
  5 * 1024 * 1024;

const FAN_MESSAGE_PHOTO_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

let fanMessagePhotoPreviewUrl = "";


/* =========================================================
   파일 크기 표시
========================================================= */

function formatFanMessagePhotoSize(bytes) {
  const megabytes =
    Number(bytes) / 1024 / 1024;

  if (megabytes < 0.01) {
    return `${Math.ceil(bytes / 1024)} KB`;
  }

  return `${megabytes.toFixed(2)} MB`;
}

/* =========================================================
   사진 미리보기 주소 해제
========================================================= */

function revokeFanMessagePhotoPreviewUrl() {
  if (!fanMessagePhotoPreviewUrl) {
    return;
  }

  URL.revokeObjectURL(
    fanMessagePhotoPreviewUrl
  );

  fanMessagePhotoPreviewUrl = "";
}

/* =========================================================
   첨부 사진 초기화
========================================================= */

function resetFanMessagePhoto() {
  const elements =
    getFanMessageElements();

  revokeFanMessagePhotoPreviewUrl();

  if (elements.photoInput) {
    elements.photoInput.value = "";
  }

  if (elements.photoPreviewImage) {
    elements.photoPreviewImage.removeAttribute(
      "src"
    );
  }

  if (elements.photoName) {
    elements.photoName.textContent =
      "선택된 사진";
  }

  if (elements.photoSize) {
    elements.photoSize.textContent =
      "0 MB";
  }

  if (elements.photoPreview) {
    elements.photoPreview.hidden = true;
  }

  if (elements.photoPicker) {
    elements.photoPicker.hidden = false;
  }
}

/* =========================================================
   현재 선택된 팬 메시지 사진 가져오기
========================================================= */

function getSelectedFanMessagePhotoFile() {
  const elements = getFanMessageElements();

  const selectedFile =
    elements.photoInput?.files?.[0] || null;

  if (!selectedFile) {
    return null;
  }

  if (!FAN_MESSAGE_PHOTO_TYPES.has(selectedFile.type)) {
    throw new Error(
      "JPG, PNG, WEBP 사진만 첨부할 수 있습니다."
    );
  }

  if (selectedFile.size > FAN_MESSAGE_PHOTO_MAX_SIZE) {
    throw new Error(
      "사진은 최대 5MB까지 첨부할 수 있습니다."
    );
  }

  return selectedFile;
}

/* =========================================================
   팬 메시지 사진 업로드
========================================================= */

async function uploadFanMessagePhoto(file) {
  if (!file) {
    return {
      photoUrl: "",
      photoKey: "",
    };
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "/api/fan-message-photo",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    }
  );

  const result =
    await parseFanMessageApiResponse(response);

  return {
    photoUrl:
      result.photoUrl ||
      result.photo_url ||
      result.file?.url ||
      "",
    photoKey:
      result.photoKey ||
      result.photo_key ||
      result.file?.key ||
      "",
  };
}


/* =========================================================
   첨부 사진 선택
========================================================= */

function handleFanMessagePhotoChange(
  event
) {
  const elements = getFanMessageElements();

  const selectedFile =
    event.target.files?.[0];

  if (!selectedFile) {
    resetFanMessagePhoto();
    return;
  }

  if (
    !FAN_MESSAGE_PHOTO_TYPES.has(
      selectedFile.type
    )
  ) {
    resetFanMessagePhoto();

    alert(
      "JPG, PNG, WEBP 사진만 첨부할 수 있습니다."
    );

    return;
  }

  if (
    selectedFile.size >
    FAN_MESSAGE_PHOTO_MAX_SIZE
  ) {
    resetFanMessagePhoto();

    alert(
      "사진은 최대 5MB까지 첨부할 수 있습니다."
    );

    return;
  }

  revokeFanMessagePhotoPreviewUrl();

  fanMessagePhotoPreviewUrl =
    URL.createObjectURL(
      selectedFile
    );

  if (elements.photoPreviewImage) {
    elements.photoPreviewImage.src =
      fanMessagePhotoPreviewUrl;
  }

  if (elements.photoName) {
    elements.photoName.textContent =
      selectedFile.name;
  }

  if (elements.photoSize) {
    elements.photoSize.textContent =
      formatFanMessagePhotoSize(
        selectedFile.size
      );
  }

  if (elements.photoPicker) {
    elements.photoPicker.hidden = true;
  }

  if (elements.photoPreview) {
    elements.photoPreview.hidden = false;
  }
}

/* =========================================================
   작성창 열기
========================================================= */

function openFanMessageForm() {
  const elements = getFanMessageElements();

  if (
    !elements.formWrap ||
    !elements.writeToggle
  ) {
    return;
  }

  fanMessageState.isFormOpen = true;

  elements.formWrap.hidden = false;

  elements.writeToggle.setAttribute(
    "aria-expanded",
    "true"
  );

  elements.writeToggle.textContent =
    "작성창 닫기";

  setFanMessageFormStatus("");

  requestAnimationFrame(() => {
    elements.formWrap.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  });

  window.setTimeout(() => {
    elements.nameInput?.focus();
  }, 250);
}


/* =========================================================
   작성창 닫기
========================================================= */

function closeFanMessageForm({
  reset = true,
} = {}) {
  const elements = getFanMessageElements();

  if (
    !elements.formWrap ||
    !elements.writeToggle
  ) {
    return;
  }

  fanMessageState.isFormOpen = false;
  fanMessageState.editingId = null;

  elements.formWrap.hidden = true;

  elements.writeToggle.setAttribute(
    "aria-expanded",
    "false"
  );

  elements.writeToggle.textContent =
    "메시지 남기기";

  if (reset) {
    resetFanMessageForm();
  }
}


/* =========================================================
   작성창 열기/닫기
========================================================= */

function toggleFanMessageForm() {
  if (fanMessageState.isFormOpen) {
    closeFanMessageForm();
    return;
  }

  openFanMessageForm();
}


/* =========================================================
   팬 메시지 폼 초기화
========================================================= */

function resetFanMessageForm() {
  const elements = getFanMessageElements();

  elements.form?.reset();

  if (elements.messageId) {
    elements.messageId.value = "";
  }

  if (elements.characterCount) {
    elements.characterCount.textContent =
      "0";
  }

  resetFanMessagePhoto();

  if (elements.submitButton) {
    elements.submitButton.disabled = false;
    elements.submitButton.textContent =
      "등록";
  }

  if (elements.formStatus) {
    elements.formStatus.textContent = "";

    delete elements.formStatus.dataset
      .statusType;
  }

  fanMessageState.editingId = null;
  fanMessageState.editingPassword = "";
}

/* =========================================================
   글자 수 표시
========================================================= */

function updateFanMessageCharacterCount() {
  const elements = getFanMessageElements();

  if (
    !elements.contentInput ||
    !elements.characterCount
  ) {
    return;
  }

  elements.characterCount.textContent =
    String(
      elements.contentInput.value.length
    );
}

/* =========================================================
   팬 메시지 폼 입력값
========================================================= */

function getFanMessageFormData() {
  const elements =
    getFanMessageElements();

  const nickname =
    elements.nameInput?.value.trim() ||
    "";

  const password =
    elements.passwordInput?.value ||
    "";

  const performance =
    elements.performanceSelect?.value.trim() ||
    "";

  const message =
    elements.contentInput?.value.trim() ||
    "";

  if (!nickname) {
    throw new Error(
      "이름 또는 닉네임을 입력해 주세요."
    );
  }

  if (nickname.length > 20) {
    throw new Error(
      "닉네임은 20자 이하로 입력해 주세요."
    );
  }

  if (password.length < 4) {
    throw new Error(
      "비밀번호는 4자 이상 입력해 주세요."
    );
  }

  if (password.length > 20) {
    throw new Error(
      "비밀번호는 20자 이하로 입력해 주세요."
    );
  }

  if (performance.length > 100) {
    throw new Error(
      "공연명은 100자 이하로 입력해 주세요."
    );
  }

  if (!message) {
    throw new Error(
      "메시지를 입력해 주세요."
    );
  }

  if (message.length > 300) {
    throw new Error(
      "메시지는 300자 이하로 입력해 주세요."
    );
  }

  return {
    nickname,
    password,
    performance,
    message,
  };
}


/* =========================================================
   HTML 특수문자 처리
========================================================= */

function escapeFanMessageHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =========================================================
   날짜 표시
========================================================= */

function formatFanMessageDate(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}.${month}.${day}`;
}


async function updateFanMessage(
  messageId,
  messageData
) {
  const response = await fetch(
    FAN_MESSAGE_API_URL,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",

        Accept:
          "application/json",
      },

      body: JSON.stringify({
        id: messageId,
        ...messageData,
      }),
    }
  );

  return parseFanMessageApiResponse(
    response
  );
}

/* =========================================================
   아바타 글자
========================================================= */

function createFanMessageAvatarText(name) {
  const cleanName =
    String(name || "").trim();

  if (!cleanName) {
    return "♡";
  }

  return cleanName
    .slice(0, 1)
    .toUpperCase();
}


/* =========================================================
   팬 메시지 기본 카드 HTML
========================================================= */

function createFanMessageCardHtml(messageData) {
  const id = escapeFanMessageHtml(
    messageData.id
  );

  const name = escapeFanMessageHtml(
    messageData.nickname ||
    messageData.name ||
    "익명"
  );

  const performance =
    escapeFanMessageHtml(
      messageData.performance ||
      "ONYOUR 응원 메시지"
    );

  const message =
    escapeFanMessageHtml(
      messageData.message || ""
    );

  const photoUrl =
    escapeFanMessageHtml(
      messageData.photoUrl ||
      messageData.photo_url ||
      ""
    );

  const createdAt =
    messageData.createdAt ||
    messageData.created_at ||
    "";

  const formattedDate =
    formatFanMessageDate(createdAt);

  const avatar =
    escapeFanMessageHtml(
      createFanMessageAvatarText(name)
    );

  const pinnedHtml =
    isFanMessagePinned(messageData)
      ? `
        <span class="fan-message-pinned">
          ONYOUR PICK
        </span>
      `
      : "";

  const newBadgeHtml =
    createFanMessageNewBadgeHtml(
      messageData
    );

  const photoHtml =
    photoUrl
      ? `
        <button
          class="fan-message-card-photo"
          type="button"
          data-fan-photo-url="${photoUrl}"
          aria-label="첨부 사진 크게 보기"
        >
          <img
            src="${photoUrl}"
            alt="${name}님의 첨부 사진"
            loading="lazy"
          />
        </button>
      `
      : "";

  return `
    <article
      class="fan-message-card"
      data-fan-message-id="${id}"
    >
      <div class="fan-message-card-header">
        <div class="fan-message-user">
          <span
            class="fan-message-avatar"
            aria-hidden="true"
          >
            ${avatar}
          </span>

          <div class="fan-message-user-info">
            <div class="fan-message-name-row">
              <strong>
                ${name}
              </strong>

              ${newBadgeHtml}
            </div>

            <span class="fan-message-performance">
              ${performance}
            </span>
          </div>
        </div>

        <time
          datetime="${escapeFanMessageHtml(
            createdAt
          )}"
        >
          ${formattedDate}
        </time>
      </div>

      ${pinnedHtml}

      <p class="fan-message-card-content">
        ${message}
      </p>

      ${photoHtml}

      <div class="fan-message-card-actions">
        <button
          type="button"
          data-fan-message-action="manage"
          data-fan-message-id="${id}"
        >
          관리
        </button>
      </div>
    </article>
  `;
}

/* =========================================================
   고정 메시지 여부
========================================================= */

function isFanMessagePinned(messageData) {
  return (
    messageData.isPinned === true ||
    messageData.is_pinned === true ||
    Number(messageData.isPinned) === 1 ||
    Number(messageData.is_pinned) === 1
  );
}


/* =========================================================
   메시지 작성 시각
========================================================= */

function getFanMessageTimestamp(messageData) {
  const rawDate =
    messageData.createdAt ||
    messageData.created_at ||
    "";

  const timestamp =
    new Date(rawDate).getTime();

  return Number.isFinite(timestamp)
    ? timestamp
    : 0;
}

/* =========================================================
   새 메시지 여부
   등록 후 24시간 이내
========================================================= */

function isFanMessageNew(messageData) {
  const createdTimestamp =
    getFanMessageTimestamp(messageData);

  if (!createdTimestamp) {
    return false;
  }

  const currentTimestamp = Date.now();

  const elapsedTime =
    currentTimestamp - createdTimestamp;

  const oneDay =
    24 * 60 * 60 * 1000;

  return (
    elapsedTime >= 0 &&
    elapsedTime < oneDay
  );
}


/* =========================================================
   NEW 배지 HTML
========================================================= */

function createFanMessageNewBadgeHtml(
  messageData
) {
  if (!isFanMessageNew(messageData)) {
    return "";
  }

  return `
    <span class="fan-message-new-badge">
      NEW
    </span>
  `;
}

/* =========================================================
   기본 카드에 표시할 메시지 선택
   고정 최대 3개 + 최근 일반글 3개
========================================================= */

function getFanMessageCardItems() {
  const sortedMessages =
    [...fanMessageState.allMessages]
      .sort(
        (first, second) =>
          getFanMessageTimestamp(second) -
          getFanMessageTimestamp(first)
      );

  const pinnedMessages =
    sortedMessages
      .filter(isFanMessagePinned)
      .slice(
        0,
        FAN_MESSAGE_PINNED_LIMIT
      );

  const pinnedIds =
    new Set(
      pinnedMessages.map(
        (messageItem) =>
          String(messageItem.id)
      )
    );

  const recentMessages =
    sortedMessages
      .filter(
        (messageItem) =>
          !pinnedIds.has(
            String(messageItem.id)
          )
      )
      .slice(
        0,
        FAN_MESSAGE_CARD_RECENT_LIMIT
      );

  return [
    ...pinnedMessages,
    ...recentMessages,
  ];
}


/* =========================================================
   전체 메시지 한 줄 리스트 HTML
========================================================= */

function createFanMessageListItemHtml(
  messageData
) {
  const id = escapeFanMessageHtml(
    messageData.id
  );

  const name = escapeFanMessageHtml(
    messageData.nickname ||
    messageData.name ||
    "익명"
  );

  const performance =
    escapeFanMessageHtml(
      messageData.performance ||
      "ONYOUR 응원 메시지"
    );

  const message =
    escapeFanMessageHtml(
      messageData.message || ""
    );

  const photoUrl =
    escapeFanMessageHtml(
      messageData.photoUrl ||
      messageData.photo_url ||
      ""
    );

  const createdAt =
    messageData.createdAt ||
    messageData.created_at ||
    "";

  const formattedDate =
    formatFanMessageDate(createdAt);

  const pinnedLabel =
    isFanMessagePinned(messageData)
      ? `
        <span class="fan-message-list-pinned">
          ONYOUR PICK
        </span>
      `
      : "";

  const newBadgeHtml =
    createFanMessageNewBadgeHtml(
      messageData
    );

  const photoHtml =
    photoUrl
      ? `
        <button
          class="fan-message-list-photo"
          type="button"
          data-fan-photo-url="${photoUrl}"
          aria-label="첨부 사진 크게 보기"
        >
          사진 보기
        </button>
      `
      : "";

  return `
    <article
      class="fan-message-list-item"
      data-fan-message-id="${id}"
    >
      <div class="fan-message-list-main">
        <div class="fan-message-list-meta">
          ${pinnedLabel}

          <strong class="fan-message-list-name">
            ${name}
          </strong>

          ${newBadgeHtml}

          <span class="fan-message-list-performance">
            ${performance}
          </span>
        </div>

        <p class="fan-message-list-content">
          ${message}
        </p>

        ${photoHtml}
      </div>

      <div class="fan-message-list-side">
        <time
          datetime="${escapeFanMessageHtml(
            createdAt
          )}"
        >
          ${formattedDate}
        </time>

        <button
          type="button"
          data-fan-message-action="manage"
          data-fan-message-id="${id}"
        >
          관리
        </button>
      </div>
    </article>
  `;
}

/* =========================================================
   로딩 문구
========================================================= */

function showFanMessageLoading() {
  const elements = getFanMessageElements();

  if (elements.messageList) {
    elements.messageList.innerHTML = `
      <div class="fan-message-empty">
        메시지를 불러오는 중입니다.
      </div>
    `;
  }

  if (elements.allList) {
    elements.allList.innerHTML = "";
  }
}


/* =========================================================
   빈 목록 문구
========================================================= */

function showFanMessageEmpty() {
  const elements = getFanMessageElements();

  if (!elements.messageList) {
    return;
  }

  elements.messageList.innerHTML = `
    <div class="fan-message-empty">
      아직 등록된 메시지가 없습니다.<br />
      ONYOUR에게 첫 메시지를 남겨주세요.
    </div>
  `;
}


/* =========================================================
   오류 문구
========================================================= */

function showFanMessageLoadError(message) {
  const elements = getFanMessageElements();

  if (!elements.messageList) {
    return;
  }

  elements.messageList.innerHTML = `
    <div class="fan-message-empty">
      ${escapeFanMessageHtml(message)}
    </div>
  `;
}


/* =========================================================
   기본 카드 목록 렌더링
========================================================= */

function renderFanMessageCards() {
  const elements = getFanMessageElements();

  if (!elements.messageList) {
    return;
  }

  const cardItems =
    getFanMessageCardItems();

  if (cardItems.length === 0) {
    showFanMessageEmpty();
    return;
  }

  elements.messageList.innerHTML =
    cardItems
      .map(createFanMessageCardHtml)
      .join("");
}


/* =========================================================
   전체 한 줄 목록 렌더링
========================================================= */

function renderFanMessageAllList() {
  const elements = getFanMessageElements();

  if (
    !elements.allSection ||
    !elements.allList
  ) {
    return;
  }

  const sortedMessages =
    [...fanMessageState.allMessages]
      .sort((first, second) => {
        const pinnedDifference =
          Number(isFanMessagePinned(second)) -
          Number(isFanMessagePinned(first));

        if (pinnedDifference !== 0) {
          return pinnedDifference;
        }

        return (
          getFanMessageTimestamp(second) -
          getFanMessageTimestamp(first)
        );
      });

  elements.allList.innerHTML =
    sortedMessages
      .map(createFanMessageListItemHtml)
      .join("");

  if (elements.allCount) {
    elements.allCount.textContent =
      `총 ${fanMessageState.total}개의 메시지`;
  }
}


/* =========================================================
   전체 목록 열기·닫기
========================================================= */

function updateFanMessageExpandedView() {
  const elements = getFanMessageElements();

  if (
    !elements.allSection ||
    !elements.moreButton
  ) {
    return;
  }

  elements.allSection.hidden =
    !fanMessageState.isExpanded;

  elements.moreButton.setAttribute(
    "aria-expanded",
    fanMessageState.isExpanded
      ? "true"
      : "false"
  );

  elements.moreButton.textContent =
    fanMessageState.isExpanded
      ? "접기"
      : "더 많은 메시지 보기";
}


/* =========================================================
   더보기 버튼 상태
========================================================= */

function updateFanMessageMoreButton() {
  const elements = getFanMessageElements();

  if (!elements.moreButton) {
    return;
  }

  const shouldShow =
    fanMessageState.total >
    getFanMessageCardItems().length;

  elements.moreButton.hidden =
    !shouldShow;

  elements.moreButton.disabled =
    fanMessageState.isLoading;

  if (fanMessageState.isLoading) {
    elements.moreButton.textContent =
      "불러오는 중...";
    return;
  }

  updateFanMessageExpandedView();
}


/* =========================================================
   더보기·접기 처리
========================================================= */

function toggleFanMessageAllList() {
  const elements = getFanMessageElements();

  if (
    fanMessageState.isLoading ||
    !elements.allSection
  ) {
    return;
  }

  fanMessageState.isExpanded =
    !fanMessageState.isExpanded;

  updateFanMessageExpandedView();

  if (fanMessageState.isExpanded) {
    renderFanMessageAllList();

    window.requestAnimationFrame(() => {
      elements.allSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return;
  }

  document
    .getElementById("fanMessageCardSection")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
}


/* =========================================================
   API 응답 처리
========================================================= */

async function parseFanMessageApiResponse(
  response
) {
  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      "서버 응답을 읽을 수 없습니다."
    );
  }

  if (
    !response.ok ||
    result.success === false
  ) {
    throw new Error(
      result.message ||
      "요청을 처리하지 못했습니다."
    );
  }

  return result;
}


/* =========================================================
   전체 메시지 불러오기
========================================================= */

async function loadFanMessages({
  reset = true,
} = {}) {
  const elements = getFanMessageElements();

  if (
    !elements.messageList ||
    fanMessageState.isLoading
  ) {
    return;
  }

  fanMessageState.isLoading = true;

  if (reset) {
    fanMessageState.total = 0;
    fanMessageState.isExpanded = false;
    fanMessageState.messages.clear();
    fanMessageState.allMessages = [];

    showFanMessageLoading();

    if (elements.allSection) {
      elements.allSection.hidden = true;
    }
  }

  updateFanMessageMoreButton();

  try {
    let offset = 0;
    let hasMore = true;
    let total = 0;

    const loadedMessages = [];

    while (hasMore) {
      const requestUrl =
        `${FAN_MESSAGE_API_URL}` +
        `?limit=${FAN_MESSAGE_FETCH_LIMIT}` +
        `&offset=${offset}`;

      const response = await fetch(
        requestUrl,
        {
          method: "GET",

          headers: {
            Accept: "application/json",
          },

          cache: "no-store",
        }
      );

      const result =
        await parseFanMessageApiResponse(
          response
        );

      const pageMessages =
        Array.isArray(result.messages)
          ? result.messages
          : [];

      const pagination =
        result.pagination || {};

      loadedMessages.push(
        ...pageMessages
      );

      offset += pageMessages.length;

      total =
        Number(pagination.total) ||
        loadedMessages.length;

      hasMore =
        Boolean(pagination.hasMore) &&
        pageMessages.length > 0;

      if (offset >= total) {
        hasMore = false;
      }
    }

    fanMessageState.allMessages =
      loadedMessages;

    fanMessageState.total =
      total;

    fanMessageState.messages.clear();

    loadedMessages.forEach(
      (messageItem) => {
        fanMessageState.messages.set(
          String(messageItem.id),
          messageItem
        );
      }
    );

    renderFanMessageCards();
    renderFanMessageAllList();
  } catch (error) {
    console.error(
      "Fan Messages 불러오기 실패:",
      error
    );

    showFanMessageLoadError(
      error.message ||
      "메시지를 불러오지 못했습니다."
    );
  } finally {
    fanMessageState.isLoading = false;
    updateFanMessageMoreButton();
  }
}


/* =========================================================
   새 메시지 실제 등록
========================================================= */

async function createFanMessage(messageData) {
  const response = await fetch(
    FAN_MESSAGE_API_URL,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Accept:
          "application/json",
      },

      body: JSON.stringify(
        messageData
      ),
    }
  );

  return parseFanMessageApiResponse(
    response
  );
}


/* =========================================================
   폼 상태 문구
========================================================= */

function setFanMessageFormStatus(
  message,
  type = "normal"
) {
  const elements = getFanMessageElements();

  if (!elements.formStatus) {
    return;
  }

  elements.formStatus.textContent =
    message;

  elements.formStatus.dataset.statusType =
    type;
}


/* =========================================================
   팬 메시지 폼 제출
   사진 업로드 후 메시지 등록·수정
========================================================= */

async function handleFanMessageSubmit(
  event
) {
  event.preventDefault();

  const elements =
    getFanMessageElements();

  if (
    !elements.form ||
    !elements.submitButton
  ) {
    return;
  }

  const isEditing =
    Boolean(
      fanMessageState.editingId
    );

  try {
    const messageData =
      getFanMessageFormData();

    if (
      isEditing &&
      fanMessageState.editingPassword
    ) {
      messageData.password =
        fanMessageState.editingPassword;
    }

    const selectedPhoto =
      getSelectedFanMessagePhotoFile();

    elements.submitButton.disabled =
      true;

    elements.submitButton.textContent =
      selectedPhoto
        ? "사진 업로드 중..."
        : isEditing
          ? "수정 중..."
          : "등록 중...";

    setFanMessageFormStatus(
      selectedPhoto
        ? "첨부한 사진을 업로드하고 있습니다."
        : isEditing
          ? "메시지를 수정하고 있습니다."
          : "메시지를 등록하고 있습니다."
    );

    /*
     * 사진이 선택된 경우에만
     * R2 업로드 API를 먼저 호출한다.
     */
    if (selectedPhoto) {
      const uploadedPhoto =
        await uploadFanMessagePhoto(
          selectedPhoto
        );

      messageData.photoUrl =
        uploadedPhoto.photoUrl;

      messageData.photoKey =
        uploadedPhoto.photoKey;

      elements.submitButton.textContent =
        isEditing
          ? "메시지 수정 중..."
          : "메시지 등록 중...";

      setFanMessageFormStatus(
        isEditing
          ? "사진 업로드가 완료되었습니다. 메시지를 수정하고 있습니다."
          : "사진 업로드가 완료되었습니다. 메시지를 등록하고 있습니다."
      );
    }

    if (isEditing) {
      await updateFanMessage(
        fanMessageState.editingId,
        messageData
      );
    } else {
      await createFanMessage(
        messageData
      );
    }

    setFanMessageFormStatus(
      isEditing
        ? "메시지가 수정되었습니다."
        : "메시지가 등록되었습니다.",
      "success"
    );

    /*
     * 미리보기 URL과 파일 입력까지
     * 함께 초기화한다.
     */
    resetFanMessagePhoto();

    elements.form.reset();

    fanMessageState.editingId =
      null;

    fanMessageState.editingPassword =
      "";

    updateFanMessageCharacterCount();

    await loadFanMessages({
      reset: true,
    });

    window.setTimeout(() => {
      closeFanMessageForm();
    }, 700);
  } catch (error) {
    console.error(
      isEditing
        ? "Fan Message 수정 실패:"
        : "Fan Message 등록 실패:",
      error
    );

    setFanMessageFormStatus(
      error.message ||
      (
        isEditing
          ? "메시지를 수정하지 못했습니다."
          : "메시지를 등록하지 못했습니다."
      ),
      "error"
    );
  } finally {
    elements.submitButton.disabled =
      false;

    elements.submitButton.textContent =
      isEditing
        ? "수정"
        : "등록";
  }
}

/* =========================================================
   메시지 삭제 API
========================================================= */

async function deleteFanMessage(
  id,
  password
) {
  const response = await fetch(
    FAN_MESSAGE_API_URL,
    {
      method: "DELETE",

      headers: {
        "Content-Type":
          "application/json",

        Accept:
          "application/json",
      },

      body: JSON.stringify({
        id,
        password,
      }),
    }
  );

  return parseFanMessageApiResponse(
    response
  );
}


/* =========================================================
   메시지 관리 팝업 닫기
========================================================= */

function closeFanMessageManageModal() {
  const modal =
    document.getElementById(
      "fanMessageManageModal"
    );

  if (!modal) {
    return;
  }

  modal.remove();

  document.body.style.overflow = "";
}


/* =========================================================
   메시지 관리 팝업 열기
========================================================= */

function openFanMessageEditForm(
  messageId,
  password
) {
  const elements =
    getFanMessageElements();

  const messageData =
    fanMessageState.messages.get(
      String(messageId)
    );

  if (!messageData) {
    alert(
      "수정할 메시지 정보를 찾을 수 없습니다."
    );

    return;
  }

  fanMessageState.editingId =
    String(messageId);

  fanMessageState.editingPassword =
    password;

  if (elements.messageId) {
    elements.messageId.value =
      String(messageId);
  }

  if (elements.nameInput) {
    elements.nameInput.value =
      messageData.nickname ||
      messageData.name ||
      "";
  }

  if (elements.passwordInput) {
    elements.passwordInput.value =
      password;
  }

  if (elements.performanceSelect) {
    elements.performanceSelect.value =
      messageData.performance || "";
  }

  if (elements.contentInput) {
    elements.contentInput.value =
      messageData.message || "";
  }

  const rating =
    Number(messageData.rating) || 0;

  const ratingInput =
    document.querySelector(
      `input[name="rating"][value="${rating}"]`
    );

  if (ratingInput) {
    ratingInput.checked = true;
  }

  openFanMessageForm();

  fanMessageState.editingId =
    String(messageId);

  fanMessageState.editingPassword =
    password;

  if (elements.submitButton) {
    elements.submitButton.textContent =
      "수정";
  }

  updateFanMessageCharacterCount();

  closeFanMessageManageModal();

  window.setTimeout(() => {
    elements.contentInput?.focus();

    elements.formWrap?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 100);
}

function openFanMessageManageModal(
  messageId
) {
  closeFanMessageManageModal();

  const modal =
    document.createElement("div");

  modal.id =
    "fanMessageManageModal";

  modal.className =
    "fan-message-manage-modal";

  modal.innerHTML = `
    <div
      class="fan-message-manage-backdrop"
      data-fan-manage-close
    ></div>

    <div
      class="fan-message-manage-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fanMessageManageTitle"
    >
      <button
        type="button"
        class="fan-message-manage-close"
        data-fan-manage-close
        aria-label="닫기"
      >
        ×
      </button>

      <div class="fan-message-manage-heading">
        <p>Fan Message</p>

        <h3 id="fanMessageManageTitle">
          메시지 관리
        </h3>

        <span>
          작성할 때 입력한 비밀번호를 입력해 주세요.
        </span>
      </div>

      <label class="fan-message-manage-field">
        <span>비밀번호</span>

        <input
          id="fanMessageManagePassword"
          type="password"
          maxlength="20"
          autocomplete="current-password"
          placeholder="비밀번호 입력"
        />
      </label>

      <p
        class="fan-message-manage-status"
        id="fanMessageManageStatus"
        aria-live="polite"
      ></p>

      <div class="fan-message-manage-actions">
        <button
          type="button"
          class="fan-message-manage-edit"
          data-fan-manage-action="edit"
        >
          수정
        </button>

        <button
          type="button"
          class="fan-message-manage-delete"
          data-fan-manage-action="delete"
        >
          삭제
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.body.style.overflow =
    "hidden";

  const passwordInput =
    modal.querySelector(
      "#fanMessageManagePassword"
    );

  const statusElement =
    modal.querySelector(
      "#fanMessageManageStatus"
    );

  const editButton =
    modal.querySelector(
      '[data-fan-manage-action="edit"]'
    );

  const deleteButton =
    modal.querySelector(
      '[data-fan-manage-action="delete"]'
    );

  modal
    .querySelectorAll(
      "[data-fan-manage-close]"
    )
    .forEach((closeButton) => {
      closeButton.addEventListener(
        "click",
        closeFanMessageManageModal
      );
    });

editButton?.addEventListener(
  "click",
  () => {
    const password =
      passwordInput?.value || "";

    if (!password.trim()) {
      if (statusElement) {
        statusElement.textContent =
          "비밀번호를 입력해 주세요.";

        statusElement.dataset.statusType =
          "error";
      }

      passwordInput?.focus();
      return;
    }

    openFanMessageEditForm(
      messageId,
      password
    );
  }
);

  deleteButton?.addEventListener(
    "click",
    async () => {
      const password =
        passwordInput?.value || "";

      if (!password.trim()) {
        if (statusElement) {
          statusElement.textContent =
            "비밀번호를 입력해 주세요.";

          statusElement.dataset.statusType =
            "error";
        }

        passwordInput?.focus();
        return;
      }

      const confirmed =
        window.confirm(
          "이 메시지를 삭제할까요?"
        );

      if (!confirmed) {
        return;
      }

      try {
        deleteButton.disabled = true;

        if (editButton) {
          editButton.disabled = true;
        }

        deleteButton.textContent =
          "삭제 중";

        if (statusElement) {
          statusElement.textContent =
            "메시지를 삭제하고 있습니다.";

          statusElement.dataset.statusType =
            "normal";
        }

        const result =
          await deleteFanMessage(
            messageId,
            password
          );

        await loadFanMessages({
          reset: true,
        });

        closeFanMessageManageModal();

        alert(
          result.message ||
          "메시지가 삭제되었습니다."
        );
      } catch (error) {
        console.error(
          "Fan Message 삭제 실패:",
          error
        );

        if (statusElement) {
          statusElement.textContent =
            error.message ||
            "메시지를 삭제하지 못했습니다.";

          statusElement.dataset.statusType =
            "error";
        }

        deleteButton.disabled = false;
        deleteButton.textContent =
          "삭제";

        if (editButton) {
          editButton.disabled = false;
        }
      }
    }
  );

  window.setTimeout(() => {
    passwordInput?.focus();
  }, 50);
}

/* =========================================================
   팬 메시지 사진 팝업 닫기
========================================================= */

function closeFanPhotoLightbox() {
  const lightbox =
    document.getElementById(
      "fanPhotoLightbox"
    );

  if (!lightbox) {
    return;
  }

  lightbox.classList.remove(
    "is-open"
  );

  lightbox.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "fan-photo-lightbox-open"
  );

  window.setTimeout(() => {
    lightbox.remove();
  }, 240);
}


/* =========================================================
   팬 메시지 사진 팝업 열기
========================================================= */

function openFanPhotoLightbox(
  photoUrl,
  photoAlt = "첨부 사진"
) {
  const cleanPhotoUrl =
    String(photoUrl || "").trim();

  if (!cleanPhotoUrl) {
    return;
  }

  closeFanPhotoLightbox();

  const lightbox =
    document.createElement("div");

  lightbox.id =
    "fanPhotoLightbox";

  lightbox.className =
    "fan-photo-lightbox";

  lightbox.setAttribute(
    "role",
    "dialog"
  );

  lightbox.setAttribute(
    "aria-modal",
    "true"
  );

  lightbox.setAttribute(
    "aria-hidden",
    "true"
  );

  lightbox.setAttribute(
    "aria-label",
    "첨부 사진 크게 보기"
  );

  lightbox.innerHTML = `
    <button
      class="fan-photo-lightbox-backdrop"
      type="button"
      data-fan-photo-close
      aria-label="사진 팝업 닫기"
    ></button>

    <div
      class="fan-photo-lightbox-panel"
      role="document"
    >
      <img
        class="fan-photo-lightbox-image"
        src="${escapeFanMessageHtml(
          cleanPhotoUrl
        )}"
        alt="${escapeFanMessageHtml(
          photoAlt
        )}"
      />

      <button
        class="fan-photo-lightbox-close"
        type="button"
        data-fan-photo-close
        aria-label="사진 팝업 닫기"
      >
        ×
      </button>
    </div>
  `;

  document.body.appendChild(
    lightbox
  );

  document.body.classList.add(
    "fan-photo-lightbox-open"
  );

  lightbox
    .querySelectorAll(
      "[data-fan-photo-close]"
    )
    .forEach((closeButton) => {
      closeButton.addEventListener(
        "click",
        closeFanPhotoLightbox
      );
    });

  const closeButton =
    lightbox.querySelector(
      ".fan-photo-lightbox-close"
    );

  window.requestAnimationFrame(() => {
    lightbox.classList.add(
      "is-open"
    );

    lightbox.setAttribute(
      "aria-hidden",
      "false"
    );

    closeButton?.focus();
  });
}


/* =========================================================
   메시지 관리 버튼 / 사진 보기
========================================================= */

function handleFanMessageListClick(
  event
) {
  /*
   * 첨부 사진 클릭
   */
  const photoButton =
    event.target.closest(
      "[data-fan-photo-url]"
    );

  if (photoButton) {
    const photoUrl =
      photoButton.dataset
        .fanPhotoUrl;

    const photoImage =
      photoButton.querySelector(
        "img"
      );

    const photoAlt =
      photoImage?.alt ||
      "팬 메시지 첨부 사진";

    openFanPhotoLightbox(
      photoUrl,
      photoAlt
    );

    return;
  }

  /*
   * 관리 버튼 클릭
   */
  const actionButton =
    event.target.closest(
      "[data-fan-message-action]"
    );

  if (!actionButton) {
    return;
  }

  const action =
    actionButton.dataset
      .fanMessageAction;

  const messageId =
    actionButton.dataset
      .fanMessageId;

  if (action !== "manage") {
    return;
  }

  if (!messageId) {
    alert(
      "메시지 정보를 찾을 수 없습니다."
    );

    return;
  }

  openFanMessageManageModal(
    messageId
  );
}


/* =========================================================
   팬 메시지 초기화
========================================================= */

function initializeFanMessages() {
  const elements = getFanMessageElements();

  if (
    !elements.writeToggle ||
    !elements.formWrap ||
    !elements.form ||
    !elements.messageList
  ) {
    return;
  }

  elements.formWrap.hidden = true;

  if (elements.allSection) {
    elements.allSection.hidden = true;
  }

  elements.writeToggle.addEventListener(
    "click",
    toggleFanMessageForm
  );

  elements.cancelButton?.addEventListener(
    "click",
    closeFanMessageForm
  );

  elements.contentInput?.addEventListener(
    "input",
    updateFanMessageCharacterCount
  );

  elements.photoInput?.addEventListener(
    "change",
    handleFanMessagePhotoChange
  );

  elements.photoRemoveButton
    ?.addEventListener(
      "click",
      resetFanMessagePhoto
    );

  elements.form.addEventListener(
    "submit",
    handleFanMessageSubmit
  );

  elements.messageList.addEventListener(
    "click",
    handleFanMessageListClick
  );

  elements.allList?.addEventListener(
    "click",
    handleFanMessageListClick
  );

  elements.moreButton?.addEventListener(
    "click",
    toggleFanMessageAllList
  );

  updateFanMessageCharacterCount();
  resetFanMessagePhoto();

  loadFanMessages({
    reset: true,
  });
}

/*************************************************
 * 사진 팝업 ESC 닫기
 *************************************************/

document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape" &&
      document.getElementById(
        "fanPhotoLightbox"
      )
    ) {
      closeFanPhotoLightbox();
    }
  }
);


/* =========================================================
   실행
========================================================= */

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeFanMessages
  );
} else {
  initializeFanMessages();
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    loadPublicMusic
  );
} else {
  loadPublicMusic();
}