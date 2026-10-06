// Third party imports
import { createError } from "h3";
import { useRuntimeConfig } from "#imports";

// Local imports
import cloud_api_schemas, {
  type AuthLoginParams,
  type AuthLoginResponse,
} from "@geode/cloud-api/cloud_api_typed_schemas.js";
import type { ErrorResponse } from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import { defineTypedEventHandler } from "@ogw_server/utils/typed_handler";
import schemas from "pegghy/pegghy_typed_schemas.js";

// PEGGHy has no user login: the cloud launch authenticates as a dedicated Firebase account.
// Signing in server side, through the Cloud API, keeps its password out of the client bundle;
// The credentials are read at runtime from the EMAIL and PASSWORD environment variables (Netlify secrets).
const INTERNAL_SERVER_ERROR = 500;
const BAD_GATEWAY = 502;

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === "") {
    throw createError({
      statusCode: INTERNAL_SERVER_ERROR,
      statusMessage: `${name} is not configured`,
    });
  }
  return value;
}

function isErrorResponse(payload: unknown): payload is ErrorResponse {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "description" in payload &&
    typeof payload.description === "string"
  );
}

async function login(params: AuthLoginParams): Promise<AuthLoginResponse> {
  const { CLOUD_API_URL } = useRuntimeConfig().public;
  const response = await fetch(`${CLOUD_API_URL}/${cloud_api_schemas.cloud_api.auth.login.$id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const payload: unknown = await response.json();
  if (!response.ok) {
    throw createError({
      statusCode: BAD_GATEWAY,
      statusMessage: "Cloud API login failed",
      message: isErrorResponse(payload) ? payload.description : `HTTP ${response.status}`,
    });
  }
  // Shape guaranteed by the Cloud API login schema
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return payload as AuthLoginResponse;
}

export default defineTypedEventHandler(schemas.api.serverless.cloud_token, async () => {
  const { idToken } = await login({
    email: requiredEnv("EMAIL"),
    password: requiredEnv("PASSWORD"),
  });
  return { token: idToken };
});
