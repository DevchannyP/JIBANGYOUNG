interface ReasonCardsProps {
  reason1: string;
  reason2: string;
  reason3: string;
  reason4: string;
}

interface ReasonCardProps {
  icon: string;
  title: string;
  description: string;
  iconClass: string;
}

function ReasonCard({ icon, title, description, iconClass }: ReasonCardProps) {
  return (
    <div className="reason-card">
      <div className={`reason-icon ${iconClass}`}>
        {icon}
      </div>
      <div className="reason-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export function ReasonCards({ reason1, reason2, reason3, reason4 }: ReasonCardsProps) {
  const parseReason = (reason: string) => {
    const parts = reason.split(' : ');
    if (parts.length >= 3) {
      return {
        grade: parts[1],
        description: parts.slice(2).join(' : ')
      };
    }
    return {
      grade: '정보없음',
      description: reason
    };
  };

  const medicalReason = parseReason(reason1);
  const medicalReason2 = parseReason(reason2);
  const transportReason = parseReason(reason3);
  const housingReason = parseReason(reason4);

  return (
    <div className="reason-cards">
      <ReasonCard
        icon="🏥"
        title="의료 인프라 분야"
        description={medicalReason.description}
        iconClass="medical-icon"
      />
      
      <ReasonCard
        icon="🏥"
        title="의료 접근성 분야"
        description={medicalReason2.description}
        iconClass="housing-icon"
      />
      
      <ReasonCard
        icon="🚌"
        title="교통 인프라 분야"
        description={transportReason.description}
        iconClass="education-icon"
      />
      
      <ReasonCard
        icon="🏠"
        title="주거 인프라 분야"
        description={housingReason.description}
        iconClass="transport-icon"
      />
    </div>
  );
}