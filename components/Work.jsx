import React, { useState, useEffect } from 'react';
import { AiFillEye, AiFillMail } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { urlFor, client } from '../lib/client';

const Work = () => {
  const [works, setWorks] = useState([]);
  const [filterWork, setFilterWork] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [animateCard, setAnimateCard] = useState({ y: 0, opacity: 1 });
  const [expandedCard, setExpandedCard] = useState(null);


  useEffect(() => {
    const query = '*[_type == "work"]';

    client.fetch(query).then((data) => {
      setWorks(data);
      setFilterWork(data);
    });
  }, []);

  const handleWorkFilter = (item) => {
    setActiveFilter(item);
    setAnimateCard([{ y: 100, opacity: 0 }]);

    setTimeout(() => {
      setAnimateCard([{ y: 0, opacity: 1 }]);

      if (item === 'All') {
        setFilterWork(works);
      } else {
        setFilterWork(works.filter((work) => work.tags.includes(item)));
      }
    }, 500);
  };


  return (
    <>
      <h2 className="head-text">What we <span className='head__span-about'>Do Best</span> in each Sector</h2>

      <div className="app__work-filter">
        {['Meet the company', 'What we do', 'Past Successes', 'Your Pick?', 'All'].map((item, index) => (
          <div
            key={index}
            onClick={() => handleWorkFilter(item)}
            className={`app__work-filter-item app__flex p-text ${activeFilter === item ? 'item-active' : ''}`}
          >
            {item}
          </div>
        ))}
      </div>

      <motion.div
        animate={animateCard}
        transition={{ duration: 0.5, delayChildren: 0.5 }}
        className="app__work-portfolio"
      >
  {filterWork.map((work, index) => (
  <div 
    className={`app__work-item app__flex ${index === expandedCard ? 'expanded-card' : ''}`} 
    key={index}
  >
            <div
              className="app__work-img app__flex"
            >
              <img src={urlFor(work.imgUrl)} alt={work.name} />

              <motion.div
                whileHover={{ opacity: [0, 1] }}
                transition={{ duration: 0.25, ease: 'easeInOut', staggerChildren: 0.5 }}
                className="app__work-hover app__flex"
              >
                {work.email && (
                  <a href={`mailto:${work.email}`} target="_blank" rel="noopener noreferrer">
                    <AiFillMail className='email-icon'/>
                  </a>
                )}
              </motion.div>
            </div>

            <div className="app__work-content app__flex">
              <h4 className="bold-text">{work.name}</h4>
              <h6 className="bold-text" style={{color:'#1f4da1'}}>{work.title}</h6>
              {index === expandedCard ?
        <p className="p-text" title={work.description}>
          {work.description}
        </p>
        :
        <p className="p-text truncated-text" title={work.description}>
          {work.description ? work.description.substring(0, 100) : ""}
        </p>
      }
      {work.description && work.description.length > 100 && (
  <button className="expand-button" onClick={() => setExpandedCard(index === expandedCard ? null : index)}>
    {index === expandedCard ? 'Read Less' : 'Read More'}
  </button>
)}
              <div className="app__work-tag app__flex">
                <p className="p-text">{work.tags[0]}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </>
  );
};

export default Work;