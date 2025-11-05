// File: app/sartlar/page.tsx
import Link from "next/link";

const ORG = {
  name: "CBO İnşaat",
  address: "19 MAYIS MAH. TOYGAR SK. 54 NOLU B.B. NO: 36G, KAPAKLI / TEKİRDAĞ",
  phone: "0511 111 11 11",
  email: "info@cboyapi.com",
  updatedAt: "05.11.2025",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Başlık */}
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-[#155dfc] to-[#8cc1ff] bg-clip-text text-transparent">
              Şartlar ve Koşullar
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
                ["Tanımlar ve Kapsam", "#kapsam"],
                ["Site Kullanımı", "#kullanim"],
                ["Teklif, Sözleşme ve Uygulama", "#teklif"],
                ["Ücret, Ödeme ve Faturalama", "#odeme"],
                ["Fikri Mülkiyet", "#fikri"],
                ["Garanti Reddi", "#garanti"],
                ["Sorumluluğun Sınırlandırılması", "#sorumluluk"],
                ["Mücbir Sebep", "#mucbir"],
                ["Gizlilik ve KVKK", "#kvkk"],
                ["Bağlantılar ve Üçüncü Taraflar", "#baglantilar"],
                ["Değişiklikler", "#degisiklikler"],
                ["Uygulanacak Hukuk ve Yetki", "#hukuk"],
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

        {/* 1 */}
        <section id="kapsam" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">1) Tanımlar ve Kapsam</h2>
          <p className="text-gray-700 leading-relaxed">
            Bu Şartlar ve Koşullar (“Şartlar”), {ORG.name}’a ait internet sitesinin (“Site”) kullanımını
            ve Site üzerinden iletilen teklif/iletişim taleplerine ilişkin temel hükümleri düzenler.
            Sitede <strong>üyelik veya hesap oluşturma</strong> bulunmamaktadır; ziyaretçiler
            formlar aracılığıyla talepte bulunur ve iletişim kurar.
          </p>
        </section>

        {/* 2 */}
        <section id="kullanim" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">2) Site Kullanımı</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Sitede yer alan bilgi ve içerik genel bilgilendirme amaçlıdır; bağlayıcı teknik şartname yerine geçmez.</li>
            <li>Formlar üzerinden ilettiğiniz bilgilerin doğru ve güncel olmasından siz sorumlusunuz.</li>
            <li>Site, kesintisiz veya hatasız çalışmayı taahhüt etmez; bakım ve güncellemeler yapılabilir.</li>
            <li>Hukuka aykırı, hak ihlali doğuracak içerik gönderilmesi yasaktır.</li>
          </ul>
        </section>

        {/* 3 */}
        <section id="teklif" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">3) Teklif, Sözleşme ve Uygulama</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>
              Form aracılığıyla talep iletmeniz, <strong>bağlayıcı bir sözleşme kurulduğu anlamına gelmez</strong>.
              Teknik keşif, ihtiyaç analizi, projenin kapsamı ve iş programı netleştirildikten sonra yazılı teklif sunulur.
            </li>
            <li>
              Sözleşme; kapsam, fiyat, ödeme planı, iş programı, malzeme/standartlar ve garanti hükümlerini içerir.
              Çalışmalar ancak sözleşmenin imzalanması ve ön koşulların sağlanmasıyla başlar.
            </li>
            <li>
              Şantiye güvenliği, iş sağlığı ve güvenliği (İSG) gereklilikleri ve saha erişimi işin yürütülmesi için zorunludur.
            </li>
          </ul>
        </section>

        {/* 4 */}
        <section id="odeme" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">4) Ücret, Ödeme ve Faturalama</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Ücretler teklif/sözleşmede belirtilir; fiyatlar KDV ve diğer yasal yükümlülükler bakımından revize edilebilir.</li>
            <li>Ödemeler sözleşmede belirtilen takvime ve yöntemlere göre yapılır; gecikme halinde gecikme koşulları uygulanır.</li>
            <li>Malzeme değişimleri veya kapsam genişlemeleri ek bedel doğurabilir.</li>
          </ul>
        </section>

        {/* 5 */}
        <section id="fikri" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">5) Fikri Mülkiyet</h2>
          <p className="text-gray-700 leading-relaxed">
            Sitedeki metin, görsel, logo, tasarım, çizim ve sair materyaller {ORG.name}’a aittir veya lisanslanmıştır.
            Yazılı izin olmaksızın kopyalama, çoğaltma, yayma yasaktır. Proje sırasında üretilen çizim ve görsellerin
            kullanım hakkı, sözleşmede aksi kararlaştırılmadıkça {ORG.name}’a aittir.
          </p>
        </section>

        {/* 6 */}
        <section id="garanti" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">6) Garanti Reddi</h2>
          <p className="text-gray-700 leading-relaxed">
            Site “olduğu gibi” sunulur. Doğruluk, güncellik, belirli bir amaca uygunluk ve kesintisizlik
            konusunda açık veya zımni garanti verilmez. Bağlayıcı bilgiler, yalnızca yazılı teklif ve
            sözleşme dokümanlarında yer alır.
          </p>
        </section>

        {/* 7 */}
        <section id="sorumluluk" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">7) Sorumluluğun Sınırlandırılması</h2>
          <p className="text-gray-700 leading-relaxed">
            Kanunun zorunlu tuttuğu haller saklı kalmak kaydıyla, Site’nin kullanımından veya kullanılamamasından
            kaynaklanan dolaylı, arızi veya netice kabilinden zararlardan {ORG.name} sorumlu tutulamaz.
            Sözleşmeye dayalı işlerde sorumluluk, sözleşme hükümleriyle sınırlıdır.
          </p>
        </section>

        {/* 8 */}
        <section id="mucbir" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">8) Mücbir Sebep</h2>
          <p className="text-gray-700 leading-relaxed">
            Doğal afetler, savaş, grev, siber saldırı, kamu otoritesi işlemleri, tedarik zinciri kesintileri ve
            tarafların makul kontrolü dışındaki diğer olaylar mücbir sebep sayılır. Bu hallerde yükümlülükler
            etkilediği ölçüde askıya alınır.
          </p>
        </section>

        {/* 9 */}
        <section id="kvkk" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">9) Gizlilik ve KVKK</h2>
          <p className="text-gray-700">
            Kişisel verileriniz; <Link href="/kvkk" className="underline">KVKK Aydınlatma Metni</Link> ve{" "}
            <Link href="/gizlilik-politikasi" className="underline">Gizlilik Politikası</Link> kapsamında işlenir.
            Üyelik yoktur; veriler form ve teklif süreçleri için sınırlı olarak kullanılır.
          </p>
        </section>

        {/* 10 */}
        <section id="baglantilar" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">10) Bağlantılar ve Üçüncü Taraflar</h2>
          <p className="text-gray-700">
            Site, üçüncü taraf sitelere veya hizmetlere bağlantılar içerebilir. Bu sitelerin içerik ve
            güvenliğinden {ORG.name} sorumlu değildir. Firebase gibi hizmet sağlayıcıları teknik altyapı sunar.
          </p>
        </section>

        {/* 11 */}
        <section id="degisiklikler" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">11) Değişiklikler</h2>
          <p className="text-gray-700">
            {ORG.name}, bu Şartları dilediği zaman güncelleyebilir. Güncel sürüm her zaman bu sayfada yayımlanır.
            Yayım sonrası Site’nin kullanılmaya devam edilmesi değişikliklerin kabulü anlamına gelir.
          </p>
        </section>

        {/* 12 */}
        <section id="hukuk" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">12) Uygulanacak Hukuk ve Yetki</h2>
          <p className="text-gray-700">
            Bu Şartlar, Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda Tekirdağ (Kapaklı) adli
            yargı mercileri ve icra daireleri yetkilidir. Tüketici sıfatınız varsa zorunlu tüketici
            başvuru yolları saklıdır.
          </p>
        </section>

        {/* 13 */}
        <section id="iletisim" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">13) İletişim</h2>
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
