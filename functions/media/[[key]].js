export async function onRequestGet(context) {
  try {
    const { params, env } = context;

    if (!env.MEDIA) {
      return new Response("R2 binding not found.", {
        status: 500,
      });
    }

    const key = decodeKey(params.key);

    if (!key) {
      return new Response("Invalid media path.", {
        status: 400,
      });
    }

    const object = await env.MEDIA.get(key);

    if (!object) {
      return new Response("Image not found.", {
        status: 404,
      });
    }

    const headers = new Headers();

    object.writeHttpMetadata(headers);

    headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );

    headers.set(
      "ETag",
      object.httpEtag
    );

    return new Response(object.body, {
      headers,
    });

  } catch (error) {

    console.error(error);

    return new Response(
      "Internal Server Error",
      {
        status: 500,
      }
    );

  }
}

function decodeKey(key) {

  if (!key) return "";

  if (Array.isArray(key)) {
    key = key.join("/");
  }

  return key
    .split("/")
    .map(decodeURIComponent)
    .join("/");

}