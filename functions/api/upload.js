const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    if (!env.MEDIA) {
      return jsonResponse(
        {
          success: false,
          message: "R2 MEDIA 바인딩을 찾을 수 없습니다.",
        },
        500
      );
    }

    const contentType =
      request.headers.get("content-type") || "";

    if (
      !contentType.includes(
        "multipart/form-data"
      )
    ) {
      return jsonResponse(
        {
          success: false,
          message:
            "multipart/form-data 형식으로 업로드해 주세요.",
        },
        400
      );
    }

    const formData =
      await request.formData();

    const file = formData.get("file");

    const folder =
      sanitizeFolderName(
        formData.get("folder") || "general"
      );

    if (
      !file ||
      typeof file === "string" ||
      typeof file.stream !== "function"
    ) {
      return jsonResponse(
        {
          success: false,
          message:
            "업로드할 이미지 파일이 없습니다.",
        },
        400
      );
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return jsonResponse(
        {
          success: false,
          message:
            "JPG, PNG, WEBP, GIF 이미지만 업로드할 수 있습니다.",
        },
        400
      );
    }

    if (file.size <= 0) {
      return jsonResponse(
        {
          success: false,
          message:
            "비어 있는 파일은 업로드할 수 없습니다.",
        },
        400
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return jsonResponse(
        {
          success: false,
          message:
            "이미지 크기는 최대 10MB까지 가능합니다.",
        },
        413
      );
    }

    const extension =
      getSafeExtension(
        file.name,
        file.type
      );

    const objectId =
      crypto.randomUUID();

    const now = new Date();

    const year = now
      .getUTCFullYear()
      .toString();

    const month = String(
      now.getUTCMonth() + 1
    ).padStart(2, "0");

    const objectKey =
      `${folder}/${year}/${month}/${objectId}.${extension}`;

    await env.MEDIA.put(
      objectKey,
      file.stream(),
      {
        httpMetadata: {
          contentType: file.type,
          cacheControl:
            "public, max-age=31536000, immutable",
          contentDisposition: "inline",
        },

        customMetadata: {
          originalName:
            normalizeMetadataValue(
              file.name
            ),
          uploadedAt:
            now.toISOString(),
          folder,
        },
      }
    );

    const encodedPath =
      objectKey
        .split("/")
        .map(encodeURIComponent)
        .join("/");

    const publicUrl =
      `/media/${encodedPath}`;

    return jsonResponse(
      {
        success: true,
        file: {
          id: objectId,
          key: objectKey,
          url: publicUrl,
          originalName: file.name,
          contentType: file.type,
          size: file.size,
          folder,
        },
      },
      201
    );
  } catch (error) {
    console.error(
      "R2 image upload failed:",
      error
    );

    return jsonResponse(
      {
        success: false,
        message:
          "이미지 업로드 중 오류가 발생했습니다.",
      },
      500
    );
  }
}

export function onRequestGet() {
  return jsonResponse(
    {
      success: false,
      message:
        "이 주소는 POST 이미지 업로드 전용입니다.",
    },
    405,
    {
      Allow: "POST",
    }
  );
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

function sanitizeFolderName(value) {
  const safeValue = String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return safeValue || "general";
}

function getSafeExtension(
  fileName,
  mimeType
) {
  const extensionMap = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };

  const nameExtension =
    String(fileName)
      .split(".")
      .pop()
      ?.toLowerCase();

  const allowedExtensions =
    new Set([
      "jpg",
      "jpeg",
      "png",
      "webp",
      "gif",
    ]);

  if (
    nameExtension &&
    allowedExtensions.has(
      nameExtension
    )
  ) {
    return nameExtension === "jpeg"
      ? "jpg"
      : nameExtension;
  }

  return extensionMap[mimeType] || "bin";
}

function normalizeMetadataValue(
  value
) {
  return String(value)
    .normalize("NFC")
    .slice(0, 500);
}