import React from 'react';
import { AiFillInstagram, AiOutlineLinkedin, AiOutlineTwitter} from 'react-icons/ai';

const Footer = () => {
  return (
    <div className="footer-container">
      <p>2022 Synkhem All rights reserverd</p>
      <p className="icons">
      <a href="https://instagram.com/synkhem_petrochemicals?igshid=NTc4MTIwNjQ2YQ==" target='_blank'>
      <AiFillInstagram />
      </a>
      <a href="https://www.linkedin.com/in/synkhem-petrochemicals-16338b268/" target='_blank'>
      <AiOutlineLinkedin />
      </a>
    
       
      </p>
    </div>
  )
}

export default Footer