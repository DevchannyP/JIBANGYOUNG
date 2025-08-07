import { Download } from "lucide-react";
import styles from "../AdminPage.module.css";

interface DownloadButtonProps {
  fileUrl: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function DownloadButton({ fileUrl, onClick }: DownloadButtonProps) {
  const handleDownload = (e: React.MouseEvent) => {
    // 외부에서 stopPropagation 필요시 전달받아 실행
    onClick?.(e);

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className={styles.downloadButton}
      type="button"
    >
      <Download size={16} />
    </button>
  );
}
