// app/hakkimizda/page.tsx
import { HardHat, Users, Trophy, Clock, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HakkimizdaPage() {
  return (
    <>
      {/* HERO – Tam ekran, karanlık overlay + zarif tipografi */}
      <section className="mt-20 relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hakkimizda/image.png"
            alt="CBO Yapı Ekibi"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-2xl">
            <span className="bg-gradient-to-r from-slate-300 to-white bg-clip-text text-transparent">
              CBO Yapı
            </span>
          </h1>
          <p className="mt-6 text-2xl md:text-4xl font-light tracking-wider drop-shadow-lg">
            Güven, kalite ve profesyonellik.
          </p>
          <div className="mt-10">
            <Link
              href="/iletisim"
              className="
                inline-flex items-center gap-3 px-8 py-4 rounded-full
                bg-white/20 backdrop-blur-md text-white font-bold text-lg
                border border-white/30 hover:bg-white/30
                transition-all duration-300 hover:shadow-2xl hover:scale-105
              "
            >
              Bize Ulaşın
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* İÇERİK – Slate temasıyla yeniden tasarlandı */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Başlık */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold">
              <span className="bg-gradient-to-r from-slate-600 to-slate-300 bg-clip-text text-transparent">
                HAKKIMIZDA
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              15+ yıldır Tekirdağ’da hayalleri gerçeğe dönüştürüyoruz.
            </p>
          </div>

          {/* İki sütun: Metin + İstatistik kartları */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-6">
              <p className="text-lg text-slate-700 leading-relaxed">
                <strong className="text-slate-800">CBO Yapı</strong>, konut ve ticari projelerde uçtan uca hizmet sunan bir <span className="font-bold text-slate-600">tam çözüm ortağıdır</span>.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                İç mimari tasarımdan özel ölçü mobilya üretimine, çelik kapı montajından yapı market tedarikine kadar her aşamada yanınızdayız. Otomotiv danışmanlığımızla da hayatınızı kolaylaştırıyoruz.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Her projede üç temel ilkeye bağlı kalırız:
              </p>
              <ul className="space-y-3 mt-4">
                {["Mükemmel işçilik", "Zamanında teslim", "Sürdürülebilir kalite"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="font-medium text-slate-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* İstatistik kartları – Slate */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Users, value: "250+", label: "Mutlu Müşteri" },
                { icon: Trophy, value: "18", label: "Ödül" },
                { icon: HardHat, value: "42", label: "Tamamlanan Proje" },
                { icon: Clock, value: "15+", label: "Yıl Tecrübe" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="
                    group relative bg-white rounded-2xl p-8 shadow-lg border border-slate-100
                    transition-all duration-300 hover:shadow-2xl hover:-translate-y-2
                    overflow-hidden
                  "
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition" />
                  <stat.icon className="w-14 h-14 text-slate-600 mx-auto mb-4 transition-transform group-hover:scale-110" />
                  <p className="text-3xl font-bold text-slate-800 text-center">{stat.value}</p>
                  <p className="text-sm text-slate-600 text-center mt-2 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* NEDEN CBO YAPI? – Modern kartlar */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-16 border border-slate-100">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-800 mb-12 text-center">
              Neden <span className="text-slate-600">CBO Yapı</span>?
            </h3>

            <div className="grid md:grid-cols-2 gap-10">
              {[
                {
                  title: "Tek Çatı Altında Tüm Çözümler",
                  desc: "İnşaat, renovasyon, mobilya, kapı üretimi ve malzeme tedariki. Süreci tek elden yönetir, size vakit kazandırırız.",
                },
                {
                  title: "Yerel Bilgi, Doğru Uygulama",
                  desc: "Tekirdağ’ın iklimi, zemini ve yönetmeliklerine hâkimiz. Her projeyi bölgesel dinamiklere göre optimize ederiz.",
                },
                {
                  title: "Kalite ve Güven Standarttır",
                  desc: "Uzun ömürlü malzemeler, ölçü kontrolü ve şeffaf raporlama. Teslimde ayrıntılı dosya sunarız.",
                },
                {
                  title: "Estetik + Fonksiyon Dengesi",
                  desc: "Modern tasarım, ergonomi ve sürdürülebilirlik bir arada. Kullanımı kolay, bakımı pratik mekânlar.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="
                    group relative p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white
                    border border-slate-200 shadow-md hover:shadow-xl
                    transition-all duration-300 hover:-translate-y-1
                  "
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-slate-800 mb-3 group-hover:text-slate-900">
                        {item.title}
                      </h4>
                      <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ALINTI – Zarif tipografi */}
          <div className="mt-24 text-center">
            <div className="max-w-4xl mx-auto">
              <blockquote className="text-2xl md:text-3xl font-medium text-slate-700 italic leading-relaxed">
                “CBO Yapı olarak; doğru bütçe, doğru zaman ve doğru işçilik prensipleriyle mekanlarınıza kalıcı değer katıyoruz.”
              </blockquote>
              <p className="mt-8 text-lg font-bold bg-gradient-to-r from-slate-600 to-slate-400 bg-clip-text text-transparent">
                CBO Yapı Ekibi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA – Slate gradient */}
      <section className="py-20 bg-gradient-to-r from-slate-600 to-slate-800">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Hayalinizdeki projeye başlıyoruz.
          </h3>
          <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
            Ücretsiz keşif ve ön teklif için hemen iletişime geçin.
          </p>
          <Link
            href="/iletisim"
            className="
              group inline-flex items-center gap-4 px-10 py-5 rounded-full
              bg-white text-slate-700 font-bold text-xl
              hover:bg-slate-100 hover:shadow-2xl
              transition-all duration-300 hover:scale-105
            "
          >
            Bize Ulaşın
            <svg
              className="w-6 h-6 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}