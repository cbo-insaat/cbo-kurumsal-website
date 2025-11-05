// File: app/kvkk/page.tsx
import Link from "next/link";

const ORG = {
  name: "CBO İnşaat",
  address: "19 MAYIS MAH. TOYGAR SK. 54 NOLU B.B. NO: 36G, KAPAKLI / TEKİRDAĞ",
  phone: "0511 111 11 11",
  email: "info@cboyapi.com",
  website: "https://cboyapi.com",
  updatedAt: "05.11.2025", // Son güncelleme
};

export default function KVKKPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Başlık */}
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-[#155dfc] to-[#8cc1ff] bg-clip-text text-transparent">
              Kişisel Verilerin Korunması Aydınlatma Metni
            </span>
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Son güncelleme: {ORG.updatedAt}
          </p>
        </header>

        {/* Hızlı İçindekiler */}
        <nav className="mb-8">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="font-semibold text-gray-800 mb-2">İçindekiler</p>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
              {[
                ["Veri Sorumlusu", "#veri-sorumlusu"],
                ["İşlenen Veri Kategorileri", "#kategoriler"],
                ["Amaç ve Hukuki Sebepler", "#amac-hukuki-sebep"],
                ["Toplama Yöntemi", "#yontem"],
                ["Aktarımlar", "#aktarim"],
                ["Saklama Süreleri", "#saklama"],
                ["Aydınlatma (KVKK m.10) & Haklar (m.11)", "#haklar"],
                ["Başvuru Yöntemi", "#basvuru"],
                ["Güvenlik Tedbirleri", "#guvenlik"],
                ["Çerezler", "#cerezler"],
                ["Değişiklikler", "#degisiklikler"],
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

        {/* İçerik */}
        <section id="veri-sorumlusu" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">1) Veri Sorumlusu</h2>
          <p className="text-gray-700 leading-relaxed">
            6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca kişisel
            verileriniz; veri sorumlusu{" "}
            <strong>{ORG.name}</strong> tarafından, aşağıda açıklanan kapsamda
            işlenmektedir.
          </p>
          <div className="mt-3 text-sm text-gray-700">
            <p><span className="font-semibold">Adres:</span> {ORG.address}</p>
            <p><span className="font-semibold">Telefon:</span> {ORG.phone}</p>
            <p>
              <span className="font-semibold">E-posta:</span>{" "}
              <a href={`mailto:${ORG.email}`} className="underline">{ORG.email}</a>
            </p>
            <p>
              <span className="font-semibold">Web:</span>{" "}
              <a href={ORG.website} className="underline" target="_blank">
                {ORG.website}
              </a>
            </p>
          </div>
        </section>

        <section id="kategoriler" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">2) İşlenen Kişisel Veri Kategorileri</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Kimlik Bilgileri (ad-soyad vb.)</li>
            <li>İletişim Bilgileri (telefon, e-posta, adres)</li>
            <li>Müşteri İşlem Verileri (teklif/form içerikleri, talep/şikâyet kayıtları)</li>
            <li>Pazarlama Verileri (izinler, kampanya tercihleri)</li>
            <li>İşlem Güvenliği / Log Kayıtları (IP, tarayıcı bilgisi, zaman damgaları)</li>
            <li>Görsel/İşitsel Kayıtlar (gönderilmiş dosyalar vb., varsa)</li>
            <li>Finansal Veriler (teklif/ödeme bilgileri, fatura verileri — gerekiyorsa)</li>
            <li>Lokasyon Bilgisi (harita/servis kullanımı kapsamında, açık rıza/ayarlara bağlı olarak)</li>
          </ul>
          <p className="mt-3 text-sm text-gray-500">
            <em>Özel nitelikli kişisel veriler sadece kanuni zorunluluk ve/veya açık rıza
            halinde ve mevzuata uygun ilave tedbirlerle işlenir.</em>
          </p>
        </section>

        <section id="amac-hukuki-sebep" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">3) İşleme Amaçları ve Hukuki Sebepler</h2>
          <p className="text-gray-700 mb-3">
            Kişisel verileriniz aşağıdaki amaçlarla KVKK m.5/2 kapsamında işlenmektedir:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Tekliflendirme, keşif, sözleşme ve proje yönetimi süreçlerinin yürütülmesi
              (<strong>sözleşmenin kurulması/ifası</strong>).</li>
            <li>Hukuki yükümlülüklerin yerine getirilmesi (mali/vergisel işlemler, talep/şikâyet yönetimi)
              (<strong>hukuki yükümlülük</strong>).</li>
            <li>İletişim faaliyetleri, randevu/yerinde keşif ve destek süreçleri (<strong>meşru menfaat</strong>).</li>
            <li>Güvenlik, dolandırıcılık ve suiistimalin önlenmesi (<strong>meşru menfaat</strong>).</li>
            <li>Açık rıza verilen pazarlama/ileti yönetimi (<strong>açık rıza</strong>).</li>
          </ul>
        </section>

        <section id="yontem" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">4) Toplama Yöntemi</h2>
          <p className="text-gray-700">
            Verileriniz; internet sitemizdeki formlar (<Link href="/iletisim" className="underline">iletişim</Link>,{" "}
            <Link href="/teklif-al" className="underline">teklif</Link>), e-posta/telefon yazışmaları,
            sözleşme/evrak süreçleri, çerezler ve dijital kayıt sistemleri aracılığıyla
            elektronik ve/veya fiziki yollarla elde edilir.
          </p>
        </section>

        <section id="aktarim" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">5) Aktarımlar (Alıcı Grupları)</h2>
          <p className="text-gray-700 mb-3">
            Amaçla sınırlı olmak üzere; {ORG.name}’in hizmet aldığı veya iş birliği yaptığı
            tedarikçilere, kargo/lojistik, bankacılık/ödeme kuruluşları, mali müşavirlik,
            hukuk/danışmanlık, bilişim/hosting hizmet sağlayıcılarına; yasal zorunluluk
            halinde yetkili kişi, kurum ve kuruluşlara aktarım yapılabilir. Yurt dışına
            aktarım söz konusu ise açık rızanız alınır veya KVKK’daki istisnalar dâhilinde
            gerekli koruma şartları sağlanır.
          </p>
        </section>

        <section id="saklama" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">6) Saklama Süreleri</h2>
          <p className="text-gray-700">
            Kişisel verileriniz; ilgili mevzuattaki zamanaşımı ve ispat yükümlülüğü
            süreleri, muhasebe/vergisel saklama süreleri ve işleme amaçlarımızla
            sınırlı olarak saklanır; süre dolduğunda silinir, yok edilir veya anonim
            hâle getirilir.
          </p>
        </section>

        <section id="haklar" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            7) KVKK m.10 Aydınlatma & m.11 Kapsamındaki Haklarınız
          </h2>
          <p className="text-gray-700 mb-3">
            Başvurunuz üzerine aşağıdaki haklarınızı kullanabilirsiniz:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Verilerinizin işlenip işlenmediğini öğrenme,</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
            <li>İşleme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme,</li>
            <li>Yurt içi/yurt dışı aktarılan üçüncü kişileri bilme,</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
            <li>KVKK ve ilgili mevzuata uygun olarak silinmesini/yok edilmesini isteme,</li>
            <li>Bu işlemlerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
            <li>Otomatik sistemlerce analiz sonucu aleyhinize bir sonucun ortaya çıkmasına
              itiraz etme,</li>
            <li>Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde tazminat talep etme.</li>
          </ul>
        </section>

        <section id="basvuru" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">8) Başvuru Yöntemi</h2>
          <p className="text-gray-700">
            Haklarınızı kullanmak için kimliğinizi tevsik edecek belgelerle birlikte;
            <br />
            <span className="font-semibold">• E-posta:</span>{" "}
            <a href={`mailto:${ORG.email}`} className="underline">{ORG.email}</a>{" "}
            <br />
            <span className="font-semibold">• Posta/elden:</span> {ORG.address}
            <br />
            adreslerine başvuruda bulunabilirsiniz. Başvurularınız KVKK’da öngörülen
            sürelerde sonuçlandırılır.
          </p>
        </section>

        <section id="guvenlik" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">9) Teknik ve İdari Tedbirler</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Erişim yetkilendirme, parola politikaları, loglama ve ağ güvenliği</li>
            <li>Şifreleme, yedekleme ve saklama güvenliği</li>
            <li>Tedarikçi sözleşmeleri ve gizlilik taahhütleri</li>
            <li>Personel farkındalık eğitimleri ve iç politika/prosedürler</li>
          </ul>
        </section>

        <section id="cerezler" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">10) Çerezler</h2>
          <p className="text-gray-700">
            Sitemizde performans ve deneyim amaçlı çerezler kullanılabilir. Detaylar için
            <Link href="/cerez-politikasi" className="underline"> Çerez Politikası</Link>’na göz atabilirsiniz.
            Tarayıcı ayarlarından çerez tercihlerinizi değiştirebilirsiniz.
          </p>
        </section>

        <section id="degisiklikler" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">11) Değişiklikler</h2>
          <p className="text-gray-700">
            İşbu Aydınlatma Metni gerekli görüldüğünde güncellenebilir. En güncel
            versiyon <Link href="/" className="underline">web sitemizde</Link> yayımlanır.
          </p>
        </section>

        {/* Alt CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/iletisim"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-[#155dfc] text-white hover:brightness-110 shadow-md"
          >
            Sorunuz mu var? Bizimle iletişime geçin
          </Link>
          <p className="mt-3 text-xs text-gray-500">
            *Bu metin genel bilgilendirme amaçlıdır; nihai hukuki değerlendirme için
            uzman görüşü alınması önerilir.
          </p>
        </div>
      </div>
    </main>
  );
}
