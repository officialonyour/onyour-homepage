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
   SAVE ADD / EDIT
========================= */

async function saveAdminItem(
  sectionName,
  data
) {
  const sectionItems =
    adminStore[sectionName] || [];

  const existingIndex =
    sectionItems.findIndex(
      (item) =>
        String(item.id) ===
        String(data.id)
    );

  const isUpdate =
    existingIndex >= 0;

  const url = isUpdate
    ? `/api/content?type=${encodeURIComponent(
        sectionName
      )}&id=${encodeURIComponent(
        data.id
      )}`
    : `/api/content?type=${encodeURIComponent(
        sectionName
      )}`;

  const result =
    await adminApiRequest(url, {
      method: isUpdate
        ? "PUT"
        : "POST",

      body: JSON.stringify(data),
    });

  const savedItem =
    result.item ||
    result.data ||
    null;

  if (!savedItem) {
    console.error(
      "저장 API 응답:",
      result
    );

    throw new Error(
      "서버가 저장된 콘텐츠 정보를 반환하지 않았습니다."
    );
  }

  if (!savedItem.id) {
    savedItem.id =
      data.id;
  }

  if (isUpdate) {
    adminStore[sectionName][
      existingIndex
    ] = savedItem;
  } else {
    adminStore[sectionName].unshift(
      savedItem
    );
  }

  renderAllAdminLists();
  openAdminView(sectionName);

  return savedItem;
}

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
      message: "서버 응답을 읽을 수 없습니다.",
    };
  }

  if (!response.ok) {
    throw new Error(
      result.message || "요청 처리 중 오류가 발생했습니다."
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
   MUSIC PLATFORM LINK + PUBLIC MUSIC LOAD
   - 동적 플랫폼 배열 지원
   - 기존 YouTube / Spotify / Apple 필드 호환
   - 플랫폼 개수에 따라 버튼 동일 너비
   - 링크가 없으면 준비중 안내
   - 링크가 없으면 앨범 자켓 흐림 + COMING SOON
========================================================= */

const MUSIC_PLATFORM_SETTINGS = {
  youtube: {
    label: "YouTube",
    color: "#ff0000",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.5V8.5L15.8 12Z"
        />
      </svg>
    `,
  },

  spotify: {
    label: "Spotify",
    color: "#1db954",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0Zm5.5 17.3a.75.75 0 0 1-1 .2c-2.7-1.6-6.1-2-10-.9a.75.75 0 1 1-.1-1.5c4.2-.2 7.9.3 10.9 1.1.4.2.5.8.2 1.1Zm1.4-3.1a.93.93 0 0 1-1.3.3c-3.1-1.9-7.9-2.5-11.6-1.2a.94.94 0 1 1-.6-1.8c4.2-1.4 9.4-.7 13.1 1.5.4.3.5.9.4 1.2Zm.2-3.3c-3.7-2.2-9.8-2.4-13.4-1.3a1.13 1.13 0 1 1-.7-2.1c4.2-1.3 11-1 15.2 1.5a1.12 1.12 0 1 1-1.1 1.9Z"
        />
      </svg>
    `,
  },

  apple: {
    label: "Apple Music",
    color: "#fa243c",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16.9 2v13.2a3.5 3.5 0 1 1-1.4-2.8V5.5l-7 1.5v10.2A3.5 3.5 0 1 1 7 14.4V5.8L16.9 2Z"
        />
      </svg>
    `,
  },

  melon: {
    label: "Melon",
    color: "#00cd3c",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="currentColor"
        />

        <text
          x="12"
          y="15.8"
          text-anchor="middle"
          font-size="8"
          font-weight="700"
          fill="#ffffff"
          font-family="Arial, sans-serif"
        >
          M
        </text>
      </svg>
    `,
  },

  genie: {
    label: "Genie",
    color: "#20c5e5",
    icon: `
      <span
        class="music-platform-letter"
        aria-hidden="true"
      >
        G
      </span>
    `,
  },

  flo: {
    label: "FLO",
    color: "#8b5cf6",
    icon: `
      <span
        class="music-platform-letter"
        aria-hidden="true"
      >
        F
      </span>
    `,
  },

  bugs: {
    label: "Bugs",
    color: "#ff3b30",
    icon: `
      <span
        class="music-platform-letter"
        aria-hidden="true"
      >
        B
      </span>
    `,
  },

  soundcloud: {
    label: "SoundCloud",
    color: "#ff5500",
    icon: `
      <i
        class="fa-brands fa-soundcloud"
        aria-hidden="true"
      ></i>
    `,
  },

  bandcamp: {
    label: "Bandcamp",
    color: "#629aa9",
    icon: `
      <i
        class="fa-brands fa-bandcamp"
        aria-hidden="true"
      ></i>
    `,
  },

  lineMusic: {
    label: "LINE MUSIC",
    color: "#06c755",
    icon: `
      <span
        class="music-platform-letter"
        aria-hidden="true"
      >
        L
      </span>
    `,
  },

  qqMusic: {
    label: "QQ Music",
    color: "#31c27c",
    icon: `
      <span
        class="music-platform-letter"
        aria-hidden="true"
      >
        Q
      </span>
    `,
  },

  other: {
    label: "Music",
    color: "#ffffff",
    icon: `
      <span
        class="music-platform-letter"
        aria-hidden="true"
      >
        ♪
      </span>
    `,
  },
};


/* =========================
   플랫폼 키 정리
========================= */

function normalizeMusicPlatformKey(value) {
  const cleanValue =
    String(value || "")
      .trim()
      .toLowerCase()
      .replaceAll("-", "")
      .replaceAll("_", "")
      .replaceAll(" ", "");

  const aliases = {
    youtube: "youtube",
    youtubemusic: "youtube",

    spotify: "spotify",

    apple: "apple",
    applemusic: "apple",

    melon: "melon",

    genie: "genie",
    geniemusic: "genie",

    flo: "flo",

    bugs: "bugs",
    bugsmusic: "bugs",

    soundcloud: "soundcloud",

    bandcamp: "bandcamp",

    linemusic: "lineMusic",
    line: "lineMusic",

    qqmusic: "qqMusic",
    qq: "qqMusic",

    other: "other",
    music: "other",
  };

  return aliases[cleanValue] || cleanValue;
}


/* =========================
   platforms 값 배열 변환
========================= */

function parseMusicPlatformsValue(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (
    value &&
    typeof value === "object"
  ) {
    return Object.entries(value).map(
      ([platformKey, platformValue]) => {
        if (
          typeof platformValue ===
          "string"
        ) {
          return {
            key: platformKey,
            url: platformValue,
          };
        }

        return {
          key: platformKey,
          ...(platformValue || {}),
        };
      }
    );
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    try {
      const parsedValue =
        JSON.parse(value);

      return parseMusicPlatformsValue(
        parsedValue
      );
    } catch {
      return [];
    }
  }

  return [];
}


/* =========================
   저장 데이터에서 플랫폼 목록 만들기
========================= */

function getMusicPlatforms(item) {
  const platformMap = new Map();

  const dynamicPlatforms =
    parseMusicPlatformsValue(
      item.platforms ||
      item.platformsJson ||
      item.platforms_json ||
      []
    );

  dynamicPlatforms.forEach(
    (platformItem) => {
      const platformKey =
        normalizeMusicPlatformKey(
          platformItem.key ||
          platformItem.platform ||
          platformItem.type ||
          platformItem.name ||
          platformItem.label
        );

      const platformUrl =
        String(
          platformItem.url ||
          platformItem.link ||
          platformItem.href ||
          ""
        ).trim();

      if (
        !platformKey ||
        !platformUrl
      ) {
        return;
      }

      platformMap.set(
        platformKey,
        {
          key: platformKey,

          label:
            platformItem.label ||
            platformItem.name ||
            MUSIC_PLATFORM_SETTINGS[
              platformKey
            ]?.label ||
            "Music",

          url: platformUrl,
        }
      );
    }
  );

  const legacyPlatforms = [
    {
      key: "youtube",
      url:
        item.youtubeUrl ||
        item.youtube_url ||
        "",
    },

    {
      key: "spotify",
      url:
        item.spotifyUrl ||
        item.spotify_url ||
        "",
    },

    {
      key: "apple",
      url:
        item.appleUrl ||
        item.apple_url ||
        "",
    },

    {
      key: "melon",
      url:
        item.melonUrl ||
        item.melon_url ||
        "",
    },
  ];

  legacyPlatforms.forEach(
    (platformItem) => {
      const platformUrl =
        String(
          platformItem.url || ""
        ).trim();

      if (
        !platformUrl ||
        platformMap.has(
          platformItem.key
        )
      ) {
        return;
      }

      platformMap.set(
        platformItem.key,
        {
          key: platformItem.key,

          label:
            MUSIC_PLATFORM_SETTINGS[
              platformItem.key
            ]?.label ||
            "Music",

          url: platformUrl,
        }
      );
    }
  );

  return Array.from(
    platformMap.values()
  );
}


/* =========================
   플랫폼 버튼 만들기
========================= */

function createMusicPlatformLink(
  platformItem
) {
  const platformKey =
    normalizeMusicPlatformKey(
      platformItem.key
    );

  const setting =
    MUSIC_PLATFORM_SETTINGS[
      platformKey
    ] ||
    MUSIC_PLATFORM_SETTINGS.other;

  const cleanUrl =
    String(
      platformItem.url || ""
    ).trim();

  const label =
    String(
      platformItem.label ||
      setting.label ||
      "Music"
    ).trim();

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
      data-music-platform="${escapeAdminHtml(
        platformKey
      )}"
      style="--music-platform-color: ${
        setting.color
      };"
    >
      <span
        class="music-platform-icon"
        aria-hidden="true"
      >
        ${setting.icon}
      </span>

      <span class="music-platform-name">
        ${escapeAdminHtml(label)}
      </span>
    </a>
  `;
}


/* =========================
   앨범 자켓 준비중 상태
========================= */

function updateMusicComingSoonArtwork({
  artwork,
  coverImage,
  fallback,
  isComingSoon,
  coverUrl,
  albumTitle,
}) {
  if (!artwork) {
    return;
  }

  artwork.classList.toggle(
    "is-coming-soon",
    isComingSoon
  );

  artwork
    .querySelector(
      ".music-coming-soon-overlay"
    )
    ?.remove();

  if (
    coverImage &&
    coverUrl
  ) {
    coverImage.src = coverUrl;
    coverImage.alt =
      `${albumTitle} 앨범 자켓`;

    coverImage.hidden = false;

    if (fallback) {
      fallback.hidden = true;
    }
  } else {
    if (coverImage) {
      coverImage.removeAttribute(
        "src"
      );

      coverImage.alt = "";
      coverImage.hidden = true;
    }

    if (fallback) {
      fallback.hidden = false;

      fallback.innerHTML = `
        <small>
          ${
            isComingSoon
              ? "COMING SOON"
              : "LATEST RELEASE"
          }
        </small>
      `;
    }
  }

  if (!isComingSoon) {
    return;
  }

  const comingSoonOverlay =
    document.createElement("div");

  comingSoonOverlay.className =
    "music-coming-soon-overlay";

  comingSoonOverlay.innerHTML = `
    <span>COMING</span>
    <strong>SOON</strong>
  `;

  artwork.appendChild(
    comingSoonOverlay
  );
}


/* =========================
   공개 Music 불러오기
========================= */

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
      defaultArtist:
        "이휘근(Kenneth)",
      defaultType: "SINGLE",
      defaultTitle:
        "Side by Side",
    },

    eluni: {
      suffix: "Eluni",
      defaultArtist: "이루니",
      defaultType:
        "PARTICIPATION",
      defaultTitle:
        "참여 음원",
    },

    leecherin: {
      suffix: "Leecherin",
      defaultArtist: "이체린",
      defaultType:
        "PARTICIPATION",
      defaultTitle:
        "참여 음원",
    },
  };

  try {
    const response =
      await fetch(
        "/api/content?type=music",
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",
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
                String(savedProfileKey) ===
                String(profileKey)
              );
            }
          );

        const card =
          musicProfileList.querySelector(
            `[data-music-profile="${profileKey}"]`
          );

        if (!card) {
          return;
        }

        if (
          !item ||
          item.published === false ||
          Number(item.published) === 0
        ) {
          card.hidden = true;
          return;
        }

        card.hidden = false;

        const suffix =
          setting.suffix;

        const artwork =
          card.querySelector(
            ".music-artwork"
          );

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
            `musicArtistName${suffix}`
          );

        const typeElement =
          document.getElementById(
            `musicAlbumType${suffix}`
          );

        const titleElement =
          document.getElementById(
            `musicAlbumTitle${suffix}`
          );

        const platformContainer =
          document.getElementById(
            `musicPlatformLinks${suffix}`
          );

        const artist =
          String(
            item.artist ||
            item.artist_name ||
            setting.defaultArtist
          ).trim();

        const albumType =
          String(
            item.type ||
            setting.defaultType
          ).trim();

        const albumTitle =
          String(
            item.title ||
            setting.defaultTitle
          ).trim();

        const coverUrl =
          String(
            item.coverUrl ||
            item.cover_url ||
            ""
          ).trim();

        const platforms =
          getMusicPlatforms(item);

        const isComingSoon =
          platforms.length === 0;

        if (artistElement) {
          artistElement.textContent =
            artist;
        }

        if (typeElement) {
          typeElement.textContent =
            albumType;
        }

        if (titleElement) {
          titleElement.textContent =
            albumTitle;

          fitMusicCardTitle(
            titleElement
          );
        }

        updateMusicComingSoonArtwork({
          artwork,
          coverImage,
          fallback,
          isComingSoon,
          coverUrl,
          albumTitle,
        });

        card.classList.toggle(
          "is-coming-soon",
          isComingSoon
        );

        if (!platformContainer) {
          return;
        }

        platformContainer.classList.toggle(
          "is-empty",
          isComingSoon
        );

        platformContainer.style.setProperty(
          "--music-platform-count",
          String(
            Math.max(
              platforms.length,
              1
            )
          )
        );

        if (isComingSoon) {
          platformContainer.innerHTML = `
            <div class="music-platform-coming-soon">
              <span aria-hidden="true">
                ♪
              </span>

              <div>
                <strong>
                  준비중입니다.
                </strong>

                <p>
                  정식 발매 후 음원 서비스를 이용하실 수 있습니다.
                </p>
              </div>
            </div>
          `;

          return;
        }

        platformContainer.innerHTML =
          platforms
            .map(
              createMusicPlatformLink
            )
            .join("");
      }
    );
  } catch (error) {
    console.error(
      "공개 음원 불러오기 실패:",
      error
    );
  }
}

/* =========================================================
   PUBLIC MEMBERS LOAD
   D1 멤버 정보 → 홈페이지 멤버 카드
========================================================= */

async function loadPublicMembers() {
  const memberSettings = [
    {
      suffix: "Leehwigeun",
      fallbackText: "HWG",
    },
    {
      suffix: "Eluni",
      fallbackText: "ELU",
    },
    {
      suffix: "Leecherin",
      fallbackText: "CHR",
    },
  ];

  const socialPlatformSettings = {
    instagram: {
      label: "Instagram",
      icon: "◎",
    },

    youtube: {
      label: "YouTube",
      icon: "▶",
    },

    spotify: {
      label: "Spotify",
      icon: "●",
    },

    apple: {
      label: "Apple Music",
      icon: "♪",
    },

    applemusic: {
      label: "Apple Music",
      icon: "♪",
    },

    melon: {
      label: "Melon",
      icon: "M",
    },

    soundcloud: {
      label: "SoundCloud",
      icon: "☁",
    },

    tiktok: {
      label: "TikTok",
      icon: "♪",
    },

    x: {
      label: "X",
      icon: "𝕏",
    },

    twitter: {
      label: "X",
      icon: "𝕏",
    },

    facebook: {
      label: "Facebook",
      icon: "f",
    },

    homepage: {
      label: "Website",
      icon: "↗",
    },

    website: {
      label: "Website",
      icon: "↗",
    },

    other: {
      label: "Link",
      icon: "↗",
    },
  };

  function normalizeMemberSocialLinks(
    item
  ) {
    let socialLinks = [];

    const rawSocialLinks =
      item?.socialLinks ??
      item?.social_links ??
      item?.socialLinksJson ??
      item?.social_links_json ??
      [];

    if (
      Array.isArray(rawSocialLinks)
    ) {
      socialLinks =
        rawSocialLinks;
    } else if (
      typeof rawSocialLinks ===
      "string"
    ) {
      try {
        const parsedValue =
          JSON.parse(
            rawSocialLinks
          );

        socialLinks =
          Array.isArray(parsedValue)
            ? parsedValue
            : [];
      } catch {
        socialLinks = [];
      }
    }

    const normalizedLinks =
      socialLinks
        .map((socialLink) => {
          const platform =
            String(
              socialLink.platform ||
              socialLink.key ||
              socialLink.type ||
              "other"
            )
              .trim()
              .toLowerCase();

          const url =
            String(
              socialLink.url ||
              socialLink.href ||
              socialLink.link ||
              ""
            ).trim();

          const label =
            String(
              socialLink.label ||
              socialLink.name ||
              ""
            ).trim();

          return {
            platform,
            url,
            label,
          };
        })
        .filter(
          (socialLink) =>
            socialLink.url
        );

    const oldInstagramUrl =
      String(
        item?.instagram ||
        item?.instagramUrl ||
        item?.instagram_url ||
        ""
      ).trim();

    const hasInstagram =
      normalizedLinks.some(
        (socialLink) =>
          socialLink.platform ===
          "instagram"
      );

    if (
      oldInstagramUrl &&
      !hasInstagram
    ) {
      normalizedLinks.push({
        platform: "instagram",
        label: "Instagram",
        url: oldInstagramUrl,
      });
    }

    const uniqueLinks =
      new Map();

    normalizedLinks.forEach(
      (socialLink) => {
        const uniqueKey =
          `${socialLink.platform}:${socialLink.url}`;

        if (
          !uniqueLinks.has(
            uniqueKey
          )
        ) {
          uniqueLinks.set(
            uniqueKey,
            socialLink
          );
        }
      }
    );

    return Array.from(
      uniqueLinks.values()
    );
  }

  function createMemberSocialLinkHtml(
    socialLink
  ) {
    const platformSetting =
      socialPlatformSettings[
        socialLink.platform
      ] ||
      socialPlatformSettings.other;

    const label =
      socialLink.label ||
      platformSetting.label;

    return `
      <a
        class="member-link member-social-link"
        href="${escapeAdminHtml(
          socialLink.url
        )}"
        target="_blank"
        rel="noopener noreferrer"
        data-social-platform="${escapeAdminHtml(
          socialLink.platform
        )}"
        aria-label="${escapeAdminHtml(
          label
        )} 새 창에서 열기"
      >
        <span
          class="member-social-icon"
          aria-hidden="true"
        >
          ${escapeAdminHtml(
            platformSetting.icon
          )}
        </span>

        <span class="member-social-label">
          ${escapeAdminHtml(
            label
          )}
        </span>
      </a>
    `;
  }

  try {
    const response =
      await fetch(
        "/api/content?type=members",
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",
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
        "멤버 정보를 불러오지 못했습니다."
      );
    }

    const members = (
      Array.isArray(result.items)
        ? result.items
        : []
    )
      .filter(
        (item) =>
          item.published !== false &&
          Number(
            item.published
          ) !== 0
      )
      .sort(
        (firstItem, secondItem) =>
          Number(
            firstItem.order ??
            firstItem.sortOrder ??
            firstItem.sort_order ??
            0
          ) -
          Number(
            secondItem.order ??
            secondItem.sortOrder ??
            secondItem.sort_order ??
            0
          )
      );

    memberSettings.forEach(
      (setting, index) => {
        const item =
          members[index];

        const suffix =
          setting.suffix;

        const image =
          document.getElementById(
            `memberImage${suffix}`
          );

        const fallback =
          document.getElementById(
            `memberFallback${suffix}`
          );

        const name =
          document.getElementById(
            `memberName${suffix}`
          );

        const role =
          document.getElementById(
            `memberRole${suffix}`
          );

        const description =
          document.getElementById(
            `memberDescription${suffix}`
          );

        const socialContainer =
          document.getElementById(
            `memberSocialLinks${suffix}`
          );

        const card =
          document.querySelector(
            `[data-member="${suffix}"]`
          ) ||
          name?.closest(
            ".member-card"
          );

        if (!item) {
          if (card) {
            card.hidden = true;
          }

          return;
        }

        if (card) {
          card.hidden = false;
        }

        const memberName =
          String(
            item.name ||
            "멤버"
          ).trim();

        const memberRole =
          String(
            item.role ||
            ""
          ).trim();

        const memberDescription =
          String(
            item.description ||
            ""
          ).trim();

        const imageUrl =
          String(
            item.imageUrl ||
            item.image_url ||
            ""
          ).trim();

        const imagePositionX =
          Number(
            item.imagePositionX ??
            item.image_position_x ??
            50
          );

        const imagePositionY =
          Number(
            item.imagePositionY ??
            item.image_position_y ??
            50
          );

        const imageScale =
          Number(
            item.imageScale ??
            item.image_scale ??
            100
          );

        if (name) {
          name.textContent =
            memberName;
        }

        if (role) {
          role.textContent =
            memberRole;
        }

        if (description) {
          description.textContent =
            memberDescription;

          description.hidden =
            !memberDescription;
        }

        if (
          image &&
          fallback
        ) {
          if (imageUrl) {
            image.src =
              imageUrl;

            image.alt =
              `${memberName} 프로필 사진`;

            image.hidden =
              false;

            fallback.hidden =
              true;

            image.style.objectPosition =
              `${imagePositionX}% ${imagePositionY}%`;

            image.style.transform =
              `scale(${imageScale / 100})`;

            image.style.transformOrigin =
              "center center";

            image.onerror =
              () => {
                image.removeAttribute(
                  "src"
                );

                image.alt = "";
                image.hidden = true;

                fallback.hidden =
                  false;

                fallback.textContent =
                  setting.fallbackText;
              };
          } else {
            image.removeAttribute(
              "src"
            );

            image.alt = "";
            image.hidden = true;

            image.style.objectPosition =
              "50% 50%";

            image.style.transform =
              "scale(1)";

            fallback.hidden =
              false;

            fallback.textContent =
              setting.fallbackText;
          }
        }

        if (socialContainer) {
          const socialLinks =
            normalizeMemberSocialLinks(
              item
            );

          socialContainer.innerHTML =
            socialLinks
              .map(
                createMemberSocialLinkHtml
              )
              .join("");

          socialContainer.hidden =
            socialLinks.length === 0;

          socialContainer.classList.toggle(
            "is-empty",
            socialLinks.length === 0
          );
        }
      }
    );
  } catch (error) {
    console.error(
      "공개 멤버 불러오기 실패:",
      error
    );
  }
}

/* =========================================================
   MEMBER SOCIAL LINKS EDITOR
   - SNS 링크 추가
   - 플랫폼 선택
   - 이름 및 URL 입력
   - 개별 삭제
   - JSON 변환 및 복원
========================================================= */

const ADMIN_MEMBER_SOCIAL_PLATFORMS = [
  {
    value: "instagram",
    label: "Instagram",
  },
  {
    value: "youtube",
    label: "YouTube",
  },
  {
    value: "spotify",
    label: "Spotify",
  },
  {
    value: "apple-music",
    label: "Apple Music",
  },
  {
    value: "tiktok",
    label: "TikTok",
  },
  {
    value: "soundcloud",
    label: "SoundCloud",
  },
  {
    value: "website",
    label: "Website",
  },
  {
    value: "other",
    label: "기타",
  },
];

const adminMemberSocialList =
  document.getElementById(
    "adminMemberSocialList"
  );

const adminMemberSocialAddButton =
  document.getElementById(
    "adminMemberSocialAddButton"
  );

const adminMemberSocialLinksJson =
  document.getElementById(
    "adminMemberSocialLinksJson"
  );


/* =========================
   HTML 특수문자 처리
========================= */

function escapeAdminMemberSocialHtml(
  value
) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =========================
   URL 기본 형식 정리
========================= */

function normalizeAdminMemberSocialUrl(
  value
) {
  const url =
    String(value ?? "").trim();

  if (!url) {
    return "";
  }

  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  return `https://${url}`;
}


/* =========================
   플랫폼 이름 가져오기
========================= */

function getAdminMemberSocialPlatformLabel(
  platform
) {
  const matchedPlatform =
    ADMIN_MEMBER_SOCIAL_PLATFORMS.find(
      (item) =>
        item.value === platform
    );

  return (
    matchedPlatform?.label ||
    "기타"
  );
}


/* =========================
   플랫폼 선택 옵션 생성
========================= */

function createAdminMemberSocialPlatformOptions(
  selectedPlatform = "instagram"
) {
  return ADMIN_MEMBER_SOCIAL_PLATFORMS
    .map((platformItem) => {
      const selected =
        platformItem.value ===
        selectedPlatform
          ? " selected"
          : "";

      return `
        <option
          value="${escapeAdminMemberSocialHtml(
            platformItem.value
          )}"
          ${selected}
        >
          ${escapeAdminMemberSocialHtml(
            platformItem.label
          )}
        </option>
      `;
    })
    .join("");
}


/* =========================
   SNS 링크 한 줄 생성
========================= */

function createAdminMemberSocialRow(
  socialLink = {}
) {
  const platform =
    String(
      socialLink.platform ||
      "instagram"
    ).trim();

  const defaultLabel =
    getAdminMemberSocialPlatformLabel(
      platform
    );

  const label =
    String(
      socialLink.label ||
      defaultLabel
    ).trim();

  const url =
    String(
      socialLink.url || ""
    ).trim();

  const row =
    document.createElement("div");

  row.className =
    "admin-member-social-row";

  row.dataset.memberSocialRow =
    "true";

  row.innerHTML = `
    <div class="admin-member-social-row-fields">

      <label>
        <span>종류</span>

        <select
          class="admin-member-social-platform"
          data-member-social-platform
        >
          ${createAdminMemberSocialPlatformOptions(
            platform
          )}
        </select>
      </label>

      <label>
        <span>표시 이름</span>

        <input
          class="admin-member-social-label"
          data-member-social-label
          type="text"
          maxlength="30"
          value="${escapeAdminMemberSocialHtml(
            label
          )}"
          placeholder="예: Instagram"
        />
      </label>

      <label class="admin-member-social-url-field">
        <span>링크 주소</span>

        <input
          class="admin-member-social-url"
          data-member-social-url
          type="url"
          value="${escapeAdminMemberSocialHtml(
            url
          )}"
          placeholder="https://..."
        />
      </label>

    </div>

    <button
      class="admin-member-social-remove"
      type="button"
      data-member-social-remove
      aria-label="링크 삭제"
    >
      삭제
    </button>
  `;

  return row;
}


/* =========================
   빈 화면 표시
========================= */

function renderAdminMemberSocialEmpty() {
  if (!adminMemberSocialList) {
    return;
  }

  const rows =
    adminMemberSocialList.querySelectorAll(
      "[data-member-social-row]"
    );

  const existingEmpty =
    adminMemberSocialList.querySelector(
      ".admin-member-social-empty"
    );

  if (rows.length > 0) {
    existingEmpty?.remove();
    return;
  }

  if (existingEmpty) {
    return;
  }

  const emptyElement =
    document.createElement("div");

  emptyElement.className =
    "admin-member-social-empty";

  emptyElement.innerHTML = `
    <strong>
      등록된 링크가 없습니다.
    </strong>

    <p>
      링크 추가 버튼을 눌러 SNS를 추가하세요.
    </p>
  `;

  adminMemberSocialList.appendChild(
    emptyElement
  );
}


/* =========================
   SNS 링크 한 줄 추가
========================= */

function addAdminMemberSocialLink(
  socialLink = {}
) {
  if (!adminMemberSocialList) {
    return;
  }

  adminMemberSocialList
    .querySelector(
      ".admin-member-social-empty"
    )
    ?.remove();

  const row =
    createAdminMemberSocialRow(
      socialLink
    );

  adminMemberSocialList.appendChild(
    row
  );

  updateAdminMemberSocialLinksJson();

  const urlInput =
    row.querySelector(
      "[data-member-social-url]"
    );

  urlInput?.focus();
}


/* =========================
   현재 입력값 배열로 가져오기
========================= */

function getAdminMemberSocialLinks() {
  if (!adminMemberSocialList) {
    return [];
  }

  const rows = [
    ...adminMemberSocialList.querySelectorAll(
      "[data-member-social-row]"
    ),
  ];

  return rows
    .map((row) => {
      const platform =
        row
          .querySelector(
            "[data-member-social-platform]"
          )
          ?.value?.trim() ||
        "other";

      const defaultLabel =
        getAdminMemberSocialPlatformLabel(
          platform
        );

      const label =
        row
          .querySelector(
            "[data-member-social-label]"
          )
          ?.value?.trim() ||
        defaultLabel;

      const rawUrl =
        row
          .querySelector(
            "[data-member-social-url]"
          )
          ?.value?.trim() ||
        "";

      const url =
        normalizeAdminMemberSocialUrl(
          rawUrl
        );

      return {
        platform,
        label,
        url,
      };
    })
    .filter(
      (socialLink) =>
        Boolean(socialLink.url)
    );
}


/* =========================
   hidden JSON 값 갱신
========================= */

function updateAdminMemberSocialLinksJson() {
  const socialLinks =
    getAdminMemberSocialLinks();

  const jsonValue =
    JSON.stringify(
      socialLinks
    );

  if (
    adminMemberSocialLinksJson
  ) {
    adminMemberSocialLinksJson.value =
      jsonValue;
  }

  return jsonValue;
}


/* =========================
   저장값을 편집창에 복원
========================= */

function setAdminMemberSocialLinks(
  socialLinks = []
) {
  if (!adminMemberSocialList) {
    return;
  }

  adminMemberSocialList.innerHTML =
    "";

  const normalizedLinks =
    Array.isArray(socialLinks)
      ? socialLinks.filter(
          (socialLink) =>
            socialLink &&
            typeof socialLink ===
              "object"
        )
      : [];

  normalizedLinks.forEach(
    (socialLink) => {
      addAdminMemberSocialLink(
        socialLink
      );
    }
  );

  renderAdminMemberSocialEmpty();
  updateAdminMemberSocialLinksJson();
}


/* =========================
   JSON 문자열 안전하게 읽기
========================= */

function parseAdminMemberSocialLinks(
  value
) {
  if (Array.isArray(value)) {
    return value;
  }

  if (
    value &&
    typeof value === "object"
  ) {
    return [];
  }

  const stringValue =
    String(value ?? "").trim();

  if (!stringValue) {
    return [];
  }

  try {
    const parsedValue =
      JSON.parse(stringValue);

    return Array.isArray(parsedValue)
      ? parsedValue
      : [];
  } catch (error) {
    console.warn(
      "멤버 SNS JSON 변환 실패:",
      error
    );

    return [];
  }
}


/* =========================
   멤버 데이터에서 SNS 읽기
========================= */

function getMemberSocialLinksFromItem(
  item = {}
) {
  const directLinks =
    item.socialLinks ||
    item.social_links;

  if (Array.isArray(directLinks)) {
    return directLinks;
  }

  const jsonLinks =
    item.socialLinksJson ??
    item.social_links_json ??
    "";

  const parsedLinks =
    parseAdminMemberSocialLinks(
      jsonLinks
    );

  if (parsedLinks.length > 0) {
    return parsedLinks;
  }

  /*
   * 기존 Instagram 데이터 호환
   */
  const legacyInstagram =
    item.instagram ||
    item.instagramUrl ||
    item.instagram_url ||
    "";

  if (legacyInstagram) {
    return [
      {
        platform: "instagram",
        label: "Instagram",
        url: legacyInstagram,
      },
    ];
  }

  return [];
}


/* =========================
   SNS 편집창 초기화
========================= */

function resetAdminMemberSocialEditor() {
  setAdminMemberSocialLinks([]);
}


/* =========================
   링크 추가 버튼
========================= */

adminMemberSocialAddButton
  ?.addEventListener(
    "click",
    () => {
      addAdminMemberSocialLink({
        platform: "instagram",
        label: "Instagram",
        url: "",
      });
    }
  );


/* =========================
   SNS 목록 이벤트
========================= */

adminMemberSocialList
  ?.addEventListener(
    "click",
    (event) => {
      const removeButton =
        event.target.closest(
          "[data-member-social-remove]"
        );

      if (!removeButton) {
        return;
      }

      const row =
        removeButton.closest(
          "[data-member-social-row]"
        );

      row?.remove();

      renderAdminMemberSocialEmpty();
      updateAdminMemberSocialLinksJson();
    }
  );


adminMemberSocialList
  ?.addEventListener(
    "input",
    () => {
      updateAdminMemberSocialLinksJson();
    }
  );


adminMemberSocialList
  ?.addEventListener(
    "change",
    (event) => {
      const platformSelect =
        event.target.closest(
          "[data-member-social-platform]"
        );

      if (!platformSelect) {
        updateAdminMemberSocialLinksJson();
        return;
      }

      const row =
        platformSelect.closest(
          "[data-member-social-row]"
        );

      const labelInput =
        row?.querySelector(
          "[data-member-social-label]"
        );

      if (labelInput) {
        const previousPlatform =
          platformSelect.dataset
            .previousPlatform ||
          "";

        const previousLabel =
          getAdminMemberSocialPlatformLabel(
            previousPlatform
          );

        const currentLabel =
          labelInput.value.trim();

        if (
          !currentLabel ||
          currentLabel ===
            previousLabel
        ) {
          labelInput.value =
            getAdminMemberSocialPlatformLabel(
              platformSelect.value
            );
        }
      }

      platformSelect.dataset.previousPlatform =
        platformSelect.value;

      updateAdminMemberSocialLinksJson();
    }
  );


/* =========================
   최초 빈 상태
========================= */

renderAdminMemberSocialEmpty();
updateAdminMemberSocialLinksJson();

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
   음악 수정 폼 전체 채우기
   - 기본 앨범 정보
   - 기존 고정 플랫폼 링크 호환
   - 새로운 동적 플랫폼 목록 출력
========================= */

function fillAdminMusicForm(item) {
  if (!item) {
    return;
  }

  const profileKey =
    item.profileKey ||
    item.profile_key ||
    item.id ||
    "";

  const profileSetting =
    ADMIN_MUSIC_PROFILES[
      profileKey
    ] || {};

  const coverUrl =
    item.coverUrl ||
    item.cover_url ||
    "";

  const artworkTitle =
    item.artworkTitle ||
    item.artwork_title ||
    "";

  const displayLabel =
    item.displayLabel ||
    item.display_label ||
    "";

  const trackCount =
    item.trackCount ??
    item.track_count ??
    0;

  const releaseDate =
    item.releaseDate ||
    item.release_date ||
    "";

  const releaseUrl =
    item.releaseUrl ||
    item.release_url ||
    "";

  const artistName =
    item.artist ||
    item.artist_name ||
    profileSetting.name ||
    "";

  const albumType =
    item.type ||
    item.albumType ||
    item.album_type ||
    item.releaseType ||
    item.release_type ||
    "";

  const publishedValue =
    item.published === false ||
    Number(item.published) === 0
      ? false
      : true;

  /*
   * 기본 음원 정보
   */
  setAdminFormValue(
    "adminMusicId",
    item.id || profileKey
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
    "adminMusicType",
    albumType
  );

  setAdminFormValue(
    "adminMusicTitle",
    item.title || ""
  );

  setAdminFormValue(
    "adminMusicEditorName",
    artistName
  );

  setAdminFormValue(
    "adminMusicArtworkTitle",
    artworkTitle
  );

  setAdminFormValue(
    "adminMusicDisplayLabel",
    displayLabel
  );

  setAdminFormValue(
    "adminMusicTrackCount",
    Number(trackCount) || 0
  );

  setAdminFormValue(
    "adminMusicReleaseDate",
    releaseDate
  );

  setAdminFormValue(
    "adminMusicDescription",
    item.description || ""
  );

  setAdminFormValue(
    "adminMusicReleaseUrl",
    releaseUrl
  );

  setAdminFormValue(
    "adminMusicPublished",
    publishedValue
  );

  /*
   * 예전 고정 플랫폼 숨김 입력값도 유지
   * 기존 서버 구조와 임시 호환하기 위함
   */
  setAdminFormValue(
    "adminMusicYoutube",
    item.youtubeUrl ||
    item.youtube_url ||
    ""
  );

  setAdminFormValue(
    "adminMusicSpotify",
    item.spotifyUrl ||
    item.spotify_url ||
    ""
  );

  setAdminFormValue(
    "adminMusicApple",
    item.appleUrl ||
    item.apple_url ||
    ""
  );

  /*
   * 새 동적 플랫폼 목록 만들기
   *
   * 지원 형식:
   * 1. platforms 배열
   * 2. platforms JSON 문자열
   * 3. platforms 객체
   * 4. 기존 youtubeUrl / spotifyUrl / appleUrl
   */
  const savedPlatforms =
    getAdminMusicPlatformsFromItem(
      item
    );

  renderAdminMusicPlatforms(
    savedPlatforms
  );

  /*
   * 플랫폼 JSON 숨김값 동기화
   */
  syncAdminMusicPlatformsJson();

  /*
   * 앨범 자켓 미리보기
   */
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
      `${
        item.title ||
        artistName ||
        "앨범"
      } 자켓 미리보기`;

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
      "";

    previewBox.hidden =
      true;
  }

  /*
   * 파일 선택값 초기화
   */
  const coverInput =
    document.getElementById(
      "adminMusicImage"
    );

  if (coverInput) {
    coverInput.value = "";
  }

  /*
   * 관리자 수정 화면 상단 이름
   */
  const editorCategory =
    document.getElementById(
      "adminMusicEditorCategory"
    );

  if (editorCategory) {
    editorCategory.textContent =
      profileSetting.category ||
      "MUSIC PROFILE";
  }

  /*
   * 수정 화면 제목
   */
  setAdminFormTitle(
    "music",
    "edit"
  );
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
  if (!item) {
    return;
  }

  const imageUrl =
    item.imageUrl ||
    item.image_url ||
    "";

  const imagePositionX =
    Number(
      item.imagePositionX ??
        item.image_position_x ??
        50
    );

  const imagePositionY =
    Number(
      item.imagePositionY ??
        item.image_position_y ??
        50
    );

  const imageScale =
    Number(
      item.imageScale ??
        item.image_scale ??
        100
    );

  setAdminFormValue(
    "adminMemberId",
    item.id || ""
  );

  setAdminFormValue(
    "adminMemberName",
    item.name || ""
  );

  setAdminFormValue(
    "adminMemberEnglishName",
    item.englishName ||
      item.english_name ||
      ""
  );

  setAdminFormValue(
    "adminMemberRole",
    item.role || ""
  );

  setAdminFormValue(
    "adminMemberDescription",
    item.description || ""
  );

  setAdminFormValue(
    "adminMemberOrder",
    item.order ??
      item.sortOrder ??
      item.sort_order ??
      0
  );

  setAdminFormValue(
    "adminMemberPublished",
    item.published
  );

  /*
   * 기존 프로필 이미지 미리보기
   */

  if (
    adminMemberImagePreview &&
    adminMemberPreviewImage &&
    imageUrl
  ) {
    adminMemberPreviewImage.src =
      imageUrl;

    adminMemberPreviewImage.alt =
      `${
        item.name || "멤버"
      } 프로필 사진 미리보기`;

    adminMemberPreviewImage.style.display =
      "block";

    adminMemberImagePreview.hidden =
      false;
  } else if (
    adminMemberImagePreview &&
    adminMemberPreviewImage
  ) {
    adminMemberPreviewImage.removeAttribute(
      "src"
    );

    adminMemberPreviewImage.alt =
      "";

    adminMemberPreviewImage.style.display =
      "none";

    adminMemberImagePreview.hidden =
      true;
  }

  /*
   * 사진 위치 및 확대값 복원
   */

  setAdminMemberImageEditorValues({
    imagePositionX,
    imagePositionY,
    imageScale,
  });

  /*
   * SNS 링크 복원
   */

  const socialLinks =
    getMemberSocialLinksFromItem(
      item
    );

  setAdminMemberSocialLinks(
    socialLinks
  );

  /*
   * 파일 선택창 초기화
   * 기존 사진은 유지하고 새 파일 선택값만 제거
   */

  if (
    adminMemberImageInput
  ) {
    adminMemberImageInput.value =
      "";
  }
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

/* =========================================================
   MEMBERS FORM SUBMIT
   - 프로필 사진 업로드
   - 사진 위치 및 확대값 저장
   - 동적 SNS 링크 저장
   - 기존 Instagram 데이터 호환
   - 홈페이지 멤버 카드 즉시 갱신
========================================================= */

document
  .getElementById("adminMembersForm")
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
          "adminMemberId"
        );

      const name =
        getAdminFormValue(
          "adminMemberName"
        );

      const role =
        getAdminFormValue(
          "adminMemberRole"
        );

      /*
       * 필수 입력값 검사
       */

      if (!name) {
        alert(
          "멤버 이름을 입력해 주세요."
        );

        document
          .getElementById(
            "adminMemberName"
          )
          ?.focus();

        return;
      }

      if (!role) {
        alert(
          "멤버 역할을 입력해 주세요."
        );

        document
          .getElementById(
            "adminMemberRole"
          )
          ?.focus();

        return;
      }

      /*
       * 현재 수정 중인 멤버 찾기
       */

      const existingItem =
        adminStore.members.find(
          (memberItem) =>
            String(memberItem.id) ===
            String(id)
        );

      /*
       * 새 사진을 선택하지 않으면
       * 기존 사진 주소 유지
       */

      let imageUrl =
        existingItem?.imageUrl ||
        existingItem?.image_url ||
        "";

      const imageInput =
        document.getElementById(
          "adminMemberImage"
        );

      /*
       * 사진 위치 및 확대값
       */

      const imageEditorValues =
        getAdminMemberImageEditorValues();

      const imagePositionX =
        Number(
          imageEditorValues.imagePositionX
        );

      const imagePositionY =
        Number(
          imageEditorValues.imagePositionY
        );

      const imageScale =
        Number(
          imageEditorValues.imageScale
        );

      /*
       * SNS 편집기에 입력된 링크 전체
       */

      const socialLinks =
        getAdminMemberSocialLinks();

      const socialLinksJson =
        JSON.stringify(
          socialLinks
        );

      /*
       * 기존 Instagram 필드 호환
       * SNS 목록에서 Instagram 링크를 찾아 저장
       */

      const instagramUrl =
        socialLinks.find(
          (socialLink) =>
            socialLink.platform ===
            "instagram"
        )?.url || "";

      try {
        if (submitButton) {
          submitButton.disabled =
            true;

          submitButton.textContent =
            "저장 준비 중...";
        }

        /*
         * 새 프로필 사진 업로드
         */

        const selectedImageFile =
          imageInput?.files?.[0];

        if (selectedImageFile) {
          if (
            !selectedImageFile.type.startsWith(
              "image/"
            )
          ) {
            throw new Error(
              "이미지 파일만 선택할 수 있습니다."
            );
          }

          if (submitButton) {
            submitButton.textContent =
              "사진 업로드 중...";
          }

          imageUrl =
            await uploadAdminImage(
              selectedImageFile,
              "members"
            );

          if (!imageUrl) {
            throw new Error(
              "프로필 사진 주소를 받지 못했습니다."
            );
          }
        }

        if (submitButton) {
          submitButton.textContent =
            "멤버 정보 저장 중...";
        }

        /*
         * 서버로 전송할 멤버 데이터
         */

        const data = {
          id:
            id ||
            createAdminId(
              "members"
            ),

          name,

          englishName:
            getAdminFormValue(
              "adminMemberEnglishName"
            ),

          role,

          description:
            getAdminFormValue(
              "adminMemberDescription"
            ),

          imageUrl,

          imagePositionX,
          imagePositionY,
          imageScale,

          /*
           * 기존 데이터 호환용
           */

          instagram:
            instagramUrl,

          /*
           * 새로운 SNS 데이터
           */

          socialLinks,
          socialLinksJson,

          order:
            Number(
              getAdminFormValue(
                "adminMemberOrder"
              )
            ) || 0,

          published:
            getAdminFormValue(
              "adminMemberPublished"
            ),
        };

        /*
         * D1 저장
         */

        const savedItem =
          await saveAdminItem(
            "members",
            data
          );

        /*
         * 서버 응답과 현재 입력값 병합
         */

        const normalizedSavedItem = {
          ...(existingItem || {}),
          ...data,
          ...(savedItem || {}),

          imageUrl:
            savedItem?.imageUrl ||
            savedItem?.image_url ||
            imageUrl,

          imagePositionX:
            savedItem?.imagePositionX ??
            savedItem?.image_position_x ??
            imagePositionX,

          imagePositionY:
            savedItem?.imagePositionY ??
            savedItem?.image_position_y ??
            imagePositionY,

          imageScale:
            savedItem?.imageScale ??
            savedItem?.image_scale ??
            imageScale,

          instagram:
            savedItem?.instagram ||
            savedItem?.instagramUrl ||
            savedItem?.instagram_url ||
            instagramUrl,

          socialLinks:
            savedItem?.socialLinks ||
            savedItem?.social_links ||
            socialLinks,

          socialLinksJson:
            savedItem?.socialLinksJson ||
            savedItem?.social_links_json ||
            socialLinksJson,
        };

        /*
         * 관리자 목록 데이터 갱신
         */

        const savedIndex =
          adminStore.members.findIndex(
            (memberItem) =>
              String(memberItem.id) ===
              String(
                normalizedSavedItem.id
              )
          );

        if (savedIndex >= 0) {
          adminStore.members[
            savedIndex
          ] =
            normalizedSavedItem;
        } else {
          adminStore.members.unshift(
            normalizedSavedItem
          );
        }

        renderAllAdminLists();

        /*
         * 홈페이지 멤버 카드 즉시 갱신
         */

        await loadPublicMembers();

        alert(
          "멤버 정보가 저장되었습니다."
        );
      } catch (error) {
        console.error(
          "멤버 저장 실패:",
          error
        );

        alert(
          error.message ||
          "멤버 정보를 저장하지 못했습니다."
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
   MUSIC PROFILE FORM SUBMIT
   - 동적 플랫폼 전체 저장
   - 기존 플랫폼 필드도 함께 유지
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
              musicItem.id ||
              "";

            return (
              String(
                savedProfileKey
              ) ===
              String(
                profileKey
              )
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
          "adminMusicType"
        );

      const title =
        getAdminFormValue(
          "adminMusicTitle"
        );

      const published =
        getAdminFormValue(
          "adminMusicPublished"
        );

      /*
       * 현재 플랫폼 입력칸 전체 수집
       */
      const platforms =
        collectAdminMusicPlatforms();

      /*
       * 플랫폼별 기존 호환 주소
       */
      const getPlatformUrl = (
        platformKey
      ) => {
        const platformItem =
          platforms.find(
            (item) =>
              item.key ===
              platformKey
          );

        return (
          platformItem?.url || ""
        );
      };

      const youtubeUrl =
        getPlatformUrl("youtube");

      const spotifyUrl =
        getPlatformUrl("spotify");

      const appleUrl =
        getPlatformUrl("apple");

      const melonUrl =
        getPlatformUrl("melon");

      /*
       * 기존 자켓 주소 유지
       */
      let coverUrl =
        getAdminFormValue(
          "adminMusicCoverUrl"
        ) ||
        existingItem?.coverUrl ||
        existingItem?.cover_url ||
        "";

      const coverInput =
        document.getElementById(
          "adminMusicImage"
        );

      /*
       * 필수값 검사
       */
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
            "adminMusicType"
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

      /*
       * 입력된 플랫폼 링크 검사
       */
      const platformRows =
        Array.from(
          document.querySelectorAll(
            "#adminMusicPlatformList [data-admin-platform-row]"
          )
        );

      const emptyUrlRow =
        platformRows.find(
          (row) => {
            const url =
              row
                .querySelector(
                  "[data-admin-platform-url]"
                )
                ?.value.trim() ||
              "";

            return !url;
          }
        );

      if (emptyUrlRow) {
        alert(
          "추가한 플랫폼의 음원 링크를 입력하거나 해당 플랫폼을 삭제해 주세요."
        );

        emptyUrlRow
          .querySelector(
            "[data-admin-platform-url]"
          )
          ?.focus();

        return;
      }

      const invalidOtherPlatform =
        platforms.find(
          (platformItem) =>
            platformItem.key ===
              "other" &&
            !String(
              platformItem.label || ""
            ).trim()
        );

      if (invalidOtherPlatform) {
        alert(
          "기타 플랫폼의 이름을 입력해 주세요."
        );

        return;
      }

      try {
        if (submitButton) {
          submitButton.disabled =
            true;

          submitButton.textContent =
            "저장 준비 중...";
        }

        /*
         * 새 자켓 선택 시 업로드
         */
        const selectedCoverFile =
          coverInput?.files?.[0];

        if (selectedCoverFile) {
          if (submitButton) {
            submitButton.textContent =
              "자켓 업로드 중...";
          }

          coverUrl =
            await uploadAdminImage(
              selectedCoverFile,
              "music"
            );

          if (!coverUrl) {
            throw new Error(
              "앨범 자켓 주소를 받지 못했습니다."
            );
          }

          setAdminFormValue(
            "adminMusicCoverUrl",
            coverUrl
          );
        }

        if (submitButton) {
          submitButton.textContent =
            "음원 정보 저장 중...";
        }

        /*
         * hidden JSON 값 갱신
         */
        const platformsJson =
          JSON.stringify(
            platforms
          );

        setAdminFormValue(
          "adminMusicPlatformsJson",
          platformsJson
        );

        /*
         * 서버 전송 데이터
         */
        const data = {
          id:
            id ||
            profileKey ||
            createAdminId(
              "music"
            ),

          profileKey,

          type:
            albumType,

          title,

          artist,

          artworkTitle:
            getAdminFormValue(
              "adminMusicArtworkTitle"
            ),

          displayLabel:
            getAdminFormValue(
              "adminMusicDisplayLabel"
            ),

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

          coverUrl,

          /*
           * 새로운 동적 플랫폼 저장값
           */
          platforms,

          platformsJson,

          /*
           * 기존 서버·데이터 호환값
           */
          youtubeUrl,
          spotifyUrl,
          appleUrl,
          melonUrl,

          published,
        };

        const savedItem =
          await saveAdminItem(
            "music",
            data
          );

        /*
         * 서버가 platforms를 응답하지 않는 경우에도
         * 현재 화면에서는 입력값 유지
         */
        const normalizedSavedItem = {
          ...existingItem,
          ...data,
          ...(savedItem || {}),

          platforms:
            savedItem?.platforms ||
            savedItem?.platformsJson ||
            savedItem?.platforms_json
              ? (
                  savedItem.platforms ||
                  savedItem.platformsJson ||
                  savedItem.platforms_json
                )
              : platforms,

          platformsJson:
            savedItem?.platformsJson ||
            savedItem?.platforms_json ||
            platformsJson,

          youtubeUrl:
            savedItem?.youtubeUrl ||
            savedItem?.youtube_url ||
            youtubeUrl,

          spotifyUrl:
            savedItem?.spotifyUrl ||
            savedItem?.spotify_url ||
            spotifyUrl,

          appleUrl:
            savedItem?.appleUrl ||
            savedItem?.apple_url ||
            appleUrl,

          melonUrl:
            savedItem?.melonUrl ||
            savedItem?.melon_url ||
            melonUrl,
        };

        const savedIndex =
          adminStore.music.findIndex(
            (musicItem) => {
              const savedProfileKey =
                musicItem.profileKey ||
                musicItem.profile_key ||
                musicItem.id ||
                "";

              return (
                String(
                  savedProfileKey
                ) ===
                String(
                  profileKey
                )
              );
            }
          );

        if (savedIndex >= 0) {
          adminStore.music[
            savedIndex
          ] =
            normalizedSavedItem;
        } else {
          adminStore.music.unshift(
            normalizedSavedItem
          );
        }

        renderAllAdminLists();

        await loadPublicMusic();

        alert(
          "음원 정보가 저장되었습니다."
        );
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

/* =========================================================
   IMAGE PREVIEW
   - 일반 이미지 미리보기
   - 멤버 사진 위치 및 확대 편집
========================================================= */

/* =========================
   일반 이미지 미리보기
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

  input.addEventListener(
    "change",
    () => {
      const file =
        input.files?.[0];

      if (!file) {
        previewBox.hidden = true;

        previewImage.removeAttribute(
          "src"
        );

        return;
      }

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        input.value = "";

        previewBox.hidden = true;

        previewImage.removeAttribute(
          "src"
        );

        alert(
          "이미지 파일만 선택할 수 있습니다."
        );

        return;
      }

      const imageUrl =
        URL.createObjectURL(file);

      previewImage.src =
        imageUrl;

      previewBox.hidden =
        false;

      previewImage.onload =
        () => {
          URL.revokeObjectURL(
            imageUrl
          );
        };
    }
  );
}


/* =========================
   멤버 이미지 편집 요소
========================= */

const adminMemberImageInput =
  document.getElementById(
    "adminMemberImage"
  );

const adminMemberImagePreview =
  document.getElementById(
    "adminMemberImagePreview"
  );

const adminMemberPreviewImage =
  document.getElementById(
    "adminMemberPreviewImage"
  );

const adminMemberImageScale =
  document.getElementById(
    "adminMemberImageScale"
  );

const adminMemberImagePosX =
  document.getElementById(
    "adminMemberImagePosX"
  );

const adminMemberImagePosY =
  document.getElementById(
    "adminMemberImagePosY"
  );

const adminMemberImageScaleValue =
  document.getElementById(
    "adminMemberImageScaleValue"
  );

const adminMemberImagePosXValue =
  document.getElementById(
    "adminMemberImagePosXValue"
  );

const adminMemberImagePosYValue =
  document.getElementById(
    "adminMemberImagePosYValue"
  );

const adminMemberImageReset =
  document.getElementById(
    "adminMemberImageReset"
  );


/* =========================
   멤버 이미지 값 제한
========================= */

function clampAdminMemberImageValue(
  value,
  minimum,
  maximum,
  fallback
) {
  const numberValue =
    Number.parseInt(
      value,
      10
    );

  if (
    !Number.isFinite(
      numberValue
    )
  ) {
    return fallback;
  }

  return Math.min(
    maximum,
    Math.max(
      minimum,
      numberValue
    )
  );
}


/* =========================
   멤버 이미지 편집값 가져오기
========================= */

function getAdminMemberImageEditorValues() {
  return {
    imagePositionX:
      clampAdminMemberImageValue(
        adminMemberImagePosX?.value,
        0,
        100,
        50
      ),

    imagePositionY:
      clampAdminMemberImageValue(
        adminMemberImagePosY?.value,
        0,
        100,
        50
      ),

    imageScale:
      clampAdminMemberImageValue(
        adminMemberImageScale?.value,
        100,
        180,
        100
      ),
  };
}


/* =========================
   멤버 이미지 미리보기 갱신
========================= */

function updateAdminMemberImagePreview() {
  const {
    imagePositionX,
    imagePositionY,
    imageScale,
  } =
    getAdminMemberImageEditorValues();

  if (
    adminMemberImageScaleValue
  ) {
    adminMemberImageScaleValue.textContent =
      `${imageScale}%`;
  }

  if (
    adminMemberImagePosXValue
  ) {
    adminMemberImagePosXValue.textContent =
      `${imagePositionX}%`;
  }

  if (
    adminMemberImagePosYValue
  ) {
    adminMemberImagePosYValue.textContent =
      `${imagePositionY}%`;
  }

  if (
    !adminMemberPreviewImage
  ) {
    return;
  }

  adminMemberPreviewImage.style.objectPosition =
    `${imagePositionX}% ${imagePositionY}%`;

  adminMemberPreviewImage.style.transform =
    `scale(${imageScale / 100})`;

  adminMemberPreviewImage.style.transformOrigin =
    "center center";

  adminMemberPreviewImage.style.display =
    adminMemberPreviewImage.getAttribute("src")
      ? "block"
      : "none";
}


/* =========================
   멤버 이미지 편집값 설정
========================= */

function setAdminMemberImageEditorValues({
  imagePositionX = 50,
  imagePositionY = 50,
  imageScale = 100,
} = {}) {
  const cleanPositionX =
    clampAdminMemberImageValue(
      imagePositionX,
      0,
      100,
      50
    );

  const cleanPositionY =
    clampAdminMemberImageValue(
      imagePositionY,
      0,
      100,
      50
    );

  const cleanScale =
    clampAdminMemberImageValue(
      imageScale,
      100,
      180,
      100
    );

  if (
    adminMemberImagePosX
  ) {
    adminMemberImagePosX.value =
      String(cleanPositionX);
  }

  if (
    adminMemberImagePosY
  ) {
    adminMemberImagePosY.value =
      String(cleanPositionY);
  }

  if (
    adminMemberImageScale
  ) {
    adminMemberImageScale.value =
      String(cleanScale);
  }

  if (
    adminMemberImagePosXValue
  ) {
    adminMemberImagePosXValue.textContent =
      `${cleanPositionX}%`;
  }

  if (
    adminMemberImagePosYValue
  ) {
    adminMemberImagePosYValue.textContent =
      `${cleanPositionY}%`;
  }

  if (
    adminMemberImageScaleValue
  ) {
    adminMemberImageScaleValue.textContent =
      `${cleanScale}%`;
  }

  updateAdminMemberImagePreview();
}


/* =========================
   멤버 이미지 편집 초기화
========================= */

function resetAdminMemberImageEditor({
  hidePreview = true,
  clearImage = true,
  clearFile = true,
} = {}) {
  setAdminMemberImageEditorValues({
    imagePositionX: 50,
    imagePositionY: 50,
    imageScale: 100,
  });

  if (
    clearFile &&
    adminMemberImageInput
  ) {
    adminMemberImageInput.value = "";
  }

  if (
    clearImage &&
    adminMemberPreviewImage
  ) {
    adminMemberPreviewImage.removeAttribute(
      "src"
    );

    adminMemberPreviewImage.alt = "";

    adminMemberPreviewImage.style.objectPosition =
      "50% 50%";

    adminMemberPreviewImage.style.transform =
      "scale(1)";

    adminMemberPreviewImage.style.transformOrigin =
      "center center";
  }

  if (
    hidePreview &&
    adminMemberImagePreview
  ) {
    adminMemberImagePreview.hidden = true;
  }
}


/* =========================
   멤버 사진 선택
========================= */

adminMemberImageInput
  ?.addEventListener(
    "change",
    () => {
      const file =
        adminMemberImageInput
          .files?.[0];

      if (!file) {
        return;
      }

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        adminMemberImageInput.value =
          "";

        alert(
          "이미지 파일만 선택할 수 있습니다."
        );

        return;
      }

      const imageUrl =
        URL.createObjectURL(
          file
        );

      if (
        adminMemberPreviewImage
      ) {
        adminMemberPreviewImage.src =
          imageUrl;

        adminMemberPreviewImage.alt =
          "선택한 멤버 프로필 사진 미리보기";

        adminMemberPreviewImage.onload =
          () => {
            URL.revokeObjectURL(
              imageUrl
            );
          };
      }

      if (
        adminMemberImagePreview
      ) {
        adminMemberImagePreview.hidden =
          false;
      }

      setAdminMemberImageEditorValues({
        imagePositionX: 50,
        imagePositionY: 50,
        imageScale: 100,
      });
    }
  );


/* =========================
   슬라이더 실시간 반영
========================= */

[
  adminMemberImageScale,
  adminMemberImagePosX,
  adminMemberImagePosY,
].forEach(
  (rangeInput) => {
    rangeInput?.addEventListener(
      "input",
      updateAdminMemberImagePreview
    );
  }
);


/* =========================
   위치 초기화 버튼
========================= */

adminMemberImageReset
  ?.addEventListener(
    "click",
    () => {
      setAdminMemberImageEditorValues({
        imagePositionX: 50,
        imagePositionY: 50,
        imageScale: 100,
      });
    }
  );


/* =========================
   일반 이미지 미리보기 연결
========================= */

connectImagePreview(
  "adminMusicImage",
  "adminMusicImagePreview",
  "adminMusicPreviewImage"
);

connectImagePreview(
  "adminSettingHeroImage",
  "adminSettingHeroPreview",
  "adminSettingHeroPreviewImage"
);


/* =========================
   멤버 편집기 최초 상태
========================= */

setAdminMemberImageEditorValues({
  imagePositionX: 50,
  imagePositionY: 50,
  imageScale: 100,
});

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

/* =========================================================
   ADMIN MUSIC PLATFORM MANAGER
   - 플랫폼 자유 추가
   - 플랫폼 변경
   - 링크 입력
   - 개별 삭제
   - JSON 자동 동기화
========================================================= */

const ADMIN_MUSIC_PLATFORM_OPTIONS = [
  {
    key: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/...",
  },

  {
    key: "spotify",
    label: "Spotify",
    placeholder: "https://open.spotify.com/...",
  },

  {
    key: "apple",
    label: "Apple Music",
    placeholder: "https://music.apple.com/...",
  },

  {
    key: "melon",
    label: "Melon",
    placeholder: "https://www.melon.com/...",
  },

  {
    key: "genie",
    label: "Genie",
    placeholder: "https://www.genie.co.kr/...",
  },

  {
    key: "flo",
    label: "FLO",
    placeholder: "https://www.music-flo.com/...",
  },

  {
    key: "bugs",
    label: "Bugs",
    placeholder: "https://music.bugs.co.kr/...",
  },

  {
    key: "soundcloud",
    label: "SoundCloud",
    placeholder: "https://soundcloud.com/...",
  },

  {
    key: "bandcamp",
    label: "Bandcamp",
    placeholder: "https://artist.bandcamp.com/...",
  },

  {
    key: "lineMusic",
    label: "LINE MUSIC",
    placeholder: "https://music.line.me/...",
  },

  {
    key: "qqMusic",
    label: "QQ Music",
    placeholder: "https://y.qq.com/...",
  },

  {
    key: "other",
    label: "기타 플랫폼",
    placeholder: "https://...",
  },
];


/* =========================
   플랫폼 설정 찾기
========================= */

function getAdminMusicPlatformSetting(
  platformKey
) {
  return (
    ADMIN_MUSIC_PLATFORM_OPTIONS.find(
      (option) =>
        option.key === platformKey
    ) ||
    ADMIN_MUSIC_PLATFORM_OPTIONS.find(
      (option) =>
        option.key === "other"
    )
  );
}


/* =========================
   플랫폼 행 ID 생성
========================= */

function createAdminMusicPlatformRowId() {
  return (
    "music-platform-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .slice(2, 8)
  );
}


/* =========================
   플랫폼 행 HTML 생성
========================= */

function createAdminMusicPlatformRow(
  platformData = {}
) {
  const rowId =
    platformData.rowId ||
    createAdminMusicPlatformRowId();

  const selectedKey =
    String(
      platformData.key ||
      platformData.platform ||
      "youtube"
    ).trim();

  const selectedUrl =
    String(
      platformData.url ||
      platformData.link ||
      ""
    ).trim();

  const selectedLabel =
    String(
      platformData.label ||
      ""
    ).trim();

  const setting =
    getAdminMusicPlatformSetting(
      selectedKey
    );

  const platformOptionsHtml =
    ADMIN_MUSIC_PLATFORM_OPTIONS
      .map((option) => {
        const isSelected =
          option.key === selectedKey;

        return `
          <option
            value="${escapeAdminHtml(
              option.key
            )}"
            ${
              isSelected
                ? "selected"
                : ""
            }
          >
            ${escapeAdminHtml(
              option.label
            )}
          </option>
        `;
      })
      .join("");

  return `
    <article
      class="admin-platform-item"
      data-admin-platform-row="${escapeAdminHtml(
        rowId
      )}"
    >
      <div class="admin-platform-item-header">
        <strong>
          음원 플랫폼
        </strong>

        <button
          class="admin-platform-remove-button"
          type="button"
          data-remove-admin-platform
          aria-label="음원 플랫폼 삭제"
        >
          삭제
        </button>
      </div>

      <div class="admin-platform-fields">
        <label>
          플랫폼

          <select
            class="admin-platform-type-select"
            data-admin-platform-key
          >
            ${platformOptionsHtml}
          </select>
        </label>

        <label
          class="admin-platform-custom-label-field"
          ${
            selectedKey === "other"
              ? ""
              : "hidden"
          }
        >
          플랫폼 이름

          <input
            class="admin-platform-custom-label"
            type="text"
            maxlength="30"
            value="${escapeAdminHtml(
              selectedLabel
            )}"
            placeholder="예: TikTok Music"
            data-admin-platform-label
          />
        </label>

        <label>
          음원 링크

          <input
            class="admin-platform-url-input"
            type="url"
            value="${escapeAdminHtml(
              selectedUrl
            )}"
            placeholder="${escapeAdminHtml(
              setting.placeholder
            )}"
            autocomplete="url"
            data-admin-platform-url
          />

          <small class="admin-field-help">
            앨범, 싱글 또는 트랙 주소를 입력하세요.
          </small>
        </label>
      </div>
    </article>
  `;
}


/* =========================
   플랫폼 목록 저장값 만들기
========================= */

function collectAdminMusicPlatforms() {
  const platformList =
    document.getElementById(
      "adminMusicPlatformList"
    );

  if (!platformList) {
    return [];
  }

  return Array.from(
    platformList.querySelectorAll(
      "[data-admin-platform-row]"
    )
  )
    .map((row) => {
      const platformKey =
        row
          .querySelector(
            "[data-admin-platform-key]"
          )
          ?.value.trim() ||
        "";

      const platformUrl =
        row
          .querySelector(
            "[data-admin-platform-url]"
          )
          ?.value.trim() ||
        "";

      const customLabel =
        row
          .querySelector(
            "[data-admin-platform-label]"
          )
          ?.value.trim() ||
        "";

      const setting =
        getAdminMusicPlatformSetting(
          platformKey
        );

      return {
        key: platformKey,

        label:
          platformKey === "other"
            ? customLabel ||
              "기타 플랫폼"
            : setting.label,

        url: platformUrl,
      };
    })
    .filter(
      (platformItem) =>
        platformItem.key &&
        platformItem.url
    );
}


/* =========================
   hidden JSON과 동기화
========================= */

function syncAdminMusicPlatformsJson() {
  const hiddenInput =
    document.getElementById(
      "adminMusicPlatformsJson"
    );

  if (!hiddenInput) {
    return;
  }

  hiddenInput.value =
    JSON.stringify(
      collectAdminMusicPlatforms()
    );
}


/* =========================
   빈 상태 표시 갱신
========================= */

function updateAdminMusicPlatformEmptyState() {
  const platformList =
    document.getElementById(
      "adminMusicPlatformList"
    );

  if (!platformList) {
    return;
  }

  const rows =
    platformList.querySelectorAll(
      "[data-admin-platform-row]"
    );

  const existingEmptyState =
    platformList.querySelector(
      ".admin-platform-empty-state"
    );

  if (rows.length > 0) {
    existingEmptyState?.remove();
    return;
  }

  if (existingEmptyState) {
    return;
  }

  platformList.innerHTML = `
    <div
      class="admin-platform-empty-state"
      id="adminMusicPlatformEmpty"
    >
      <strong>
        등록된 음원 플랫폼이 없습니다.
      </strong>

      <p>
        플랫폼 추가 버튼을 눌러 음원 링크를 등록해 주세요.
      </p>
    </div>
  `;
}


/* =========================
   플랫폼 한 개 추가
========================= */

function addAdminMusicPlatform(
  platformData = {}
) {
  const platformList =
    document.getElementById(
      "adminMusicPlatformList"
    );

  if (!platformList) {
    return;
  }

  platformList
    .querySelector(
      ".admin-platform-empty-state"
    )
    ?.remove();

  platformList.insertAdjacentHTML(
    "beforeend",
    createAdminMusicPlatformRow(
      platformData
    )
  );

  syncAdminMusicPlatformsJson();

  const latestRow =
    platformList.lastElementChild;

  latestRow
    ?.querySelector(
      "[data-admin-platform-key]"
    )
    ?.focus();
}


/* =========================
   플랫폼 목록 전체 출력
========================= */

function renderAdminMusicPlatforms(
  platforms = []
) {
  const platformList =
    document.getElementById(
      "adminMusicPlatformList"
    );

  if (!platformList) {
    return;
  }

  const cleanPlatforms =
    Array.isArray(platforms)
      ? platforms.filter(
          (platformItem) =>
            platformItem &&
            typeof platformItem ===
              "object"
        )
      : [];

  if (
    cleanPlatforms.length === 0
  ) {
    platformList.innerHTML = "";

    updateAdminMusicPlatformEmptyState();
    syncAdminMusicPlatformsJson();

    return;
  }

  platformList.innerHTML =
    cleanPlatforms
      .map(
        createAdminMusicPlatformRow
      )
      .join("");

  syncAdminMusicPlatformsJson();
}


/* =========================
   JSON 값 안전하게 읽기
========================= */

function parseAdminMusicPlatforms(
  value
) {
  if (Array.isArray(value)) {
    return value;
  }

  if (
    value &&
    typeof value === "object"
  ) {
    return Object.entries(value).map(
      ([platformKey, platformValue]) => {
        if (
          typeof platformValue ===
          "string"
        ) {
          return {
            key: platformKey,
            url: platformValue,
          };
        }

        return {
          key: platformKey,
          ...(platformValue || {}),
        };
      }
    );
  }

  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return [];
  }

  try {
    const parsedValue =
      JSON.parse(value);

    return parseAdminMusicPlatforms(
      parsedValue
    );
  } catch {
    return [];
  }
}


/* =========================
   기존 저장 형식까지 플랫폼 변환
========================= */

function getAdminMusicPlatformsFromItem(
  item = {}
) {
  const platformMap = new Map();

  const dynamicPlatforms =
    parseAdminMusicPlatforms(
      item.platforms ||
      item.platformsJson ||
      item.platforms_json ||
      []
    );

  dynamicPlatforms.forEach(
    (platformItem) => {
      const platformKey =
        String(
          platformItem.key ||
          platformItem.platform ||
          platformItem.type ||
          ""
        ).trim();

      const platformUrl =
        String(
          platformItem.url ||
          platformItem.link ||
          ""
        ).trim();

      if (
        !platformKey ||
        !platformUrl
      ) {
        return;
      }

      platformMap.set(
        platformKey,
        {
          key: platformKey,

          label:
            platformItem.label ||
            platformItem.name ||
            "",

          url: platformUrl,
        }
      );
    }
  );

  const legacyPlatforms = [
    {
      key: "youtube",
      url:
        item.youtubeUrl ||
        item.youtube_url ||
        "",
    },

    {
      key: "spotify",
      url:
        item.spotifyUrl ||
        item.spotify_url ||
        "",
    },

    {
      key: "apple",
      url:
        item.appleUrl ||
        item.apple_url ||
        "",
    },

    {
      key: "melon",
      url:
        item.melonUrl ||
        item.melon_url ||
        "",
    },
  ];

  legacyPlatforms.forEach(
    (platformItem) => {
      const cleanUrl =
        String(
          platformItem.url || ""
        ).trim();

      if (
        !cleanUrl ||
        platformMap.has(
          platformItem.key
        )
      ) {
        return;
      }

      platformMap.set(
        platformItem.key,
        {
          key: platformItem.key,
          url: cleanUrl,
        }
      );
    }
  );

  return Array.from(
    platformMap.values()
  );
}


/* =========================
   플랫폼 선택 변경 처리
========================= */

function handleAdminMusicPlatformChange(
  selectElement
) {
  const row =
    selectElement.closest(
      "[data-admin-platform-row]"
    );

  if (!row) {
    return;
  }

  const platformKey =
    selectElement.value;

  const setting =
    getAdminMusicPlatformSetting(
      platformKey
    );

  const urlInput =
    row.querySelector(
      "[data-admin-platform-url]"
    );

  const customLabelField =
    row.querySelector(
      ".admin-platform-custom-label-field"
    );

  const customLabelInput =
    row.querySelector(
      "[data-admin-platform-label]"
    );

  if (urlInput) {
    urlInput.placeholder =
      setting.placeholder;
  }

  if (customLabelField) {
    customLabelField.hidden =
      platformKey !== "other";
  }

  if (
    platformKey !== "other" &&
    customLabelInput
  ) {
    customLabelInput.value = "";
  }

  syncAdminMusicPlatformsJson();
}


/* =========================
   플랫폼 추가 버튼
========================= */

document
  .getElementById(
    "adminMusicPlatformAddButton"
  )
  ?.addEventListener(
    "click",
    () => {
      addAdminMusicPlatform({
        key: "youtube",
        label: "YouTube",
        url: "",
      });
    }
  );


/* =========================
   플랫폼 목록 이벤트
========================= */

document
  .getElementById(
    "adminMusicPlatformList"
  )
  ?.addEventListener(
    "click",
    (event) => {
      const removeButton =
        event.target.closest(
          "[data-remove-admin-platform]"
        );

      if (!removeButton) {
        return;
      }

      const row =
        removeButton.closest(
          "[data-admin-platform-row]"
        );

      row?.remove();

      updateAdminMusicPlatformEmptyState();
      syncAdminMusicPlatformsJson();
    }
  );

document
  .getElementById(
    "adminMusicPlatformList"
  )
  ?.addEventListener(
    "change",
    (event) => {
      const selectElement =
        event.target.closest(
          "[data-admin-platform-key]"
        );

      if (!selectElement) {
        return;
      }

      handleAdminMusicPlatformChange(
        selectElement
      );
    }
  );

document
  .getElementById(
    "adminMusicPlatformList"
  )
  ?.addEventListener(
    "input",
    (event) => {
      const platformField =
        event.target.closest(
          "[data-admin-platform-url], [data-admin-platform-label]"
        );

      if (!platformField) {
        return;
      }

      syncAdminMusicPlatformsJson();
    }
  );


/* =========================
   관리자 플랫폼 초기 상태
========================= */

function resetAdminMusicPlatforms() {
  renderAdminMusicPlatforms([]);
}

if (
  document.readyState === "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    loadPublicMembers
  );
} else {
  loadPublicMembers();
}