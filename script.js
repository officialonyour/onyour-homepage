"use strict";

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
    item.spotifyUrl ||
    item.appleUrl ||
    item.youtubeUrl ||
    ""
  );
}

function createPublicMusicCardHtml(
  item
) {
  const coverUrl =
    String(item.coverUrl || "").trim();

  const musicLink =
    getPublicMusicLink(item);

  const isUpcoming =
    String(item.type || "")
      .toLowerCase()
      .includes("upcoming") ||
    String(item.releaseDate || "")
      .toLowerCase()
      .includes("coming");

  const artworkHtml = coverUrl
    ? `
      <img
        class="music-artwork-image"
        src="${escapeAdminHtml(coverUrl)}"
        alt="${escapeAdminHtml(
          item.title
        )} 앨범 자켓"
        loading="lazy"
      />

      <div class="music-artwork-shade"></div>
    `
    : `
      <div class="music-artwork-inner">
        <span>
          ${escapeAdminHtml(
            item.artist || "ONYOUR"
          )}
        </span>

        <small>
          ${isUpcoming
            ? "COMING SOON"
            : "LATEST RELEASE"}
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
        ${isUpcoming
          ? "Coming Soon"
          : "링크 준비 중"}
      </button>
    `;

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
              item.artist || ""
            )}
          </p>
        </div>

        ${
          item.releaseDate
            ? `
              <span class="music-badge">
                ${escapeAdminHtml(
                  item.releaseDate
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

async function loadPublicMusic() {
  const musicList =
    document.getElementById(
      "publicMusicList"
    );

  if (!musicList) {
    return;
  }

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

    if (items.length === 0) {
      musicList.innerHTML = `
        <div class="music-loading">
          공개된 음원이 없습니다.
        </div>
      `;

      return;
    }

    musicList.innerHTML =
      items
        .map(
          createPublicMusicCardHtml
        )
        .join("");
  } catch (error) {
    console.error(
      "공개 음원 불러오기 실패:",
      error
    );

    musicList.innerHTML = `
      <div class="music-loading">
        음원을 불러오지 못했습니다.
      </div>
    `;
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
  setAdminFormValue(
    "adminMusicId",
    item.id
  );

  setAdminFormValue(
    "adminMusicProfileKey",
    item.profileKey
  );

  setAdminFormValue(
    "adminMusicCoverUrl",
    item.coverUrl
  );

  setAdminFormValue(
    "adminMusicType",
    item.type
  );

  setAdminFormValue(
    "adminMusicTitle",
    item.title
  );

  /*
   * 관리자 수정창 상단의 프로필 이름
   * 기존 artist 값을 이 입력칸에서 수정합니다.
   */
  setAdminFormValue(
    "adminMusicEditorName",
    item.artist
  );

  setAdminFormValue(
    "adminMusicArtworkTitle",
    item.artworkTitle
  );

  setAdminFormValue(
    "adminMusicDisplayLabel",
    item.displayLabel
  );

  setAdminFormValue(
    "adminMusicTrackCount",
    Number(item.trackCount) || 0
  );

  setAdminFormValue(
    "adminMusicReleaseDate",
    item.releaseDate
  );

  setAdminFormValue(
    "adminMusicDescription",
    item.description
  );

  setAdminFormValue(
    "adminMusicYoutubeUrl",
    item.youtubeUrl
  );

  setAdminFormValue(
    "adminMusicSpotifyUrl",
    item.spotifyUrl
  );

  setAdminFormValue(
    "adminMusicAppleUrl",
    item.appleUrl
  );

  setAdminFormValue(
    "adminMusicPublished",
    item.published
  );

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
    item.coverUrl
  ) {
    previewImage.src = item.coverUrl;
    previewBox.hidden = false;
  } else if (
    previewBox &&
    previewImage
  ) {
    previewImage.removeAttribute("src");
    previewBox.hidden = true;
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
    (event) => {
      event.preventDefault();

      const id = getAdminFormValue(
        "adminMusicId"
      );

      const profileKey =
        getAdminFormValue(
          "adminMusicProfileKey"
        );

      const artist =
        getAdminFormValue(
          "adminMusicEditorName"
        );

      const artworkTitle =
        getAdminFormValue(
          "adminMusicArtworkTitle"
        );

      const displayLabel =
        getAdminFormValue(
          "adminMusicDisplayLabel"
        );

      if (!artist) {
        alert(
          "프로필 이름을 입력해 주세요."
        );

        document
          .getElementById(
            "adminMusicEditorName"
          )
          ?.focus();

        return;
      }

      if (!artworkTitle) {
        alert(
          "자켓 안 큰 제목을 입력해 주세요."
        );

        document
          .getElementById(
            "adminMusicArtworkTitle"
          )
          ?.focus();

        return;
      }

      const data = {
        id:
          id ||
          profileKey ||
          createAdminId("music"),

        profileKey,

        type: getAdminFormValue(
          "adminMusicType"
        ),

        title: getAdminFormValue(
          "adminMusicTitle"
        ),

        artist,

        artworkTitle,

        displayLabel,

        trackCount:
          Number(
            getAdminFormValue(
              "adminMusicTrackCount"
            )
          ) || 0,

        releaseDate:
          getAdminFormValue(
            "adminMusicReleaseDate"
          ),

        description:
          getAdminFormValue(
            "adminMusicDescription"
          ),

        coverUrl:
          getAdminFormValue(
            "adminMusicCoverUrl"
          ),

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

        published:
          getAdminFormValue(
            "adminMusicPublished"
          ),
      };

      saveAdminItem(
        "music",
        data
      );
    }
  );

document
  .getElementById("adminMembersForm")
  ?.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const id = getAdminFormValue(
        "adminMemberId"
      );

      const data = {
        id:
          id ||
          createAdminId("member"),
        name: getAdminFormValue(
          "adminMemberName"
        ),
        englishName:
          getAdminFormValue(
            "adminMemberEnglishName"
          ),
        role: getAdminFormValue(
          "adminMemberRole"
        ),
        description:
          getAdminFormValue(
            "adminMemberDescription"
          ),
        instagram: getAdminFormValue(
          "adminMemberInstagram"
        ),
        order:
          Number(
            getAdminFormValue(
              "adminMemberOrder"
            )
          ) || 1,
        published: getAdminFormValue(
          "adminMemberPublished"
        ),
      };

      saveAdminItem("members", data);
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
  "adminMusicImage",
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
const FAN_MESSAGE_PAGE_SIZE = 6;

const fanMessageState = {
  isFormOpen: false,

  editingId: null,
  editingPassword: "",

  offset: 0,
  total: 0,
  hasMore: false,
  isLoading: false,

  messages: new Map(),
};


/* =========================================================
   요소 가져오기
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

    moreButton: document.getElementById(
      "fanMessageMoreButton"
    ),
  };
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
   폼 초기화
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
   선택된 별점
========================================================= */

function getSelectedFanMessageRating() {
  const selectedRating =
    document.querySelector(
      'input[name="rating"]:checked'
    );

  if (!selectedRating) {
    return 0;
  }

  const rating = Number(
    selectedRating.value
  );

  if (
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return 0;
  }

  return rating;
}


/* =========================================================
   폼 입력값
========================================================= */

function getFanMessageFormData() {
  const elements = getFanMessageElements();

  const nickname =
    elements.nameInput?.value.trim() || "";

  const password =
    elements.passwordInput?.value || "";

  const performance =
    elements.performanceSelect?.value.trim() ||
    "";

  const rating =
    getSelectedFanMessageRating();

  const message =
    elements.contentInput?.value.trim() || "";

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
    rating,
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


/* =========================================================
   별점 표시
========================================================= */

function createFanMessageRatingText(rating) {
  const safeRating = Math.max(
    0,
    Math.min(
      5,
      Number(rating) || 0
    )
  );

  if (safeRating === 0) {
    return "";
  }

  return (
    "★".repeat(safeRating) +
    "☆".repeat(5 - safeRating)
  );
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
   메시지 카드 HTML
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
      messageData.performance || ""
    );

  const message =
    escapeFanMessageHtml(
      messageData.message || ""
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

  const rating =
    Number(messageData.rating) || 0;

  const ratingText =
    createFanMessageRatingText(rating);

  const performanceHtml =
    performance
      ? `
        <span class="fan-message-performance">
          ${performance}
        </span>
      `
      : "";

  const ratingHtml =
    ratingText
      ? `
        <div
          class="fan-message-card-rating"
          aria-label="별점 ${rating}점"
        >
          ${ratingText}
        </div>
      `
      : "";

  const pinnedHtml =
    messageData.isPinned
      ? `
        <span class="fan-message-pinned">
          ONYOUR PICK
        </span>
      `
      : "";

  return `
    <article
      class="fan-message-card"
      data-fan-message-id="${id}"
    >
      <div class="fan-message-card-header">
        <div class="fan-message-user">
          <span class="fan-message-avatar">
            ${avatar}
          </span>

          <div>
            <strong>
              ${name}
            </strong>

            ${performanceHtml}
          </div>
        </div>

        <time datetime="${escapeFanMessageHtml(
          createdAt
        )}">
          ${formattedDate}
        </time>
      </div>

      ${pinnedHtml}
      ${ratingHtml}

      <p class="fan-message-card-content">
        ${message}
      </p>

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
   로딩 문구
========================================================= */

function showFanMessageLoading() {
  const elements = getFanMessageElements();

  if (!elements.messageList) {
    return;
  }

  elements.messageList.innerHTML = `
    <div class="fan-message-empty">
      메시지를 불러오는 중입니다.
    </div>
  `;
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
   더보기 버튼 상태
========================================================= */

function updateFanMessageMoreButton() {
  const elements = getFanMessageElements();

  if (!elements.moreButton) {
    return;
  }

  if (
    fanMessageState.total === 0 ||
    !fanMessageState.hasMore
  ) {
    elements.moreButton.hidden = true;
    return;
  }

  elements.moreButton.hidden = false;

  elements.moreButton.disabled =
    fanMessageState.isLoading;

  elements.moreButton.textContent =
    fanMessageState.isLoading
      ? "불러오는 중..."
      : "더 많은 메시지 보기";
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

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message ||
      "요청을 처리하지 못했습니다."
    );
  }

  return result;
}


/* =========================================================
   메시지 목록 불러오기

   reset = true:
   처음부터 새로 불러오기

   reset = false:
   기존 목록 아래에 추가
========================================================= */

async function loadFanMessages({
  reset = false,
} = {}) {
  const elements = getFanMessageElements();

  if (
    !elements.messageList ||
    fanMessageState.isLoading
  ) {
    return;
  }

  if (reset) {
    fanMessageState.offset = 0;
    fanMessageState.total = 0;
    fanMessageState.hasMore = false;

    showFanMessageLoading();
  }

  fanMessageState.isLoading = true;
  updateFanMessageMoreButton();

  try {
    const requestUrl =
      `${FAN_MESSAGE_API_URL}` +
      `?limit=${FAN_MESSAGE_PAGE_SIZE}` +
      `&offset=${fanMessageState.offset}`;

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


      const messages =

      Array.isArray(result.messages)

      ? result.messages

      : [];



      if (reset) {

        fanMessageState.messages.clear();

      }

messages.forEach((messageItem) => {
  fanMessageState.messages.set(
    String(messageItem.id),
    messageItem
  );
});

        
    const pagination =
      result.pagination || {};

    if (reset) {
      elements.messageList.innerHTML = "";
    }

    if (
      reset &&
      messages.length === 0
    ) {
      showFanMessageEmpty();
    } else {
      const cardsHtml =
        messages
          .map(
            createFanMessageCardHtml
          )
          .join("");

      elements.messageList.insertAdjacentHTML(
        "beforeend",
        cardsHtml
      );
    }

    fanMessageState.offset +=
      messages.length;

    fanMessageState.total =
      Number(pagination.total) || 0;

    fanMessageState.hasMore =
      Boolean(pagination.hasMore);
  } catch (error) {
    console.error(
      "Fan Messages 불러오기 실패:",
      error
    );

    if (reset) {
      showFanMessageLoadError(
        error.message ||
        "메시지를 불러오지 못했습니다."
      );
    } else {
      alert(
        error.message ||
        "추가 메시지를 불러오지 못했습니다."
      );
    }
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
   폼 제출
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

    elements.submitButton.disabled =
      true;

    elements.submitButton.textContent =
      isEditing
        ? "수정 중..."
        : "등록 중...";

    setFanMessageFormStatus(
      isEditing
        ? "메시지를 수정하고 있습니다."
        : "메시지를 등록하고 있습니다."
    );

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

    elements.form.reset();

    fanMessageState.editingId = null;
    fanMessageState.editingPassword = "";

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
   메시지 관리 버튼
========================================================= */

function handleFanMessageListClick(
  event
) {
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
   초기화
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

  elements.writeToggle.addEventListener(
    "click",
    toggleFanMessageForm
  );

  elements.cancelButton?.addEventListener(
    "click",
    () => {
      closeFanMessageForm();
    }
  );

  elements.contentInput?.addEventListener(
    "input",
    updateFanMessageCharacterCount
  );

  elements.form.addEventListener(
    "submit",
    handleFanMessageSubmit
  );

  elements.messageList.addEventListener(
    "click",
    handleFanMessageListClick
  );

  elements.moreButton?.addEventListener(
    "click",
    () => {
      loadFanMessages({
        reset: false,
      });
    }
  );

  updateFanMessageCharacterCount();

  loadFanMessages({
    reset: true,
  });
}


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