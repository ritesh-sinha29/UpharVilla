"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const REDIRECT_SECONDS = 5;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (countdown <= 0) {
      router.replace("/");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <html lang="en">
      <head>
        <title>404 — Page Not Found | upharVilla</title>
        <meta name="robots" content="noindex" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Poppins', sans-serif;
            background: #ffffff;
            min-height: 100dvh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            color: #1a1625;
          }
          @keyframes popIn {
            from { opacity: 0; transform: translateY(20px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0)   scale(1); }
          }
          @keyframes shrink {
            from { width: 100%; }
            to   { width: 0%; }
          }
        `}</style>
      </head>
      <body>
        <div style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: "16px",
          boxShadow: "0 4px 32px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
          overflow: "hidden",
          animation: "popIn 0.45s cubic-bezier(0.16,1,0.3,1) both",
        }}>
          {/* Progress bar */}
          <div style={{ height: "3px", background: "#f0ebfa", position: "relative" }}>
            <div style={{
              height: "100%",
              background: "#ad8de9",
              animation: `shrink ${REDIRECT_SECONDS}s linear both`,
              transformOrigin: "left",
            }} />
          </div>

          {/* Card body */}
          <div style={{ padding: "2.5rem 2rem 2rem" }}>
            {/* Brand mark */}
            <p style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#ad8de9",
              marginBottom: "1.75rem",
            }}>
              upharVilla
            </p>

            {/* 404 */}
            <p style={{
              fontSize: "4.5rem",
              fontWeight: 700,
              color: "#ad8de9",
              lineHeight: 1,
              marginBottom: "0.5rem",
              letterSpacing: "-0.03em",
            }}>
              404
            </p>

            <h1 style={{
              fontSize: "1.15rem",
              fontWeight: 600,
              color: "#1a1625",
              marginBottom: "0.5rem",
              lineHeight: 1.3,
            }}>
              Page not found
            </h1>

            <p style={{
              fontSize: "0.85rem",
              fontWeight: 400,
              color: "#7c6aad",
              lineHeight: 1.6,
              marginBottom: "1.75rem",
            }}>
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>

            {/* Countdown line */}
            <p style={{
              fontSize: "0.78rem",
              color: "#a89cc8",
              marginBottom: "1.5rem",
              fontWeight: 500,
            }}>
              Redirecting to home in{" "}
              <span style={{ color: "#ad8de9", fontWeight: 600 }}>{countdown}s</span>
            </p>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <Link
                href={`${SITE_URL}/`}
                style={{
                  display: "inline-block",
                  background: "#ad8de9",
                  color: "#fff",
                  padding: "0.6rem 1.4rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.88"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
              >
                Back to Home
              </Link>
              <Link
                href={`${SITE_URL}/products`}
                style={{
                  display: "inline-block",
                  background: "transparent",
                  color: "#ad8de9",
                  padding: "0.6rem 1.4rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  textDecoration: "none",
                  border: "1px solid #ad8de9",
                  letterSpacing: "0.01em",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#ad8de9"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#ad8de9"; }}
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
