import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Will You Be My Valentine?";
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
          fontSize: 64,
          background: "linear-gradient(135deg, #faf6f1 0%, #f5ebe0 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 120, marginBottom: 20 }}>❤️</div>
        <div
          style={{
            color: "#5c4a6e",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          Will You Be My Valentine?
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#8b7355",
            marginTop: 20,
          }}
        >
          A most distinguished invitation
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
