import { CommonModal, ModalButton } from "@/app/admin/components/AdminModal";
import { AdMentorRequest } from "@/types/api/adMentorRequest";
import { useMemo, useState } from "react";

interface MentorRequestModalProps {
  data: AdMentorRequest;
  userRole?: string;
  onRequest?: () => void;
  onFirstApprove?: () => void;
  onSecondApprove?: () => void;
  onReject: (reason: string) => void;
  onClose: () => void;
  regionOptions: { code: number; name: string }[];
}

export function MentorRequestModal({
  data,
  userRole,
  regionOptions,
  onRequest,
  onFirstApprove,
  onSecondApprove,
  onReject,
  onClose,
}: MentorRequestModalProps) {
  // 반려 모드 (사유 입력)
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // 지역명
  const regionName = useMemo(() => {
    const r = regionOptions.find((it) => it.code === data.regionId);
    return r ? r.name : String(data.regionId ?? "");
  }, [regionOptions, data.regionId]);

  const resetReject = () => {
    setIsRejecting(false);
    setRejectReason("");
  };

  const handleRejectConfirm = () => {
    const reason = rejectReason.trim();
    if (!reason) {
      alert("반려 사유를 입력해 주세요.");
      return;
    }
    onReject(reason);
    resetReject();
  };

  // 기본 버튼(역할/상태별)
  const getBaseButtons = (): ModalButton[] => {
    // MENTOR_A: FIRST_APPROVED, REQUESTED, PENDING → 2차 승인, 반려
    if (
      userRole === "MENTOR_A" &&
      ["FIRST_APPROVED", "REQUESTED", "PENDING"].includes(data.status)
    ) {
      return [
        onSecondApprove && {
          label: "2차 승인",
          onClick: () => onSecondApprove?.(),
          type: "secondary",
        },
        {
          label: "반려",
          onClick: () => setIsRejecting(true),
          type: "danger",
        },
      ].filter(Boolean) as ModalButton[];
    }

    // MENTOR_A: SECOND_APPROVED → 2차 승인 취소(=1차 승인 API 호출)
    if (userRole === "MENTOR_A" && data.status === "SECOND_APPROVED") {
      return [
        {
          label: "2차 승인 취소",
          onClick: () => onFirstApprove?.(), // 기존 1차 승인 API 호출
          type: "warning",
        },
        {
          label: "반려",
          onClick: () => setIsRejecting(true),
          type: "danger",
        },
      ];
    }

    // MENTOR_B: REQUESTED, PENDING → 1차 승인, 반려
    if (
      userRole === "MENTOR_B" &&
      ["REQUESTED", "PENDING"].includes(data.status)
    ) {
      return [
        onFirstApprove && {
          label: "1차 승인",
          onClick: () => onFirstApprove?.(),
          type: "info",
        },
        {
          label: "반려",
          onClick: () => setIsRejecting(true),
          type: "danger",
        },
      ].filter(Boolean) as ModalButton[];
    }

    // MENTOR_B: FIRST_APPROVED → 1차 승인 취소
    if (userRole === "MENTOR_B" && data.status === "FIRST_APPROVED") {
      return [
        {
          label: "1차 승인 취소",
          onClick: () => onRequest?.(),
          type: "warning",
        },
        {
          label: "반려",
          onClick: () => setIsRejecting(true),
          type: "danger",
        },
      ];
    }

    // MENTOR_C: PENDING → 승인요청
    if (userRole === "MENTOR_C" && data.status === "PENDING") {
      return [
        onRequest && {
          label: "승인 요청",
          onClick: () => onRequest?.(),
          type: "warning",
        },
      ].filter(Boolean) as ModalButton[];
    }

    return [];
  };

  // 반려 모드일 때 버튼 교체
  const getButtons = (): ModalButton[] => {
    if (isRejecting) {
      return [
        {
          label: "반려 확정",
          onClick: () => handleRejectConfirm(),
          type: "danger",
        },
        { label: "취소", onClick: () => resetReject(), type: "secondary" },
      ];
    }
    return getBaseButtons();
  };

  return (
    <CommonModal
      title="멘토 신청 상세"
      content={
        <div style={{ display: "grid", gap: 8 }}>
          <p>
            <b>멘토 신청 ID:</b> {data.userName}
          </p>
          <p>
            <b>이메일:</b> {data.userEmail}
          </p>
          <p>
            <b>멘토 신청지역:</b> {regionName}
          </p>
          <p>
            <b>행정기관여부:</b> {data.governmentAgency ? "예" : "아니오"}
          </p>
          <p>
            <b>신청일:</b>{" "}
            {data.createdAt
              ? data.createdAt.slice(0, 16).replace("T", " ")
              : ""}
          </p>
          <div>
            <p>
              <b>신청사유:</b>
            </p>
            <textarea
              value={data.reason || ""}
              readOnly
              style={{ width: "100%", height: 100 }}
            />
          </div>

          {isRejecting && (
            <div>
              <p style={{ marginTop: 12 }}>
                <b>반려 사유 입력</b> (필수)
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="반려 사유를 입력하세요"
                style={{ width: "100%", height: 100 }}
              />
            </div>
          )}
        </div>
      }
      buttons={getButtons()}
      onClose={() => {
        resetReject();
        onClose();
      }}
    />
  );
}
