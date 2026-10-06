// Third party imports
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { createError } from "h3";

// Local imports
import { defineTypedEventHandler } from "@ogw_server/utils/typed_handler";
import schemas from "pegghy/pegghy_typed_schemas.js";

// PEGGHy has no user login: the cloud launch authenticates as a dedicated Firebase account.
// Signing in server side keeps its password out of the client bundle; the credentials are
// Read at runtime from the FIREBASE_* environment variables (Netlify secrets).
const INTERNAL_SERVER_ERROR = 500;

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

export default defineTypedEventHandler(schemas.api.serverless.cloud_token, async () => {
  const app =
    getApps().length === 0 ? initializeApp({ apiKey: requiredEnv("FIREBASE_API_KEY") }) : getApp();
  const { user } = await signInWithEmailAndPassword(
    getAuth(app),
    requiredEnv("FIREBASE_EMAIL"),
    requiredEnv("FIREBASE_PASSWORD"),
  );
  return { token: await user.getIdToken() };
});
