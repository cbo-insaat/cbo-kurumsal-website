// File: app/gizlilik-politikasi/page.tsx
import Link from "next/link";

const ORG = {
  name: "CBO İnşaat",
  address: "19 MAYIS MAH. TOYGAR SK. 54 NOLU B.B. NO: 36G, KAPAKLI / TEKİRDAĞ",
  phone: "0511 111 11 11",
  email: "info@cboyapi.com",
  updatedAt: "05.11.2025",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white mt-20">
      <div className="max-w-5xl mx-auto px-6 py-14">
        {/* Başlık */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-slate-600 to-slate-300 bg-clip-text text-transparent">
              Gizlilik Politikası
            </span>
          </h1>
          <p className="mt-4 text-base text-slate-500 font-medium">
            Son güncelleme: <span className="font-bold">{ORG.updatedAt}</span>
          </p>
        </header>

        {/* İçindekiler */}
        <nav className="mb-12">
          <div className="rounded-2xl border-2 border-slate-100 bg-slate-50/70 p-6 shadow-sm backdrop-blur">
            <p className="font-bold text-slate-800 mb-4 text-lg">İçindekiler</p>
            <ul className="grid sm:grid-cols-2 gap-3 text-slate-700">
              {[
                ["Genel", "#genel"],
                ["Topladığımız Bilgiler", "#toplama"],
                ["Bilgilerin Kullanımı", "#kullanim"],
                ["Çerezler ve Ölçümleme", "#cerezler"],
                ["Üyelik / Hesaplar", "#uyelik"],
                ["Üçüncü Taraflar", "#ucuncu-taraf"],
                ["Saklama & Güvenlik", "#saklama-guvenlik"],
                ["Haklarınız", "#haklar"],
                ["Değişiklikler", "#degisiklikler"],
                ["İletişim", "#iletisim"],
              ].map(([t, href]) => (
                <li key={href} className="group">
                  <a
                    href={href}
                    className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white hover:shadow transition-all duration-200 group-hover:translate-x-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-slate-600 transition" />
                    <span className="font-medium">{t}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Bölümler */}
        <article className="space-y-14">
          <section id="genel">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold">1</span>
              Genel
            </h2>
            <p className="text-gray-700 leading-relaxed text-base">
              Bu Gizlilik Politikası, <strong>{ORG.name}</strong>’ın internet sitesi üzerinden elde ettiği kişisel verileri nasıl işlediğini şeffaf bir şekilde açıklar. KVKK kapsamındaki ayrıntılı aydınlatma için{" "}
              <Link href="/kvkk" className="font-medium text-slate-600 underline hover:text-slate-800 transition">
                KVKK Aydınlatma Metni
              </Link>’ni inceleyebilirsiniz.
            </p>
          </section>

          <section id="toplama">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold">2</span>
              Topladığımız Bilgiler
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex gap-3">
                <span className="text-slate-500 mt-1">→</span>
                <div>
                  <strong>İletişim & Teklif Formları:</strong> Ad–soyad, e-posta, telefon, talep/mesaj içeriği, isteğe bağlı web sitesi adresi; tarayıcı türü, IP, tarih-saat gibi temel log bilgileri.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-slate-500 mt-1">→</span>
                <div>
                  <strong>Haber/Blog Etkileşimi:</strong> İçerik görüntüleme ve yönlendirme verileri (toplulaştırılmış).
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-slate-500 mt-1">→</span>
                <div>
                  <strong>Medya:</strong> Formla paylaşılan görsel/dosya varsa dosyanın kendisi ve meta verileri.
                </div>
              </li>
            </ul>
            <p className="mt-4 text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-4">
              Özel nitelikli veriler talep edilmez; bu tür verileri paylaşmamanızı önemle rica ederiz.
            </p>
          </section>

          <section id="kullanim">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold">3</span>
              Bilgilerin Kullanımı
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Tekliflendirme, keşif ve proje süreçlerinin yürütülmesi",
                "Talep/şikâyet yönetimi ve yasal yükümlülüklerin yerine getirilmesi",
                "Site güvenliği, hata ayıklama ve performans iyileştirme",
                "Açık rızaya tabi pazarlama/duyuru iletişimi (varsa)",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="cerezler">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold">4</span>
              Çerezler ve Ölçümleme
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Sitede temel işlevler ve performans takibi için çerezler kullanılabilir. Tercihlerinizi tarayıcı ayarlarından dilediğiniz zaman yönetebilirsiniz.
            </p>
            <div className="mt-4">
              <Link
                href="/cerez-politikasi"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-800 underline"
              >
                Çerez Politikası’nı Oku
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>

          <section id="uyelik">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold">5</span>
              Üyelik / Hesaplar
            </h2>
            <p className="text-gray-700 bg-emerald-50 border border-emerald-200 rounded-lg p-5">
              Sitemizde <strong>kullanıcı kaydı veya üyelik sistemi bulunmamaktadır</strong>. Formlar aracılığıyla paylaşılan bilgiler, yalnızca talebinizin karşılanması amacıyla işlenir.
            </p>
          </section>

          <section id="ucuncu-taraf">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold">6</span>
              Üçüncü Taraflar (Firebase)
            </h2>
            <p className="text-gray-700">
              Form verileri ve medya; <strong>Google Firebase</strong> (Firestore ve Storage) üzerinde saklanır. Bu hizmetler, verilerin güvenliği için endüstri standardı önlemler uygular.
            </p>
            <p className="mt-3 text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-4">
              Yurt dışına veri aktarımı söz konusu olabilir. Detaylar için{" "}
              <Link href="/kvkk" className="underline font-medium">KVKK metnimizi</Link> inceleyin.
            </p>
          </section>

          <section id="saklama-guvenlik">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold">7</span>
              Saklama & Güvenlik
            </h2>
            <ul className="space-y-3 text-gray-700">
              {[
                "Veriler; amaçla sınırlı, mevzuat ve ispat yükümlülüklerine uygun süre boyunca saklanır.",
                "Erişim yetkilendirme, şifreleme, loglama ve yedekleme gibi teknik/idari tedbirler uygulanır.",
                "Süre dolduğunda veriler silinir, yok edilir veya anonimleştirilir.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-emerald-500 mt-1">Check</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="haklar">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold">8</span>
              Haklarınız ve Başvuru
            </h2>
            <p className="text-gray-700">
              KVKK kapsamındaki haklarınızı ve başvuru yöntemini{" "}
              <Link href="/kvkk" className="font-medium text-slate-600 underline hover:text-slate-800">
                KVKK Aydınlatma Metni
              </Link>’nde bulabilirsiniz.
            </p>
          </section>

          <section id="degisiklikler">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold">9</span>
              Değişiklikler
            </h2>
            <p className="text-gray-700">
              Bu politika zaman zaman güncellenebilir. En güncel sürüm <strong>her zaman bu sayfada</strong> yayımlanır.
            </p>
          </section>

          <section id="iletisim">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold">10</span>
              İletişim
            </h2>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-4m-6 0H5" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Ticari Unvan</p>
                  <p className="text-gray-700">{ORG.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Adres</p>
                  <p className="text-gray-700 text-sm">{ORG.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Telefon</p>
                  <p className="text-gray-700">{ORG.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">E-posta</p>
                  <a href={`mailto:${ORG.email}`} className="text-slate-600 hover:text-slate-800 underline">
                    {ORG.email}
                  </a>
                </div>
              </div>
            </div>
          </section>
        </article>

        {/* Alt CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/iletisim"
            className="
              group inline-flex items-center gap-3 px-7 py-4 rounded-2xl
              bg-slate-600 text-white font-bold text-lg
              hover:bg-slate-700 hover:shadow-xl
              transition-all duration-300
              hover:-translate-y-1
            "
          >
            Sorunuz mu var? Hemen İletişime Geçin
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}