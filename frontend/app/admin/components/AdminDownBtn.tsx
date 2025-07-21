"use client";

import { Download } from "lucide-react";
import styles from "../AdminPage.module.css";

interface DownloadButtonProps {
  fileUrl: string;
}

export function DownloadButton({ fileUrl }: DownloadButtonProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "";
    link.click();
  };

  return (
    <button onClick={handleDownload} className={styles.downloadButton}>
      <Download size={16} />
    </button>
  );
}
