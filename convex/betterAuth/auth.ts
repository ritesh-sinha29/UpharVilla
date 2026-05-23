import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import type { GenericCtx } from "@convex-dev/better-auth/utils";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";

import { components } from "../_generated/api";
import type { DataModel } from "../_generated/dataModel";
import authConfig from "../auth.config";
import schema from "./schema";

// Better Auth Component
export const authComponent = createClient<DataModel, typeof schema>(
  components.betterAuth as any,
  {
    local: { schema },
    verbose: false,
  },
);

// Better Auth Options
export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  const providers: BetterAuthOptions["socialProviders"] = {};

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.google = {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    };
  }

  if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
    providers.facebook = {
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    };
  }

  const baseURL = process.env.SITE_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000";
  const trustedOrigins = [baseURL];
  if (!trustedOrigins.includes("http://localhost:3000")) {
    trustedOrigins.push("http://localhost:3000");
  }

  return {
    appName: "upharvilla",
    baseURL: baseURL,
    trustedOrigins: trustedOrigins,
    secret: process.env.BETTER_AUTH_SECRET,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      async sendResetPassword({ user, url }) {
        if (process.env.RESEND_API_KEY) {
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
            to: user.email,
            subject: "Reset your password for upharVilla",
            html: `
              <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
                <h2 style="color: #1e1b4b; margin-bottom: 16px;">Reset Your Password</h2>
                <p style="color: #475569; line-height: 1.6;">Hello ${user.name},</p>
                <p style="color: #475569; line-height: 1.6;">We received a request to reset your password for your upharVilla account. Click the button below to set a new password:</p>
                <div style="margin: 32px 0;">
                  <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
                </div>
                <p style="color: #64748b; font-size: 14px; line-height: 1.6;">If you didn't request this, you can safely ignore this email. The link will expire in 1 hour.</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                <p style="color: #94a3b8; font-size: 12px; text-align: center;">© 2026 upharVilla. All rights reserved.</p>
              </div>
            `,
          });
        } else {
          console.warn("No RESEND_API_KEY found. Reset URL:", url, "for", user.email);
        }
      },
    },
    socialProviders: providers,
    account: {
      accountLinking: {
        enabled: true,
      },
    },

    plugins: [
      convex({ authConfig }) as any,
      emailOTP({
        sendVerificationOnSignUp: true,
        async sendVerificationOTP({ email, otp, type }) {
          if (process.env.RESEND_API_KEY) {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const isReset = type === "forget-password";
            
            await resend.emails.send({
              from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
              to: email,
              subject: isReset ? "Reset your password for upharVilla" : "Your OTP for upharVilla",
              html: isReset ? `
                <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
                  <h2 style="color: #1e1b4b; margin-bottom: 16px;">Password Reset Request</h2>
                  <p style="color: #475569; line-height: 1.6;">We received a request to reset your password for your upharVilla account.</p>
                  <p style="color: #475569; line-height: 1.6;">Your 6-digit verification code is:</p>
                  <div style="margin: 32px 0; text-align: center;">
                    <span style="font-size: 32px; font-weight: 700; tracking: 4px; color: #4f46e5; padding: 12px 24px; background-color: #f5f3ff; border-radius: 8px;">${otp}</span>
                  </div>
                  <p style="color: #64748b; font-size: 14px; line-height: 1.6;">Enter this code on the reset page to set a new password. If you didn't request this, you can safely ignore this email.</p>
                  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                  <p style="color: #94a3b8; font-size: 12px; text-align: center;">© 2026 upharVilla. All rights reserved.</p>
                </div>
              ` : `
                <div style="font-family: sans-serif; padding: 20px;">
                  <h2>Welcome to upharVilla!</h2>
                  <p>Your verification code is: <strong style="font-size: 24px;">${otp}</strong></p>
                  <p>This code will expire shortly.</p>
                </div>
              `,
            });
          } else {
            console.warn(`No RESEND_API_KEY found. Simulated OTP (${type}):`, otp, "for", email);
          }
        },
      }),
    ],
  } satisfies BetterAuthOptions;
};

// For `auth` CLI
export const options = createAuthOptions({} as GenericCtx<DataModel>);

// Better Auth Instance
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx));
};
