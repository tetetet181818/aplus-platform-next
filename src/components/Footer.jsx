"use client";

import Link from "next/link";
import { Award } from "lucide-react";
import PaymentMethodsSection from "@/components/home/PaymentMethodsSection";
import sudia_busniess_center from "../../public/sudia_busniess_center.jpeg";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerLinks = [
    {
      title: "روابط سريعة",
      links: [
        { href: "/", text: "الرئيسية" },
        { href: "/FAQPage", text: "الاسئله الشائعه" },
        { href: "/notes", text: "تصفح الملخصات" },
        { href: "/add-note", text: "إضافة ملخص" },
        { href: "/profile", text: "الملف الشخصي" },
      ],
    },
    {
      title: "المساعدة",
      links: [
        { href: "/faq", text: "الأسئلة الشائعة" },
        { href: "/privacy-policy", text: "سياسة الخصوصية" },
        { href: "/terms-of-service", text: "شروط الاستخدام" },
        { href: "/contact-us", text: "اتصل بنا" },
      ],
    },
  ];

  return (
    <footer className="bg-background border-t">
      <div className=" py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" aria-hidden="true" />
              <span className="text-xl font-bold text-foreground">منصة A+</span>
            </div>
            <p className="text-muted-foreground text-sm">
              منصة لبيع وشراء الملخصات الجامعية بين الطلاب، وفر وقتك واستفد من
              خبرات زملائك
            </p>
            <div>
              <Image
                src={sudia_busniess_center}
                alt="سجل تجاري منصة A+"
                className="w-full h-auto"
              />
              <h2 className="text-2xl font-bold text-center mt-4">
                7050237267
              </h2>
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-lg mb-4 text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-2 lg:col-span-1">
            <PaymentMethodsSection />
          </div>
        </div>

        <div className="border-t mt-12 pt-6 text-center text-muted-foreground text-sm">
          <p>© {currentYear} منصة A+. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
