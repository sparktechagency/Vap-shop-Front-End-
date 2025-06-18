interface Howl {
  link: string;
  method?: "get" | "post" | "delete" | "put" | "patch";
  content?:
    | "json"
    | "text"
    | "html"
    | "xml"
    | "form"
    | "multipart"
    | "javascript"
    | "css"
    | "png"
    | "jpeg"
    | "gif"
    | "pdf";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  auth?: "bearer" | "basic" | "digest" | "apiKey" | "awsSignature" | "custom";
  token?: string;
  mode?: "cors" | "no-cors" | "same-origin";
  cache?:
    | "default"
    | "no-store"
    | "reload"
    | "no-cache"
    | "force-cache"
    | "only-if-cached";
  credentials?: "omit" | "same-origin" | "include";
  redirect?: "follow" | "manual" | "error";
  reffererPolicy?:
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin"
    | "unsafe-url";
  integrity?: string;
}

const options = {
  type: {
    json: "application/json",
    text: "text/plain",
    html: "text/html",
    xml: "application/xml",
    form: "application/x-www-form-urlencoded",
    multipart: "multipart/form-data",
    javascript: "application/javascript",
    css: "text/css",
    png: "image/png",
    jpeg: "image/jpeg",
    gif: "image/gif",
    pdf: "application/pdf",
  },
  auth: {
    bearer: "Bearer",
    basic: "Basic",
    digest: "Digest",
    apiKey: "Api-Key",
    awsSignature: "",
    custom: "CustomScheme",
  },
};

export default async function howl({
  link,
  method = "get",
  data = null,
  auth = "bearer",
  content = "json",
  token,
  mode = "cors",
  cache = "default",
  credentials = "same-origin",
  redirect = "follow",
  reffererPolicy = "strict-origin-when-cross-origin",
  integrity = "",
}: Howl) {
  try {
    // Validate the method and content type
    if (!link) throw new Error("Missing required 'link' parameter.");

    // Prepare headers
    const headers: HeadersInit = {
      "Content-Type": options.type[content],
    };

    // Add Authorization header if token is present
    if (token) {
      headers["Authorization"] = `${options.auth[auth]} ${token}`;
    }

    // Prepare the body
    let body: BodyInit | null = null;
    if (data) {
      body = content === "json" ? JSON.stringify(data) : data;
    }

    // Make the request using fetch
    const call = await fetch("" + link, {
      method: method.toUpperCase(),
      mode,
      cache,
      credentials,
      redirect,
      referrerPolicy: reffererPolicy,
      integrity,
      headers,
      body,
    });

    // // Check if the response is successful (status 200-299)
    // if (!call.ok) {
    //   throw new Error(
    //     `Request failed with status ${call.status}: ${call.statusText}`
    //   );
    // }

    // Parse the JSON response
    return await call.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error during request:", error.message);
      return error; // Return a JSON object with the error message
    }
  }
}
