// app/hakkimizda/page.tsx
import { HardHat, Users, Trophy, Clock, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function HakkimizdaPage() {
  return (
    <>
      {/* Hero Section - Görsel + Başlık */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hakkimizda/image.png" // public/hakkimizda/image.png
            alt="CBO Yapı Ekibi"
            fill
            className="object-cover brightness-75"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl">
            CBO Yapı
          </h1>
          <p className="text-xl md:text-3xl font-light tracking-wide drop-shadow-lg">
            Güven, kalite ve profesyonellik.
          </p>
        </div>
      </section>

      {/* İçerik */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-800 text-center mb-16">
            HAKKIMIZDA
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                <strong>CBO Yapı</strong>, 15+ yıllık deneyimiyle konut ve ticari
                projelerde uçtan uca hizmet verir. İç mimari ve özel ölçü
                mobilyadan çelik kapı üretimi ve montajına, yapı market ürün
                tedarikinden otomotiv alım–satım danışmanlığına kadar geniş bir
                çözüm yelpazesine sahibiz.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Her projede <span className="font-bold text-[#155dfc]">mükemmel
                işçilik</span>, <span className="font-bold text-[#155dfc]">zamanında teslim</span> ve
                <span className="font-bold text-[#155dfc]"> sürdürülebilir kalite</span> ilkeleriyle
                çalışır; mimar ve mühendis ekibimizle hayallerinizi ölçülebilir
                çıktılara dönüştürürüz.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Users, label: "250+ Mutlu Müşteri" },
                { icon: Trophy, label: "18 Ödül" },
                { icon: HardHat, label: "42 Tamamlanan Proje" },
                { icon: Clock, label: "15+ Yıl Tecrübe" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl shadow-lg text-center border"
                >
                  <item.icon className="w-12 h-12 text-[#155dfc] mx-auto mb-3" />
                  <p className="text-sm text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Neden CBO Yapı? */}
          <div className="bg-white rounded-3xl shadow-xl p-10 md:p-16">
            <h3 className="text-3xl font-bold text-slate-800 mb-10">
              Neden CBO Yapı?
            </h3>

            <div className="space-y-8">
              {[
                {
                  title: "Tek Çatı Altında Tüm Çözümler",
                  desc: "Yeni inşaat, renovasyon, iç mimari, mobilya ve kapı üretimi; ayrıca malzeme tedariki ve otomotiv danışmanlığı. Süreci tek elden yönetir, size vakit kazandırırız.",
                },
                {
                  title: "Yerel Bilgi, Doğru Uygulama",
                  desc: "Tekirdağ ve çevresinin teknik gereksinimlerine hâkimiz. Şantiye planlaması, tedarik ve uygulama süreçlerini bölgesel dinamiklere göre optimize ederiz.",
                },
                {
                  title: "Kalite ve Güven Standarttır",
                  desc: "Uzun ömürlü malzemeler, ölçü kontrolü ve şeffaf raporlama ile her aşamada güvence sağlarız. Proje kapanışında ayrıntılı teslim dosyası sunarız.",
                },
                {
                  title: "Estetik + Fonksiyon Dengesi",
                  desc: "Modern tasarımı ergonomi ve sürdürülebilirlikle birleştiririz. Kullanımı kolay, bakımı pratik ve değer katan mekânlar üretiriz.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-[#155dfc] to-[#8cc1ff]">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-slate-800 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Son Söz */}
          <div className="mt-20 text-center">
            <p className="text-2xl font-medium text-slate-700 italic leading-relaxed max-w-4xl mx-auto">
              “CBO Yapı olarak; doğru bütçe, doğru zaman ve doğru işçilik
              prensipleriyle mekanlarınıza kalıcı değer katıyoruz.”
            </p>
            <div className="mt-8">
              <p className="font-bold text-lg bg-gradient-to-r from-[#155dfc] to-[#8cc1ff] bg-clip-text text-transparent">
                CBO Yapı Ekibi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#155dfc] to-[#8cc1ff]">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-4xl font-bold text-white mb-6">
            Hayalinizdeki projeye başlıyoruz.
          </h3>
          <p className="text-white/95 text-lg mb-8">
            Ücretsiz keşif ve ön teklif için bize ulaşın.
          </p>
          <a
            href="/iletisim"
            className="inline-flex items-center gap-3 bg-white text-[#155dfc] px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition shadow-lg"
          >
            Bize Ulaşın
          </a>
        </div>
      </section>
    </>
  );
}
