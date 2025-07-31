// libs/editor/S3UploadAdapter.ts
export interface S3UploadAdapterOptions {
  getPresignedUrl: (file: File) => Promise<{ url: string; publicUrl: string }>;
}

export default class S3UploadAdapter {
  loader: any;
  options: S3UploadAdapterOptions;

  constructor(loader: any, options: S3UploadAdapterOptions) {
    this.loader = loader;
    this.options = options;
  }

  async upload() {
    const file: File = await this.loader.file;

    // Presigned URL 발급
    const { url, publicUrl } = await this.options.getPresignedUrl(file);

    // S3로 업로드
    const uploadRes = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
        // "x-amz-acl": "public-read",
      },
      body: file,
    });
    console.log("file type:", file.type);
    console.log("url:", url);
    if (!uploadRes.ok) {
      throw new Error("이미지 업로드 실패");
    }

    return { default: publicUrl };
  }

  abort() {
    // 필요시 구현
  }
}
