import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/Hero";
import PriceCard from "@/components/PriceCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faq = [
  {
    number: 1,
    question: "What is Retriv ?",
    answer: "Retriv is a platform that lets you create an AI agent for your website, allowing it to respond to user queries based on your website’s content.",
  },
  {
    number: 2,
    question: "How does Retriv work?",
    answer: "Retriv automatically crawls and indexes your website pages, then uses that content to generate accurate responses to user queries.",
  },
  {
    number: 4,
    question: "How do I integrate the agent into my website?",
    answer: "We provide a simple embed code or API to add your agent easily on you website. ",
  },
  {
    number: 5,
    question: "Is Retriv free to use?",
    answer: "We offer a free trial. Paid plans are available for higher usage.",
  },
  {
    number: 6,
    question: "What if my website changes later?",
    answer: "Retriv can re-crawl your website and update the AI’s knowledge base whenever you want.",
  },
];

export default function Home() {
  return (
    <>
      <div className="bg-[#F9F6F0]">
        <Header />
        <main className="min-h-screen">
          <HeroSection />
          {/* Pricing  */}
          <section id="pricing" className="w-full mt-6">
            <div className="mx-20  flex flex-col items-center">
              <div className="mb-12">
                <p className="text-3xl font-semibold text-center mb-4">
                  One plan that boost your businesss
                </p>
                <p className="max-w-2xl text-sm text-center">
                  Everything you need to turn your website into an AI agent — for just $39/month.
                </p>
              </div>
              <div>
                <PriceCard />
              </div>
            </div>
          </section>
          {/* FAQ  */}
          <section id="faq" className="w-full mt-16">
            <p className="text-3xl font-semibold text-center mb-4">
              Frequenly asked questions
            </p>
            <div className="mx-20 flex justify-center items-center">
              <Accordion type="single" collapsible className="max-w-3xl">
                {Faq.map((item) => (
                  <AccordionItem key={item.number} value={`item-${item.number}`}>
                    <AccordionTrigger className="text-xl font-semibold min-w-3xl hover:no-underline cursor-pointer">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-typography-weak">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
