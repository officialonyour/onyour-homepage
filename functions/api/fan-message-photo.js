/* =========================================================
   ONYOUR FAN MESSAGE PHOTO UPLOAD API

   경로:
   functions/api/fan-message-photo.js

   기능:
   - 팬 메시지 첨부 사진 업로드
   - JPG / PNG / WEBP만 허용
   - 최대 5MB
   - Cloudflare R2 MEDIA 버킷 저장

   R2 Binding:
   context.env.MEDIA
========================================================= */


/* =========================================================
   공통 설정
========================================================= */

const FAN_MESSAGE_PHOTO_MAX_SIZE =
  5 * 1024 * 1024;

const FAN_MESSAGE_PHOTO_PREFIX =
  "fan-messages/";

const FAN_MESSAGE_ALLOWED_TYPES =
  new Map([
    ["image/jpeg", "jpg"],
    ["image/png", "png"],
    ["image/webp", "webp"],
  ]);


/* =========================================================
   JSON 응답
========================================================= */

function jsonResponse(
  data,
  status = 200
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
      },
    }
  );
}


/* =========================================================
   업로드 파일 이름 생성
========================================================= */

function createPhotoKey(extension) {
  const uniqueId =
    typeof crypto.randomUUID ===
    "function"
      ? crypto.randomUUID()
      : [
          Date.now(),
          Math.random()
            .toString(16)
            .slice(2),
        ].join("-");

  return (
    FAN_MESSAGE_PHOTO_PREFIX +
    `${Date.now()}-${uniqueId}.${extension}`
  );
}


/* =========================================================
   R2 바인딩 확인
========================================================= */

function ensureMediaBucket(context) {
  if (!context.env.MEDIA) {
    throw new Error(
      "Cloudflare R2 MEDIA 바인딩을 찾을 수 없습니다."
    );
  }

  return context.env.MEDIA;
}


/* =========================================================
   POST
   팬 메시지 사진 업로드
========================================================= */

export async function onRequestPost(
  context
) {
  try {
    const mediaBucket =
      ensureMediaBucket(context);

    const contentType =
      context.request.headers.get(
        "Content-Type"
      ) || "";

    if (
      !contentType.includes(
        "multipart/form-data"
      )
    ) {
      return jsonResponse(
        {
          success: false,

          message:
            "사진 업로드 형식이 올바르지 않습니다.",
        },
        400
      );
    }

    let formData;

    try {
      formData =
        await context.request.formData();
    } catch {
      return jsonResponse(
        {
          success: false,

          message:
            "업로드한 사진 데이터를 읽을 수 없습니다.",
        },
        400
      );
    }

    const file =
      formData.get("file");

    if (
      !file ||
      typeof file.arrayBuffer !==
        "function"
    ) {
      return jsonResponse(
        {
          success: false,

          message:
            "업로드할 사진을 선택해 주세요.",
        },
        400
      );
    }

    const mimeType =
      String(file.type || "")
        .toLowerCase();

    const extension =
      FAN_MESSAGE_ALLOWED_TYPES.get(
        mimeType
      );

    if (!extension) {
      return jsonResponse(
        {
          success: false,

          message:
            "JPG, PNG, WEBP 사진만 첨부할 수 있습니다.",
        },
        400
      );
    }

    const fileSize =
      Number(file.size) || 0;

    if (fileSize < 1) {
      return jsonResponse(
        {
          success: false,

          message:
            "비어 있는 사진 파일은 업로드할 수 없습니다.",
        },
        400
      );
    }

    if (
      fileSize >
      FAN_MESSAGE_PHOTO_MAX_SIZE
    ) {
      return jsonResponse(
        {
          success: false,

          message:
            "사진은 최대 5MB까지 첨부할 수 있습니다.",
        },
        413
      );
    }

    const photoKey =
      createPhotoKey(extension);

    const photoBuffer =
      await file.arrayBuffer();

    await mediaBucket.put(
      photoKey,
      photoBuffer,
      {
        httpMetadata: {
          contentType: mimeType,

          cacheControl:
            "public, max-age=31536000, immutable",
        },

        customMetadata: {
          originalName:
            String(
              file.name || ""
            ).slice(0, 200),

          uploadedAt:
            new Date().toISOString(),

          source:
            "fan-message",
        },
      }
    );

    const photoUrl =
      `/media/${photoKey}`;

    return jsonResponse(
      {
        success: true,

        message:
          "사진이 업로드되었습니다.",

        photoUrl,
        photoKey,

        file: {
          url: photoUrl,
          key: photoKey,
          type: mimeType,
          size: fileSize,
        },
      },
      201
    );
  } catch (error) {
    console.error(
      "팬 메시지 사진 업로드 오류:",
      error
    );

    return jsonResponse(
      {
        success: false,

        message:
          error.message ||
          "사진을 업로드하지 못했습니다.",
      },
      500
    );
  }
}


/* =========================================================
   지원하지 않는 요청
========================================================= */

export function onRequestGet() {
  return jsonResponse(
    {
      success: false,

      message:
        "사진 업로드는 POST 요청만 지원합니다.",
    },
    405
  );
}


/* =========================================================
   OPTIONS
========================================================= */

export function onRequestOptions() {
  return new Response(
    null,
    {
      status: 204,

      headers: {
        "Access-Control-Allow-Methods":
          "POST, OPTIONS",

        "Access-Control-Allow-Headers":
          "Content-Type",

        "Access-Control-Max-Age":
          "86400",
      },
    }
  );
}