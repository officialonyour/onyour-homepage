const CONTENT_CONFIG = {
  news: {
    table: "news",
    orderBy: "created_at DESC",

    fields: {
      category: "category",
      title: "title",
      date: "date_text",
      description: "description",
      imageUrl: "image_url",
      published: "published",
      featured: "featured",
      publishAt: "publish_at",
    },
  },

  performance: {
    table: "performances",
    orderBy: "performance_date ASC, created_at DESC",

    fields: {
      title: "title",
      date: "performance_date",
      time: "performance_time",
      location: "location",
      address: "address",
      description: "description",
      setlist: "setlist",
      ticketUrl: "ticket_url",
      posterUrl: "poster_url",
      published: "published",
      publishAt: "publish_at",
    },
  },

  video: {
    table: "videos",
    orderBy: "created_at DESC",

    fields: {
      title: "title",
      videoType: "video_type",
      url: "video_url",
      thumbnailUrl: "thumbnail_url",
      description: "description",
      featured: "featured",
      published: "published",
      publishAt: "publish_at",
    },
  },

  music: {
    table: "music",
    orderBy: "created_at DESC",

    fields: {
      profileKey: "profile_key",
      type: "release_type",
      title: "title",
      artist: "artist",
      artworkTitle: "artwork_title",
      displayLabel: "display_label",
      trackCount: "track_count",
      releaseDate: "release_date",
      description: "description",
      coverUrl: "cover_url",

      youtubeUrl: "youtube_url",
      spotifyUrl: "spotify_url",
      appleUrl: "apple_url",

      platformsJson: "platforms_json",

      releaseUrl: "release_url",
      published: "published",
      publishAt: "publish_at",
    },
  },

  gallery: {
    table: "gallery",
    orderBy: "sort_order ASC, created_at DESC",

    fields: {
      title: "title",
      photoDate: "photo_date",
      description: "description",
      imageUrl: "image_url",
      imageKey: "image_key",
      sortOrder: "sort_order",
      published: "published",
      publishAt: "publish_at",
    },
  },

  members: {
    table: "members",
    orderBy: "sort_order ASC, created_at ASC",

    fields: {
      name: "name",
      englishName: "english_name",
      role: "role",
      description: "description",
      imageUrl: "image_url",
      instagram: "instagram_url",
      order: "sort_order",
      published: "published",
    },
  },
};


/* =========================================================
   GET /api/content?type=news
   GET /api/content?type=news&id=news-1
========================================================= */

export async function onRequestGet(context) {
  try {
    const { request, env } = context;

    if (!env.DB) {
      return jsonResponse(
        {
          success: false,
          message: "D1 DB 바인딩을 찾을 수 없습니다.",
        },
        500
      );
    }

    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const id = url.searchParams.get("id");
    const includePrivate =
      url.searchParams.get("includePrivate") === "true";

    const config = getContentConfig(type);

    if (!config) {
      return invalidTypeResponse();
    }

    if (includePrivate) {
      const authorized = isAdminAuthorized(
        request,
        env
      );

      if (!authorized) {
        return unauthorizedResponse();
      }
    }

    if (id) {
      const statement = env.DB
        .prepare(
          `
            SELECT *
            FROM ${config.table}
            WHERE id = ?
            LIMIT 1
          `
        )
        .bind(id);

      const row = await statement.first();

      if (!row) {
        return jsonResponse(
          {
            success: false,
            message: "콘텐츠를 찾을 수 없습니다.",
          },
          404
        );
      }

      if (
        !includePrivate &&
        Number(row.published) !== 1
      ) {
        return jsonResponse(
          {
            success: false,
            message: "콘텐츠를 찾을 수 없습니다.",
          },
          404
        );
      }

      return jsonResponse({
        success: true,
        item: convertDatabaseRow(
          type,
          row
        ),
      });
    }

    const visibilityClause =
      includePrivate
        ? ""
        : "WHERE published = 1";

    const statement = env.DB.prepare(
      `
        SELECT *
        FROM ${config.table}
        ${visibilityClause}
        ORDER BY ${config.orderBy}
      `
    );

    const result = await statement.all();

    return jsonResponse({
      success: true,
      items: (result.results || []).map(
        (row) =>
          convertDatabaseRow(type, row)
      ),
    });
  } catch (error) {
    console.error(
      "GET /api/content failed:",
      error
    );

    return jsonResponse(
      {
        success: false,
        message:
          "콘텐츠를 불러오는 중 오류가 발생했습니다.",
      },
      500
    );
  }
}


/* =========================================================
   POST /api/content?type=news
========================================================= */

export async function onRequestPost(context) {
  return saveContent(context, false);
}


/* =========================================================
   PUT /api/content?type=news&id=news-1
========================================================= */

export async function onRequestPut(context) {
  return saveContent(context, true);
}


/* =========================================================
   DELETE /api/content?type=news&id=news-1
========================================================= */

export async function onRequestDelete(context) {
  try {
    const { request, env } = context;

    if (!env.DB) {
      return jsonResponse(
        {
          success: false,
          message: "D1 DB 바인딩을 찾을 수 없습니다.",
        },
        500
      );
    }

    if (!isAdminAuthorized(request, env)) {
      return unauthorizedResponse();
    }

    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const id = url.searchParams.get("id");

    const config = getContentConfig(type);

    if (!config) {
      return invalidTypeResponse();
    }

    if (!id) {
      return jsonResponse(
        {
          success: false,
          message: "삭제할 콘텐츠 ID가 필요합니다.",
        },
        400
      );
    }

    const existing = await env.DB
      .prepare(
        `
          SELECT id
          FROM ${config.table}
          WHERE id = ?
          LIMIT 1
        `
      )
      .bind(id)
      .first();

    if (!existing) {
      return jsonResponse(
        {
          success: false,
          message: "삭제할 콘텐츠가 없습니다.",
        },
        404
      );
    }

    await env.DB
      .prepare(
        `
          DELETE FROM ${config.table}
          WHERE id = ?
        `
      )
      .bind(id)
      .run();

    return jsonResponse({
      success: true,
      id,
      message: "삭제되었습니다.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/content failed:",
      error
    );

    return jsonResponse(
      {
        success: false,
        message:
          "콘텐츠 삭제 중 오류가 발생했습니다.",
      },
      500
    );
  }
}


/* =========================================================
   CREATE / UPDATE
========================================================= */

async function saveContent(
  context,
  isUpdate
) {
  try {
    const { request, env } = context;

    if (!env.DB) {
      return jsonResponse(
        {
          success: false,
          message: "D1 DB 바인딩을 찾을 수 없습니다.",
        },
        500
      );
    }

    if (!isAdminAuthorized(request, env)) {
      return unauthorizedResponse();
    }

    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const queryId = url.searchParams.get("id");

    const config = getContentConfig(type);

    if (!config) {
      return invalidTypeResponse();
    }

    const body = await readJsonBody(request);

    if (!body) {
      return jsonResponse(
        {
          success: false,
          message:
            "올바른 JSON 데이터를 전송해 주세요.",
        },
        400
      );
    }

    if (
      type === "music" &&
      !String(body.coverUrl || "").trim()
    ) {
      body.coverUrl =
      await resolveMusicCoverUrl(body);
    }

    const validationError =
      validateRequiredFields(type, body);

    if (validationError) {
      return jsonResponse(
        {
          success: false,
          message: validationError,
        },
        400
      );
    }

    if (isUpdate) {
      const id = queryId || body.id;

      if (!id) {
        return jsonResponse(
          {
            success: false,
            message:
              "수정할 콘텐츠 ID가 필요합니다.",
          },
          400
        );
      }

      const exists = await env.DB
        .prepare(
          `
            SELECT id
            FROM ${config.table}
            WHERE id = ?
            LIMIT 1
          `
        )
        .bind(id)
        .first();

      if (!exists) {
        return jsonResponse(
          {
            success: false,
            message:
              "수정할 콘텐츠를 찾을 수 없습니다.",
          },
          404
        );
      }

      const normalizedData =
        normalizeContentData(
          type,
          body
        );

      const entries = Object.entries(
        normalizedData
      );

      const setClause = entries
        .map(
          ([column]) =>
            `${column} = ?`
        )
        .join(", ");

      const values = entries.map(
        ([, value]) => value
      );

      await env.DB
        .prepare(
          `
            UPDATE ${config.table}
            SET
              ${setClause},
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `
        )
        .bind(...values, id)
        .run();

      const updatedRow = await env.DB
        .prepare(
          `
            SELECT *
            FROM ${config.table}
            WHERE id = ?
            LIMIT 1
          `
        )
        .bind(id)
        .first();

      return jsonResponse({
        success: true,
        item: convertDatabaseRow(
          type,
          updatedRow
        ),
        message: "수정되었습니다.",
      });
    }

    const id =
      body.id ||
      createContentId(type);

    const normalizedData =
      normalizeContentData(
        type,
        body
      );

    const columns = [
      "id",
      ...Object.keys(normalizedData),
    ];

    const values = [
      id,
      ...Object.values(normalizedData),
    ];

    const placeholders = columns
      .map(() => "?")
      .join(", ");

    await env.DB
      .prepare(
        `
          INSERT INTO ${config.table}
          (${columns.join(", ")})
          VALUES (${placeholders})
        `
      )
      .bind(...values)
      .run();

    const insertedRow = await env.DB
      .prepare(
        `
          SELECT *
          FROM ${config.table}
          WHERE id = ?
          LIMIT 1
        `
      )
      .bind(id)
      .first();

    return jsonResponse(
      {
        success: true,
        item: convertDatabaseRow(
          type,
          insertedRow
        ),
        message: "등록되었습니다.",
      },
      201
    );
  } catch (error) {
    console.error(
      "SAVE /api/content failed:",
      error
    );

    const message =
      String(error?.message || "");

    if (
      message.includes(
        "UNIQUE constraint failed"
      )
    ) {
      return jsonResponse(
        {
          success: false,
          message:
            "이미 존재하는 콘텐츠 ID입니다.",
        },
        409
      );
    }

    return jsonResponse(
      {
        success: false,
        message:
          "콘텐츠 저장 중 오류가 발생했습니다.",
      },
      500
    );
  }
}


/* =========================================================
   NORMALIZE DATA
========================================================= */

function normalizeContentData(
  type,
  body
) {
  const config = CONTENT_CONFIG[type];
  const result = {};

  Object.entries(config.fields).forEach(
    ([clientKey, databaseColumn]) => {
      let value = body[clientKey];

      if (
        databaseColumn === "published" ||
        databaseColumn === "featured"
      ) {
        value = value ? 1 : 0;
      } else if (
        databaseColumn === "sort_order" ||
        databaseColumn === "track_count"
      ) {
        value =
          Number.parseInt(value, 10) || 0;
      } else if (value == null) {
        value = "";
      } else {
        value = String(value).trim();
      }

      result[databaseColumn] = value;
    }
  );

  if (
    type === "video" &&
    !result.video_type
  ) {
    result.video_type = "youtube";
  }

  return result;
}


/* =========================================================
   DATABASE ROW → FRONTEND OBJECT
========================================================= */

function convertDatabaseRow(
  type,
  row
) {
  const config = CONTENT_CONFIG[type];

  const item = {
    id: row.id,
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
  };

  Object.entries(config.fields).forEach(
    ([clientKey, databaseColumn]) => {
      let value = row[databaseColumn];

      if (
        databaseColumn === "published" ||
        databaseColumn === "featured"
      ) {
        value = Number(value) === 1;
      }

      item[clientKey] = value ?? "";
    }
  );

  return item;
}


/* =========================================================
   VALIDATION
========================================================= */

function validateRequiredFields(
  type,
  body
) {
  const requiredFields = {
    news: [
      ["category", "카테고리"],
      ["title", "제목"],
      ["date", "날짜 또는 상태"],
    ],

    performance: [
      ["title", "공연명"],
      ["date", "공연 날짜"],
      ["location", "공연 장소"],
    ],

    video: [
      ["title", "영상 제목"],
      ["url", "영상 주소"],
    ],

    music: [
      ["type", "음원 구분"],
      ["title", "음원 제목"],
      ["artist", "아티스트"],
    ],

    gallery: [
      ["imageUrl", "사진"],
      ["imageKey", "사진 저장 정보"],
    ],

    members: [
      ["name", "멤버 이름"],
      ["role", "멤버 역할"],
    ],
  };

  const fields =
    requiredFields[type] || [];

  for (const [field, label] of fields) {
    const value = body[field];

    if (
      value == null ||
      String(value).trim() === ""
    ) {
      return `${label}을(를) 입력해 주세요.`;
    }
  }

  return "";
}


/* =========================================================
   ADMIN AUTHORIZATION
========================================================= */

function isAdminAuthorized(
  request,
  env
) {
  const configuredPassword =
    env.ADMIN_PASSWORD;

  if (!configuredPassword) {
    console.error(
      "ADMIN_PASSWORD environment variable is missing."
    );

    return false;
  }

  const receivedPassword =
    request.headers.get(
      "X-Admin-Password"
    );

  if (!receivedPassword) {
    return false;
  }

  return timingSafeEqual(
    receivedPassword,
    configuredPassword
  );
}

function timingSafeEqual(a, b) {
  const first = String(a);
  const second = String(b);

  if (first.length !== second.length) {
    return false;
  }

  let difference = 0;

  for (
    let index = 0;
    index < first.length;
    index += 1
  ) {
    difference |=
      first.charCodeAt(index) ^
      second.charCodeAt(index);
  }

  return difference === 0;
}


/* =========================================================
   HELPERS
========================================================= */

function getContentConfig(type) {
  if (!type) return null;

  return CONTENT_CONFIG[type] || null;
}

function createContentId(type) {
  const prefix =
    type === "members"
      ? "member"
      : type;

  return `${prefix}-${crypto.randomUUID()}`;
}

async function readJsonBody(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function invalidTypeResponse() {
  return jsonResponse(
    {
      success: false,
      message:
        "지원하지 않는 콘텐츠 종류입니다.",
      allowedTypes: Object.keys(
        CONTENT_CONFIG
      ),
    },
    400
  );
}

function unauthorizedResponse() {
  return jsonResponse(
    {
      success: false,
      message:
        "관리자 인증이 필요하거나 비밀번호가 올바르지 않습니다.",
    },
    401
  );
}

async function resolveMusicCoverUrl(body) {
  const releaseUrl = String(
    body.releaseUrl ||
    body.release_url ||
    ""
  ).trim();

  if (!releaseUrl) {
    return "";
  }

  if (isSpotifyUrl(releaseUrl)) {
    const spotifyCover =
      await fetchSpotifyCoverUrl(
        releaseUrl
      );

    if (spotifyCover) {
      return spotifyCover;
    }
  }

  if (isYouTubeUrl(releaseUrl)) {
    const youtubeCover =
      getYouTubeThumbnailUrl(
        releaseUrl
      );

    if (youtubeCover) {
      return youtubeCover;
    }
  }

  return await fetchOpenGraphImage(
    releaseUrl
  );
}


async function fetchSpotifyCoverUrl(
  spotifyUrl
) {
  try {
    const endpoint =
      "https://open.spotify.com/oembed?url=" +
      encodeURIComponent(spotifyUrl);

    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.warn(
        "Spotify cover fetch failed:",
        response.status
      );

      return "";
    }

    const data = await response.json();

    return String(
      data?.thumbnail_url || ""
    ).trim();
  } catch (error) {
    console.error(
      "Spotify cover fetch error:",
      error
    );

    return "";
  }
}


async function fetchOpenGraphImage(
  pageUrl
) {
  try {
    const response = await fetch(pageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 ONYOUR-CMS",
        Accept: "text/html",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return "";
    }

    const html = await response.text();

    const patterns = [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);

      if (match?.[1]) {
        return decodeHtmlEntities(
          match[1]
        );
      }
    }

    return "";
  } catch (error) {
    console.error(
      "Open Graph cover fetch error:",
      error
    );

    return "";
  }
}


function getYouTubeThumbnailUrl(
  youtubeUrl
) {
  try {
    const url = new URL(youtubeUrl);
    let videoId = "";

    if (
      url.hostname === "youtu.be" ||
      url.hostname.endsWith(".youtu.be")
    ) {
      videoId =
        url.pathname
          .split("/")
          .filter(Boolean)[0] || "";
    }

    if (
      url.hostname.includes(
        "youtube.com"
      )
    ) {
      videoId =
        url.searchParams.get("v") || "";

      if (!videoId) {
        const parts = url.pathname
          .split("/")
          .filter(Boolean);

        const shortsIndex =
          parts.indexOf("shorts");

        const embedIndex =
          parts.indexOf("embed");

        if (
          shortsIndex >= 0 &&
          parts[shortsIndex + 1]
        ) {
          videoId =
            parts[shortsIndex + 1];
        } else if (
          embedIndex >= 0 &&
          parts[embedIndex + 1]
        ) {
          videoId =
            parts[embedIndex + 1];
        }
      }
    }

    if (!videoId) {
      return "";
    }

    return (
      "https://i.ytimg.com/vi/" +
      encodeURIComponent(videoId) +
      "/maxresdefault.jpg"
    );
  } catch {
    return "";
  }
}


function decodeHtmlEntities(value) {
  return String(value || "")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function jsonResponse(
  data,
  status = 200,
  extraHeaders = {}
) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type":
          "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        ...extraHeaders,
      },
    }
  );
}