// app/sartlar/page.tsx
import Link from "next/link";
import { JSX } from "react";

const ORG = {
  name: "CBO İnşaat",
  address: "19 MAYIS MAH. TOYGAR SK. 54 NOLU B.B. NO: 36G, KAPAKLI / TEKİRDAĞ",
  phone: "0511 111 11 11",
  email: "info@cboyapi.com",
  updatedAt: "05.11.2025",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white mt-20">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* HERO */}
        <header className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-slate-600 to-slate-300 bg-clip-text text-transparent">
              Şartlar ve Koşullar
            </span>
          </h1>
          <p className="mt-4 text-xl text-slate-600 font-medium">
            Site Kullanım & Hizmet Sözleşmesi
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Son güncelleme: <span className="font-bold">{ORG.updatedAt}</span>
          </p>
        </header>

        {/* İÇİNDEKİLER – Numaralı Hover Kart */}
        <nav className="mb-14">
          <div className="rounded-3xl border-2 border-slate-100 bg-slate-50/80 p-8 shadow-lg backdrop-blur">
            <p className="text-xl font-bold text-slate-800 mb-6 text-center">
              İçindekiler
            </p>
            <ul className="grid sm:grid-cols-2 gap-4">
              {[
                ["Kapsam", "#kapsam"],
                ["Site Kullanımı", "#kullanim"],
                ["Teklif & Sözleşme", "#teklif"],
                ["Ödeme", "#odeme"],
                ["Fikri Mülkiyet", "#fikri"],
                ["Garanti Reddi", "#garanti"],
                ["Sorumluluk Sınırı", "#sorumluluk"],
                ["Mücbir Sebep", "#mucbir"],
                ["Gizlilik", "#kvkk"],
                ["Üçüncü Taraflar", "#baglantilar"],
                ["Değişiklikler", "#degisiklikler"],
                ["Hukuk & Yetki", "#hukuk"],
                ["İletişim", "#iletisim"],
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

          {/* 1. Kapsam */}
          <section id="kapsam">
            <h2 className="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
              <Badge>1</Badge>
              Tanımlar ve Kapsam
            </h2>
            <Card>
              <p className="text-slate-700 leading-relaxed">
                Bu <strong>Şartlar</strong>, <strong>{ORG.name}</strong>’a ait internet sitesinin kullanımını ve formlar aracılığıyla iletilen taleplerin temel kurallarını düzenler.
              </p>
              <Highlight>Üyelik yoktur. Sadece form = talep.</Highlight>
            </Card>
          </section>

          {/* 2. Site Kullanımı */}
          <section id="kullanim">
            <h2 className="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
              <Badge>2</Badge>
              Site Kullanımı
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                "Bilgiler genel amaçlıdır",
                "Doğru bilgi sizin sorumluluğunuz",
                "Kesintisiz çalışma garantisi yok",
                "Yasaklı içerik göndermek yasak",
              ].map((item, i) => (
                <RuleCard key={i} number={i + 1}>
                  {item}
                </RuleCard>
              ))}
            </div>
          </section>

          {/* 3. Teklif & Sözleşme */}
          <section id="teklif">
            <h2 className="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
              <Badge>3</Badge>
              Teklif, Sözleşme ve Uygulama
            </h2>
            <Timeline>
              <Step title="Form = Talep" desc="Bağlayıcı değildir" />
              <Step title="Keşif & Analiz" desc="İhtiyaçlar netleşir" />
              <Step title="Yazılı Teklif" desc="Fiyat + kapsam + süre" />
              <Step title="İmzalı Sözleşme" desc="İş başlar" />
            </Timeline>
          </section>

          {/* 4. Ödeme */}
          <section id="odeme">
            <h2 className="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
              <Badge>4</Badge>
              Ücret, Ödeme ve Faturalama
            </h2>
            <Card>
              <ul className="space-y-3">
                {["KDV dahil fiyatlar", "Sözleşmede ödeme takvimi", "Gecikme faizi uygulanır", "Ek iş = ek bedel"].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {/* 5–13 Kısa Kartlar */}
          <div className="grid md:grid-cols-2 gap-8">

            <ShortSection id="fikri" num="5" title="Fikri Mülkiyet">
              Logo, görsel, çizim → <strong>{ORG.name}’a aittir</strong>. Yazılı izin olmadan kullanılamaz.
            </ShortSection>

            <ShortSection id="garanti" num="6" title="Garanti Reddi">
              Site “olduğu gibi”. Bağlayıcı bilgi sadece <strong>yazılı sözleşmede</strong>.
            </ShortSection>

            <ShortSection id="sorumluluk" num="7" title="Sorumluluğun Sınırlandırılması">
              Dolaylı zararlar kapsam dışı. Sözleşme hükümleri geçerlidir.
            </ShortSection>

            <ShortSection id="mucbir" num="8" title="Mücbir Sebep">
              Deprem, savaş, siber saldırı → yükümlülükler askıya alınır.
            </ShortSection>

            <ShortSection id="kvkk" num="9" title="Gizlilik ve KVKK">
              <Link href="/kvkk" className="underline font-medium">KVKK Metni</Link> ve{" "}
              <Link href="/gizlilik-politikasi" className="underline font-medium">Gizlilik</Link> geçerlidir.
            </ShortSection>

            <ShortSection id="baglantilar" num="10" title="Üçüncü Taraflar">
              Firebase, Google Maps → onların politikaları geçerli.
            </ShortSection>

            <ShortSection id="degisiklikler" num="11" title="Değişiklikler">
              Güncellemeler bu sayfada. Kullanım = kabul.
            </ShortSection>

            <ShortSection id="hukuk" num="12" title="Uygulanacak Hukuk">
              Türkiye hukuku · Tekirdağ (Kapaklı) mahkemeleri yetkili.
            </ShortSection>

          </div>

          {/* 13. İletişim */}
          <section id="iletisim">
            <h2 className="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
              <Badge>13</Badge>
              İletişim
            </h2>
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <ContactItem icon="building" label="Ticari Unvan">{ORG.name}</ContactItem>
                <ContactItem icon="map-pin" label="Adres">{ORG.address}</ContactItem>
                <ContactItem icon="phone" label="Telefon">
                  <a href={`tel:${ORG.phone.replace(/\s/g, "")}`} className="hover:underline">{ORG.phone}</a>
                </ContactItem>
                <ContactItem icon="mail" label="E-posta">
                  <a href={`mailto:${ORG.email}`} className="hover:underline">{ORG.email}</a>
                </ContactItem>
              </div>
            </div>
          </section>
        </article>

        {/* CTA */}
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
        </div>
      </div>
    </main>
  );
}

/* Yardımcı Bileşenler */
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
      {children}
    </span>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-white rounded-2xl p-7 border border-slate-200 shadow-md">
      {children}
    </div>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-medium text-sm">
      {children}
    </div>
  );
}

function RuleCard({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow hover:shadow-lg transition">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-600 text-white flex items-center justify-center text-xs font-bold">
          {number}
        </div>
        <p className="text-slate-700 text-sm">{children}</p>
      </div>
    </div>
  );
}

function Timeline({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
}

function Step({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-full bg-slate-600 text-white flex items-center justify-center text-sm font-bold">
        →
      </div>
      <div>
        <p className="font-semibold text-slate-800">{title}</p>
        <p className="text-sm text-slate-600">{desc}</p>
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ShortSection({ id, num, title, children }: { id: string; num: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id}>
      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
        <Badge>{num}</Badge>
        {title}
      </h2>
      <Card>
        <div className="text-slate-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: children as string }} />
      </Card>
    </section>
  );
}

function ContactItem({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  const icons: Record<string, JSX.Element> = {
    building: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-4m-6 0H5" /></svg>,
    "map-pin": <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    phone: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
    mail: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  };
  return (
    <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
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