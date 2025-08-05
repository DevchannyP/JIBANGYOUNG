"use client";

import { getMentorDocumentPresignedUrl, uploadFileToS3 } from "@/libs/api/mentor/mentor.api";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";

interface EditorProps {
  initialData?: string;
  onChange?: (data: string) => void;
}

// 멘토 전용 S3 업로드 어댑터
class MentorS3UploadAdapter {
  loader: any;

  constructor(loader: any) {
    this.loader = loader;
  }

  async upload() {
    const file: File = await this.loader.file;

    try {
      // 멘토 전용 presigned URL 발급
      const { url: presignedUrl, publicUrl } = await getMentorDocumentPresignedUrl(file);
      
      // S3에 직접 업로드
      await uploadFileToS3(presignedUrl, file);

      return { default: publicUrl };
    } catch (error) {
      throw new Error("이미지 업로드 실패");
    }
  }

  abort() {
    // 필요시 구현
  }
}

export default function MentorNoticeEditor({
  initialData = "",
  onChange,
}: EditorProps) {
  return (
    <div>
      <CKEditor
        editor={ClassicEditor as any}
        data={initialData}
        onReady={(editor) => {
          editor.plugins.get("FileRepository").createUploadAdapter = (
            loader: any
          ) => new MentorS3UploadAdapter(loader);
        }}
        onChange={(_, editor) => {
          const data = editor.getData();
          onChange?.(data);
        }}
        config={{
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'imageUpload',
            'blockQuote',
            'insertTable',
            'mediaEmbed',
            'undo',
            'redo'
          ]
        }}
      />
    </div>
  );
}