import React, { useState, useEffect } from 'react';
import { AiFillEye, AiFillMail } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { urlFor, client } from '../lib/client';

const Work = () => {
  const [works, setWorks] = useState([]);
  const [filterWork, setFilterWork] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [animateCard, setAnimateCard] = useState({ y: 0, opacity: 1 });
  const [hoveredCard, setHoveredCard] = useState(null);

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



  const truncateDescription = (description, id) => {
    if (!description) return "";  // add this line
    const sentences = description.match(/[^\.!\?]+[\.!\?]+/g);
    // Only truncate the text if this card is not currently being hovered over
    return (sentences && sentences.length > 4 && id !== hoveredCard) ? sentences.slice(0, 4).join(" ") + "..." : description;
  }
  


  return (
    <>
      <h2 className="head-text">What we <span className='head__span'>Do Best</span> in each Sector</h2>

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
    className="app__work-item app__flex" 
    key={index} 
    style={{ height: '400px', width: '300px', overflow: 'hidden' }}
    onMouseEnter={() => setHoveredCard(index)}  // Set the hovered card when the mouse enters
    onMouseLeave={() => setHoveredCard(null)}  // Unset the hovered card when the mouse leaves
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
              <p className="p-text" style={{ marginTop: 10}}
                title={work.description}>{truncateDescription(work.description, index)}</p>
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