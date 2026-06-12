import Link from "next/link";

interface AdminPlacementHintProps {
  items: string[];
  previewHref?: string;
  previewLabel?: string;
}

export default function AdminPlacementHint({
  items,
  previewHref = "/",
  previewLabel = "معاينة في المتجر",
}: AdminPlacementHintProps) {
  return (
    <div className="admin-placement-hint">
      <p className="admin-placement-hint__title">أين يظهر في الموقع؟</p>
      <ul className="admin-placement-hint__list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {previewHref && (
        <Link
          href={previewHref}
          target="_blank"
          className="admin-placement-hint__link"
        >
          {previewLabel} ↗
        </Link>
      )}
    </div>
  );
}
