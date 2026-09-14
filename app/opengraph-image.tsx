import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Fyp, offrir le cadeau parfait sans jamais gâcher la surprise";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #FDE7F0 0%, #FFFFFF 50%, #FDE7F0 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Glow decoration */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            height: "400px",
            background: "rgba(232, 54, 143, 0.15)",
            borderRadius: "50%",
            filter: "blur(80px)",
          }}
        />

        {/* Logo Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "32px",
            background: "#FFFFFF",
            padding: "12px 28px",
            borderRadius: "30px",
            border: "2px solid #FBCFE8",
            boxShadow: "0 10px 25px -5px rgba(232, 54, 143, 0.2)",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "14px",
              background: "#E8368F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: "24px",
              fontWeight: 900,
            }}
          >
            🎁
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 900,
              color: "#2B2230",
              letterSpacing: "-0.03em",
            }}
          >
            Fyp<span style={{ color: "#E8368F" }}>.</span>
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "56px",
            fontWeight: 900,
            color: "#2B2230",
            textAlign: "center",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            maxWidth: "950px",
            marginBottom: "24px",
          }}
        >
          Offrir le cadeau parfait sans jamais gâcher la surprise
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "24px",
            fontWeight: 500,
            color: "#6B5E70",
            textAlign: "center",
            maxWidth: "850px",
            lineHeight: 1.4,
          }}
        >
          Mécanisme d’aveuglement : 4 questions discrètes, budget 100% secret, 3 recommandations ciblées.
        </div>

        {/* Footer Pills */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              background: "rgba(232, 54, 143, 0.1)",
              color: "#E8368F",
              padding: "8px 20px",
              borderRadius: "20px",
              fontSize: "16px",
              fontWeight: 700,
              border: "1px solid rgba(232, 54, 143, 0.2)",
            }}
          >
            🔒 Budget 100% secret
          </div>
          <div
            style={{
              background: "rgba(232, 54, 143, 0.1)",
              color: "#E8368F",
              padding: "8px 20px",
              borderRadius: "20px",
              fontSize: "16px",
              fontWeight: 700,
              border: "1px solid rgba(232, 54, 143, 0.2)",
            }}
          >
            ⚡ Quiz 1 minute
          </div>
          <div
            style={{
              background: "rgba(232, 54, 143, 0.1)",
              color: "#E8368F",
              padding: "8px 20px",
              borderRadius: "20px",
              fontSize: "16px",
              fontWeight: 700,
              border: "1px solid rgba(232, 54, 143, 0.2)",
            }}
          >
            ✨ 3 idées sur-mesure
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
