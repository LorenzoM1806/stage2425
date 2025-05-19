export function generateStatsList(throws, users, sorting, players, tournamentMatches) {
  const statList = [];
  const tornooiId = parseInt(localStorage.getItem("tornooiId"), 10);
  
  const matchIds = tournamentMatches
    .filter(tm => tm.tournament.id === tornooiId)
    .map(tm => tm.match.id)
    .filter(id => id != null)

  const worpen = throws.filter(t => matchIds.includes(t.match.id));
  
  function countHits(list, playerId, targetScore) {
    return list
      .filter(t => t.speler.id === playerId)
      .reduce((sum, t) =>
        sum
          + (t.throw1 === targetScore ? 1 : 0)
          + (t.throw2 === targetScore ? 1 : 0)
          + (t.throw3 === targetScore ? 1 : 0)
        , 0);
  }
  
  players.forEach(playerName => {
    const user = users.find(u => u.name === playerName);
    if (!user) return;
  
    statList.push({
      name:   playerName,
      bull:   countHits(worpen, user.id, 50),
      triple: countHits(worpen, user.id, 60),
      miss:   countHits(worpen, user.id, 0),
    });
  });
  
  const sortFns = {
    name:     (a, b) => a.name.localeCompare(b.name),
    "Bull's eye": (a, b) => b.bull   - a.bull,
    "Triple 20":  (a, b) => b.triple - a.triple,
    miss:     (a, b) => b.miss   - a.miss,
  };
  
  if (sortFns[sorting]) {
    statList.sort(sortFns[sorting]);
  }
  
  return statList;
}