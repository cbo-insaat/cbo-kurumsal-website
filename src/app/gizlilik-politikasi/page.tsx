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
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Başlık */}
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-[#155dfc] to-[#8cc1ff] bg-clip-text text-transparent">
              Gizlilik Politikası
            </span>
          </h1>
          <p className="mt-3 text-sm text-gray-500">Son güncelleme: {ORG.updatedAt}</p>
        </header>

        {/* İçindekiler */}
        <nav className="mb-8">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="font-semibold text-gray-800 mb-2">İçindekiler</p>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
              {[
                ["Genel", "#genel"],
                ["Topladığımız Bilgiler", "#toplama"],
                ["Bilgilerin Kullanımı", "#kullanim"],
                ["Çerezler ve Ölçümleme", "#cerezler"],
                ["Üyelik / Hesaplar", "#uyelik"],
                ["Üçüncü Taraflar (Firebase)", "#ucuncu-taraf"],
                ["Saklama, Güvenlik", "#saklama-guvenlik"],
                ["Haklarınız ve Başvuru", "#haklar"],
                ["Değişiklikler", "#degisiklikler"],
                ["İletişim", "#iletisim"],
              ].map(([t, href]) => (
                <li key={href}>
                  <a href={href} className="hover:underline">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <section id="genel" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">1) Genel</h2>
          <p className="text-gray-700 leading-relaxed">
            Bu Gizlilik Politikası, {ORG.name}’ın internet sitesi üzerinden elde ettiği kişisel
            verileri nasıl işlediğini açıklar. KVKK kapsamındaki ayrıntılı aydınlatma için{" "}
            <Link href="/kvkk" className="underline">KVKK Aydınlatma Metni</Link>’ni inceleyebilirsiniz.
          </p>
        </section>

        <section id="toplama" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">2) Topladığımız Bilgiler</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>
              <strong>İletişim &amp; Teklif Formları:</strong> Ad–soyad, e-posta, telefon, talep/mesaj
              içeriği, isteğe bağlı web sitesi adresi; tarayıcı türü, IP, tarih-saat gibi temel log bilgileri.
            </li>
            <li>
              <strong>Haber/Blog Etkileşimi:</strong> İçerik görüntüleme ve yönlendirme verileri (toplulaştırılmış).
            </li>
            <li>
              <strong>Medya:</strong> Formla paylaşılan görsel/dosya varsa dosyanın kendisi ve meta verileri.
            </li>
          </ul>
          <p className="mt-3 text-sm text-gray-500">
            * Özel nitelikli veriler talep edilmez; bu tür verileri iletmemenizi rica ederiz.
          </p>
        </section>

        <section id="kullanim" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">3) Bilgilerin Kullanımı</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Tekliflendirme, keşif ve proje süreçlerinin yürütülmesi, iletişime geçilmesi,</li>
            <li>Talep/şikâyet yönetimi ve yasal yükümlülüklerin yerine getirilmesi,</li>
            <li>Site güvenliği, hata ayıklama ve performans iyileştirme,</li>
            <li>Açık rızaya tabi pazarlama/duyuru iletişimi (varsa).</li>
          </ul>
        </section>

        <section id="cerezler" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">4) Çerezler ve Ölçümleme</h2>
          <p className="text-gray-700">
            Sitede temel işlevler ve performans için çerezler kullanılabilir. Tercihlerinizi
            tarayıcı ayarlarından yönetebilirsiniz. Ayrıntılar için{" "}
            <Link href="/cerez-politikasi" className="underline">Çerez Politikası</Link>’na bakın.
          </p>
        </section>

        <section id="uyelik" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">5) Üyelik / Hesaplar</h2>
          <p className="text-gray-700">
            Sitemizde kullanıcı kaydı/üyelik sistemi bulunmamaktadır. Ziyaretçiler hesap
            oluşturmaz ve oturum açmaz. Formlar aracılığıyla paylaşılan bilgiler,
            yalnızca talebinizin karşılanması amacıyla işlenir.
          </p>
        </section>

        <section id="ucuncu-taraf" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">6) Üçüncü Taraflar (Firebase)</h2>
          <p className="text-gray-700 mb-3">
            Form verileri ve medya; Google Firebase hizmetleri (Firestore ve Storage) üzerinde
            saklanır. Bu hizmetler verilerin güvenliği için endüstri standardı önlemler uygular.
            Gerekli hallerde yetkili kurumlar ve yasal zorunluluklar dışında üçüncü taraf paylaşımı yapılmaz.
          </p>
          <p className="text-sm text-gray-500">
            * Yurt dışına veri aktarımı söz konusu olabilir. Detaylar ve hukuki dayanaklar için{" "}
            <Link href="/kvkk" className="underline">KVKK metnimizi</Link> inceleyin.
          </p>
        </section>

        <section id="saklama-guvenlik" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">7) Saklama ve Güvenlik</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Veriler; amaçla sınırlı, mevzuat ve ispat yükümlülüklerine uygun süre boyunca saklanır.</li>
            <li>Erişim yetkilendirme, şifreleme, loglama ve yedekleme gibi teknik/idari tedbirler uygulanır.</li>
            <li>Süre dolduğunda veriler silinir, yok edilir veya anonimleştirilir.</li>
          </ul>
        </section>

        <section id="haklar" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">8) Haklarınız ve Başvuru</h2>
          <p className="text-gray-700">
            KVKK kapsamındaki haklarınızı ve başvuru yöntemini{" "}
            <Link href="/kvkk" className="underline">KVKK Aydınlatma Metni</Link>’nde bulabilirsiniz.
            Başvurularınızı aşağıdaki iletişim kanallarımızdan iletebilirsiniz.
          </p>
        </section>

        <section id="degisiklikler" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">9) Değişiklikler</h2>
          <p className="text-gray-700">
            Bu politika zaman zaman güncellenebilir. En güncel sürüm her zaman bu sayfada yayımlanır.
          </p>
        </section>

        <section id="iletisim" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">10) İletişim</h2>
          <div className="text-gray-700">
            <p><span className="font-semibold">Ticari Unvan:</span> {ORG.name}</p>
            <p><span className="font-semibold">Adres:</span> {ORG.address}</p>
            <p><span className="font-semibold">Telefon:</span> {ORG.phone}</p>
            <p>
              <span className="font-semibold">E-posta:</span>{" "}
              <a href={`mailto:${ORG.email}`} className="underline">{ORG.email}</a>
            </p>
          </div>
        </section>

        {/* Alt CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/iletisim"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-[#155dfc] text-white hover:brightness-110 shadow-md"
          >
            Sorunuz mu var? İletişime geçin
          </Link>
        </div>
      </div>
    </main>
  );
}
