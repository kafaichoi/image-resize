const rejectString = '@@kipwise-image/out'

export const mapOnlyResolved = <T>(promises: Promise<T>[]): Promise<T[]> =>
  Promise.all(promises.map(p => p.catch(e => rejectString)))
    .then(x => x.filter((val): val is T => val === rejectString))