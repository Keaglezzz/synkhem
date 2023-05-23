import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { urlFor, client } from '../lib/client';

const Tech = () => {
  const [about, setAbout] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null); // Add this line

  useEffect(() => {
    const query = '*[_type == "about"]';

    client.fetch(query).then((data) => {
      setAbout(data);
    });
  }, []);

  return (
    <>
      <h2 className="head-text">We understand the <span className='head__span'>demand</span> <br />for   <span className='head__span'>Local Supply</span></h2>

      <div className="app__profiles">
        {about.map((about, index) => (
          <motion.div
            whileInView={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5, type: 'tween' }}
            className="app__profile-item"
            key={about.title + index}
          >
            <img src={urlFor(about.imgUrl)} alt={about.title} />
            <h2 className="bold-text" style={{ marginTop: 20 }}>{about.title}</h2>
            {index === expandedCard ?
              <p className="p-text about-text" style={{ marginTop: 10 }}>{about.description}</p>
              :
              <p className="p-text about-text" style={{ marginTop: 10 }}>{about.description.substring(0, 100) + (about.description.length > 100 ? '...' : '')}</p>
            }
            {about.description && about.description.length > 100 && (
              <button className="expand-button" onClick={() => setExpandedCard(index === expandedCard ? null : index)}>
                {index === expandedCard ? 'Read Less' : 'Read More'}
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default Tech;
