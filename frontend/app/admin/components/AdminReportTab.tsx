import styles from "../AdminPage.module.css";

export interface AdminRegionTabProps {
  regionOptions: { code: number; name: string }[];
  selectedRegionCode: number;
  onSelectRegion: (regionName: string, code: number) => void;
}

export function AdminRegionTab({
  regionOptions,
  selectedRegionCode,
  onSelectRegion,
}: AdminRegionTabProps) {
  if (!regionOptions || regionOptions.length === 0)
    return <div>지역 정보 없음</div>;

  return (
    <div className={styles.regionTabs}>
      {regionOptions.map((region) => (
        <button
          key={region.code}
          onClick={() => onSelectRegion(region.name, region.code)}
          className={
            selectedRegionCode === region.code ? styles.activeRegion : ""
          }
        >
          {region.name}
        </button>
      ))}
    </div>
  );
}
