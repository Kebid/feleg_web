import { motion } from "framer-motion";
import { MagnifyingGlassIcon, PencilSquareIcon, SparklesIcon } from "@heroicons/react/24/solid";

const steps = [
  {
    icon: <MagnifyingGlassIcon className="w-12 h-12 text-blue-500 mb-4" />,
    title: "Discover",
    desc: "Browse programs by category, location, or age group."
  },
  {
    icon: <PencilSquareIcon className="w-12 h-12 text-purple-500 mb-4" />,
    title: "Apply",
    desc: "Submit applications with just a few clicks."
  },
  {
    icon: <SparklesIcon className="w-12 h-12 text-pink-500 mb-4" />,
    title: "Enroll",
    desc: "Get accepted and start your child's journey."
  }
];

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, type: "spring" as const, stiffness: 60 } }
};

export default function HowFelegWorks() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 overflow-hidden">
      {/* Blurred SVG shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/20 rounded-full blur-3xl z-0" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-purple-400/20 rounded-full blur-3xl z-0" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent inline-block">How Feleg Works</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Simple steps to find and enroll in the perfect program</p>
        </motion.div>
        {/* Timeline/Steps */}
        <div className="relative flex flex-col md:flex-row md:items-stretch md:justify-between gap-10 md:gap-0">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900 dark:via-purple-900 dark:to-blue-950 z-0" style={{transform: 'translateY(-50%)'}} />
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={stepVariants}
              transition={{ delay: 0.1 + i * 0.15 }}
              className="relative z-10 bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group mx-auto md:w-1/3 w-full"
            >
              {/* Icon */}
              {step.icon}
              <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-base">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
