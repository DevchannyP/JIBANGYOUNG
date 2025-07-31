"use client";

import { getPresignedUrl } from "@/libs/api/community/upload.api";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import S3UploadAdapter from "../utils/S3UploadAdapter";

interface EditorProps {
  initialData?: string;
  onChange?: (data: string) => void;
}

export default function CKEditorWithS3({
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
          ) => new S3UploadAdapter(loader, { getPresignedUrl });
        }}
        onChange={(_, editor) => {
          const data = editor.getData();
          onChange?.(data);
        }}
      />
    </div>
  );
}
