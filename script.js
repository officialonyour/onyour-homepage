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
     ADMIN ENTRY - PLACEHOLDER
  ========================= */

  if (adminEntryButton) {
    adminEntryButton.addEventListener("click", () => {
      alert("관리자 기능은 다음 단계에서 연결할 예정입니다.");
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
  (event) => {
    event.preventDefault();

    const password =
      adminPassword?.value.trim();

    if (!password) {
      if (adminLoginMessage) {
        adminLoginMessage.textContent =
          "비밀번호를 입력해 주세요.";
      }

      adminPassword?.focus();
      return;
    }

    currentAdminPassword = password;

    /*
      현재 단계에서는 비밀번호가 입력되면
      관리자 화면이 열립니다.

      실제 비밀번호 검증은 이후
      Cloudflare Functions에서 처리합니다.
    */

    openAdminDashboard();
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

const adminData = {
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
      ADMIN_CONTENT_TYPES.map(
        async (type) => {
          const result =
            await adminApiRequest(
              `/api/content?type=${type}&includePrivate=true`
            );

          return {
            type,
            items: result.items || [],
          };
        }
      )
    );


    results.forEach(
        ({ type, items }) => {
            if (items.length > 0) {
                adminData[type] = items;
            }
        }
    );

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
  return adminData[sectionName]?.find(
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

  list.innerHTML = adminData.news
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

  list.innerHTML = adminData.performance
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

  list.innerHTML = adminData.video
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
  const list = document.getElementById(
    "adminMusicList"
  );

  if (!list) return;

  list.innerHTML = adminData.music
    .map((item) =>
      createAdminListItem({
        sectionName: "music",
        id: item.id,
        category: item.type,
        title: item.title,
        meta: [
          item.artist,
          item.releaseDate,
        ]
          .filter(Boolean)
          .join(" · "),
      })
    )
    .join("");
}

function renderAdminMembersList() {
  const list = document.getElementById(
    "adminMembersList"
  );

  if (!list) return;

  const sortedMembers = [
    ...adminData.members,
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

function fillAdminMusicForm(item) {
  setAdminFormValue(
    "adminMusicId",
    item.id
  );
  setAdminFormValue(
    "adminMusicType",
    item.type
  );
  setAdminFormValue(
    "adminMusicTitle",
    item.title
  );
  setAdminFormValue(
    "adminMusicArtist",
    item.artist
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
}

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

    adminData[sectionName] =
      adminData[sectionName].filter(
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

document
  .getElementById("adminMusicForm")
  ?.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const id = getAdminFormValue(
        "adminMusicId"
      );

      const data = {
        id: id || createAdminId("music"),
        type: getAdminFormValue(
          "adminMusicType"
        ),
        title: getAdminFormValue(
          "adminMusicTitle"
        ),
        artist: getAdminFormValue(
          "adminMusicArtist"
        ),
        releaseDate: getAdminFormValue(
          "adminMusicReleaseDate"
        ),
        description: getAdminFormValue(
          "adminMusicDescription"
        ),
        youtubeUrl: getAdminFormValue(
          "adminMusicYoutubeUrl"
        ),
        spotifyUrl: getAdminFormValue(
          "adminMusicSpotifyUrl"
        ),
        appleUrl: getAdminFormValue(
          "adminMusicAppleUrl"
        ),
        published: getAdminFormValue(
          "adminMusicPublished"
        ),
      };

      saveAdminItem("music", data);
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
      adminData[sectionName]?.find(
        (item) => item.id === data.id
      );

    const isUpdate =
      Boolean(existingItem);

      console.log("저장 확인:", {
        sectionName,
        data,
        existingItem,
        isUpdate,
    });


    alert(
        `저장 방식: ${
            isUpdate ? "수정" : "신규 등록"
        }\nID: ${data.id}`
    );

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
        adminData[
          sectionName
        ].findIndex(
          (item) =>
            item.id === savedItem.id
        );

      if (index >= 0) {
        adminData[sectionName][index] =
          savedItem;
      }
    } else {
      adminData[sectionName].unshift(
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
