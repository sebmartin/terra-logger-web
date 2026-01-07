import { FeatureType } from "../../types/feature";

export default function FeatureIcon({ name, size }: { name: FeatureType, size?: number }) {
  const defaultSize = 16;
  return (
    <span className="feature-icon-container" style={{
      display: "inline-block",
      height: `${size || defaultSize}px`,
      width: `${size || defaultSize}px`,
    }}>
      <span
        className={`control-icon feature-icon-${name.toLowerCase()}`}
        style={{
          display: "inline-block",
          height: `${size || defaultSize}px`,
          width: `${size || defaultSize}px`,
        }}
      />
    </span>
  );
}