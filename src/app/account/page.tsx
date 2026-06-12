"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";

export default function AccountPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const { t, isRtl } = useLocale();
  const chevron = isRtl ? "bi-chevron-left" : "bi-chevron-right";

  const menuItems = [
    { icon: "bi-bag", label: t("account.myOrders"), href: "/bag" },
    { icon: "bi-heart", label: t("account.savedItems"), href: "/wishlist" },
    { icon: "bi-geo-alt", label: t("account.addresses"), href: "#" },
    { icon: "bi-credit-card", label: t("account.paymentMethods"), href: "#" },
  ];

  return (
    <>
      <Header />
      <main className="site-container mx-auto max-w-lg py-12 lg:py-20">
        {!loggedIn ? (
          <div>
            <h1 className="text-3xl font-black uppercase">{t("account.signIn")}</h1>
            <p className="mt-2 text-sm text-gray-500">{t("account.signInText")}</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setLoggedIn(true);
              }}
              className="mt-8 space-y-4"
            >
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  {t("account.email")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2d2d2d]"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  {t("account.password")}
                </label>
                <input
                  type="password"
                  required
                  className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2d2d2d]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#2d2d2d] py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#1a1a1a]"
              >
                {t("account.signInBtn")}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              {t("account.newHere")}{" "}
              <button
                onClick={() => setLoggedIn(true)}
                className="font-semibold underline"
              >
                {t("account.createAccount")}
              </button>
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-black uppercase">{t("account.myAccount")}</h1>
            <p className="mt-2 text-sm text-gray-500">
              {t("account.welcome")}
              {email ? `، ${email}` : ""}!
            </p>

            <div className="mt-8 grid gap-3">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 border border-gray-200 px-5 py-4 text-sm font-semibold transition hover:border-[#2d2d2d]"
                >
                  <i className={`bi ${item.icon} text-lg`} />
                  {item.label}
                  <i className={`bi ${chevron} ms-auto text-gray-400`} />
                </Link>
              ))}
            </div>

            <Link
              href="/admin"
              className="mt-6 flex items-center gap-4 border border-dashed border-gray-300 px-5 py-4 text-sm font-semibold text-gray-600 transition hover:border-[#2d2d2d]"
            >
              <i className="bi bi-gear text-lg" />
              لوحة تحكم المشرف
              <i className={`bi ${chevron} ms-auto text-gray-400`} />
            </Link>

            <button
              onClick={() => {
                setLoggedIn(false);
                setEmail("");
              }}
              className="mt-8 text-sm font-semibold text-gray-500 underline"
            >
              {t("account.signOut")}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
