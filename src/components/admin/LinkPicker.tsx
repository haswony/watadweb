"use client";

import { LINK_TYPE_LABELS } from "@/lib/admin-links";
import { formatCategoryOption } from "@/lib/category-tree";
import type { AdminCategory, AdminLinkType } from "@/types/admin";

interface LinkPickerProps {
  linkType: AdminLinkType;
  categoryId?: string;
  categories: AdminCategory[];
  onChange: (linkType: AdminLinkType, categoryId?: string) => void;
  label?: string;
}

export default function LinkPicker({
  linkType,
  categoryId,
  categories,
  onChange,
  label = "الوجهة",
}: LinkPickerProps) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      <select
        className="admin-input"
        value={
          linkType === "category" && categoryId
            ? `category:${categoryId}`
            : linkType
        }
        onChange={(e) => {
          const val = e.target.value;
          if (val.startsWith("category:")) {
            onChange("category", val.replace("category:", ""));
          } else {
            onChange(val as AdminLinkType, undefined);
          }
        }}
      >
        {(["home", "all", "sale"] as AdminLinkType[]).map((type) => (
          <option key={type} value={type}>
            {LINK_TYPE_LABELS[type].ar}
          </option>
        ))}
        {categories.map((c) => (
          <option key={c.id} value={`category:${c.id}`}>
            فئة: {formatCategoryOption(c, categories, "ar")}
          </option>
        ))}
      </select>
    </div>
  );
}
