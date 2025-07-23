// File: api/input-faktur-api/src/index.js

import { GoogleGenerativeAI } from "@google/generative-ai";

export default {
  async fetch(request, env, ctx) {
    try {
      const contentType = request.headers.get("content-type") || "";

      if (request.method === "POST" && contentType.includes("multipart/form-data")) {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) throw new Error("No file uploaded");

        const arrayBuffer = await file.arrayBuffer();
        const base64Image = btoa(
          String.fromCharCode(...new Uint8Array(arrayBuffer))
        );

        const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

        const result = await model.generateContent([
          "Tolong ekstrak daftar nama produk obat dari foto faktur pembelian ini.",
          {
            inlineData: {
              mimeType: file.type,
              data: base64Image,
            },
          },
        ]);

        const response = await result.response;
        const text = await response.text();

        return new Response(JSON.stringify({ result: text }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response("Use POST with multipart/form-data", { status: 405 });
    } catch (err) {
      console.error("ERROR:", err.message);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
