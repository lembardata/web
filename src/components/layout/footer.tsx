import Link from "next/link";
import { Github, Twitter, Mail } from "lucide-react";

const footerNavigation = {
  product: [
    { name: "Fitur", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Dokumentasi", href: "/docs" },
    { name: "API Reference", href: "/docs/api" },
  ],
  support: [
    { name: "Help Center", href: "/support" },
    { name: "Contact Us", href: "/support/contact" },
    { name: "Status", href: "/status" },
    { name: "Bug Report", href: "/support/bug-report" },
  ],
  company: [
    { name: "Tentang Kami", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Karir", href: "/careers" },
    { name: "Press Kit", href: "/press" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "GDPR", href: "/gdpr" },
  ],
};

const socialLinks = [
  {
    name: "Twitter",
    href: "#",
    icon: Twitter,
  },
  {
    name: "GitHub",
    href: "#",
    icon: Github,
  },
  {
    name: "Email",
    href: "mailto:support@spreadsheetai.com",
    icon: Mail,
  },
];

export function Footer() {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SA</span>
              </div>
              <span className="text-xl font-bold text-white">
                SpreadsheetAI
              </span>
            </div>
            <p className="text-sm leading-6 text-gray-300">
              Platform AI terdepan untuk mengoptimalkan dan menganalisis
              spreadsheet Anda. Tingkatkan produktivitas dengan kekuatan
              artificial intelligence.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Product
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.product.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Support
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.support.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Company
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Legal
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-gray-400">
              &copy; 2024 SpreadsheetAI. All rights reserved.
            </p>
            <div className="mt-4 sm:mt-0">
              <p className="text-xs leading-5 text-gray-400">
                Made with ❤️ in Indonesia
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
