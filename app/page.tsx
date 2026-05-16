"use client"

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Phone, MapPin, Star, Heart, Camera, Coffee, ShieldCheck, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./hero-carousel.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const cylinderRef = React.useRef<HTMLDivElement>(null);

  const roomImages = [
    "/rooms/image_31099_2988ac388dcd403c87f3128ff109d508.jpg",
    "/rooms/image_31099_43ead64d20e44a558ae2107760ad5d5a.jpg",
    "/rooms/image_31099_7bd8f5f59eab45619a4bd68814578aad.jpg",
    "/rooms/image_31099_e05b2d9bddc543919d965a60e23964d2.jpg",
  ];

  const galleryImages = [
    "/rooms/image_31099_2988ac388dcd403c87f3128ff109d508.jpg",
    "/rooms/image_31099_43ead64d20e44a558ae2107760ad5d5a.jpg",
    "/rooms/image_31099_7bd8f5f59eab45619a4bd68814578aad.jpg",
    "/rooms/image_31099_e05b2d9bddc543919d965a60e23964d2.jpg",
    "/images/unnamed (5).jpg",
    "/images/unnamed (6).jpg",
    "/images/unnamed (7).jpg",
    "/images/unnamed (8).jpg",
    "/images/unnamed (9).jpg",
    "/images/unnamed (10).jpg",
    "/images/unnamed.jpg",
  ];

  // 3D Carousel Logic
  React.useEffect(() => {
    if (!viewportRef.current || !cylinderRef.current) return;

    const items = cylinderRef.current.querySelectorAll(".carousel-item");
    const RADIUS = 595; // Calculated for 12 items with ~10px gap
    const totalItems = items.length;
    const angleStep = 360 / totalItems;

    items.forEach((item, i) => {
      const angle = i * angleStep;
      (item as HTMLElement).style.transform = `rotateY(${angle}deg) translateZ(${RADIUS}px)`;
    });

    let cylinderRotation = 0;
    let targetRotation = 0;
    let scrollRotation = 0;
    let dragRotation = 0;

    const applyCylinder = () => {
      if (cylinderRef.current) {
        cylinderRef.current.style.transform = `rotateY(${cylinderRotation}deg)`;
      }
    };

    const ticker = () => {
      targetRotation = scrollRotation + dragRotation;
      cylinderRotation += (targetRotation - cylinderRotation) * 0.08;
      applyCylinder();
    };

    gsap.ticker.add(ticker);

    const st = ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        scrollRotation = self.progress * 360;
      }
    });

    // Drag to rotate
    let isDragging = false;
    let dragStartX = 0;
    let dragStartRotation = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartRotation = dragRotation;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      dragRotation = dragStartRotation + (e.clientX - dragStartX) * 0.5;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // hero title sizing - much smaller as requested
    gsap.set(".ml11", { fontSize: "clamp(1.5rem, 5vw, 3.5rem)", fontWeight: 700, fontFamily: "var(--font-varela)" });

    // ml11 Animation logic
    const textWrapper = document.querySelector('.ml11 .letters');
    if (textWrapper && textWrapper.textContent) {
      textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter' style='display:inline-block; line-height:1em;'>$&</span>");
    }

    const ml11Timeline = gsap.timeline(); // No repeat

    const revealAnimation = () => {
      ml11Timeline.clear();
      ml11Timeline
        .set('.ml11', { opacity: 1 })
        .set('.ml11 .line', { opacity: 0, scaleY: 0, x: 0 })
        .set('.ml11 .letter', { opacity: 0 })
        .to('.ml11 .line', {
          opacity: 1,
          scaleY: 1,
          duration: 0.7,
          ease: "expo.out"
        })
        .to('.ml11 .line', {
          x: () => {
            const letters = document.querySelector('.ml11 .letters');
            return letters ? letters.getBoundingClientRect().width + 10 : 0;
          },
          duration: 0.7,
          ease: "expo.out",
          delay: 0.1
        })
        .to('.ml11 .letter', {
          opacity: 1,
          duration: 0.6,
          ease: "expo.out",
          stagger: 0.03,
        }, "-=0.7");
    };

    const hideAnimation = () => {
      gsap.to('.ml11', {
        opacity: 0,
        y: -50,
        duration: 0.5,
        ease: "power2.in"
      });
    };

    const showAnimation = () => {
      gsap.to('.ml11', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: revealAnimation
      });
    };

    // Initial play
    revealAnimation();

    // ScrollTrigger for the title behavior
    const titleST = ScrollTrigger.create({
      trigger: ".ml11",
      start: "top 10%",
      onLeave: () => hideAnimation(),
      onEnterBack: () => showAnimation(),
    });

    return () => {
      gsap.ticker.remove(ticker);
      st.kill();
      titleST.kill();
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar Overlay */}
      <header className="backdrop-blur-md absolute top-0 left-0 right-0 z-50 w-full bg-transparent">
        <div className="container mx-auto px-4 h-24 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="#" className="text-xl font-bold text-white md:text-black hover:text-accent transition-colors drop-shadow-md md:drop-shadow-none">בית</a>            <a href="#contact" className="text-xl font-bold text-white md:text-black hover:text-accent transition-colors drop-shadow-md md:drop-shadow-none">צור קשר</a>
            <a href="#rooms" className="text-xl font-bold text-white md:text-black hover:text-accent transition-colors drop-shadow-md md:drop-shadow-none">החדרים שלנו</a>
            <a href="#gallery" className="text-xl font-bold text-white md:text-black hover:text-accent transition-colors drop-shadow-md md:drop-shadow-none">גלריה</a>
          </div>

          <div className="flex items-center mt-1">
            <Image src="/logo-img.png" alt="Tan Tan Logo" width={140} height={50} className="object-contain" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with 3D Carousel */}
        <section className="relative h-screen w-full overflow-hidden bg-white flex flex-col items-center justify-center pt-24">


          <div className="relative z-10 w-full px-4 md:px-10 lg:px-25 h-[80vh]">
            <div className="relative h-full w-full overflow-hidden rounded-[3rem] shadow-2xl flex items-center justify-center">
              <Image
                src="/rooms/image_31099_7bd8f5f59eab45619a4bd68814578aad.jpg"
                alt="Hero Background"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/30"></div>

              <div className="relative z-20 max-w-5xl text-center px-4">
                <h1 className="ml11 text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                  <span className="text-wrapper block relative">
                    <span className="line line1 absolute left-0 bottom-0 h-[2px] w-full bg-white origin-left"></span>
                    <span className="letters text-white block py-2 text-8xl font-varela">חופשה ירושלמית עם נוף עוצר נשימה</span>
                  </span>
                </h1>
              </div>
            </div>

          </div>

        </section>

        {/* Reviews Section */}
        <section id="reviews" className="py-24 bg-white">
          <div className="container mx-auto px-1">
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Image src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" width={80} height={30} className="object-contain" />
                <span className="text-2xl font-bold font-varela text-neutral-400">Reviews</span>
              </div>
              <h2 className="text-6xl mb-6 font-suez">מה האורחים שלנו אומרים</h2>
              <div className="flex justify-center gap-1 mb-10">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="mr-4 text-2xl font-bold font-varela">4.9/5</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mx-auto">
              {[
                {
                  name: "Kfir 059",
                  text: "הצימרים הכי טובים לשנת 2026, השתפרו בצורה משמעותית.\nתודה רבה על החוויה המעולה והקסומה הזאת.\nממליץ בחום לכל חובבי הצימרים 🤩\nשושני ומקום חביב מאוד!",
                  date: "לפני שבוע",
                  avatar: "https://lh3.googleusercontent.com/a/ACg8ocKC1JbOzm-h7cgBXjckV9b6E5yzpIam81Qpb5rJ20nXblR83g=w72-h72-p-rp-mo-br100"
                },
                {
                  name: "Carzy Tiger",
                  text: "צימרים יפים ושווים ועם ווליו פור מאני גדול מאוד. ממליץ בחום",
                  date: "לפני חודש",
                  avatar: "https://lh3.googleusercontent.com/a-/ALV-UjX9Nh-kBzNbpac2s5LNbr5r9WkPlniER0W1Q7zwrDolitIe3KmDow=w72-h72-p-rp-mo-ba3-br100"
                },
                {
                  name: "אריה קובליו",
                  text: "צימר נהדר המקום מתוחזק עם נוף נהדר\nצופה לאיזור פארק כרמים מלון כרמים , אווירה נהדרת\nאירוח לבבי טיפול אישי\nתודה רבה לאריה המארח המקסים",
                  date: "לפני חודשיים",
                  avatar: "https://lh3.googleusercontent.com/a/ACg8ocK_VEefgU06YzGImNlao1j0bZ1EejWDXTKtY1GCN8Td7As9EA=w72-h72-p-rp-mo-ba3-br100"
                },
                {
                  name: "Michael K",
                  text: "חייב להגיד שהייתי די סקפטי בקשר למקום אחרי שקראתי את הביקורות הקודמות. להפתעתי גיליתי בעל צימר מאד מאד נחמד שדאג לעזור ולטפל בכל בעיה שהיתה לנו. הצימר פחות מלהיב מאשר בתמונות אבל החוויה של המקום יחד עם המחיר ההוגן היתה שווה. היינו שבעה חברה ונהנינו מאוד גם הפרטיות וגם מהנוף. אריה בדק פעם ביום אם הכל בסדר ואם אנחנו צריכים משהו בנוסף. בחור מקסים",
                  date: "לפני חודש",
                  avatar: "https://lh3.googleusercontent.com/a/ACg8ocJl1qFvgD28BFfWZfZJUMooELz4QgFPVt2xAn5fI9XWTrOqb74=w72-h72-p-rp-mo-ba3-br100"
                }
              ].map((review, i) => (
                <Card key={i} className="border-none shadow-xs rounded-[8px] p-10 bg-neutral-50 hover:bg-white">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-200 flex items-center justify-center text-2xl font-bold text-neutral-500 shrink-0">
                      {review.avatar ? (
                        <Image src={review.avatar} alt={review.name} width={64} height={64} className="object-cover w-full h-full" />
                      ) : (
                        review.name[0]
                      )}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold font-varela">{review.name}</h4>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-md text-neutral-600 leading-relaxed font-varela italic mb-6 whitespace-pre-line">"{review.text}"</p>
                  <p className="text-sm text-neutral-400 font-varela">{review.date} ב-Google</p>
                </Card>
              ))}

            </div>

            <div className="mt-16 text-center">
              <Button variant="outline" className="rounded-full px-10 py-6 text-xl font-bold border-2 hover:bg-neutral-100" asChild>
                <a href="https://www.google.com/maps/place/%D7%94%D7%A6%D7%99%D7%9E%D7%A8+%D7%A9%D7%9C+%D7%AA%D7%9F-%D7%AA%D7%9F%E2%80%AD/@31.8042152,35.1233886,16.25z/data=!4m6!3m5!1s0x1502d12bae8c4d55:0xb9bd13f5e6a0e62e!8m2!3d31.807!4d35.123644!16s%2Fg%2F11g737h1y6?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">צפו בכל הביקורות ב-Google Maps</a>
              </Button>
            </div>
          </div>
        </section>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#F5F5F5" fillOpacity="1" d="M0,128L288,128L576,32L864,64L1152,128L1440,32L1440,320L1152,320L864,320L576,320L288,320L0,320Z"></path></svg>


        {/* Gallery */}
        <section id="gallery" className="py-32 border-t-2 border-neutral-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-24">
              <h2 className="text-7xl mb-6 font-suez">גלריה</h2>
              <p className="text-3xl text-neutral-500 max-w-2xl mx-auto font-varela">רגעים של קסם בסוויטת טן טן</p>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-10 space-y-10">
              {galleryImages.map((src, index) => (
                <div key={index} className="break-inside-avoid group relative overflow-hidden rounded-[8px] shadow-xs hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] transition-all duration-700">
                  <Image
                    src={src}
                    alt={`Gallery Image ${index}`}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Policies */}
        <section className="py-32 bg-white" id="rooms">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-[16/10] rounded-[3rem] overflow-hidden shadow-3xl">
                <Image src="/rooms/image_31099_2988ac388dcd403c87f3128ff109d508.jpg" alt="Policy Image" fill className="object-cover" />
              </div>
              <div className="space-y-10">
                <h2 className="text-6xl font-varela">החופשה השקטה שלכם</h2>
                <div className="space-y-8">
                  <div className="flex gap-6 items-start">
                    <div>
                      <h4 className="text-3xl font-varela mb-2">פרטיות מוחלטת</h4>
                      <p className="text-xl text-neutral-500 font-varela">הסוויטה ממוקמת באזור שקט ומבודד, מבטיחה לכם פרטיות מלאה לאורך כל השהות.</p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-start">
                    <div>
                      <h4 className="text-3xl font-varela mb-2">ניקיון ללא פשרות</h4>
                      <p className="text-xl text-neutral-500 font-varela">אנחנו מקפידים על סטנדרטים גבוהים ביותר של היגיינה וניקיון עבור כל אורח.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="contact" className="py-12 md:py-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Contact Section */}
            <section id="contact" style={{ fontFamily: 'inherit', padding: '3rem 2.5rem', background: '#f5f5f5', borderRadius: '8px' }}>
              <style>{`
    #contact .cs-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1px;
      background: rgba(0,0,0,0.08);
      border: 0.5px solid rgba(0,0,0,0.08);
      border-radius: 12px;
      overflow: hidden;
    }
    #contact .cs-card {
      background: #fff;
      padding: 1.25rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    #contact .cs-card-label {
      font-size: 11px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.09em;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    #contact .cs-card-value {
      font-size: 14px;
      font-weight: 500;
      color: #111;
      line-height: 1.4;
    }
    #contact .cs-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 500;
      color: #111;
      background: #fff;
      border: 0.5px solid rgba(0,0,0,0.18);
      border-radius: 8px;
      padding: 8px 16px;
      text-decoration: none;
      transition: background 0.15s ease;
    }
    #contact .cs-btn:hover { background: #f0f0f0; }
    @media (max-width: 640px) {
      #contact .cs-grid { grid-template-columns: 1fr; }
    }
  `}</style>

              <p style={{ fontSize: 11, color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                צור קשר
              </p>
              <h2 style={{ fontSize: 28, fontWeight: 500, color: '#111', margin: '0 0 4px' }}>מחכים לכם</h2>
              <p style={{ fontSize: 14, color: '#888', margin: '0 0 2rem' }}>
                צרו קשר לתיאום החופשה הבאה שלכם
              </p>

              <div className="cs-grid">
                <div className="cs-card">
                  <span className="cs-card-label">
                    <Phone size={13} /> טלפון
                  </span>
                  <span className="cs-card-value">050-723-0277</span>
                </div>
                <div className="cs-card">
                  <span className="cs-card-label">
                    <MapPin size={13} /> מיקום
                  </span>
                  <span className="cs-card-value">Ha-Alon St 217, Beit Nekofa</span>
                </div>
                <div className="cs-card">
                  <span className="cs-card-label">
                    <Heart size={13} /> הסוויטה
                  </span>
                  <span className="cs-card-value">Tan Tan Suite</span>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '0.5px solid rgba(0,0,0,0.08)', margin: '2rem 0' }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#aaa' }}>זמינים לשאלות ותיאומים</span>
                <a href="tel:0554309961" className="cs-btn">
                  <Phone size={14} />
                  התקשרו להזמנה
                </a>
              </div>
            </section>
          </div>
        </section>
      </main>

      <footer className="py-24 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <Image src="/logo-main.png" alt="Tan Tan Logo" width={220} height={80} className="mb-14 object-contain" />
            <div className="flex gap-12 mb-14 text-2xl font-bold font-varela text-neutral-400">
              <a href="#" className="hover:text-black transition-colors">בית</a>
              <a href="#rooms" className="hover:text-black transition-colors">חדרים</a>
              <a href="#gallery" className="hover:text-black transition-colors">גלריה</a>
              <a href="#contact" className="hover:text-black transition-colors">צור קשר</a>
            </div>
            <p className="text-neutral-300 text-2xl font-medium font-varela">
              © {new Date().getFullYear()} סוויטת טן טן. כל הזכויות שמורות.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}