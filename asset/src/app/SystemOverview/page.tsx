"use client"
import { motion } from "framer-motion";
import overviewImg from "@/app/Images/system-overview.jpg";
import Image from "next/image";

const SystemOverview = () => {
  return (
    <section id="overview" className="section-padding bg-background">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-heading font-extrabold text-3xl md:text-4xl text-center mb-16 text-foreground"
        >
          System Overview
        </motion.h2>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:w-1/2"
          >
            <Image
              src={overviewImg}
              alt="System Overview"
              className="rounded-xl shadow-2xl w-full object-cover"
              loading="lazy"
              width={800}
              height={600}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
              <h3 className="font-heading font-bold text-2xl text-primary mb-4">
                Digital Asset Verification
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                This system allows students and staff to register their laptops and verify ownership
                at exit gates using QR codes and AI-based facial recognition. It ensures that every
                device leaving the campus is properly authorized, reducing theft and improving
                accountability across the university.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SystemOverview;
