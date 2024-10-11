"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ComponentLoadingProps {
  text?: string;
}

export default function ComponentLoading({ text = "Loading..." }: ComponentLoadingProps) {
  // Animation variants for the container
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  // Animation variants for the loading bar
  const barVariants = {
    initial: { width: 0 },
    animate: {
      width: '100%',
      transition: {
        duration: 2.5,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center my-5">
      <motion.div
        className="w-48 h-1 bg-[#ECF0F3] rounded-full overflow-hidden"
        variants={containerVariants}
        animate="animate"
      >
        <motion.div
          className="h-full bg-[#5C59E4]"
          variants={barVariants}
          initial="initial"
          animate="animate"
        />
      </motion.div>
      <p className="mt-3 text-sm text-[#9CABC2] font-fira-sans">{text}</p>
    </div>
  );
}
