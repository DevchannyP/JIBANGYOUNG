export async function getPresignedUrl(file: File) {
  const ext = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${ext}`;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/community/presign`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName,
        contentType: file.type,
      }),
    }
  );

  if (!res.ok) throw new Error("Presigned URL 발급 실패");

  return await res.json(); // { url, publicUrl }
}
