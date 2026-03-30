import { motion } from "framer-motion";
import featureReg from "@/app/Images/feature-registration.jpg";
import featureQr from "@/app/Images/feature-qrcode.jpg";
import featureVerify from "@/app/Images/feature-verification.jpg";
import featureAi from "@/app/Images/feature-ai-face.jpg";
import Image from "next/image";

const features = [
  {
    title: "Asset Registration",
    description: "Users register laptops with details + face image",
    image: featureReg,
  },
  {
    title: "QR Code Generation",
    description: "Unique QR assigned to each registered laptop",
    image: featureQr,
  },
  {
    title: "Exit Verification",
    description: "Gatekeeper scans QR and captures face at exit",
    image: featureVerify,
  },
  {
    title: "AI Face Matching",
    description: "System compares live image with stored image",
    image: featureAi,
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="section-padding bg-background">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-heading font-extrabold text-3xl md:text-4xl text-center mb-4 text-foreground"
        >
          System Features
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground text-center mb-16 text-lg max-w-2xl mx-auto"
        >
          How the verification workflow operates from registration to exit
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-xl overflow-hidden shadow-lg cursor-pointer"
            >
              <Image
                src={feature.image}
                alt={feature.title}
                className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                width={800}
                height={600}
              />
              <div className="feature-card-overlay flex flex-col justify-end p-6">
                <h3 className="font-heading font-bold text-xl text-primary-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-primary-foreground/80 text-sm">{feature.description}</p>
              </div>
              {/* Always-visible title bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-primary/80 backdrop-blur-sm px-4 py-3 group-hover:opacity-0 transition-opacity duration-300">
                <h3 className="font-heading font-bold text-primary-foreground text-sm">
                  {feature.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
