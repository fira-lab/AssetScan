import { motion } from "framer-motion";
import { Eye, Target, CheckCircle } from "lucide-react";

const cards = [
  {
    icon: Eye,
    title: "Vision",
    text: "To create a secure and efficient campus environment where asset ownership is verified digitally.",
    color: "from-primary to-secondary",
  },
  {
    icon: Target,
    title: "Mission",
    text: "To simplify and automate laptop verification using QR codes and AI-based facial recognition.",
    color: "from-secondary to-primary",
  },
  {
    icon: CheckCircle,
    title: "Objectives",
    text: "Improve security, reduce delays, and ensure accurate ownership validation at exit points.",
    color: "from-primary to-accent",
  },
];

const VisionMissionSection = () => {
  return (
    // Changed bg-muted/50 to !bg-white to force light mode look
    <section className="section-padding !bg-white">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          // Added !text-foreground to ensure the title isn't accidentally white on white
          className="font-heading font-extrabold text-3xl md:text-4xl text-center mb-16 !text-slate-900"
        >
          Our Direction
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              // Added !bg-white and !border-slate-200 to keep cards clean
              className="!bg-white rounded-xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`h-2 bg-gradient-to-r ${card.color}`} />
              <div className="p-8 text-center">
                <card.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-heading font-bold text-xl mb-4 !text-slate-900">{card.title}</h3>
                <p className="!text-slate-600 leading-relaxed">{card.text}</p>
                <button className="mt-6 px-6 py-2 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors duration-300">
                  Learn More
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisionMissionSection;