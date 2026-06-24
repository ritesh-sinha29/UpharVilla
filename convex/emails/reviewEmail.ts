import { internal } from "../_generated/api";
import { internalAction, internalQuery } from "../_generated/server";
import {
  B,
  ctaButton,
  emailFooter,
  emailHeader,
  emailWrapper,
} from "./emailLayout";

const BASE_URL = process.env.SITE_URL || "https://upharvilla.in";

export const _getOrdersForReview = internalQuery({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const twoDaysAgo = now - 48 * 60 * 60 * 1000;
    const threeDaysAgo = now - 72 * 60 * 60 * 1000;

    const eligible = await ctx.db
      .query("orders")
      .withIndex("by_status_created", (q) =>
        q
          .eq("orderStatus", "delivered")
          .gt("createdAt", threeDaysAgo)
          .lt("createdAt", twoDaysAgo),
      )
      .collect();

    const results = [];
    for (const order of eligible) {
      const user = await ctx.db
        .query("user")
        .filter((q) => q.eq(q.field("_id"), order.userId))
        .first();
      if (user?.email)
        results.push({
          email: user.email,
          name: user.name || "there",
          orderId: order._id,
        });
    }
    return results;
  },
});

export const sendReviewRequests = internalAction({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.runQuery(
      internal.emails.reviewEmail._getOrdersForReview,
      {},
    );

    for (const order of orders) {
      const firstName = order.name.split(" ")[0];
      const shortId = order.orderId.slice(-8).toUpperCase();

      const stars = `
        <table cellpadding="0" cellspacing="0" style="margin:20px auto;">
          <tr>
            ${["⭐", "⭐", "⭐", "⭐", "⭐"]
              .map(
                (star, i) => `
              <td style="padding:0 4px;">
                <a href="${BASE_URL}/review?order=${shortId}&rating=${i + 1}"
                   style="font-size:32px;text-decoration:none;">${star}</a>
              </td>`,
              )
              .join("")}
          </tr>
        </table>`;

      const body = `
        ${emailHeader("How was your gift? ⭐")}
        <tr><td style="padding:36px 40px 0;text-align:center;">

          <p style="margin:0 0 10px;font-size:20px;font-weight:700;color:${B.textDark};font-family:Poppins,Arial,sans-serif;">
            Enjoying your order, ${firstName}?
          </p>
          <p style="margin:0 0 8px;font-size:14px;color:${B.textMid};line-height:1.7;font-family:Poppins,Arial,sans-serif;max-width:420px;margin-left:auto;margin-right:auto;">
            Your order <strong style="color:${B.primary};">#${shortId}</strong> was delivered a couple of days ago.
            We'd love to know how it went!
          </p>

          <!-- Stars -->
          ${stars}

          <p style="margin:8px 0 24px;font-size:13px;color:${B.textLight};font-family:Poppins,Arial,sans-serif;">
            Tap a star to rate your experience
          </p>

          <!-- Review card -->
          <table cellpadding="0" cellspacing="0" width="100%" style="background:linear-gradient(135deg,#f7f4fe,#fce7f0);border:1px solid ${B.border};border-radius:12px;margin-bottom:24px;">
            <tr><td style="padding:18px 22px;text-align:center;">
              <p style="margin:0;font-size:13px;color:${B.textMid};font-family:Poppins,Arial,sans-serif;line-height:1.7;">
                Your feedback helps other shoppers discover the perfect gift 💜<br/>
                It only takes <strong>30 seconds!</strong>
              </p>
            </td></tr>
          </table>

          ${ctaButton("Write a Review →", `${BASE_URL}/review?order=${shortId}`)}
        </td></tr>

        <tr><td style="height:32px;"></td></tr>
        ${emailFooter()}
      `;

      const templateIdStr = process.env.BREVO_TEMPLATE_REVIEW_REQUEST;
      const templateId = templateIdStr ? parseInt(templateIdStr, 10) : undefined;

      if (templateId && !isNaN(templateId)) {
        await ctx.runMutation(internal.emails.queue.enqueue, {
          to: [{ email: order.email, name: order.name }],
          templateId,
          params: JSON.stringify({
            firstName,
            orderId: shortId,
            reviewUrl: `${BASE_URL}/review?order=${shortId}`,
          }),
          tags: ["review-request"],
        });
      } else {
        await ctx.runMutation(internal.emails.queue.enqueue, {
          to: [{ email: order.email, name: order.name }],
          subject: `⭐ How was your UpharVilla gift, ${firstName}?`,
          htmlContent: emailWrapper(body),
          sender: { email: "support@upharvilla.in", name: "UpharVilla" },
          tags: ["review-request"],
        });
      }
    }

    await ctx.runAction(internal.emails.queue.processQueue);
    console.log(`[Review] Enqueued ${orders.length} review request emails`);
  },
});
