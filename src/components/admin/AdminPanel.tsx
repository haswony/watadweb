"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";
import { categoryHref } from "@/lib/admin-links";
import type { AdminTab, CatalogProduct } from "@/types/admin";
import { formatCategoryOption, getChildCategories, getRootCategories } from "@/lib/category-tree";
import AdminPlacementHint from "./AdminPlacementHint";
import ImageUpload from "./ImageUpload";
import LinkPicker from "./LinkPicker";

const TABS: { id: AdminTab; label: string }[] = [
  { id: "overview", label: "نظرة عامة" },
  { id: "products", label: "المنتجات" },
  { id: "categories", label: "الفئات" },
  { id: "brands", label: "الماركات" },
  { id: "hero", label: "البانر" },
  { id: "settings", label: "الإعدادات" },
];

const emptyProduct = (
  categoryId: string
): Omit<CatalogProduct, "id"> => ({
  name: "",
  nameAr: "",
  brand: "",
  price: 0,
  image: "",
  categoryId,
});

export default function AdminPanel() {
  const admin = useAdmin();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [productForm, setProductForm] = useState(
    emptyProduct("")
  );
  const [showProductForm, setShowProductForm] = useState(false);

  const { state, isAuthenticated, hydrated } = admin;
  const firstCategoryId = state.categories[0]?.id ?? "";

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const ok = admin.login(password);
    setLoginError(!ok);
  };

  if (!hydrated) {
    return (
      <div className="admin-page flex min-h-screen items-center justify-center">
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-page flex min-h-screen items-center justify-center p-4" dir="rtl">
        <form
          onSubmit={handleLogin}
          className="admin-login w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg"
        >
          <h1 className="mb-2 text-2xl font-black">لوحة تحكم المشرف</h1>
          <p className="mb-6 text-sm text-gray-500">
            أدخل كلمة المرور للوصول إلى إدارة الموقع
          </p>
          <label className="admin-label">كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-input mb-4"
            placeholder="watad2026"
            autoFocus
          />
          {loginError && (
            <p className="mb-3 text-sm text-red-600">كلمة المرور غير صحيحة</p>
          )}
          <button type="submit" className="admin-btn admin-btn--primary w-full">
            دخول
          </button>
          <Link href="/" className="mt-4 block text-center text-sm text-gray-500 hover:underline">
            العودة للمتجر
          </Link>
        </form>
      </div>
    );
  }

  const startEditProduct = (id: number) => {
    const p = state.products.find((x) => x.id === id);
    if (!p) return;
    setProductForm({
      name: p.name,
      nameAr: p.nameAr,
      brand: p.brand,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.image,
      images: p.images,
      badge: p.badge,
      description: p.description,
      sizes: p.sizes,
      color: p.color,
      categoryId: p.categoryId,
      imageFit: p.imageFit,
    });
    setEditingProduct(id);
    setShowProductForm(true);
  };

  const saveProduct = () => {
    if (!productForm.nameAr || !productForm.image || !productForm.categoryId) return;
    if (editingProduct !== null) {
      admin.updateProduct(editingProduct, productForm);
    } else {
      admin.addProduct(productForm);
    }
    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm(emptyProduct(firstCategoryId));
  };

  const categoryName = (id: string) =>
    state.categories.find((c) => c.id === id)?.nameAr ?? "—";

  const firstRootCategory = getRootCategories(state.categories)[0];
  const shopPreview = firstRootCategory
    ? categoryHref(firstRootCategory.slug)
    : "/shop/all";
  const productPreview = state.products[0]
    ? `/product/${state.products[0].id}`
    : shopPreview;

  return (
    <div className="admin-page min-h-screen" dir="rtl">
      <header className="admin-header">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-white">لوحة تحكم a3mal watad</h1>
            <p className="text-xs text-white/70">بدون روابط — ارفع الصور واختر الفئات</p>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="admin-btn admin-btn--ghost text-sm">
              عرض المتجر
            </Link>
            <button onClick={admin.logout} className="admin-btn admin-btn--ghost text-sm">
              خروج
            </button>
          </div>
        </div>
      </header>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`admin-sidebar__btn ${tab === t.id ? "admin-sidebar__btn--active" : ""}`}
            >
              {t.label}
            </button>
          ))}
        </aside>

        <main className="admin-main">
          {tab === "overview" && (
            <section>
              <h2 className="admin-section-title">نظرة عامة</h2>
              <div className="admin-stats">
                <div className="admin-stat">
                  <span className="admin-stat__num">{state.products.length}</span>
                  <span className="admin-stat__label">منتج</span>
                </div>
                <div className="admin-stat">
                  <span className="admin-stat__num">{state.categories.length}</span>
                  <span className="admin-stat__label">فئة</span>
                </div>
                <div className="admin-stat">
                  <span className="admin-stat__num">{state.settings.deliveryFee.toLocaleString()}</span>
                  <span className="admin-stat__label">د.ع توصيل</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                التوصيل {state.settings.deliveryFee.toLocaleString()} د.ع لجميع المحافظات العراقية
              </p>
              <button
                onClick={() => {
                  if (confirm("إعادة كل البيانات للوضع الافتراضي؟ سيتم حذف المنتجات.")) {
                    admin.resetToDefaults();
                  }
                }}
                className="admin-btn admin-btn--danger mt-6"
              >
                إعادة تعيين كل البيانات
              </button>
            </section>
          )}

          {tab === "products" && (
            <section>
              <AdminPlacementHint
                items={[
                  "صفحة الفئة /shop/... — شبكة المنتجات حسب التصنيف",
                  "الصفحة الرئيسية — شرائح «منتجات حسب الفئة»",
                  "صفحة المنتج /product/... — التفاصيل والسعر والمقاسات",
                  "البحث والسلة والمفضلة — عند إضافة المنتج",
                ]}
                previewHref={productPreview}
                previewLabel="معاينة صفحة منتج"
              />
              <div className="admin-toolbar">
                <h2 className="admin-section-title mb-0">
                  المنتجات ({state.products.length})
                </h2>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm(emptyProduct(firstCategoryId));
                    setShowProductForm(true);
                  }}
                  className="admin-btn admin-btn--primary"
                  disabled={!state.categories.length}
                >
                  + إضافة منتج
                </button>
              </div>

              {!state.categories.length && (
                <p className="mb-4 text-sm text-amber-700">
                  أضف فئة أولاً من تبويب الفئات
                </p>
              )}

              {showProductForm && (
                <div className="admin-form-card">
                  <h3 className="font-bold">{editingProduct ? "تعديل منتج" : "منتج جديد"}</h3>
                  <div className="admin-form-grid">
                    <div>
                      <label className="admin-label">الاسم بالعربي *</label>
                      <input
                        className="admin-input"
                        value={productForm.nameAr}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            nameAr: e.target.value,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="admin-label">الفئة *</label>
                      <select
                        className="admin-input"
                        value={productForm.categoryId}
                        onChange={(e) =>
                          setProductForm({ ...productForm, categoryId: e.target.value })
                        }
                      >
                        {state.categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {formatCategoryOption(c, state.categories, "ar")}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="admin-label">الماركة</label>
                      <select
                        className="admin-input"
                        value={productForm.brand}
                        onChange={(e) =>
                          setProductForm({ ...productForm, brand: e.target.value })
                        }
                      >
                        <option value="">— اختر —</option>
                        {state.brands.map((b) => (
                          <option key={b.id} value={b.name}>
                            {b.nameAr || b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="admin-label">السعر (د.ع) *</label>
                      <input
                        type="number"
                        className="admin-input"
                        value={productForm.price || ""}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            price: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="admin-label">سعر قبل التخفيض</label>
                      <input
                        type="number"
                        className="admin-input"
                        value={productForm.originalPrice ?? ""}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            originalPrice: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="admin-label">اللون</label>
                      <input
                        className="admin-input"
                        value={productForm.color ?? ""}
                        onChange={(e) =>
                          setProductForm({ ...productForm, color: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <ImageUpload
                        label="صورة المنتج *"
                        value={productForm.image}
                        onChange={(image) => setProductForm({ ...productForm, image })}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="admin-label">الوصف</label>
                      <textarea
                        className="admin-input min-h-[80px]"
                        value={productForm.description ?? ""}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={saveProduct} className="admin-btn admin-btn--primary">
                      حفظ
                    </button>
                    <button
                      onClick={() => setShowProductForm(false)}
                      className="admin-btn"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}

              {state.products.length === 0 ? (
                <p className="text-sm text-gray-500">لا توجد منتجات — أضف منتجك الأول</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>الاسم</th>
                        <th>الفئة</th>
                        <th>السعر</th>
                        <th>إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.products.map((p) => (
                        <tr key={p.id}>
                          <td>{p.nameAr || p.name}</td>
                          <td>{categoryName(p.categoryId)}</td>
                          <td>{p.price.toLocaleString()} د.ع</td>
                          <td>
                            <button
                              onClick={() => startEditProduct(p.id)}
                              className="admin-link"
                            >
                              تعديل
                            </button>
                            {" · "}
                            <button
                              onClick={() => {
                                if (confirm("حذف هذا المنتج؟"))
                                  admin.deleteProduct(p.id);
                              }}
                              className="admin-link admin-link--danger"
                            >
                              حذف
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {tab === "categories" && (
            <section>
              <AdminPlacementHint
                items={[
                  "الصفحة الرئيسية — الفئات الرئيسية فقط (بالصور) في قسم «أهم الفئات»",
                  "القائمة الجانبية ☰ — أسماء الفئات كنص فقط بدون صور",
                  "الفئات الفرعية (مثل نايكي داخل بناطير) — تظهر داخل القائمة الجانبية تحت الفئة الأم",
                  "صفحة المتجر /shop/... — عنوان الفئة ومنتجاتها (الرئيسية + الفرعية معاً)",
                  "قائمة سطح المكتب — نفس أسماء الفئات مع القوائم الفرعية",
                ]}
                previewHref="/"
                previewLabel="معاينة الرئيسية والقائمة"
              />
              <div className="admin-toolbar">
                <h2 className="admin-section-title mb-0">الفئات</h2>
                <button
                  onClick={() =>
                    admin.addCategory({
                      nameAr: "فئة رئيسية",
                      nameEn: "Main category",
                      image: "",
                      parentId: null,
                      kind: "main",
                    })
                  }
                  className="admin-btn admin-btn--primary"
                >
                  + فئة رئيسية
                </button>
              </div>
              <p className="mb-4 text-sm text-gray-500">
                الفئات الرئيسية تظهر في الصفحة الرئيسية بالصورة. الفئات الفرعية
                (ماركة داخل بناطير مثلاً) تظهر كنص فقط في القائمة الجانبية.
                الرابط يُنشأ تلقائياً.
              </p>
              <div className="admin-category-tree">
                {getRootCategories(state.categories).map((root) => {
                  const children = getChildCategories(state.categories, root.id);
                  return (
                    <div key={root.id} className="admin-category-group">
                      <div className="admin-card admin-category-group__root">
                        <span className="admin-category-badge">فئة رئيسية</span>
                        <input
                          className="admin-input mb-2"
                          value={root.nameAr}
                          onChange={(e) =>
                            admin.updateCategory(root.id, {
                              nameAr: e.target.value,
                            })
                          }
                          placeholder="الاسم بالعربي"
                        />
                        <input
                          className="admin-input mb-2"
                          value={root.nameEn}
                          onChange={(e) =>
                            admin.updateCategory(root.id, {
                              nameEn: e.target.value,
                            })
                          }
                          placeholder="الاسم بالإنجليزي"
                        />
                        <p className="mb-2 text-xs text-gray-400">
                          {categoryHref(root.slug)}
                        </p>
                        <ImageUpload
                          label="صورة الفئة (الرئيسية فقط)"
                          value={root.image}
                          onChange={(image) =>
                            admin.updateCategory(root.id, { image })
                          }
                        />
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              admin.addCategory({
                                nameAr: "فئة فرعية",
                                nameEn: "Sub category",
                                image: "",
                                parentId: root.id,
                                kind: "sub",
                              })
                            }
                            className="admin-btn text-xs"
                          >
                            + فئة فرعية داخل {root.nameAr}
                          </button>
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  `حذف "${root.nameAr}" وجميع الفئات الفرعية؟`
                                )
                              )
                                admin.deleteCategory(root.id);
                            }}
                            className="admin-link admin-link--danger"
                          >
                            حذف
                          </button>
                        </div>
                      </div>

                      {children.length > 0 && (
                        <div className="admin-category-group__children">
                          {children.map((child) => (
                            <div key={child.id} className="admin-card admin-category-child">
                              <span className="admin-category-badge admin-category-badge--sub">
                                فرعية — {root.nameAr}
                              </span>
                              <input
                                className="admin-input mb-2"
                                value={child.nameAr}
                                onChange={(e) =>
                                  admin.updateCategory(child.id, {
                                    nameAr: e.target.value,
                                  })
                                }
                                placeholder="مثال: نايكي"
                              />
                              <input
                                className="admin-input mb-2"
                                value={child.nameEn}
                                onChange={(e) =>
                                  admin.updateCategory(child.id, {
                                    nameEn: e.target.value,
                                  })
                                }
                                placeholder="Nike"
                              />
                              <p className="mb-2 text-xs text-gray-400">
                                {categoryHref(child.slug)}
                              </p>
                              <button
                                onClick={() => {
                                  if (confirm(`حذف "${child.nameAr}"؟`))
                                    admin.deleteCategory(child.id);
                                }}
                                className="admin-link admin-link--danger"
                              >
                                حذف
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {tab === "brands" && (
            <section>
              <AdminPlacementHint
                items={[
                  "الصفحة الرئيسية — قسم «تسوق حسب الماركة» بشعارات الماركات",
                  "عند الضغط على ماركة — يفتح صفحة بحث باسم الماركة",
                  "إخفاء القسم — يختفي من الرئيسية بالكامل",
                ]}
                previewHref="/#brands"
                previewLabel="معاينة قسم الماركات"
              />
              <h2 className="admin-section-title">تسوق حسب الماركة</h2>
              <p className="mb-4 text-sm text-gray-500">
                تحكم بقسم الماركات في الصفحة الرئيسية — العنوان، الإظهار، والماركات
              </p>

              <div className="admin-form-card mb-6">
                <h3 className="mb-3 font-bold">إعدادات القسم</h3>
                <div className="admin-form-grid">
                  <div>
                    <label className="admin-label">عنوان القسم (عربي)</label>
                    <input
                      className="admin-input"
                      value={state.settings.brandSectionTitleAr}
                      onChange={(e) =>
                        admin.updateSettings({
                          brandSectionTitleAr: e.target.value,
                        })
                      }
                      placeholder="تسوق حسب الماركة"
                    />
                  </div>
                  <div>
                    <label className="admin-label">عنوان القسم (إنجليزي)</label>
                    <input
                      className="admin-input"
                      value={state.settings.brandSectionTitleEn}
                      onChange={(e) =>
                        admin.updateSettings({
                          brandSectionTitleEn: e.target.value,
                        })
                      }
                      placeholder="Shop by brand"
                    />
                  </div>
                  <label className="col-span-2 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={state.settings.brandSectionEnabled}
                      onChange={(e) =>
                        admin.updateSettings({
                          brandSectionEnabled: e.target.checked,
                        })
                      }
                    />
                    إظهار قسم الماركات في الصفحة الرئيسية
                  </label>
                </div>
              </div>

              <div className="admin-toolbar">
                <h3 className="font-bold">الماركات ({state.brands.length})</h3>
                <button
                  onClick={() =>
                    admin.addBrand({
                      name: "New brand",
                      nameAr: "ماركة جديدة",
                      image: "",
                      visible: true,
                    })
                  }
                  className="admin-btn admin-btn--primary"
                >
                  + إضافة ماركة
                </button>
              </div>

              {state.brands.length === 0 ? (
                <p className="text-sm text-gray-500">
                  لا توجد ماركات — أضف ماركة وارفع شعارها لتظهر في المتجر
                </p>
              ) : (
                <div className="admin-cards">
                  {state.brands.map((b) => {
                    const productCount = state.products.filter(
                      (p) => p.brand === b.name || p.brand === b.nameAr
                    ).length;
                    return (
                      <div key={b.id} className="admin-card">
                        <input
                          className="admin-input mb-2"
                          value={b.nameAr}
                          onChange={(e) =>
                            admin.updateBrand(b.id, { nameAr: e.target.value })
                          }
                          placeholder="اسم الماركة بالعربي"
                        />
                        <input
                          className="admin-input mb-2"
                          value={b.name}
                          onChange={(e) =>
                            admin.updateBrand(b.id, { name: e.target.value })
                          }
                          placeholder="اسم الماركة بالإنجليزي"
                        />
                        <p className="mb-2 text-xs text-gray-400">
                          {productCount} منتج مرتبط بهذه الماركة
                        </p>
                        <ImageUpload
                          label="شعار / صورة الماركة"
                          value={b.image}
                          onChange={(image) =>
                            admin.updateBrand(b.id, { image })
                          }
                        />
                        <label className="mt-2 flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={b.visible}
                            onChange={(e) =>
                              admin.updateBrand(b.id, {
                                visible: e.target.checked,
                              })
                            }
                          />
                          إظهار في المتجر
                        </label>
                        <button
                          onClick={() => {
                            if (confirm(`حذف ماركة "${b.nameAr}"؟`))
                              admin.deleteBrand(b.id);
                          }}
                          className="admin-link admin-link--danger mt-2"
                        >
                          حذف
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {tab === "hero" && (
            <section>
              <AdminPlacementHint
                items={[
                  "الصفحة الرئيسية — أعلى الصفحة، أول ما يراه الزائر",
                  "زر «تسوق الآن» — يوجّه للفئة أو الصفحة التي تختارها",
                  "عدة شرائح — تتبدل تلقائياً إن أضفت أكثر من بانر",
                ]}
                previewHref="/"
                previewLabel="معاينة البانر"
              />
              <div className="admin-toolbar">
                <h2 className="admin-section-title mb-0">بانر الرئيسية</h2>
                <button
                  onClick={() =>
                    admin.addHeroSlide({
                      titleAr: "عنوان جديد",
                      titleEn: "New title",
                      subtitleAr: "وصف",
                      subtitleEn: "Subtitle",
                      ctaAr: "تسوق",
                      ctaEn: "Shop",
                      linkType: "category",
                      categoryId: firstCategoryId,
                      image: "",
                    })
                  }
                  className="admin-btn admin-btn--primary"
                >
                  + شريحة
                </button>
              </div>
              {state.heroSlides.map((h) => (
                <div key={h.id} className="admin-form-card mb-4">
                  <div className="admin-form-grid">
                    <input
                      className="admin-input"
                      value={h.titleAr}
                      onChange={(e) =>
                        admin.updateHeroSlide(h.id, { titleAr: e.target.value })
                      }
                      placeholder="العنوان"
                    />
                    <input
                      className="admin-input"
                      value={h.subtitleAr}
                      onChange={(e) =>
                        admin.updateHeroSlide(h.id, { subtitleAr: e.target.value })
                      }
                      placeholder="الوصف"
                    />
                    <input
                      className="admin-input"
                      value={h.ctaAr}
                      onChange={(e) =>
                        admin.updateHeroSlide(h.id, { ctaAr: e.target.value })
                      }
                      placeholder="نص الزر"
                    />
                    <LinkPicker
                      linkType={h.linkType}
                      categoryId={h.categoryId}
                      categories={state.categories}
                      label="زر التسوق يوجّه إلى"
                      onChange={(linkType, categoryId) =>
                        admin.updateHeroSlide(h.id, { linkType, categoryId })
                      }
                    />
                    <div className="col-span-2">
                      <ImageUpload
                        label="صورة البانر"
                        value={h.image}
                        onChange={(image) =>
                          admin.updateHeroSlide(h.id, { image })
                        }
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("حذف؟")) admin.deleteHeroSlide(h.id);
                    }}
                    className="admin-link admin-link--danger mt-2"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </section>
          )}

          {tab === "settings" && (
            <section>
              <AdminPlacementHint
                items={[
                  "الهيدر والفوتر — اسم الموقع والشعار",
                  "الشريط العلوي — نص التوصيل والعروض",
                  "صفحة السلة /bag — رسوم التوصيل وحد التوصيل المجاني",
                  "الفوتر — وصف المتجر وحقوق النشر",
                ]}
                previewHref="/bag"
                previewLabel="معاينة السلة والإعدادات"
              />
              <h2 className="admin-section-title">إعدادات الموقع</h2>
              <div className="admin-form-card">
                <div className="admin-form-grid">
                  <div>
                    <label className="admin-label">اسم الموقع (عربي)</label>
                    <input
                      className="admin-input"
                      value={state.settings.nameAr}
                      onChange={(e) =>
                        admin.updateSettings({ nameAr: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="admin-label">الشعار — جزء عريض</label>
                    <input
                      className="admin-input"
                      value={state.settings.logoBoldAr}
                      onChange={(e) =>
                        admin.updateSettings({ logoBoldAr: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="admin-label">الشعار — جزء خفيف</label>
                    <input
                      className="admin-input"
                      value={state.settings.logoLightAr}
                      onChange={(e) =>
                        admin.updateSettings({ logoLightAr: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="admin-label">وصف المتجر</label>
                    <textarea
                      className="admin-input min-h-[80px]"
                      value={state.settings.descriptionAr}
                      onChange={(e) =>
                        admin.updateSettings({ descriptionAr: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="admin-label">نص الشريط العلوي</label>
                    <input
                      className="admin-input"
                      value={state.settings.promoAr}
                      onChange={(e) =>
                        admin.updateSettings({ promoAr: e.target.value })
                      }
                      placeholder="توصيل 5,000 د.ع لجميع المحافظات"
                    />
                  </div>
                  <div>
                    <label className="admin-label">رسوم التوصيل (د.ع)</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={state.settings.deliveryFee}
                      onChange={(e) =>
                        admin.updateSettings({
                          deliveryFee: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="admin-label">حد التوصيل المجاني (د.ع)</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={state.settings.freeDeliveryMin}
                      onChange={(e) =>
                        admin.updateSettings({
                          freeDeliveryMin: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="admin-label">كلمة مرور المشرف</label>
                    <input
                      type="password"
                      className="admin-input"
                      value={state.settings.adminPassword}
                      onChange={(e) =>
                        admin.updateSettings({ adminPassword: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
