import { CommonModal, ModalButton } from "@/app/admin/components/AdminModal";
import { AdMentorRequest } from "@/types/api/adMentorRequest";

interface MentorRequestModalProps {
  data: AdMentorRequest;
  userRole?: string;
  onRequest?: () => void;
  onFirstApprove?: () => void;
  onSecondApprove?: () => void;
  onReject: () => void;
  onClose: () => void;
}

export function MentorRequestModal({
  data,
  userRole,
  onRequest,
  onFirstApprove,
  onSecondApprove,
  onReject,
  onClose,
}: MentorRequestModalProps) {
  // 상태값 + 유저 role에 따라 버튼을 동적으로 제어
  const getButtons = (): ModalButton[] => {
    // MENTOR_A: FIRST_APPROVED, REQUESTED, PENDING → 2차 승인, 반려
    if (
      userRole === "MENTOR_A" &&
      ["FIRST_APPROVED", "REQUESTED", "PENDING"].includes(data.status)
    ) {
      return [
        onSecondApprove && {
          label: "2차 승인",
          onClick: onSecondApprove,
          type: "secondary",
        },
        { label: "멘토 미승인", onClick: onReject, type: "danger" },
      ].filter(Boolean) as ModalButton[];
    }
    // MENTOR_B: REQUESTED, PENDING → 1차 승인, 반려
    if (
      userRole === "MENTOR_B" &&
      ["REQUESTED", "PENDING"].includes(data.status)
    ) {
      return [
        onFirstApprove && {
          label: "1차 승인",
          onClick: onFirstApprove,
          type: "info",
        },
        { label: "멘토 미승인", onClick: onReject, type: "danger" },
      ].filter(Boolean) as ModalButton[];
    }
    // MENTOR_C: PENDING → 승인요청, 반려
    if (userRole === "MENTOR_C" && data.status === "PENDING") {
      return [
        onRequest && {
          label: "승인 요청",
          onClick: onRequest,
          type: "warning",
        },
        { label: "멘토 미승인", onClick: onReject, type: "danger" },
      ].filter(Boolean) as ModalButton[];
    }
    return [];
  };

  return (
    <CommonModal
      title="멘토 신청 상세"
      content={
        <div>
          <p>
            <b>이름:</b> {data.userName}
          </p>
          <p>
            <b>이메일:</b> {data.userEmail}
          </p>
          <p>
            <b>지역:</b> {data.regionId}
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
          <p>
            <b>신청사유:</b>
          </p>
          <textarea
            value={data.reason || ""}
            readOnly
            style={{ width: "100%", height: "100px" }}
          />
        </div>
      }
      buttons={getButtons()}
      onClose={onClose}
    />
  );
}
