import { CommonModal } from "@/app/admin/components/AdminModal";
import { AdMentorRequest } from "@/types/api/adMentorRequest";

interface MentorRequestModalProps {
  data: AdMentorRequest;
  onApprove: () => void;
  onFirstApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}

export function MentorRequestModal({
  data,
  onApprove,
  onFirstApprove,
  onReject,
  onClose,
}: MentorRequestModalProps) {
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
            <b>행정기관여부:</b> {data.governmentAgency}
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
          {/* 필요하다면 반려사유, 첨부파일, 상태값 등 추가로 표시 */}
        </div>
      }
      buttons={[
        { label: "멘토 승인", onClick: onApprove, type: "primary" },
        { label: "승인 대기", onClick: onFirstApprove, type: "secondary" },
        { label: "멘토 미승인", onClick: onReject, type: "danger" },
      ]}
      onClose={onClose}
    />
  );
}
