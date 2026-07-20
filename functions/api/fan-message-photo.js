/* =========================================================
   ONYOUR FAN MESSAGES API V2

   경로:
   functions/api/messages.js

   지원 기능
   - GET    공개 메시지 목록 조회
   - POST   새 메시지 등록
   - PUT    작성자 비밀번호 확인 후 수정
   - DELETE 작성자 또는 관리자 메시지 삭제
   - PATCH  관리자 메시지 고정 / 고정 해제

   D1 Binding:
   context.env.DB

   R2 Binding:
   context.env.MEDIA
========================================================= */


/* =========================================================
   공통 상수
========================================================= */

const FAN_MESSAGE_PHOTO_PREFIX =
  "fan-messages/";


/* =========================================================
   공통 JSON 응답
========================================================= */

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

        "Cache-Control":
          "no-store",

        ...extraHeaders,
      },
    }
  );
}


/* =========================================================
   문자열 정리
========================================================= */

function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}


/* =========================================================
   Boolean 정리
========================================================= */

function normalizeBoolean(value) {
  return (
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "true"
  );
}


/* =========================================================
   UUID 생성
========================================================= */

function createMessageId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return [
    "fan",
    Date.now(),
    Math.random()
      .toString(16)
      .slice(2),
  ].join("-");
}


/* =========================================================
   ArrayBuffer → Base64
========================================================= */

function arrayBufferToBase64(buffer) {
  const bytes =
    new Uint8Array(buffer);

  let binary = "";

  for (const byte of bytes) {
    binary +=
      String.fromCharCode(byte);
  }

  return btoa(binary);
}


/* =========================================================
   Base64 → Uint8Array
========================================================= */

function base64ToUint8Array(base64) {
  const binary =
    atob(base64);

  const bytes =
    new Uint8Array(
      binary.length
    );

  for (
    let index = 0;
    index < binary.length;
    index += 1
  ) {
    bytes[index] =
      binary.charCodeAt(index);
  }

  return bytes;
}


/* =========================================================
   비밀번호 해시 생성

   저장 형식:
   pbkdf2$반복횟수$salt$hash
========================================================= */

async function hashPassword(password) {
  const encoder =
    new TextEncoder();

  const salt =
    crypto.getRandomValues(
      new Uint8Array(16)
    );

  const iterations =
    100000;

  const keyMaterial =
    await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      {
        name:
          "PBKDF2",
      },
      false,
      [
        "deriveBits",
      ]
    );

  const derivedBits =
    await crypto.subtle.deriveBits(
      {
        name:
          "PBKDF2",

        hash:
          "SHA-256",

        salt,

        iterations,
      },
      keyMaterial,
      256
    );

  const saltBase64 =
    arrayBufferToBase64(
      salt.buffer
    );

  const hashBase64 =
    arrayBufferToBase64(
      derivedBits
    );

  return [
    "pbkdf2",
    iterations,
    saltBase64,
    hashBase64,
  ].join("$");
}


/* =========================================================
   안전한 문자열 비교
========================================================= */

function timingSafeEqual(
  firstValue,
  secondValue
) {
  const first =
    String(
      firstValue || ""
    );

  const second =
    String(
      secondValue || ""
    );

  const maximumLength =
    Math.max(
      first.length,
      second.length
    );

  let difference =
    first.length ^
    second.length;

  for (
    let index = 0;
    index < maximumLength;
    index += 1
  ) {
    const firstCode =
      first.charCodeAt(index) || 0;

    const secondCode =
      second.charCodeAt(index) || 0;

    difference |=
      firstCode ^ secondCode;
  }

  return difference === 0;
}


/* =========================================================
   비밀번호 검증
========================================================= */

async function verifyPassword(
  password,
  storedPasswordHash
) {
  if (
    !password ||
    !storedPasswordHash
  ) {
    return false;
  }

  const parts =
    storedPasswordHash.split("$");

  if (
    parts.length !== 4 ||
    parts[0] !== "pbkdf2"
  ) {
    return false;
  }

  const iterations =
    Number(parts[1]);

  const saltBase64 =
    parts[2];

  const expectedHash =
    parts[3];

  if (
    !Number.isInteger(iterations) ||
    iterations < 1
  ) {
    return false;
  }

  try {
    const encoder =
      new TextEncoder();

    const salt =
      base64ToUint8Array(
        saltBase64
      );

    const keyMaterial =
      await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        {
          name:
            "PBKDF2",
        },
        false,
        [
          "deriveBits",
        ]
      );

    const derivedBits =
      await crypto.subtle.deriveBits(
        {
          name:
            "PBKDF2",

          hash:
            "SHA-256",

          salt,

          iterations,
        },
        keyMaterial,
        256
      );

    const actualHash =
      arrayBufferToBase64(
        derivedBits
      );

    return timingSafeEqual(
      actualHash,
      expectedHash
    );
  } catch (error) {
    console.error(
      "비밀번호 검증 실패:",
      error
    );

    return false;
  }
}


/* =========================================================
   JSON 요청 읽기
========================================================= */

async function readJsonBody(request) {
  const contentType =
    request.headers.get(
      "Content-Type"
    ) || "";

  if (
    !contentType.includes(
      "application/json"
    )
  ) {
    throw new Error(
      "JSON 형식으로 요청해 주세요."
    );
  }

  try {
    return await request.json();
  } catch {
    throw new Error(
      "요청 데이터를 읽을 수 없습니다."
    );
  }
}


/* =========================================================
   사진 URL 정리
========================================================= */

function normalizePhotoUrl(value) {
  const photoUrl =
    normalizeText(value);

  if (!photoUrl) {
    return "";
  }

  if (
    !photoUrl.startsWith(
      "/media/fan-messages/"
    )
  ) {
    throw new Error(
      "팬 메시지 사진 주소가 올바르지 않습니다."
    );
  }

  if (photoUrl.length > 1000) {
    throw new Error(
      "사진 주소가 너무 깁니다."
    );
  }

  return photoUrl;
}


/* =========================================================
   사진 R2 Key 정리
========================================================= */

function normalizePhotoKey(value) {
  const photoKey =
    normalizeText(value);

  if (!photoKey) {
    return "";
  }

  if (
    !photoKey.startsWith(
      FAN_MESSAGE_PHOTO_PREFIX
    )
  ) {
    throw new Error(
      "팬 메시지 사진 정보가 올바르지 않습니다."
    );
  }

  if (
    photoKey.includes("..") ||
    photoKey.includes("\\")
  ) {
    throw new Error(
      "팬 메시지 사진 경로가 올바르지 않습니다."
    );
  }

  if (photoKey.length > 500) {
    throw new Error(
      "사진 경로가 너무 깁니다."
    );
  }

  return photoKey;
}


/* =========================================================
   사진 URL과 Key 조합 검사
========================================================= */

function normalizePhotoData(
  photoUrlValue,
  photoKeyValue
) {
  const photoUrl =
    normalizePhotoUrl(
      photoUrlValue
    );

  const photoKey =
    normalizePhotoKey(
      photoKeyValue
    );

  if (
    Boolean(photoUrl) !==
    Boolean(photoKey)
  ) {
    throw new Error(
      "사진 주소와 사진 정보가 일치하지 않습니다."
    );
  }

  return {
    photoUrl,
    photoKey,
  };
}


/* =========================================================
   새 메시지 입력값 검사
========================================================= */

function validateCreateMessage(body) {
  const nickname =
    normalizeText(
      body.nickname ??
      body.name
    );

  const password =
    typeof body.password === "string"
      ? body.password
      : "";

  const performance =
    normalizeText(
      body.performance
    );

  const message =
    normalizeText(
      body.message
    );

  const photo =
    normalizePhotoData(
      body.photoUrl,
      body.photoKey
    );

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

    photoUrl:
      photo.photoUrl,

    photoKey:
      photo.photoKey,
  };
}


/* =========================================================
   메시지 수정 입력값 검사
========================================================= */

function validateUpdateMessage(body) {
  const id =
    normalizeText(
      body.id
    );

  const nickname =
    normalizeText(
      body.nickname ??
      body.name
    );

  const password =
    typeof body.password === "string"
      ? body.password
      : "";

  const performance =
    normalizeText(
      body.performance
    );

  const message =
    normalizeText(
      body.message
    );

  const removePhoto =
    normalizeBoolean(
      body.removePhoto
    );

  const hasPhotoFields =
    Object.prototype.hasOwnProperty.call(
      body,
      "photoUrl"
    ) ||
    Object.prototype.hasOwnProperty.call(
      body,
      "photoKey"
    );

  const photo =
    hasPhotoFields
      ? normalizePhotoData(
          body.photoUrl,
          body.photoKey
        )
      : {
          photoUrl:
            "",

          photoKey:
            "",
        };

  if (!id) {
    throw new Error(
      "수정할 메시지 ID가 없습니다."
    );
  }

  if (!password) {
    throw new Error(
      "비밀번호를 입력해 주세요."
    );
  }

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

  if (
    removePhoto &&
    hasPhotoFields &&
    (
      photo.photoUrl ||
      photo.photoKey
    )
  ) {
    throw new Error(
      "사진 삭제와 사진 교체를 동시에 요청할 수 없습니다."
    );
  }

  return {
    id,
    nickname,
    password,
    performance,
    message,
    removePhoto,
    hasPhotoFields,

    photoUrl:
      photo.photoUrl,

    photoKey:
      photo.photoKey,
  };
}


/* =========================================================
   삭제 입력값 검사
========================================================= */

function validateDeleteMessage(body) {
  const id =
    normalizeText(
      body.id
    );

  const password =
    typeof body.password === "string"
      ? body.password
      : "";

  if (!id) {
    throw new Error(
      "삭제할 메시지 ID가 없습니다."
    );
  }

  return {
    id,
    password,
  };
}


/* =========================================================
   DB 결과를 공개 데이터로 변환
========================================================= */

function mapPublicMessage(row) {
  if (!row) {
    return null;
  }

  return {
    id:
      row.id,

    name:
      row.nickname,

    nickname:
      row.nickname,

    performance:
      row.performance || "",

    message:
      row.message || "",

    photoUrl:
      row.photo_url || "",

    hasPhoto:
      Boolean(
        row.photo_url
      ),

    isPinned:
      Boolean(
        row.is_pinned
      ),

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,
  };
}


/* =========================================================
   DB 바인딩 확인
========================================================= */

function ensureDatabase(context) {
  if (!context.env.DB) {
    throw new Error(
      "Cloudflare D1 DB 바인딩을 찾을 수 없습니다."
    );
  }

  return context.env.DB;
}


/* =========================================================
   관리자 요청 확인
========================================================= */

function verifyAdminRequest(context) {
  const storedAdminPassword =
    String(
      context.env.ADMIN_PASSWORD ||
      ""
    );

  const requestedAdminPassword =
    String(
      context.request.headers.get(
        "X-Admin-Password"
      ) || ""
    );

  if (!storedAdminPassword) {
    return false;
  }

  if (!requestedAdminPassword) {
    return false;
  }

  return timingSafeEqual(
    requestedAdminPassword,
    storedAdminPassword
  );
}


/* =========================================================
   R2 사진 삭제
========================================================= */

async function deletePhotoFromR2(
  context,
  photoKey
) {
  const normalizedPhotoKey =
    normalizeText(
      photoKey
    );

  if (!normalizedPhotoKey) {
    return;
  }

  if (
    !normalizedPhotoKey.startsWith(
      FAN_MESSAGE_PHOTO_PREFIX
    )
  ) {
    console.warn(
      "삭제하지 않은 잘못된 사진 Key:",
      normalizedPhotoKey
    );

    return;
  }

  if (!context.env.MEDIA) {
    console.warn(
      "R2 MEDIA 바인딩이 없어 사진을 삭제하지 못했습니다:",
      normalizedPhotoKey
    );

    return;
  }

  try {
    await context.env.MEDIA.delete(
      normalizedPhotoKey
    );
  } catch (error) {
    console.error(
      "R2 팬 메시지 사진 삭제 실패:",
      error
    );
  }
}


/* =========================================================
   공개 메시지 SELECT 공통
========================================================= */

async function selectMessageById(
  db,
  id
) {
  return db
    .prepare(`
      SELECT
        id,
        nickname,
        performance,
        message,
        photo_url,
        is_hidden,
        is_pinned,
        created_at,
        updated_at
      FROM fan_messages
      WHERE id = ?
    `)
    .bind(id)
    .first();
}


/* =========================================================
   GET
   공개 메시지 목록 조회
========================================================= */

export async function onRequestGet(
  context
) {
  try {
    const db =
      ensureDatabase(context);

    const url =
      new URL(
        context.request.url
      );

    const requestedLimit =
      Number(
        url.searchParams.get(
          "limit"
        )
      );

    const requestedOffset =
      Number(
        url.searchParams.get(
          "offset"
        )
      );

    const limit =
      Number.isInteger(
        requestedLimit
      )
        ? Math.min(
            Math.max(
              requestedLimit,
              1
            ),
            50
          )
        : 6;

    const offset =
      Number.isInteger(
        requestedOffset
      )
        ? Math.max(
            requestedOffset,
            0
          )
        : 0;

    const messagesResult =
      await db
        .prepare(`
          SELECT
            id,
            nickname,
            performance,
            message,
            photo_url,
            is_hidden,
            is_pinned,
            created_at,
            updated_at
          FROM fan_messages
          WHERE is_hidden = 0
          ORDER BY
            is_pinned DESC,
            created_at DESC
          LIMIT ?
          OFFSET ?
        `)
        .bind(
          limit,
          offset
        )
        .all();

    const countResult =
      await db
        .prepare(`
          SELECT
            COUNT(*) AS total
          FROM fan_messages
          WHERE is_hidden = 0
        `)
        .first();

    const messages =
      Array.isArray(
        messagesResult.results
      )
        ? messagesResult.results.map(
            mapPublicMessage
          )
        : [];

    const total =
      Number(
        countResult?.total
      ) || 0;

    return jsonResponse({
      success:
        true,

      messages,

      pagination: {
        limit,
        offset,
        total,

        hasMore:
          offset +
          messages.length <
          total,
      },
    });
  } catch (error) {
    console.error(
      "Fan Messages GET 오류:",
      error
    );

    return jsonResponse(
      {
        success:
          false,

        message:
          error.message ||
          "메시지를 불러오지 못했습니다.",
      },
      500
    );
  }
}


/* =========================================================
   POST
   새 메시지 등록
========================================================= */

export async function onRequestPost(
  context
) {
  try {
    const db =
      ensureDatabase(context);

    const body =
      await readJsonBody(
        context.request
      );

    const data =
      validateCreateMessage(
        body
      );

    const id =
      createMessageId();

    const now =
      new Date()
        .toISOString();

    const passwordHash =
      await hashPassword(
        data.password
      );

    await db
      .prepare(`
        INSERT INTO fan_messages (
          id,
          nickname,
          password_hash,
          performance,
          message,
          photo_url,
          photo_key,
          is_hidden,
          is_pinned,
          created_at,
          updated_at
        )
        VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          0,
          0,
          ?,
          ?
        )
      `)
      .bind(
        id,
        data.nickname,
        passwordHash,
        data.performance,
        data.message,
        data.photoUrl,
        data.photoKey,
        now,
        now
      )
      .run();

    const createdMessage =
      await selectMessageById(
        db,
        id
      );

    return jsonResponse(
      {
        success:
          true,

        message:
          "팬 메시지가 등록되었습니다.",

        data:
          mapPublicMessage(
            createdMessage
          ),
      },
      201
    );
  } catch (error) {
    console.error(
      "Fan Messages POST 오류:",
      error
    );

    return jsonResponse(
      {
        success:
          false,

        message:
          error.message ||
          "메시지를 등록하지 못했습니다.",
      },
      400
    );
  }
}


/* =========================================================
   PUT
   작성자 비밀번호 확인 후 메시지 수정
========================================================= */

export async function onRequestPut(
  context
) {
  try {
    const db =
      ensureDatabase(context);

    const body =
      await readJsonBody(
        context.request
      );

    const data =
      validateUpdateMessage(
        body
      );

    const existingMessage =
      await db
        .prepare(`
          SELECT
            id,
            password_hash,
            photo_url,
            photo_key
          FROM fan_messages
          WHERE id = ?
        `)
        .bind(
          data.id
        )
        .first();

    if (!existingMessage) {
      return jsonResponse(
        {
          success:
            false,

          message:
            "수정할 메시지를 찾을 수 없습니다.",
        },
        404
      );
    }

    const isPasswordCorrect =
      await verifyPassword(
        data.password,
        existingMessage.password_hash
      );

    if (!isPasswordCorrect) {
      return jsonResponse(
        {
          success:
            false,

          message:
            "비밀번호가 올바르지 않습니다.",
        },
        403
      );
    }

    let nextPhotoUrl =
      existingMessage.photo_url ||
      "";

    let nextPhotoKey =
      existingMessage.photo_key ||
      "";

    let oldPhotoKeyToDelete =
      "";

    if (data.removePhoto) {
      oldPhotoKeyToDelete =
        nextPhotoKey;

      nextPhotoUrl =
        "";

      nextPhotoKey =
        "";
    } else if (
      data.hasPhotoFields &&
      data.photoUrl &&
      data.photoKey
    ) {
      if (
        nextPhotoKey &&
        nextPhotoKey !==
          data.photoKey
      ) {
        oldPhotoKeyToDelete =
          nextPhotoKey;
      }

      nextPhotoUrl =
        data.photoUrl;

      nextPhotoKey =
        data.photoKey;
    }

    const now =
      new Date()
        .toISOString();

    const updateResult =
      await db
        .prepare(`
          UPDATE fan_messages
          SET
            nickname = ?,
            performance = ?,
            message = ?,
            photo_url = ?,
            photo_key = ?,
            updated_at = ?
          WHERE id = ?
        `)
        .bind(
          data.nickname,
          data.performance,
          data.message,
          nextPhotoUrl,
          nextPhotoKey,
          now,
          data.id
        )
        .run();

    if (
      Number(
        updateResult.meta?.changes
      ) < 1
    ) {
      return jsonResponse(
        {
          success:
            false,

          message:
            "메시지를 수정하지 못했습니다.",
        },
        500
      );
    }

    if (oldPhotoKeyToDelete) {
      await deletePhotoFromR2(
        context,
        oldPhotoKeyToDelete
      );
    }

    const updatedMessage =
      await selectMessageById(
        db,
        data.id
      );

    return jsonResponse({
      success:
        true,

      message:
        "메시지가 수정되었습니다.",

      data:
        mapPublicMessage(
          updatedMessage
        ),
    });
  } catch (error) {
    console.error(
      "Fan Messages PUT 오류:",
      error
    );

    return jsonResponse(
      {
        success:
          false,

        message:
          error.message ||
          "메시지를 수정하지 못했습니다.",
      },
      400
    );
  }
}


/* =========================================================
   DELETE
   작성자 또는 관리자 메시지 삭제
========================================================= */

export async function onRequestDelete(
  context
) {
  try {
    const db =
      ensureDatabase(context);

    const body =
      await readJsonBody(
        context.request
      );

    const data =
      validateDeleteMessage(
        body
      );

    const existingMessage =
      await db
        .prepare(`
          SELECT
            id,
            password_hash,
            photo_key
          FROM fan_messages
          WHERE id = ?
        `)
        .bind(
          data.id
        )
        .first();

    if (!existingMessage) {
      return jsonResponse(
        {
          success:
            false,

          message:
            "삭제할 메시지를 찾을 수 없습니다.",
        },
        404
      );
    }

    const isAdmin =
      verifyAdminRequest(
        context
      );

    if (!isAdmin) {
      if (!data.password) {
        return jsonResponse(
          {
            success:
              false,

            message:
              "비밀번호를 입력해 주세요.",
          },
          400
        );
      }

      const isPasswordCorrect =
        await verifyPassword(
          data.password,
          existingMessage.password_hash
        );

      if (!isPasswordCorrect) {
        return jsonResponse(
          {
            success:
              false,

            message:
              "비밀번호가 올바르지 않습니다.",
          },
          403
        );
      }
    }

    const deleteResult =
      await db
        .prepare(`
          DELETE FROM fan_messages
          WHERE id = ?
        `)
        .bind(
          data.id
        )
        .run();

    if (
      Number(
        deleteResult.meta?.changes
      ) < 1
    ) {
      return jsonResponse(
        {
          success:
            false,

          message:
            "메시지를 삭제하지 못했습니다.",
        },
        500
      );
    }

    if (existingMessage.photo_key) {
      await deletePhotoFromR2(
        context,
        existingMessage.photo_key
      );
    }

    return jsonResponse({
      success:
        true,

      message:
        isAdmin
          ? "관리자 권한으로 메시지가 삭제되었습니다."
          : "메시지가 삭제되었습니다.",

      id:
        data.id,
    });
  } catch (error) {
    console.error(
      "Fan Messages DELETE 오류:",
      error
    );

    return jsonResponse(
      {
        success:
          false,

        message:
          error.message ||
          "메시지를 삭제하지 못했습니다.",
      },
      400
    );
  }
}


/* =========================================================
   PATCH
   관리자 메시지 고정 / 고정 해제
========================================================= */

export async function onRequestPatch(
  context
) {
  try {
    const db =
      ensureDatabase(context);

    const isAdmin =
      verifyAdminRequest(
        context
      );

    if (!isAdmin) {
      return jsonResponse(
        {
          success:
            false,

          message:
            "관리자 인증에 실패했습니다.",
        },
        403
      );
    }

    const body =
      await readJsonBody(
        context.request
      );

    const id =
      normalizeText(
        body.id
      );

    const isPinned =
      normalizeBoolean(
        body.isPinned
      );

    if (!id) {
      return jsonResponse(
        {
          success:
            false,

          message:
            "메시지 ID가 없습니다.",
        },
        400
      );
    }

    const existingMessage =
      await db
        .prepare(`
          SELECT id
          FROM fan_messages
          WHERE id = ?
        `)
        .bind(id)
        .first();

    if (!existingMessage) {
      return jsonResponse(
        {
          success:
            false,

          message:
            "메시지를 찾을 수 없습니다.",
        },
        404
      );
    }

    if (isPinned) {
      const pinnedCount =
        await db
          .prepare(`
            SELECT
              COUNT(*) AS total
            FROM fan_messages
            WHERE
              is_pinned = 1
              AND id != ?
          `)
          .bind(id)
          .first();

      if (
        Number(
          pinnedCount?.total
        ) >= 3
      ) {
        return jsonResponse(
          {
            success:
              false,

            message:
              "메인 고정 메시지는 최대 3개까지 가능합니다.",
          },
          400
        );
      }
    }

    const now =
      new Date()
        .toISOString();

    const updateResult =
      await db
        .prepare(`
          UPDATE fan_messages
          SET
            is_pinned = ?,
            updated_at = ?
          WHERE id = ?
        `)
        .bind(
          isPinned
            ? 1
            : 0,

          now,
          id
        )
        .run();

    if (
      Number(
        updateResult.meta?.changes
      ) < 1
    ) {
      return jsonResponse(
        {
          success:
            false,

          message:
            "고정 상태를 변경하지 못했습니다.",
        },
        500
      );
    }

    const updatedMessage =
      await selectMessageById(
        db,
        id
      );

    return jsonResponse({
      success:
        true,

      message:
        isPinned
          ? "메시지가 메인에 고정되었습니다."
          : "메시지 고정이 해제되었습니다.",

      data:
        mapPublicMessage(
          updatedMessage
        ),
    });
  } catch (error) {
    console.error(
      "Fan Messages PATCH 오류:",
      error
    );

    return jsonResponse(
      {
        success:
          false,

        message:
          error.message ||
          "고정 상태를 변경하지 못했습니다.",
      },
      400
    );
  }
}


/* =========================================================
   OPTIONS
========================================================= */

export function onRequestOptions() {
  return new Response(
    null,
    {
      status:
        204,

      headers: {
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",

        "Access-Control-Allow-Headers":
          "Content-Type, X-Admin-Password",

        "Access-Control-Max-Age":
          "86400",
      },
    }
  );
}