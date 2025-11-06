// app/kvkk/page.tsx
import Link from "next/link";
import { JSX } from "react";

const ORG = {
  name: "CBO İnşaat",
  address: "19 MAYIS MAH. TOYGAR SK. 54 NOLU B.B. NO: 36G, KAPAKLI / TEKİRDAĞ",
  phone: "0511 111 11 11",
  email: "info@cboyapi.com",
  website: "https://cboyapi.com",
  updatedAt: "05.11.2025",
};

export default function KVKKPage() {
  return (
    <main className="min-h-screen bg-white mt-20">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* HERO BAŞLIK */}
        <header className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-slate-600 to-slate-300 bg-clip-text text-transparent">
              Kişisel Verilerin Korunması
            </span>
          </h1>
          <p className="mt-4 text-xl text-slate-600 font-medium">
            KVKK Aydınlatma Metni
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Son güncelleme: <span className="font-bold">{ORG.updatedAt}</span>
          </p>
        </header>

        {/* İÇİNDEKİLER – Kart + Hover */}
        <nav className="mb-14">
          <div className="rounded-3xl border-2 border-slate-100 bg-slate-50/80 p-8 shadow-lg backdrop-blur">
            <p className="text-xl font-bold text-slate-800 mb-6 text-center">
              İçindekiler
            </p>
            <ul className="grid sm:grid-cols-2 gap-4">
              {[
                ["Veri Sorumlusu", "#veri-sorumlusu"],
                ["İşlenen Veriler", "#kategoriler"],
                ["Amaç & Hukuki Sebep", "#amac-hukuki-sebep"],
                ["Toplama Yöntemi", "#yontem"],
                ["Aktarımlar", "#aktarim"],
                ["Saklama Süreleri", "#saklama"],
                ["Haklarınız", "#haklar"],
                ["Başvuru", "#basvuru"],
                ["Güvenlik", "#guvenlik"],
                ["Çerezler", "#cerezler"],
                ["Değişiklikler", "#degisiklikler"],
              ].map(([t, href], i) => (
                <li key={href} className="group">
                  <a
                    href={href}
                    className="
                      flex items-center gap-3 py-3 px-5 rounded-2xl
                      bg-white/70 hover:bg-white shadow-md hover:shadow-xl
                      border border-slate-200 hover:border-slate-300
                      transition-all duration-300 group-hover:-translate-y-1
                    "
                  >
                    <span className="w-9 h-9 rounded-full bg-slate-600 text-white flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </span>
                    <span className="font-medium text-slate-700 group-hover:text-slate-900">
                      {t}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* BÖLÜMLER */}
        <article className="space-y-16">

          {/* 1. Veri Sorumlusu */}
          <section id="veri-sorumlusu">
            <h2 className="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">1</span>
              Veri Sorumlusu
            </h2>
            <div className="bg-gradient-to-r from-slate-50 to-white rounded-2xl p-7 border border-slate-200 shadow-md">
              <p className="text-slate-700 leading-relaxed mb-4">
                6698 sayılı KVKK uyarınca kişisel verileriniz; veri sorumlusu olarak{" "}
                <strong className="text-slate-800">{ORG.name}</strong> tarafından aşağıda açıklanan kapsamda işlenmektedir.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                <InfoCard icon="building" label="Ticari Unvan">{ORG.name}</InfoCard>
                <InfoCard icon="map-pin" label="Adres">{ORG.address}</InfoCard>
                <InfoCard icon="phone" label="Telefon">
                  <a href={`tel:${ORG.phone.replace(/\s/g, "")}`} className="hover:underline">{ORG.phone}</a>
                </InfoCard>
                <InfoCard icon="mail" label="E-posta">
                  <a href={`mailto:${ORG.email}`} className="hover:underline">{ORG.email}</a>
                </InfoCard>
              </div>
            </div>
          </section>

          {/* 2. İşlenen Veriler */}
          <section id="kategoriler">
            <h2 className="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">2</span>
              İşlenen Kişisel Veri Kategorileri
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                "Kimlik (ad-soyad)",
                "İletişim (tel, e-posta)",
                "Teklif & Talep İçerikleri",
                "IP & Log Kayıtları",
                "Gönderilen Dosyalar",
                "Finansal Bilgiler (gerekliyse)",
              ].map((item, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow hover:shadow-lg transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-slate-700">{item}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-5">
              <strong>Not:</strong> Özel nitelikli veri (sağlık, din, biyometri vb.) yalnızca kanunen zorunlu ise ve ek tedbirlerle işlenir.
            </p>
          </section>

          {/* 3. Amaç & Hukuki Sebep */}
          <section id="amac-hukuki-sebep">
            <h2 className="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">3</span>
              İşleme Amaçları & Hukuki Sebepler
            </h2>
            <div className="space-y-5">
              {[
                { purpose: "Teklif & Proje Yönetimi", basis: "Sözleşmenin İfası" },
                { purpose: "Yasal Yükümlülükler", basis: "Hukuki Yükümlülük" },
                { purpose: "İletişim & Destek", basis: "Meşru Menfaat" },
                { purpose: "Güvenlik & Dolandırıcılık Önleme", basis: "Meşru Menfaat" },
                { purpose: "Pazarlama (İzinli)", basis: "Açık Rıza" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
                  <div className="w-12 h-12 rounded-full bg-slate-600 text-white flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{item.purpose}</p>
                    <p className="text-sm text-slate-600 mt-1">Hukuki Sebep: <span className="font-medium">{item.basis}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Toplama Yöntemi */}
          <section id="yontem">
            <h2 className="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">4</span>
              Toplama Yöntemi
            </h2>
            <div className="bg-slate-50 rounded-2xl p-7 border border-slate-200">
              <p className="text-slate-700">
                Verileriniz şu yollarla toplanır:
              </p>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LinkCard href="/iletisim" label="İletişim Formu" />
                <LinkCard href="/teklif-al" label="Teklif Formu" />
                <SimpleCard label="E-posta & Telefon" />
                <SimpleCard label="Çerezler & Loglar" />
              </div>
            </div>
          </section>

          {/* 5. Aktarımlar */}
          <section id="aktarim">
            <h2 className="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">5</span>
              Aktarımlar
            </h2>
            <p className="text-slate-700 bg-amber-50 border border-amber-200 rounded-xl p-5">
              <strong>Yurt dışı aktarım:</strong> Firebase (Google) üzerinden gerçekleşir. Açık rıza alınır veya KVKK standartları sağlanır.
            </p>
          </section>

          {/* 6–11. Kısa Kartlar */}
          <div className="grid md:grid-cols-2 gap-8">
            <ShortSection id="saklama" num="6" title="Saklama Süreleri">
              Amaç bitince silinir. Yasal süreler (10 yıl) saklanır.
            </ShortSection>
            <ShortSection id="haklar" num="7" title="KVKK m.11 Haklarınız">
              Bilgi, düzeltme, silme, itiraz, tazminat...
            </ShortSection>
            <ShortSection id="basvuru" num="8" title="Başvuru">
              E-posta: {ORG.email}<br />Posta: {ORG.address}
            </ShortSection>
            <ShortSection id="guvenlik" num="9" title="Güvenlik">
              Şifreleme · Yetkilendirme · Yedekleme
            </ShortSection>
            <ShortSection id="cerezler" num="10" title="Çerezler">
              <Link href="/cerez-politikasi" className="underline font-medium">Çerez Politikası</Link>
            </ShortSection>
            <ShortSection id="degisiklikler" num="11" title="Değişiklikler">
              Güncellemeler bu sayfada yayımlanır.
            </ShortSection>
          </div>
        </article>

        {/* ALT CTA */}
        <div className="mt-20 text-center">
          <Link
            href="/iletisim"
            className="
              group inline-flex items-center gap-4 px-8 py-5 rounded-2xl
              bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold text-lg
              hover:from-slate-700 hover:to-slate-800
              shadow-2xl hover:shadow-3xl hover:-translate-y-1
              transition-all duration-300
            "
          >
            Sorunuz mu var? Hemen Ulaşın
            <svg className="w-6 h-6 transition group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <p className="mt-5 text-xs text-slate-500 max-w-2xl mx-auto">
            *Bu metin KVKK m.10 kapsamında hazırlanmıştır. Hukuki yorum için uzman görüşü alınız.
          </p>
        </div>
      </div>
    </main>
  );
}

/* Yardımcı Bileşenler */
function InfoCard({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  const icons: Record<string, JSX.Element> = {
    building: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-4m-6 0H5" /></svg>,
    "map-pin": <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    phone: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
    mail: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  };
  return (
    <div className="flex items-start gap-3 bg-white rounded-xl p-4 border border-slate-100">
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
        {icons[icon]}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">{label}</p>
        <div className="mt-1 text-sm text-slate-700">{children}</div>
      </div>
    </div>
  );
}

function LinkCard({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="block bg-white rounded-xl p-5 border border-slate-200 shadow hover:shadow-md transition text-center">
      <p className="font-medium text-slate-700">{label}</p>
    </Link>
  );
}

function SimpleCard({ label }: { label: string }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow text-center">
      <p className="font-medium text-slate-700">{label}</p>
    </div>
  );
}

function ShortSection({ id, num, title, children }: { id: string; num: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id}>
      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
        <span className="w-9 h-9 rounded-full bg-slate-600 text-white flex items-center justify-center text-sm font-bold">{num}</span>
        {title}
      </h2>
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="text-slate-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: children as string }} />
      </div>
    </section>
  );
}