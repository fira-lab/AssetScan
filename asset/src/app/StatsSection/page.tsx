import { motion } from "framer-motion";
import { Users, Laptop, ScanLine } from "lucide-react";

const stats = [
  { icon: Users, label: "Registered Users", value: "1,250+" },
  { icon: Laptop, label: "Registered Assets", value: "3,400+" },
  { icon: ScanLine, label: "Verification Activities", value: "12,800+" },
];

const StatsSection = () => {
  return (
    <section className="section-padding section-dark-bg">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-heading font-extrabold text-3xl md:text-4xl text-center mb-16"
        >
          System Impact
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center p-8 rounded-xl bg-card/5 border border-primary-foreground/10"
            >
              <stat.icon className="h-12 w-12 mx-auto mb-4 text-accent" />
              <div className="stat-number mb-2">{stat.value}</div>
              <p className="text-primary-foreground/70 font-medium text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
