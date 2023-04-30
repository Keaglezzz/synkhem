import createSchema from 'part:@sanity/base/schema-creator';
import schemaTypes from 'all:part:@sanity/base/schema-type';

import product from './product';
import banner from './banner';
import work from './work'
import about from './about'
import contact from './contact'
import freeze from './freeze';
import lubrication from './lubrication';
import chemical from './chemical';
import volume from './volume';


export default createSchema({
  name: 'default',
  types: schemaTypes.concat([ product, banner, work, about, contact, freeze, lubrication, chemical, volume ]),
})
  