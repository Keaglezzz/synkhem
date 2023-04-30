import React from 'react';
import { Ptest, Freeze, Lubrication, Chemical  } from '../components';
import { client } from '../lib/client';
import Link from 'next/link';
import { motion } from 'framer-motion';



const services = ( {lubrications, freezes, chemicals} ) => {

  return (
    <div>
    <div className="sidenav__container">
    <div className='sidenav'>
     <Link href="#antifreeze"><a>Anti-freeze</a></Link>
      <Link href="#lubrications"><a>Lubrications</a></Link>
      <Link href="#chemicals"><a>Chemicals</a></Link>
    </div>
    
    </div>
    <Ptest />

        <h2 className="head-text" style={{paddingTop: '100px'}}><span className='head__span'>Anti-freeze</span></h2>
        <motion.div>
        <div className="products-container" id='antifreeze'>
      {freezes && freezes.map((freeze) => <Freeze key={freeze._id} freeze={freeze} id='freeze'/>)}
    </div>
    </motion.div>
        <h2 className="head-text">Maintain your <span className='head__span'>machinery</span></h2>
        <div className="products-container" id='lubrications'>
      {lubrications && lubrications.map((lubrication) => <Lubrication key={lubrication._id} lubrication={lubrication} id='lubrication'/>)}
    </div>
      <h2 className="head-text">We offer <span className='head__span'>all included</span> <br /> extras so that you  <span className='head__span'>dont lift a finger</span></h2>
      <motion.div>
    <div className="products-container" id='chemicals'>
      {chemicals && chemicals.map((chemical) => <Chemical key={chemical._id} chemical={chemical} id='chemical'/>)}
    </div>
    </motion.div>
    </div>
  )
}


export const getServerSideProps = async () => {
  const query = '*[_type == "lubrication" ]';
  const lubrications = await client.fetch(query);

  const freezesQuery = '*[_type == "freeze"]';
  const freezes = await client.fetch(freezesQuery);

  const chemicalsQuery = '*[_type == "chemical"]';
  const chemicals = await client.fetch(chemicalsQuery);
  

  return {
    props: { lubrications, freezes, chemicals }
  }
}

export default services