import * as R from 'ramda'

const rejectString = '@@kipwise-image/out'
export const mapOnlyResolved = (promises : Promise<any>[]) =>
  Promise.all(promises.map(p => p.catch(e => rejectString)))
    .then(R.reject(R.equals(rejectString)))
