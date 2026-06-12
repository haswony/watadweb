"use client";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function ImageUpload({ label, value, onChange }: ImageUploadProps) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="admin-label">{label}</label>
      {value ? (
        <div className="admin-image-preview mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="admin-image-preview__img" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="admin-link admin-link--danger mt-1 text-xs"
          >
            إزالة الصورة
          </button>
        </div>
      ) : null}
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="admin-input text-sm"
      />
      <p className="mt-1 text-xs text-gray-400">ارفع صورة من جهازك — بدون رابط</p>
    </div>
  );
}
