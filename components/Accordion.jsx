import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineDown, AiOutlineArrowUp } from 'react-icons/ai'

const Accordion = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [isOpen4, setIsOpen4] = useState(false);
  const [isOpen5, setIsOpen5] = useState(false);

  return (
    <motion.div className='accordion__flex'>
    <div className='accordion__right'>
      <AnimatePresence >
        <motion.div
          key="time"
          className="accordion"
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.div className="accordion__question">
          What pack sizes does Synkhem supply in?
            <AiOutlineDown className='accordion__icon'/>
          </motion.div>
        </motion.div>

        {isOpen && (
          <motion.div
            key={['time']}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.5,
              },
            }}
            exit={{ opacity: 0 }}
            className="accordion__answer"
          >
           Synkhem Petrochemicals supplies in various pack sizes, ranging from 200ml to 1000L for lubricating oils, and from 100g to 180kg drums for greases. 
          </motion.div>
        )};
        </AnimatePresence>
    <AnimatePresence>
        <motion.div
          key="update"
          className="accordion"
          onClick={() => setIsOpen1(!isOpen1)}
        >
          <motion.div className="accordion__question">
          Does Synkhem offer bulk supply?
            <AiOutlineDown className='accordion__icon'/>
          </motion.div>
        </motion.div>

        {isOpen1 && (
          <motion.div
            key={['update']}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.5,
              },
            }}
            exit={{ opacity: 0 }}
            className="accordion__answer"
          >
           Yes, Synkhem Petrochemicals offers bulk supply at discounted prices. 
          </motion.div>
        )};
      </AnimatePresence>
      <AnimatePresence>
        <motion.div
          key="support"
          className="accordion"
          onClick={() => setIsOpen3(!isOpen3)}
        >
          <motion.div className="accordion__question">
          Does Synkhem offer custom labeling? 
            <AiOutlineDown className='accordion__icon'/>
          </motion.div>
        </motion.div>

        {isOpen3 && (
          <motion.div
            key={['support']}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.5,
              },
            }}
            exit={{ opacity: 0 }}
            className="accordion__answer"
          >
           Yes,  Synkhem Petrochemicals offers custom labeling. 
          </motion.div>
        )};
      </AnimatePresence>
      </div>
      <div className='accordion__left'>
      <AnimatePresence >
        <motion.div
          key="cms"
          className="accordion"
          onClick={() => setIsOpen2(!isOpen2)}
        >
          <motion.div className="accordion__question">
          Is Synkhem ISO approved? 
            <AiOutlineDown className='accordion__icon'/>
          </motion.div>
        </motion.div>

        {isOpen2 && (
          <motion.div
            key={['cms']}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.5,
              },
            }}
            exit={{ opacity: 0 }}
            className="accordion__answer"
          >
           Yes, Synkhem Petrochemicals blends with the highest grade virgin-base oils and is ISO approved, with every batch tested and certified with the COA certificate. 
          </motion.div>
        )};
        </AnimatePresence>
    <AnimatePresence>
        <motion.div
          key="stats"
          className="accordion"
          onClick={() => setIsOpen4(!isOpen4)}
        >
          <motion.div className="accordion__question">
          Does Synkhem offer product delivery?
            <AiOutlineDown className='accordion__icon'/>
          </motion.div>
        </motion.div>

        {isOpen4 && (
          <motion.div
            key={['stats']}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.5,
              },
            }}
            exit={{ opacity: 0 }}
            className="accordion__answer"
          >
           Yes, Synkhem Petrochemicals offers both delivery and collection on our products. 
          </motion.div>
        )};
      </AnimatePresence>
      </div>
    </motion.div>

    

    
  );
};

export default Accordion;