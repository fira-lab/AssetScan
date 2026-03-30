import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const SecurityHighlight = () => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-50" />

      <div className="relative z-10 container mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <ShieldCheck className="h-16 w-16 mx-auto mb-6 text-accent" />
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-primary-foreground mb-6 max-w-3xl mx-auto leading-snug">
            Ensuring secure, transparent, and reliable asset verification across campus.
          </h2>
          <p className="text-primary-foreground/70 text-lg md:text-xl italic">
            Powered by QR technology and AI-assisted identity validation
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SecurityHighlight;
