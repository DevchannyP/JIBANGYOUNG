"use client";

import {
  getMentorDocumentPresignedUrl,
  uploadFileToS3,
} from "@/libs/api/mentor/mentor.api";
import { getRegionsBoard } from "@/libs/api/region.api";
import { useCreateMentorApplication } from "@/libs/hooks/useMentor";
import type { Region } from "@/types/api/region.d";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../MentorApply.module.css";

export default function MentorApplicationForm() {
  const router = useRouter();
  const [regions, setRegions] = useState<Region[]>([]);
  const [form, setForm] = useState({
    regionId: "",
    reason: "",
    governmentAgency: false,
    documentFile: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const createMutation = useCreateMentorApplication();

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const regionData = await getRegionsBoard();
        setRegions(regionData);
      } catch (error) {
        console.error("지역 목록을 불러오지 못했습니다:", error);
      }
    };
    fetchRegions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, documentFile: file }));
  };

  const handleSubmit = async () => {
    if (!form.regionId) {
      alert("지역을 선택해주세요.");
      return;
    }
    if (!form.reason.trim()) {
      alert("신청 사유를 입력해주세요.");
      return;
    }
    // if (!form.documentFile) {
    //   alert("제출 파일을 선택해주세요.");
    //   return;
    // }

    setLoading(true);
    setUploadProgress("파일 업로드 중...");

    try {
      // 공공기관 체크 시 서류 필수 확인
      if (form.governmentAgency && !form.documentFile) {
        alert("공공기관 소속의 경우 서류 파일을 선택해주세요.");
        setLoading(false);
        return;
      }

      let publicUrl = "";

      // 서류가 있는 경우에만 업로드 처리
      if (form.documentFile) {
        // 1. Presigned URL 발급
        const { url: presignedUrl, publicUrl: uploadedUrl } =
          await getMentorDocumentPresignedUrl(form.documentFile);
        publicUrl = uploadedUrl;

        // 2. S3에 파일 업로드
        setUploadProgress("S3에 파일 업로드 중...");
        await uploadFileToS3(presignedUrl, form.documentFile);
      }

      // 3. 멘토 신청 제출 (publicUrl 포함)
      setUploadProgress("멘토 신청 제출 중...");
      await createMutation.mutateAsync({
        regionId: Number(form.regionId),
        reason: form.reason,
        governmentAgency: form.governmentAgency,
        documentUrl: publicUrl,
      });

      alert("멘토 신청이 완료되었습니다.");
      router.push("/mentor/info");
    } catch (error) {
      console.error(error);
      alert("신청 중 오류가 발생했습니다: " + (error as Error).message);
    } finally {
      setLoading(false);
      setUploadProgress("");
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formRow}>
        <label className={styles.label}>지역</label>
        <select
          title="지역선택"
          name="regionId"
          value={form.regionId}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">지역선택</option>
          {regions.map((region) => (
            <option key={region.regionCode} value={region.regionCode}>
              {region.sido} {region.guGun}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formRow}>
        <label className={styles.label}>신청사유</label>
        <textarea
          name="reason"
          value={form.reason}
          onChange={handleChange}
          placeholder="멘토로 활동하고자 하는 이유를 작성해주세요."
          className={styles.textarea}
        />
      </div>

      <div className={styles.formRow}>
        <label className={styles.label}>행정기관</label>
        <div className={styles.checkboxContainer}>
          <input
            title="행정기관 체크"
            type="checkbox"
            name="governmentAgency"
            checked={form.governmentAgency}
            onChange={handleChange}
            id="governmentAgency"
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <label className={styles.label}>제출파일</label>
        <div className={styles.fileContainer}>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className={styles.fileInput}
            id="fileInput"
          />
          <input
            type="text"
            readOnly
            value={form.documentFile?.name || "파일을 선택하세요"}
            className={styles.input}
            placeholder="파일을 선택하세요"
          />
          <label htmlFor="fileInput" className={styles.fileButton}>
            파일찾기
          </label>
        </div>
      </div>

      <div className={styles.submitContainer}>
        {uploadProgress && (
          <div className={styles.progressText}>{uploadProgress}</div>
        )}
        <button
          onClick={handleSubmit}
          disabled={loading || createMutation.isPending}
          className={styles.submitButton}
        >
          {loading || createMutation.isPending
            ? uploadProgress || "신청 중..."
            : "신청"}
        </button>
      </div>
    </div>
  );
}
